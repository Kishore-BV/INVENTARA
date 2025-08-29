import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AccessControlService, AccessControlContext } from '../database/access-control.service';
import { Role } from '../auth/permissions';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Approval action enum
 */
export enum ApprovalAction {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RETURNED = 'RETURNED',
  DELEGATED = 'DELEGATED',
}

/**
 * Document types that support approval workflows
 */
export enum ApprovalDocumentType {
  REQUISITION = 'REQUISITION',
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  INVOICE = 'INVOICE',
  PAYMENT = 'PAYMENT',
  EXPENSE_CLAIM = 'EXPENSE_CLAIM',
}

/**
 * Approval request interface
 */
export interface ApprovalRequest {
  documentType: ApprovalDocumentType;
  documentId: string;
  documentNumber: string;
  requestedAmount: number;
  requestedBy: string;
  departmentId?: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * Approval decision interface
 */
export interface ApprovalDecision {
  action: ApprovalAction;
  comments?: string;
  approvedAmount?: number;
  conditions?: string[];
  delegatedTo?: string;
}

/**
 * Approval policy interface
 */
export interface ApprovalPolicy {
  id: string;
  tenantId: string;
  departmentId?: string;
  feature: string;
  limitAmount: number;
  requiresRoles: Role[];
  isActive: boolean;
}

/**
 * Approval workflow step
 */
export interface ApprovalStep {
  level: number;
  approverRole: Role;
  approverIds?: string[];
  limitAmount?: number;
  isParallel?: boolean;
  isOptional?: boolean;
}

/**
 * Approval Workflow Service
 * 
 * Handles:
 * - Multi-level approval workflows
 * - Configurable approval thresholds
 * - Role-based approval authority
 * - Department-scoped approvals
 * - Audit trail for all approval actions
 */
@Injectable()
export class ApprovalWorkflowService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accessControl: AccessControlService,
  ) {}

  /**
   * Submit document for approval
   */
  async submitForApproval(
    context: AccessControlContext,
    request: ApprovalRequest
  ): Promise<{
    workflowId: string;
    nextApprovers: string[];
    status: string;
  }> {
    // Validate user can submit this type of document
    await this.validateSubmissionPermission(context, request);

    // Get applicable approval policies
    const policies = await this.getApplicablePolicies(
      context.tenantId,
      request.documentType,
      request.requestedAmount,
      request.departmentId
    );

    if (policies.length === 0) {
      // No approval required, auto-approve
      await this.recordApprovalAction(context, {
        documentType: request.documentType,
        documentId: request.documentId,
        documentNumber: request.documentNumber,
        approverId: context.userId,
        action: ApprovalAction.APPROVED,
        comments: 'Auto-approved (no approval policy required)',
        requestedAmount: request.requestedAmount,
        approvedAmount: request.requestedAmount,
        approvalLevel: 1,
      });

      return {
        workflowId: request.documentId,
        nextApprovers: [],
        status: 'AUTO_APPROVED',
      };
    }

    // Determine approval workflow steps
    const approvalSteps = await this.generateApprovalSteps(
      context.tenantId,
      policies,
      request.requestedAmount,
      request.departmentId
    );

    // Get first level approvers
    const firstStepApprovers = await this.getStepApprovers(
      context.tenantId,
      approvalSteps[0],
      request.departmentId
    );

    // Send notifications to approvers (would integrate with notification service)
    await this.notifyApprovers(firstStepApprovers, request);

    return {
      workflowId: request.documentId,
      nextApprovers: firstStepApprovers.map(a => a.id),
      status: 'PENDING_APPROVAL',
    };
  }

  /**
   * Process approval decision
   */
  async processApproval(
    context: AccessControlContext,
    documentType: ApprovalDocumentType,
    documentId: string,
    decision: ApprovalDecision
  ): Promise<{
    status: string;
    nextApprovers?: string[];
    finalDecision?: 'APPROVED' | 'REJECTED';
  }> {
    // Validate approver has authority
    await this.validateApprovalAuthority(context, documentType, documentId, decision);

    // Record the approval action
    await this.recordApprovalAction(context, {
      documentType,
      documentId,
      documentNumber: await this.getDocumentNumber(documentType, documentId),
      approverId: context.userId,
      action: decision.action,
      comments: decision.comments,
      requestedAmount: await this.getDocumentAmount(documentType, documentId),
      approvedAmount: decision.approvedAmount,
      approvalLevel: await this.getCurrentApprovalLevel(documentType, documentId) + 1,
    });

    // Handle different actions
    switch (decision.action) {
      case ApprovalAction.APPROVED:
        return this.handleApprovalAction(context, documentType, documentId, decision);
      
      case ApprovalAction.REJECTED:
        await this.updateDocumentStatus(documentType, documentId, 'REJECTED');
        return { status: 'REJECTED', finalDecision: 'REJECTED' };
      
      case ApprovalAction.RETURNED:
        await this.updateDocumentStatus(documentType, documentId, 'RETURNED');
        return { status: 'RETURNED' };
      
      case ApprovalAction.DELEGATED:
        return this.handleDelegation(context, documentType, documentId, decision);
      
      default:
        throw new BadRequestException('Invalid approval action');
    }
  }

  /**
   * Get pending approvals for user
   */
  async getPendingApprovals(
    context: AccessControlContext,
    options: {
      documentType?: ApprovalDocumentType;
      departmentId?: string;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const where: any = {
      tenantId: context.tenantId,
    };

    // Scope based on role
    if (context.role === 'HOD') {
      // HODs see approvals for their department
      where.OR = [
        { approverId: context.userId },
        {
          AND: [
            { departmentId: context.departmentId },
            // Check if HOD has approval authority for this amount/type
          ],
        },
      ];
    } else if (context.role === 'EMPLOYEE') {
      // Employees only see their own submissions
      where.OR = [
        { approverId: context.userId },
      ];
    }
    // Admins see all (no additional filtering)

    if (options.documentType) {
      where.documentType = options.documentType;
    }

    if (options.departmentId) {
      where.departmentId = options.departmentId;
    }

    const approvals = await this.prisma.approvalWorkflow.findMany({
      where,
      include: {
        approver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: options.limit || 50,
      skip: options.offset || 0,
    });

    // Get additional document details
    const enrichedApprovals = await Promise.all(
      approvals.map(async (approval) => {
        const documentDetails = await this.getDocumentDetails(
          approval.documentType as ApprovalDocumentType,
          approval.documentId
        );

        return {
          ...approval,
          documentDetails,
          canApprove: await this.canUserApprove(
            context,
            approval.documentType as ApprovalDocumentType,
            approval.documentId
          ),
        };
      })
    );

    return enrichedApprovals;
  }

  /**
   * Get approval history for document
   */
  async getApprovalHistory(
    context: AccessControlContext,
    documentType: ApprovalDocumentType,
    documentId: string
  ) {
    // Validate user can view this document
    await this.validateViewPermission(context, documentType, documentId);

    return this.prisma.approvalWorkflow.findMany({
      where: {
        tenantId: context.tenantId,
        documentType,
        documentId,
      },
      include: {
        approver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Check if user can approve specific document
   */
  async canUserApprove(
    context: AccessControlContext,
    documentType: ApprovalDocumentType,
    documentId: string
  ): Promise<boolean> {
    try {
      await this.validateApprovalAuthority(context, documentType, documentId, {
        action: ApprovalAction.APPROVED,
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get approval policies for tenant/department
   */
  async getApprovalPolicies(
    context: AccessControlContext,
    departmentId?: string
  ): Promise<ApprovalPolicy[]> {
    const where: any = {
      tenantId: context.tenantId,
      isActive: true,
    };

    if (departmentId) {
      where.departmentId = departmentId;
    }

    return this.prisma.approvalPolicy.findMany({
      where,
      orderBy: [
        { feature: 'asc' },
        { limitAmount: 'asc' },
      ],
    });
  }

  /**
   * Create or update approval policy (Admin only)
   */
  async upsertApprovalPolicy(
    context: AccessControlContext,
    policy: Omit<ApprovalPolicy, 'id' | 'tenantId'>
  ): Promise<ApprovalPolicy> {
    if (context.role !== 'ADMIN') {
      throw new UnauthorizedException('Only administrators can manage approval policies');
    }

    const existingPolicy = await this.prisma.approvalPolicy.findFirst({
      where: {
        tenantId: context.tenantId,
        departmentId: policy.departmentId,
        feature: policy.feature,
        limitAmount: policy.limitAmount,
      },
    });

    if (existingPolicy) {
      return this.prisma.approvalPolicy.update({
        where: { id: existingPolicy.id },
        data: {
          requiresRoles: policy.requiresRoles,
          isActive: policy.isActive,
        },
      });
    } else {
      return this.prisma.approvalPolicy.create({
        data: {
          tenantId: context.tenantId,
          departmentId: policy.departmentId,
          feature: policy.feature,
          limitAmount: policy.limitAmount,
          requiresRoles: policy.requiresRoles,
          isActive: policy.isActive,
        },
      });
    }
  }

  // ===========================================
  // PRIVATE HELPER METHODS
  // ===========================================

  private async validateSubmissionPermission(
    context: AccessControlContext,
    request: ApprovalRequest
  ): Promise<void> {
    // Basic validation - user should be able to create this type of document
    const canCreate = await this.accessControl.canAccessResource(
      context,
      request.documentType,
      request.documentId
    );

    if (!canCreate) {
      throw new UnauthorizedException('Insufficient permissions to submit for approval');
    }
  }

  private async getApplicablePolicies(
    tenantId: string,
    documentType: ApprovalDocumentType,
    amount: number,
    departmentId?: string
  ): Promise<ApprovalPolicy[]> {
    return this.prisma.approvalPolicy.findMany({
      where: {
        tenantId,
        feature: documentType,
        limitAmount: { lte: amount },
        isActive: true,
        OR: [
          { departmentId: null }, // Global policies
          { departmentId }, // Department-specific policies
        ],
      },
      orderBy: { limitAmount: 'desc' },
    });
  }

  private async generateApprovalSteps(
    tenantId: string,
    policies: ApprovalPolicy[],
    amount: number,
    departmentId?: string
  ): Promise<ApprovalStep[]> {
    const steps: ApprovalStep[] = [];

    // Sort policies by limit amount (highest first)
    const sortedPolicies = policies.sort((a, b) => Number(b.limitAmount) - Number(a.limitAmount));

    let level = 1;
    for (const policy of sortedPolicies) {
      if (Number(policy.limitAmount) <= amount) {
        steps.push({
          level,
          approverRole: policy.requiresRoles[0], // Take first required role
          limitAmount: Number(policy.limitAmount),
        });
        level++;
      }
    }

    return steps;
  }

  private async getStepApprovers(
    tenantId: string,
    step: ApprovalStep,
    departmentId?: string
  ) {
    const where: any = {
      tenantId,
      role: step.approverRole,
      isActive: true,
    };

    if (step.approverRole === 'HOD' && departmentId) {
      where.departmentId = departmentId;
    }

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });
  }

  private async notifyApprovers(approvers: any[], request: ApprovalRequest): Promise<void> {
    // This would integrate with your notification service
    console.log(`Notifying ${approvers.length} approvers for ${request.documentType} ${request.documentNumber}`);
  }

  private async validateApprovalAuthority(
    context: AccessControlContext,
    documentType: ApprovalDocumentType,
    documentId: string,
    decision: ApprovalDecision
  ): Promise<void> {
    const documentAmount = await this.getDocumentAmount(documentType, documentId);
    const documentDepartmentId = await this.getDocumentDepartmentId(documentType, documentId);

    // Check if user has approval authority for this amount and department
    const policies = await this.getApplicablePolicies(
      context.tenantId,
      documentType,
      documentAmount,
      documentDepartmentId
    );

    const hasAuthority = policies.some(policy => 
      policy.requiresRoles.includes(context.role) &&
      (policy.departmentId === null || policy.departmentId === context.departmentId)
    );

    if (!hasAuthority) {
      throw new UnauthorizedException('Insufficient approval authority');
    }
  }

  private async recordApprovalAction(
    context: AccessControlContext,
    action: {
      documentType: ApprovalDocumentType;
      documentId: string;
      documentNumber: string;
      approverId: string;
      action: ApprovalAction;
      comments?: string;
      requestedAmount: number;
      approvedAmount?: number;
      approvalLevel: number;
    }
  ): Promise<void> {
    await this.prisma.approvalWorkflow.create({
      data: {
        tenantId: context.tenantId,
        documentType: action.documentType,
        documentId: action.documentId,
        documentNumber: action.documentNumber,
        approverId: action.approverId,
        action: action.action,
        comments: action.comments,
        requestedAmount: action.requestedAmount,
        approvedAmount: action.approvedAmount,
        approvalLevel: action.approvalLevel,
      },
    });
  }

  private async handleApprovalAction(
    context: AccessControlContext,
    documentType: ApprovalDocumentType,
    documentId: string,
    decision: ApprovalDecision
  ): Promise<{ status: string; nextApprovers?: string[]; finalDecision?: 'APPROVED' | 'REJECTED' }> {
    // Check if more approvals are needed
    const documentAmount = await this.getDocumentAmount(documentType, documentId);
    const currentLevel = await this.getCurrentApprovalLevel(documentType, documentId);
    const departmentId = await this.getDocumentDepartmentId(documentType, documentId);

    const policies = await this.getApplicablePolicies(
      context.tenantId,
      documentType,
      documentAmount,
      departmentId
    );

    const approvalSteps = await this.generateApprovalSteps(
      context.tenantId,
      policies,
      documentAmount,
      departmentId
    );

    if (currentLevel >= approvalSteps.length) {
      // Final approval - document is fully approved
      await this.updateDocumentStatus(documentType, documentId, 'APPROVED');
      return { status: 'FULLY_APPROVED', finalDecision: 'APPROVED' };
    } else {
      // More approvals needed
      const nextStep = approvalSteps[currentLevel];
      const nextApprovers = await this.getStepApprovers(
        context.tenantId,
        nextStep,
        departmentId
      );

      await this.notifyApprovers(nextApprovers, {
        documentType,
        documentId,
        documentNumber: await this.getDocumentNumber(documentType, documentId),
        requestedAmount: documentAmount,
        requestedBy: context.userId,
        departmentId,
      });

      return {
        status: 'PENDING_NEXT_APPROVAL',
        nextApprovers: nextApprovers.map(a => a.id),
      };
    }
  }

  private async handleDelegation(
    context: AccessControlContext,
    documentType: ApprovalDocumentType,
    documentId: string,
    decision: ApprovalDecision
  ): Promise<{ status: string; nextApprovers?: string[] }> {
    if (!decision.delegatedTo) {
      throw new BadRequestException('Delegation target must be specified');
    }

    // Validate delegation target exists and has appropriate role
    const delegateUser = await this.prisma.user.findUnique({
      where: { id: decision.delegatedTo },
    });

    if (!delegateUser || !delegateUser.isActive) {
      throw new BadRequestException('Invalid delegation target');
    }

    // Notify delegate
    await this.notifyApprovers([delegateUser], {
      documentType,
      documentId,
      documentNumber: await this.getDocumentNumber(documentType, documentId),
      requestedAmount: await this.getDocumentAmount(documentType, documentId),
      requestedBy: context.userId,
    });

    return {
      status: 'DELEGATED',
      nextApprovers: [decision.delegatedTo],
    };
  }

  private async getCurrentApprovalLevel(documentType: ApprovalDocumentType, documentId: string): Promise<number> {
    const approvals = await this.prisma.approvalWorkflow.findMany({
      where: {
        documentType,
        documentId,
        action: ApprovalAction.APPROVED,
      },
    });

    return approvals.length;
  }

  private async getDocumentAmount(documentType: ApprovalDocumentType, documentId: string): Promise<number> {
    switch (documentType) {
      case ApprovalDocumentType.REQUISITION:
        const req = await this.prisma.requisition.findUnique({
          where: { id: documentId },
          select: { totalEstimatedCost: true },
        });
        return Number(req?.totalEstimatedCost || 0);

      case ApprovalDocumentType.PURCHASE_ORDER:
        const po = await this.prisma.purchaseOrder.findUnique({
          where: { id: documentId },
          select: { totalAmount: true },
        });
        return Number(po?.totalAmount || 0);

      case ApprovalDocumentType.INVOICE:
        const inv = await this.prisma.invoice.findUnique({
          where: { id: documentId },
          select: { totalAmount: true },
        });
        return Number(inv?.totalAmount || 0);

      default:
        return 0;
    }
  }

  private async getDocumentNumber(documentType: ApprovalDocumentType, documentId: string): Promise<string> {
    switch (documentType) {
      case ApprovalDocumentType.REQUISITION:
        const req = await this.prisma.requisition.findUnique({
          where: { id: documentId },
          select: { requisitionNumber: true },
        });
        return req?.requisitionNumber || '';

      case ApprovalDocumentType.PURCHASE_ORDER:
        const po = await this.prisma.purchaseOrder.findUnique({
          where: { id: documentId },
          select: { poNumber: true },
        });
        return po?.poNumber || '';

      case ApprovalDocumentType.INVOICE:
        const inv = await this.prisma.invoice.findUnique({
          where: { id: documentId },
          select: { invoiceNumber: true },
        });
        return inv?.invoiceNumber || '';

      default:
        return '';
    }
  }

  private async getDocumentDepartmentId(documentType: ApprovalDocumentType, documentId: string): Promise<string | undefined> {
    switch (documentType) {
      case ApprovalDocumentType.REQUISITION:
        const req = await this.prisma.requisition.findUnique({
          where: { id: documentId },
          select: { departmentId: true },
        });
        return req?.departmentId || undefined;

      case ApprovalDocumentType.PURCHASE_ORDER:
        const po = await this.prisma.purchaseOrder.findUnique({
          where: { id: documentId },
          select: { departmentId: true },
        });
        return po?.departmentId || undefined;

      case ApprovalDocumentType.INVOICE:
        const inv = await this.prisma.invoice.findUnique({
          where: { id: documentId },
          select: { departmentId: true },
        });
        return inv?.departmentId || undefined;

      default:
        return undefined;
    }
  }

  private async getDocumentDetails(documentType: ApprovalDocumentType, documentId: string): Promise<any> {
    switch (documentType) {
      case ApprovalDocumentType.REQUISITION:
        return this.prisma.requisition.findUnique({
          where: { id: documentId },
          include: {
            creator: {
              select: { firstName: true, lastName: true, email: true },
            },
            department: {
              select: { name: true, code: true },
            },
          },
        });

      case ApprovalDocumentType.PURCHASE_ORDER:
        return this.prisma.purchaseOrder.findUnique({
          where: { id: documentId },
          include: {
            creator: {
              select: { firstName: true, lastName: true, email: true },
            },
            supplier: {
              select: { name: true, code: true },
            },
          },
        });

      case ApprovalDocumentType.INVOICE:
        return this.prisma.invoice.findUnique({
          where: { id: documentId },
          include: {
            creator: {
              select: { firstName: true, lastName: true, email: true },
            },
            supplier: {
              select: { name: true, code: true },
            },
          },
        });

      default:
        return null;
    }
  }

  private async updateDocumentStatus(
    documentType: ApprovalDocumentType,
    documentId: string,
    status: string
  ): Promise<void> {
    switch (documentType) {
      case ApprovalDocumentType.REQUISITION:
        await this.prisma.requisition.update({
          where: { id: documentId },
          data: { status: status as any },
        });
        break;

      case ApprovalDocumentType.PURCHASE_ORDER:
        await this.prisma.purchaseOrder.update({
          where: { id: documentId },
          data: { status: status as any },
        });
        break;

      case ApprovalDocumentType.INVOICE:
        await this.prisma.invoice.update({
          where: { id: documentId },
          data: { status: status as any },
        });
        break;
    }
  }

  private async validateViewPermission(
    context: AccessControlContext,
    documentType: ApprovalDocumentType,
    documentId: string
  ): Promise<void> {
    const canAccess = await this.accessControl.canAccessResource(
      context,
      documentType,
      documentId
    );

    if (!canAccess) {
      throw new UnauthorizedException('Insufficient permissions to view approval history');
    }
  }
}