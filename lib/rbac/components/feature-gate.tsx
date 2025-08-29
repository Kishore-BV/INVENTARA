'use client';

import React from 'react';
import { Permission, UserContext } from '../types';
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions, 
  hasFeatureAccess,
  isAdmin,
  isHOD,
  isEmployee
} from '../utils';
import { useUser } from '../hooks';

interface FeatureGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface PermissionGateProps extends FeatureGateProps {
  permission: Permission;
}

interface AnyPermissionGateProps extends FeatureGateProps {
  permissions: Permission[];
}

interface AllPermissionGateProps extends FeatureGateProps {
  permissions: Permission[];
}

interface RoleGateProps extends FeatureGateProps {
  roles: ('ADMIN' | 'HOD' | 'EMPLOYEE')[];
  requireAll?: boolean;
}

interface FeatureAccessGateProps extends FeatureGateProps {
  feature: string;
}

interface DepartmentGateProps extends FeatureGateProps {
  departmentId?: string;
  requireSameDepartment?: boolean;
}

interface ConditionalGateProps extends FeatureGateProps {
  condition: (user: UserContext | null) => boolean;
}

/**
 * Base FeatureGate component for conditional rendering
 */
export function FeatureGate({ children, fallback = null }: FeatureGateProps) {
  const user = useUser();
  
  // If no user, don't render
  if (!user) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Gate that requires a specific permission
 */
export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const user = useUser();
  
  if (!hasPermission(user, permission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Gate that requires any of the specified permissions
 */
export function AnyPermissionGate({ permissions, children, fallback = null }: AnyPermissionGateProps) {
  const user = useUser();
  
  if (!hasAnyPermission(user, permissions)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Gate that requires all of the specified permissions
 */
export function AllPermissionGate({ permissions, children, fallback = null }: AllPermissionGateProps) {
  const user = useUser();
  
  if (!hasAllPermissions(user, permissions)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Gate that requires specific role(s)
 */
export function RoleGate({ roles, requireAll = false, children, fallback = null }: RoleGateProps) {
  const user = useUser();
  
  if (!user) {
    return <>{fallback}</>;
  }
  
  const hasRequiredRole = requireAll 
    ? roles.every(role => user.role === role)
    : roles.some(role => user.role === role);
  
  if (!hasRequiredRole) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Gate that requires access to a specific feature
 */
export function FeatureAccessGate({ feature, children, fallback = null }: FeatureAccessGateProps) {
  const user = useUser();
  
  if (!hasFeatureAccess(user, feature as any)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Gate that checks department access
 */
export function DepartmentGate({ 
  departmentId, 
  requireSameDepartment = false, 
  children, 
  fallback = null 
}: DepartmentGateProps) {
  const user = useUser();
  
  if (!user) {
    return <>{fallback}</>;
  }
  
  // Admin can access all departments
  if (isAdmin(user)) {
    return <>{children}</>;
  }
  
  // If department ID is specified, check if user belongs to it
  if (departmentId && user.departmentId !== departmentId) {
    return <>{fallback}</>;
  }
  
  // If same department is required, check if user has a department
  if (requireSameDepartment && !user.departmentId) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Gate with custom condition function
 */
export function ConditionalGate({ condition, children, fallback = null }: ConditionalGateProps) {
  const user = useUser();
  
  if (!condition(user)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Admin-only gate
 */
export function AdminGate({ children, fallback = null }: FeatureGateProps) {
  const user = useUser();
  
  if (!isAdmin(user)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * HOD or Admin gate
 */
export function HODGate({ children, fallback = null }: FeatureGateProps) {
  const user = useUser();
  
  if (!isHOD(user) && !isAdmin(user)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Employee-only gate (not HOD or Admin)
 */
export function EmployeeGate({ children, fallback = null }: FeatureGateProps) {
  const user = useUser();
  
  if (!isEmployee(user)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Authenticated user gate
 */
export function AuthenticatedGate({ children, fallback = null }: FeatureGateProps) {
  return (
    <FeatureGate fallback={fallback}>
      {children}
    </FeatureGate>
  );
}

// Compound component for complex permission logic
export const Can = {
  View: PermissionGate,
  ViewAny: AnyPermissionGate,
  ViewAll: AllPermissionGate,
  Access: FeatureAccessGate,
  Department: DepartmentGate,
  Role: RoleGate,
  Admin: AdminGate,
  HOD: HODGate,
  Employee: EmployeeGate,
  Authenticated: AuthenticatedGate,
  When: ConditionalGate,
};

export default Can;