'use client';

import React from 'react';
import { redirect } from 'next/navigation';
import { useRouter, usePathname } from 'next/navigation';
import { Permission, Role } from '@/lib/rbac/types';
import { useAuth, usePermission, useAnyPermission, useRole } from '@/lib/rbac/hooks';
import { hasFeatureAccess } from '@/lib/rbac/utils';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  // Authentication requirements
  requireAuth?: boolean;
  // Permission requirements
  permission?: Permission;
  permissions?: Permission[];
  requireAllPermissions?: boolean;
  // Role requirements
  role?: Role;
  roles?: Role[];
  requireAllRoles?: boolean;
  // Feature access requirements
  feature?: string;
  // Custom condition
  condition?: (user: any) => boolean;
  // Redirect paths
  redirectTo?: string;
  unauthorizedRedirect?: string;
  // Loading component
  loadingComponent?: React.ReactNode;
  // Fallback component for unauthorized access
  fallbackComponent?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  permission,
  permissions,
  requireAllPermissions = false,
  role,
  roles,
  requireAllRoles = false,
  feature,
  condition,
  redirectTo = '/login',
  unauthorizedRedirect = '/unauthorized',
  loadingComponent,
  fallbackComponent,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const userRole = useRole();

  // Show loading while authentication is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {loadingComponent || (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading...</span>
          </div>
        )}
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    router.push(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
    return null;
  }

  // If authenticated, check authorization requirements
  if (isAuthenticated && user) {
    // Check single permission
    if (permission && !usePermission(permission)) {
      if (fallbackComponent) {
        return <>{fallbackComponent}</>;
      }
      router.push(unauthorizedRedirect);
      return null;
    }

    // Check multiple permissions
    if (permissions && permissions.length > 0) {
      const hasPermissions = requireAllPermissions
        ? useAnyPermission(permissions) // This should be useAllPermissions when available
        : useAnyPermission(permissions);

      if (!hasPermissions) {
        if (fallbackComponent) {
          return <>{fallbackComponent}</>;
        }
        router.push(unauthorizedRedirect);
        return null;
      }
    }

    // Check single role
    if (role && userRole !== role) {
      if (fallbackComponent) {
        return <>{fallbackComponent}</>;
      }
      router.push(unauthorizedRedirect);
      return null;
    }

    // Check multiple roles
    if (roles && roles.length > 0) {
      const hasRoles = requireAllRoles
        ? roles.every(r => userRole === r)
        : roles.some(r => userRole === r);

      if (!hasRoles) {
        if (fallbackComponent) {
          return <>{fallbackComponent}</>;
        }
        router.push(unauthorizedRedirect);
        return null;
      }
    }

    // Check feature access
    if (feature && !hasFeatureAccess(user, feature as any)) {
      if (fallbackComponent) {
        return <>{fallbackComponent}</>;
      }
      router.push(unauthorizedRedirect);
      return null;
    }

    // Check custom condition
    if (condition && !condition(user)) {
      if (fallbackComponent) {
        return <>{fallbackComponent}</>;
      }
      router.push(unauthorizedRedirect);
      return null;
    }
  }

  // All checks passed, render children
  return <>{children}</>;
}

// Convenience components for common use cases
export function AdminRoute({ children, ...props }: Omit<ProtectedRouteProps, 'role'>) {
  return (
    <ProtectedRoute role="ADMIN" {...props}>
      {children}
    </ProtectedRoute>
  );
}

export function HODRoute({ children, ...props }: Omit<ProtectedRouteProps, 'roles'>) {
  return (
    <ProtectedRoute roles={['ADMIN', 'HOD']} {...props}>
      {children}
    </ProtectedRoute>
  );
}

export function EmployeeRoute({ children, ...props }: Omit<ProtectedRouteProps, 'requireAuth'>) {
  return (
    <ProtectedRoute requireAuth={true} {...props}>
      {children}
    </ProtectedRoute>
  );
}

export function PermissionRoute({ 
  permission, 
  children, 
  ...props 
}: { permission: Permission } & Omit<ProtectedRouteProps, 'permission'>) {
  return (
    <ProtectedRoute permission={permission} {...props}>
      {children}
    </ProtectedRoute>
  );
}

export function FeatureRoute({ 
  feature, 
  children, 
  ...props 
}: { feature: string } & Omit<ProtectedRouteProps, 'feature'>) {
  return (
    <ProtectedRoute feature={feature} {...props}>
      {children}
    </ProtectedRoute>
  );
}

export default ProtectedRoute;