import { 
  CanActivate, 
  ExecutionContext, 
  Injectable, 
  ForbiddenException,
  UnauthorizedException,
  Reflector 
} from '@nestjs/common';
import { Request } from 'express';
import { REQUIRE_PERMISSIONS_KEY } from './require-permissions.decorator';
import { Permission, Role, hasPermission, canPerformOperation, PermissionContext } from './permissions';

/**
 * Extended user interface for request context
 */
export interface AuthenticatedUser {
  id: string;
  tenantId: string;
  departmentId?: string | null;
  departmentName?: string | null;
  role: Role;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  permissions?: string[];
}

/**
 * Extended request interface with user context
 */
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

/**
 * Permission Guard - Enforces role-based access control
 * 
 * This guard:
 * 1. Validates that user is authenticated
 * 2. Checks if user's role has required permissions  
 * 3. Enforces department-level scoping for HOD/Employee roles
 * 4. Handles resource ownership validation for Employee role
 * 
 * Usage:
 * @UseGuards(PermissionsGuard)
 * @RequirePermissions(Permission.REQ_CREATE)
 * @Post('/requisitions')
 * createRequisition() { ... }
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required permissions from decorator metadata
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      REQUIRE_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    // If no permissions required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    // Ensure user is authenticated
    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    // Ensure user is active
    if (!user.isActive) {
      throw new ForbiddenException('User account is inactive');
    }

    // Check basic role permissions (at least one required permission must be satisfied)
    const hasRequiredPermission = requiredPermissions.some(permission => 
      hasPermission(user.role, permission)
    );

    if (!hasRequiredPermission) {
      throw new ForbiddenException(
        `Insufficient permissions. Required: ${requiredPermissions.join(' or ')}`
      );
    }

    // For Admin role, always allow (they have full access)
    if (user.role === 'ADMIN') {
      return true;
    }

    // For HOD and Employee roles, check department/ownership context
    const permissionContext: PermissionContext = {
      role: user.role,
      tenantId: user.tenantId,
      departmentId: user.departmentId,
      userId: user.id,
    };

    // Get resource context from request (if applicable)
    const resourceContext = this.extractResourceContext(request);

    // Validate department scoping and resource ownership
    return this.validateContextualAccess(
      permissionContext,
      requiredPermissions,
      resourceContext
    );
  }

  /**
   * Extract resource context from request parameters and body
   */
  private extractResourceContext(request: AuthenticatedRequest): {
    resourceId?: string;
    resourceOwnerId?: string;
    resourceDepartmentId?: string;
    resourceType?: string;
  } {
    const params = request.params;
    const body = request.body;
    const query = request.query;

    return {
      resourceId: params.id || body.id || query.id,
      resourceOwnerId: body.createdBy || body.ownerId,
      resourceDepartmentId: body.departmentId,
      resourceType: this.inferResourceType(request.url),
    };
  }

  /**
   * Infer resource type from URL path
   */
  private inferResourceType(url: string): string | undefined {
    if (url.includes('/requisitions')) return 'REQUISITION';
    if (url.includes('/purchase-orders')) return 'PURCHASE_ORDER';
    if (url.includes('/invoices')) return 'INVOICE';
    if (url.includes('/goods-receipts')) return 'GOODS_RECEIPT';
    if (url.includes('/suppliers')) return 'SUPPLIER';
    if (url.includes('/customers')) return 'CUSTOMER';
    if (url.includes('/items')) return 'ITEM';
    if (url.includes('/gst')) return 'GST';
    if (url.includes('/users')) return 'USER';
    if (url.includes('/departments')) return 'DEPARTMENT';
    return undefined;
  }

  /**
   * Validate contextual access based on role, department, and resource ownership
   */
  private validateContextualAccess(
    context: PermissionContext,
    requiredPermissions: Permission[],
    resourceContext: any
  ): boolean {
    const { role, departmentId, userId } = context;

    // For each required permission, check if it can be performed in this context
    for (const permission of requiredPermissions) {
      const canPerform = canPerformOperation(
        context,
        permission,
        resourceContext.resourceOwnerId,
        resourceContext.resourceDepartmentId
      );

      if (canPerform) {
        return true; // At least one permission is satisfied
      }
    }

    // Additional contextual validation
    return this.validateSpecialCases(context, requiredPermissions, resourceContext);
  }

  /**
   * Handle special validation cases
   */
  private validateSpecialCases(
    context: PermissionContext,
    requiredPermissions: Permission[],
    resourceContext: any
  ): boolean {
    const { role, departmentId } = context;

    // HOD special cases
    if (role === 'HOD') {
      // HODs can read department data even without explicit department_id in resource
      const hasReadPermission = requiredPermissions.some(p => 
        p.includes('_READ') && (p.includes('_DEPT') || p.includes('_ALL'))
      );

      if (hasReadPermission) {
        return true; // Allow department-level read access
      }

      // HODs can approve within their department regardless of who created
      const hasApprovalPermission = requiredPermissions.some(p => p.includes('_APPROVE'));
      if (hasApprovalPermission && resourceContext.resourceDepartmentId === departmentId) {
        return true;
      }
    }

    // Employee special cases
    if (role === 'EMPLOYEE') {
      // Employees can read catalog data (master data) without ownership check
      const isCatalogRead = requiredPermissions.some(p => 
        (p === Permission.ITEMS_READ || 
         p === Permission.SUPPLIERS_READ || 
         p === Permission.CUSTOMERS_READ ||
         p === Permission.TAX_CODES_READ) &&
        resourceContext.resourceType &&
        ['ITEM', 'SUPPLIER', 'CUSTOMER', 'TAX_CODE'].includes(resourceContext.resourceType)
      );

      if (isCatalogRead) {
        return true;
      }

      // Employees can create requisitions (they will become the owner)
      const isCreateRequisition = requiredPermissions.includes(Permission.REQ_CREATE) &&
        resourceContext.resourceType === 'REQUISITION';

      if (isCreateRequisition) {
        return true;
      }
    }

    return false;
  }
}

/**
 * Resource Owner Guard - Additional validation for resource ownership
 * 
 * This guard should be used after PermissionsGuard for operations that require
 * strict ownership validation (e.g., updating/deleting own records)
 */
@Injectable()
export class ResourceOwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    // Admin can access any resource
    if (user.role === 'ADMIN') {
      return true;
    }

    // For other roles, check resource ownership or department membership
    const resourceId = request.params.id;
    if (!resourceId) {
      return true; // No specific resource, proceed
    }

    // This would typically involve a database lookup to check resource ownership
    // For now, we'll delegate to the service layer to handle this validation
    return true;
  }
}

/**
 * Department Member Guard - Validates department membership
 * 
 * Ensures user belongs to the department specified in the request
 */
@Injectable()
export class DepartmentMemberGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    // Admin can access any department
    if (user.role === 'ADMIN') {
      return true;
    }

    const requestedDepartmentId = request.params.departmentId || request.body.departmentId;
    
    // If no department specified in request, allow
    if (!requestedDepartmentId) {
      return true;
    }

    // Check if user belongs to the requested department
    if (user.departmentId !== requestedDepartmentId) {
      throw new ForbiddenException('Access denied: Not a member of the requested department');
    }

    return true;
  }
}

/**
 * Active User Guard - Ensures user account is active
 */
@Injectable()
export class ActiveUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    if (!user.isActive) {
      throw new ForbiddenException('User account is inactive');
    }

    return true;
  }
}

/**
 * Tenant Member Guard - Validates tenant membership
 */
@Injectable()
export class TenantMemberGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    const requestedTenantId = request.headers['x-tenant-id'] || request.params.tenantId;
    
    // If no tenant specified in request, use user's tenant
    if (!requestedTenantId) {
      return true;
    }

    // Check if user belongs to the requested tenant
    if (user.tenantId !== requestedTenantId) {
      throw new ForbiddenException('Access denied: Not a member of the requested tenant');
    }

    return true;
  }
}