import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Role, UserContext } from '@/lib/rbac/types';
import { getRoleDisplayName, formatUserContext } from '@/lib/rbac/utils';
import { Shield, Users, User } from 'lucide-react';

interface RoleBadgeProps {
  role: Role;
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  showIcon?: boolean;
}

interface UserRoleBadgeProps {
  user: UserContext;
  showDepartment?: boolean;
  showIcon?: boolean;
  className?: string;
}

interface PermissionBadgeProps {
  permission: string;
  granted: boolean;
  className?: string;
}

const roleConfig = {
  ADMIN: {
    variant: 'destructive' as const,
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  HOD: {
    variant: 'default' as const,
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  EMPLOYEE: {
    variant: 'secondary' as const,
    icon: User,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
};

/**
 * Badge component for displaying user roles
 */
export function RoleBadge({ 
  role, 
  className, 
  variant, 
  size = 'default',
  showIcon = false 
}: RoleBadgeProps) {
  const config = roleConfig[role];
  const Icon = config.icon;
  const displayName = getRoleDisplayName(role);
  const badgeVariant = variant || config.variant;

  return (
    <Badge 
      variant={badgeVariant}
      className={cn(
        'font-medium',
        size === 'sm' && 'text-xs px-2 py-0.5',
        size === 'lg' && 'text-sm px-3 py-1',
        className
      )}
    >
      {showIcon && (
        <Icon className={cn(
          'mr-1',
          size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'
        )} />
      )}
      {displayName}
    </Badge>
  );
}

/**
 * Enhanced badge that shows user role and department
 */
export function UserRoleBadge({ 
  user, 
  showDepartment = false, 
  showIcon = true,
  className 
}: UserRoleBadgeProps) {
  const config = roleConfig[user.role];
  const Icon = config.icon;
  const { roleDisplay, departmentDisplay } = formatUserContext(user);

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Badge 
        variant={config.variant}
        className="font-medium"
      >
        {showIcon && <Icon className="mr-1 h-4 w-4" />}
        {roleDisplay}
      </Badge>
      
      {showDepartment && user.departmentName && (
        <Badge variant="outline" className="text-xs">
          {departmentDisplay}
        </Badge>
      )}
    </div>
  );
}

/**
 * Badge for showing permission status
 */
export function PermissionBadge({ 
  permission, 
  granted, 
  className 
}: PermissionBadgeProps) {
  return (
    <Badge 
      variant={granted ? 'default' : 'secondary'}
      className={cn(
        'text-xs',
        granted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
        className
      )}
    >
      {permission.replace(/_/g, ' ').toLowerCase()}
    </Badge>
  );
}

/**
 * Card component for displaying detailed role information
 */
interface RoleCardProps {
  user: UserContext;
  showPermissions?: boolean;
  className?: string;
}

export function RoleCard({ user, showPermissions = false, className }: RoleCardProps) {
  const { displayName, roleDisplay, departmentDisplay, initials } = formatUserContext(user);
  const config = roleConfig[user.role];
  const Icon = config.icon;

  return (
    <div className={cn(
      'p-4 rounded-lg border',
      config.bgColor,
      config.borderColor,
      className
    )}>
      <div className="flex items-center space-x-3 mb-3">
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold',
          user.role === 'ADMIN' && 'bg-red-600',
          user.role === 'HOD' && 'bg-blue-600',
          user.role === 'EMPLOYEE' && 'bg-gray-600'
        )}>
          {initials}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{displayName}</div>
          <div className="flex items-center space-x-2">
            <Icon className={cn('h-4 w-4', config.color)} />
            <span className={cn('text-sm font-medium', config.color)}>
              {roleDisplay}
            </span>
          </div>
        </div>
      </div>

      {user.departmentName && (
        <div className="mb-3">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Department:</span> {departmentDisplay}
          </div>
        </div>
      )}

      {showPermissions && user.permissions && (
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">
            Permissions ({user.permissions.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {user.permissions.slice(0, 6).map((permission) => (
              <PermissionBadge
                key={permission}
                permission={permission}
                granted={true}
              />
            ))}
            {user.permissions.length > 6 && (
              <Badge variant="outline" className="text-xs">
                +{user.permissions.length - 6} more
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Simple role indicator for compact displays
 */
interface RoleIndicatorProps {
  role: Role;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RoleIndicator({ role, size = 'md', className }: RoleIndicatorProps) {
  const config = roleConfig[role];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className={cn(
      'inline-flex items-center justify-center rounded-full p-1',
      config.bgColor,
      className
    )}>
      <Icon className={cn(sizeClasses[size], config.color)} />
    </div>
  );
}

export default RoleBadge;