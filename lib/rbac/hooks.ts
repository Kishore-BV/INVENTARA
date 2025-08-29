'use client';

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/contexts/auth-context';
import { UserContext, Permission, Role } from './types';
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions, 
  hasFeatureAccess, 
  canAccessNavigation,
  getAvailableActions,
  getPermissionLevel
} from './utils';

/**
 * Hook to get current user and auth state
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * Hook to get current user context
 */
export function useUser(): UserContext | null {
  const { user } = useAuth();
  return user;
}

/**
 * Hook to check if user has specific permission
 */
export function usePermission(permission: Permission): boolean {
  const user = useUser();
  return hasPermission(user, permission);
}

/**
 * Hook to check if user has any of the specified permissions
 */
export function useAnyPermission(permissions: Permission[]): boolean {
  const user = useUser();
  return hasAnyPermission(user, permissions);
}

/**
 * Hook to check if user has all of the specified permissions
 */
export function useAllPermissions(permissions: Permission[]): boolean {
  const user = useUser();
  return hasAllPermissions(user, permissions);
}

/**
 * Hook to check if user has access to a feature
 */
export function useFeatureAccess(feature: string): boolean {
  const user = useUser();
  return hasFeatureAccess(user, feature as any);
}

/**
 * Hook to check if user can access navigation item
 */
export function useNavigationAccess(navItem: string): boolean {
  const user = useUser();
  return canAccessNavigation(user, navItem as any);
}

/**
 * Hook to get user's role
 */
export function useRole(): Role | null {
  const user = useUser();
  return user?.role || null;
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin(): boolean {
  const role = useRole();
  return role === 'ADMIN';
}

/**
 * Hook to check if user is HOD
 */
export function useIsHOD(): boolean {
  const role = useRole();
  return role === 'HOD';
}

/**
 * Hook to check if user is employee
 */
export function useIsEmployee(): boolean {
  const role = useRole();
  return role === 'EMPLOYEE';
}

/**
 * Hook to get available actions for a resource type
 */
export function useResourceActions(resourceType: string): string[] {
  const user = useUser();
  return getAvailableActions(user, resourceType as any);
}

/**
 * Hook to get permission level for a resource
 */
export function usePermissionLevel(resourceType: string): 'NONE' | 'READ' | 'WRITE' | 'ADMIN' {
  const user = useUser();
  return getPermissionLevel(user, resourceType);
}

/**
 * Hook to check if user belongs to specific department
 */
export function useInDepartment(departmentId?: string): boolean {
  const user = useUser();
  if (!user || !departmentId) return false;
  return user.departmentId === departmentId;
}

/**
 * Hook to get user's department info
 */
export function useDepartment(): { id: string | null; name: string | null } {
  const user = useUser();
  return {
    id: user?.departmentId || null,
    name: user?.departmentName || null,
  };
}

/**
 * Hook to manage auth loading states
 */
export function useAuthLoading() {
  const { isLoading, isAuthenticated } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true);
    }
  }, [isLoading]);

  return {
    isLoading,
    isAuthenticated,
    isInitialized,
  };
}

/**
 * Hook to check multiple permissions at once
 */
export function usePermissions(permissions: Permission[]): Record<string, boolean> {
  const user = useUser();
  
  return permissions.reduce((acc, permission) => {
    acc[permission] = hasPermission(user, permission);
    return acc;
  }, {} as Record<string, boolean>);
}

/**
 * Hook to get user's accessible features
 */
export function useAccessibleFeatures(): string[] {
  const user = useUser();
  if (!user) return [];

  const features = [
    'ADMIN_CONSOLE',
    'MASTER_DATA_MANAGE',
    'MASTER_DATA_PROPOSE',
    'PROCUREMENT_CREATE',
    'PROCUREMENT_APPROVE',
    'WAREHOUSE_OPERATIONS',
    'FINANCIAL_MANAGE',
    'FINANCIAL_APPROVE',
    'GST_CONSOLE',
    'GST_OPERATIONS',
    'REPORTS_MANAGEMENT',
    'REPORTS_DEPARTMENTAL',
    'DATA_EXPORT',
    'AUDIT_ACCESS',
    'APPROVAL_MANAGEMENT',
  ];

  return features.filter(feature => hasFeatureAccess(user, feature));
}

/**
 * Hook to get user's accessible navigation items
 */
export function useAccessibleNavigation(): string[] {
  const user = useUser();
  if (!user) return ['DASHBOARD'];

  const navItems = [
    'DASHBOARD',
    'REQUISITIONS',
    'PURCHASE_ORDERS',
    'GOODS_RECEIPTS',
    'ITEMS_CATALOG',
    'SUPPLIERS',
    'CUSTOMERS',
    'INVOICES',
    'PAYMENTS',
    'GST_CONSOLE',
    'REPORTS',
    'USER_MANAGEMENT',
    'TENANT_SETTINGS',
    'APPROVAL_POLICIES',
    'AUDIT_LOGS',
  ];

  return navItems.filter(navItem => canAccessNavigation(user, navItem as any));
}

/**
 * Hook for conditional rendering based on permissions
 */
export function useConditionalRender() {
  const user = useUser();

  return {
    // Show for admins only
    whenAdmin: (content: React.ReactNode) => user?.role === 'ADMIN' ? content : null,
    
    // Show for HODs and above
    whenHODOrAbove: (content: React.ReactNode) => 
      user?.role === 'ADMIN' || user?.role === 'HOD' ? content : null,
    
    // Show when user has permission
    whenPermission: (permission: Permission, content: React.ReactNode) => 
      hasPermission(user, permission) ? content : null,
    
    // Show when user has any permission
    whenAnyPermission: (permissions: Permission[], content: React.ReactNode) => 
      hasAnyPermission(user, permissions) ? content : null,
    
    // Show when user has feature access
    whenFeature: (feature: string, content: React.ReactNode) => 
      hasFeatureAccess(user, feature as any) ? content : null,
  };
}

/**
 * Hook to handle role-based data fetching
 */
export function useRoleBasedQuery() {
  const user = useUser();

  const getQueryParams = (baseParams: any = {}) => {
    if (!user) return baseParams;

    switch (user.role) {
      case 'ADMIN':
        return {
          ...baseParams,
          scope: 'tenant',
          tenantId: user.tenantId,
        };
      
      case 'HOD':
        return {
          ...baseParams,
          scope: 'department',
          tenantId: user.tenantId,
          departmentId: user.departmentId,
        };
      
      case 'EMPLOYEE':
        return {
          ...baseParams,
          scope: 'user',
          tenantId: user.tenantId,
          userId: user.id,
        };
      
      default:
        return baseParams;
    }
  };

  return { getQueryParams };
}

/**
 * Hook for managing approval-related permissions
 */
export function useApprovalPermissions() {
  const user = useUser();

  return {
    canApproveRequisitions: hasPermission(user, Permission.REQ_APPROVE),
    canApprovePurchaseOrders: hasPermission(user, Permission.PO_APPROVE),
    canApproveInvoices: hasPermission(user, Permission.INVOICE_APPROVE),
    canApprovePayments: hasPermission(user, Permission.PAYMENT_APPROVE),
    canManageApprovalPolicies: hasPermission(user, Permission.APPROVAL_MANAGE),
    canViewAllApprovals: hasPermission(user, Permission.APPROVAL_VIEW_ALL),
    canViewDeptApprovals: hasPermission(user, Permission.APPROVAL_VIEW_DEPT),
    canViewOwnApprovals: hasPermission(user, Permission.APPROVAL_VIEW_OWN),
  };
}

/**
 * Hook for managing GST-related permissions
 */
export function useGSTPermissions() {
  const user = useUser();

  return {
    canAccessConsole: hasPermission(user, Permission.GST_CONSOLE_ACCESS),
    canGenerateIRN: hasPermission(user, Permission.GST_IRN_GENERATE),
    canCancelIRN: hasPermission(user, Permission.GST_IRN_CANCEL),
    canGenerateEWaybill: hasPermission(user, Permission.GST_EWAYBILL_GENERATE),
    canCancelEWaybill: hasPermission(user, Permission.GST_EWAYBILL_CANCEL),
    canFileReturns: hasPermission(user, Permission.GST_RETURNS_FILE),
    canReadAllGST: hasPermission(user, Permission.GST_READ_ALL),
    canReadDeptGST: hasPermission(user, Permission.GST_READ_DEPT),
    canReadOwnGST: hasPermission(user, Permission.GST_READ_OWN),
  };
}

/**
 * Hook for managing report permissions
 */
export function useReportPermissions() {
  const user = useUser();

  return {
    canViewAllReports: hasPermission(user, Permission.REPORTS_ALL),
    canViewDeptReports: hasPermission(user, Permission.REPORTS_DEPT),
    canViewPersonalReports: hasPermission(user, Permission.REPORTS_PERSONAL),
    canViewAllDashboards: hasPermission(user, Permission.DASHBOARDS_ALL),
    canViewDeptDashboards: hasPermission(user, Permission.DASHBOARDS_DEPT),
    canViewPersonalDashboards: hasPermission(user, Permission.DASHBOARDS_PERSONAL),
    canExportAllData: hasPermission(user, Permission.EXPORT_ALL),
    canExportDeptData: hasPermission(user, Permission.EXPORT_DEPT),
    canExportOwnData: hasPermission(user, Permission.EXPORT_OWN),
  };
}