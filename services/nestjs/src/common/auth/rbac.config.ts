import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { Permission, Role, RolePermissions } from './permissions';

/**
 * Role configuration interface
 */
export interface RoleConfig {
  role: Role;
  displayName: string;
  description: string;
  permissions: Permission[];
  hierarchy: number; // Higher number = more privileges
  defaultApprovalLimits?: {
    requisitionLimit?: number;
    purchaseOrderLimit?: number;
    invoiceLimit?: number;
    paymentLimit?: number;
  };
  features: string[];
  restrictions?: {
    maxDepartments?: number;
    allowCrossDepartmentAccess?: boolean;
    requireMFA?: boolean;
    sessionTimeout?: number;
  };
}

/**
 * RBAC Configuration Service
 * 
 * Manages role-based access control configuration:
 * - Role definitions and hierarchies
 * - Permission mappings
 * - Approval limits and policies
 * - Feature toggles per role
 * - Security restrictions
 */
@Injectable()
export class RBACConfigService {
  private readonly roleConfigs: Map<Role, RoleConfig> = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.initializeRoleConfigurations();
  }

  /**
   * Initialize default role configurations
   */
  private initializeRoleConfigurations(): void {
    // Administrator Configuration
    this.roleConfigs.set('ADMIN', {
      role: 'ADMIN',
      displayName: 'Administrator',
      description: 'Full system access with tenant-wide administrative privileges',
      permissions: RolePermissions.ADMIN,
      hierarchy: 100,
      defaultApprovalLimits: {
        requisitionLimit: Number.MAX_SAFE_INTEGER,
        purchaseOrderLimit: Number.MAX_SAFE_INTEGER,
        invoiceLimit: Number.MAX_SAFE_INTEGER,
        paymentLimit: Number.MAX_SAFE_INTEGER,
      },
      features: [
        'ADMIN_CONSOLE',
        'MASTER_DATA_MANAGE',
        'PROCUREMENT_CREATE',
        'PROCUREMENT_APPROVE',
        'WAREHOUSE_OPERATIONS',
        'FINANCIAL_MANAGE',
        'FINANCIAL_APPROVE',
        'GST_CONSOLE',
        'GST_OPERATIONS',
        'REPORTS_MANAGEMENT',
        'DATA_EXPORT',
        'AUDIT_ACCESS',
        'APPROVAL_MANAGEMENT',
      ],
      restrictions: {
        allowCrossDepartmentAccess: true,
        requireMFA: this.configService.get<boolean>('ADMIN_REQUIRE_MFA') || false,
        sessionTimeout: this.configService.get<number>('ADMIN_SESSION_TIMEOUT') || 28800, // 8 hours
      },
    });

    // Head of Department Configuration
    this.roleConfigs.set('HOD', {
      role: 'HOD',
      displayName: 'Head of Department',
      description: 'Department-scoped access with approval and management capabilities',
      permissions: RolePermissions.HOD,
      hierarchy: 50,
      defaultApprovalLimits: {
        requisitionLimit: this.configService.get<number>('HOD_REQUISITION_LIMIT') || 100000,
        purchaseOrderLimit: this.configService.get<number>('HOD_PO_LIMIT') || 500000,
        invoiceLimit: this.configService.get<number>('HOD_INVOICE_LIMIT') || 500000,
        paymentLimit: this.configService.get<number>('HOD_PAYMENT_LIMIT') || 100000,
      },
      features: [
        'MASTER_DATA_PROPOSE',
        'PROCUREMENT_CREATE',
        'PROCUREMENT_APPROVE',
        'WAREHOUSE_OPERATIONS',
        'FINANCIAL_APPROVE',
        'GST_CONSOLE',
        'REPORTS_DEPARTMENTAL',
        'DATA_EXPORT',
        'AUDIT_ACCESS',
      ],
      restrictions: {
        maxDepartments: 1,
        allowCrossDepartmentAccess: false,
        requireMFA: this.configService.get<boolean>('HOD_REQUIRE_MFA') || false,
        sessionTimeout: this.configService.get<number>('HOD_SESSION_TIMEOUT') || 14400, // 4 hours
      },
    });

    // Employee Configuration
    this.roleConfigs.set('EMPLOYEE', {
      role: 'EMPLOYEE',
      displayName: 'Employee',
      description: 'Limited access to personal records and basic operations',
      permissions: RolePermissions.EMPLOYEE,
      hierarchy: 10,
      defaultApprovalLimits: {
        requisitionLimit: this.configService.get<number>('EMPLOYEE_REQUISITION_LIMIT') || 10000,
        purchaseOrderLimit: 0, // Employees cannot create POs
        invoiceLimit: 0, // Employees cannot create invoices
        paymentLimit: 0, // Employees cannot create payments
      },
      features: [
        'PROCUREMENT_CREATE', // Limited requisitions only
        'WAREHOUSE_OPERATIONS', // If assigned
        'REPORTS_PERSONAL',
        'DATA_EXPORT', // Own data only
      ],
      restrictions: {
        maxDepartments: 1,
        allowCrossDepartmentAccess: false,
        requireMFA: this.configService.get<boolean>('EMPLOYEE_REQUIRE_MFA') || false,
        sessionTimeout: this.configService.get<number>('EMPLOYEE_SESSION_TIMEOUT') || 14400, // 4 hours
      },
    });
  }

  /**
   * Get role configuration
   */
  getRoleConfig(role: Role): RoleConfig | undefined {
    return this.roleConfigs.get(role);
  }

  /**
   * Get all role configurations
   */
  getAllRoleConfigs(): RoleConfig[] {
    return Array.from(this.roleConfigs.values());
  }

  /**
   * Check if role has higher privileges than another
   */
  hasHigherPrivileges(role1: Role, role2: Role): boolean {
    const config1 = this.getRoleConfig(role1);
    const config2 = this.getRoleConfig(role2);
    
    if (!config1 || !config2) {
      return false;
    }
    
    return config1.hierarchy > config2.hierarchy;
  }

  /**
   * Get role hierarchy level
   */
  getRoleHierarchy(role: Role): number {
    return this.getRoleConfig(role)?.hierarchy || 0;
  }

  /**
   * Get default approval limits for role
   */
  getDefaultApprovalLimits(role: Role): RoleConfig['defaultApprovalLimits'] {
    return this.getRoleConfig(role)?.defaultApprovalLimits;
  }

  /**
   * Get tenant-specific approval policies
   */
  async getTenantApprovalPolicies(tenantId: string): Promise<any[]> {
    return this.prisma.approvalPolicy.findMany({
      where: { tenantId },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: [
        { documentType: 'asc' },
        { thresholdAmount: 'asc' },
      ],
    });
  }

  /**
   * Get effective approval limits for user
   */
  async getEffectiveApprovalLimits(
    userId: string,
    tenantId: string,
    departmentId?: string | null
  ): Promise<{
    requisitionLimit: number;
    purchaseOrderLimit: number;
    invoiceLimit: number;
    paymentLimit: number;
  }> {
    // Get user role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get default limits for role
    const defaultLimits = this.getDefaultApprovalLimits(user.role as Role);
    
    // Get tenant-specific policies
    const policies = await this.getTenantApprovalPolicies(tenantId);
    
    // Calculate effective limits based on policies
    const effectiveLimits = {
      requisitionLimit: defaultLimits?.requisitionLimit || 0,
      purchaseOrderLimit: defaultLimits?.purchaseOrderLimit || 0,
      invoiceLimit: defaultLimits?.invoiceLimit || 0,
      paymentLimit: defaultLimits?.paymentLimit || 0,
    };

    // Apply tenant-specific policies
    for (const policy of policies) {
      if (departmentId && policy.departmentId && policy.departmentId !== departmentId) {
        continue; // Skip policies for other departments
      }

      // Apply policy limits based on document type and role
      if (policy.approverRole === user.role || policy.approverRole === 'ANY') {
        switch (policy.documentType) {
          case 'REQUISITION':
            effectiveLimits.requisitionLimit = Math.min(
              effectiveLimits.requisitionLimit,
              policy.maxAmount || Number.MAX_SAFE_INTEGER
            );
            break;
          case 'PURCHASE_ORDER':
            effectiveLimits.purchaseOrderLimit = Math.min(
              effectiveLimits.purchaseOrderLimit,
              policy.maxAmount || Number.MAX_SAFE_INTEGER
            );
            break;
          case 'INVOICE':
            effectiveLimits.invoiceLimit = Math.min(
              effectiveLimits.invoiceLimit,
              policy.maxAmount || Number.MAX_SAFE_INTEGER
            );
            break;
          case 'PAYMENT':
            effectiveLimits.paymentLimit = Math.min(
              effectiveLimits.paymentLimit,
              policy.maxAmount || Number.MAX_SAFE_INTEGER
            );
            break;
        }
      }
    }

    return effectiveLimits;
  }

  /**
   * Check if user can approve document with specific amount
   */
  async canApproveAmount(
    userId: string,
    documentType: 'REQUISITION' | 'PURCHASE_ORDER' | 'INVOICE' | 'PAYMENT',
    amount: number,
    tenantId: string,
    departmentId?: string | null
  ): Promise<boolean> {
    const limits = await this.getEffectiveApprovalLimits(userId, tenantId, departmentId);
    
    switch (documentType) {
      case 'REQUISITION':
        return amount <= limits.requisitionLimit;
      case 'PURCHASE_ORDER':
        return amount <= limits.purchaseOrderLimit;
      case 'INVOICE':
        return amount <= limits.invoiceLimit;
      case 'PAYMENT':
        return amount <= limits.paymentLimit;
      default:
        return false;
    }
  }

  /**
   * Get role restrictions
   */
  getRoleRestrictions(role: Role): RoleConfig['restrictions'] {
    return this.getRoleConfig(role)?.restrictions;
  }

  /**
   * Check if role requires MFA
   */
  requiresMFA(role: Role): boolean {
    return this.getRoleConfig(role)?.restrictions?.requireMFA || false;
  }

  /**
   * Get session timeout for role
   */
  getSessionTimeout(role: Role): number {
    return this.getRoleConfig(role)?.restrictions?.sessionTimeout || 14400; // 4 hours default
  }

  /**
   * Validate role transition (for role changes)
   */
  canTransitionRole(fromRole: Role, toRole: Role, currentUserRole: Role): boolean {
    const currentConfig = this.getRoleConfig(currentUserRole);
    const fromConfig = this.getRoleConfig(fromRole);
    const toConfig = this.getRoleConfig(toRole);

    if (!currentConfig || !fromConfig || !toConfig) {
      return false;
    }

    // Only users with higher privileges can change roles
    return currentConfig.hierarchy > Math.max(fromConfig.hierarchy, toConfig.hierarchy);
  }

  /**
   * Get role capabilities summary
   */
  getRoleCapabilities(role: Role): {
    canManageUsers: boolean;
    canApproveDocuments: boolean;
    canAccessGST: boolean;
    canViewReports: 'ALL' | 'DEPARTMENT' | 'PERSONAL';
    canExportData: 'ALL' | 'DEPARTMENT' | 'OWN';
    maxApprovalAmount: number;
  } {
    const config = this.getRoleConfig(role);
    if (!config) {
      throw new Error(`Invalid role: ${role}`);
    }

    const hasPermission = (permission: Permission) => config.permissions.includes(permission);

    return {
      canManageUsers: hasPermission(Permission.USER_MANAGE_ALL) || hasPermission(Permission.USER_READ_DEPT),
      canApproveDocuments: [
        Permission.REQ_APPROVE,
        Permission.PO_APPROVE,
        Permission.INVOICE_APPROVE,
        Permission.PAYMENT_APPROVE,
      ].some(p => hasPermission(p)),
      canAccessGST: hasPermission(Permission.GST_CONSOLE_ACCESS),
      canViewReports: hasPermission(Permission.REPORTS_ALL) ? 'ALL' : 
                     hasPermission(Permission.REPORTS_DEPT) ? 'DEPARTMENT' : 'PERSONAL',
      canExportData: hasPermission(Permission.EXPORT_ALL) ? 'ALL' :
                    hasPermission(Permission.EXPORT_DEPT) ? 'DEPARTMENT' : 'OWN',
      maxApprovalAmount: Math.max(
        config.defaultApprovalLimits?.requisitionLimit || 0,
        config.defaultApprovalLimits?.purchaseOrderLimit || 0,
        config.defaultApprovalLimits?.invoiceLimit || 0,
        config.defaultApprovalLimits?.paymentLimit || 0
      ),
    };
  }
}