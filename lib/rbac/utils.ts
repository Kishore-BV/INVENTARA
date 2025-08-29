import { Permission, Role, UserContext, FeatureGroups, NavigationPermissions } from './types';

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: UserContext | null, permission: Permission): boolean {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(user: UserContext | null, permissions: Permission[]): boolean {
  if (!user || !user.permissions) return false;
  return permissions.some(permission => user.permissions.includes(permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(user: UserContext | null, permissions: Permission[]): boolean {
  if (!user || !user.permissions) return false;
  return permissions.every(permission => user.permissions.includes(permission));
}

/**
 * Check if user has access to a feature group
 */
export function hasFeatureAccess(user: UserContext | null, feature: keyof typeof FeatureGroups): boolean {
  if (!user) return false;
  const requiredPermissions = FeatureGroups[feature];
  return hasAnyPermission(user, requiredPermissions);
}

/**
 * Check if user can access a navigation item
 */
export function canAccessNavigation(user: UserContext | null, navItem: keyof typeof NavigationPermissions): boolean {
  if (!user) return false;
  const requiredPermissions = NavigationPermissions[navItem];
  return requiredPermissions.length === 0 || hasAnyPermission(user, requiredPermissions);
}

/**
 * Get user's role display name
 */
export function getRoleDisplayName(role: Role): string {
  switch (role) {
    case 'ADMIN':
      return 'Administrator';
    case 'HOD':
      return 'Head of Department';
    case 'EMPLOYEE':
      return 'Employee';
    default:
      return 'Unknown';
  }
}

/**
 * Get user's full name
 */
export function getUserDisplayName(user: UserContext): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

/**
 * Check if user is admin
 */
export function isAdmin(user: UserContext | null): boolean {
  return user?.role === 'ADMIN';
}

/**
 * Check if user is HOD
 */
export function isHOD(user: UserContext | null): boolean {
  return user?.role === 'HOD';
}

/**
 * Check if user is employee
 */
export function isEmployee(user: UserContext | null): boolean {
  return user?.role === 'EMPLOYEE';
}

/**
 * Check if user belongs to a specific department
 */
export function isInDepartment(user: UserContext | null, departmentId: string): boolean {
  if (!user) return false;
  return user.departmentId === departmentId;
}

/**
 * Check if user can manage other users
 */
export function canManageUsers(user: UserContext | null): boolean {
  return hasPermission(user, Permission.USER_MANAGE_ALL) || hasPermission(user, Permission.USER_READ_DEPT);
}

/**
 * Check if user can approve documents
 */
export function canApproveDocuments(user: UserContext | null): boolean {
  return hasAnyPermission(user, [
    Permission.REQ_APPROVE,
    Permission.PO_APPROVE,
    Permission.INVOICE_APPROVE,
    Permission.PAYMENT_APPROVE,
  ]);
}

/**
 * Check if user can create procurement documents
 */
export function canCreateProcurement(user: UserContext | null): boolean {
  return hasAnyPermission(user, [
    Permission.REQ_CREATE,
    Permission.PO_CREATE,
  ]);
}

/**
 * Check if user can access GST console
 */
export function canAccessGST(user: UserContext | null): boolean {
  return hasPermission(user, Permission.GST_CONSOLE_ACCESS);
}

/**
 * Check if user can view reports
 */
export function canViewReports(user: UserContext | null): boolean {
  return hasAnyPermission(user, [
    Permission.REPORTS_ALL,
    Permission.REPORTS_DEPT,
    Permission.REPORTS_PERSONAL,
  ]);
}

/**
 * Check if user can export data
 */
export function canExportData(user: UserContext | null): boolean {
  return hasAnyPermission(user, [
    Permission.EXPORT_ALL,
    Permission.EXPORT_DEPT,
    Permission.EXPORT_OWN,
  ]);
}

/**
 * Get available actions for a resource type
 */
export function getAvailableActions(
  user: UserContext | null,
  resourceType: 'REQUISITION' | 'PURCHASE_ORDER' | 'INVOICE' | 'GOODS_RECEIPT' | 'SUPPLIER' | 'CUSTOMER' | 'ITEM'
): string[] {
  if (!user) return [];

  const actions: string[] = [];

  switch (resourceType) {
    case 'REQUISITION':
      if (hasPermission(user, Permission.REQ_CREATE)) actions.push('CREATE');
      if (hasAnyPermission(user, [Permission.REQ_READ_ALL, Permission.REQ_READ_DEPT, Permission.REQ_READ_OWN])) actions.push('READ');
      if (hasAnyPermission(user, [Permission.REQ_UPDATE_ALL, Permission.REQ_UPDATE_DEPT, Permission.REQ_UPDATE_OWN])) actions.push('UPDATE');
      if (hasPermission(user, Permission.REQ_APPROVE)) actions.push('APPROVE');
      if (hasPermission(user, Permission.REQ_DELETE)) actions.push('DELETE');
      break;

    case 'PURCHASE_ORDER':
      if (hasPermission(user, Permission.PO_CREATE)) actions.push('CREATE');
      if (hasAnyPermission(user, [Permission.PO_READ_ALL, Permission.PO_READ_DEPT, Permission.PO_READ_OWN])) actions.push('read');
      if (hasAnyPermission(user, [Permission.PO_UPDATE_ALL, Permission.PO_UPDATE_DEPT])) actions.push('UPDATE');
      if (hasPermission(user, Permission.PO_APPROVE)) actions.push('APPROVE');
      if (hasPermission(user, Permission.PO_DELETE)) actions.push('DELETE');
      break;

    case 'INVOICE':
      if (hasPermission(user, Permission.INVOICE_CREATE)) actions.push('CREATE');
      if (hasAnyPermission(user, [Permission.INVOICE_READ_ALL, Permission.INVOICE_READ_DEPT, Permission.INVOICE_READ_OWN])) actions.push('read');
      if (hasAnyPermission(user, [Permission.INVOICE_UPDATE_ALL, Permission.INVOICE_UPDATE_DEPT, Permission.INVOICE_UPDATE_OWN])) actions.push('UPDATE');
      if (hasPermission(user, Permission.INVOICE_APPROVE)) actions.push('APPROVE');
      if (hasPermission(user, Permission.INVOICE_DELETE)) actions.push('DELETE');
      break;

    case 'GOODS_RECEIPT':
      if (hasAnyPermission(user, [Permission.GRN_CREATE_ALL, Permission.GRN_CREATE_DEPT, Permission.GRN_CREATE_ASSIGNED])) actions.push('CREATE');
      if (hasAnyPermission(user, [Permission.GRN_READ_ALL, Permission.GRN_READ_DEPT, Permission.GRN_READ_ASSIGNED])) actions.push('read');
      if (hasAnyPermission(user, [Permission.GRN_UPDATE_ALL, Permission.GRN_UPDATE_DEPT, Permission.GRN_UPDATE_ASSIGNED])) actions.push('UPDATE');
      if (hasPermission(user, Permission.GRN_QUALITY_APPROVE)) actions.push('QUALITY_APPROVE');
      break;

    case 'SUPPLIER':
      if (hasPermission(user, Permission.SUPPLIERS_CREATE)) actions.push('CREATE');
      if (hasPermission(user, Permission.SUPPLIERS_READ)) actions.push('read');
      if (hasPermission(user, Permission.SUPPLIERS_UPDATE)) actions.push('UPDATE');
      if (hasPermission(user, Permission.SUPPLIERS_DELETE)) actions.push('DELETE');
      if (hasPermission(user, Permission.SUPPLIERS_PROPOSE_CHANGES)) actions.push('PROPOSE_CHANGES');
      break;

    case 'CUSTOMER':
      if (hasPermission(user, Permission.CUSTOMERS_CREATE)) actions.push('CREATE');
      if (hasPermission(user, Permission.CUSTOMERS_READ)) actions.push('read');
      if (hasPermission(user, Permission.CUSTOMERS_UPDATE)) actions.push('UPDATE');
      if (hasPermission(user, Permission.CUSTOMERS_DELETE)) actions.push('DELETE');
      if (hasPermission(user, Permission.CUSTOMERS_PROPOSE_CHANGES)) actions.push('PROPOSE_CHANGES');
      break;

    case 'ITEM':
      if (hasPermission(user, Permission.ITEMS_CREATE)) actions.push('CREATE');
      if (hasPermission(user, Permission.ITEMS_READ)) actions.push('read');
      if (hasPermission(user, Permission.ITEMS_UPDATE)) actions.push('UPDATE');
      if (hasPermission(user, Permission.ITEMS_DELETE)) actions.push('DELETE');
      if (hasPermission(user, Permission.ITEMS_PROPOSE_CHANGES)) actions.push('PROPOSE_CHANGES');
      break;
  }

  return actions;
}

/**
 * Get filtered navigation items based on user permissions
 */
export function getAccessibleNavigation(user: UserContext | null): (keyof typeof NavigationPermissions)[] {
  if (!user) return ['DASHBOARD'];

  return (Object.keys(NavigationPermissions) as (keyof typeof NavigationPermissions)[])
    .filter(navItem => canAccessNavigation(user, navItem));
}

/**
 * Get user's accessible features
 */
export function getAccessibleFeatures(user: UserContext | null): (keyof typeof FeatureGroups)[] {
  if (!user) return [];

  return (Object.keys(FeatureGroups) as (keyof typeof FeatureGroups)[])
    .filter(feature => hasFeatureAccess(user, feature));
}

/**
 * Check if user has higher privilege than another user
 */
export function hasHigherPrivilege(currentUser: UserContext | null, targetUser: UserContext): boolean {
  if (!currentUser) return false;

  const roleHierarchy: Record<Role, number> = {
    'ADMIN': 3,
    'HOD': 2,
    'EMPLOYEE': 1,
  };

  return roleHierarchy[currentUser.role] > roleHierarchy[targetUser.role];
}

/**
 * Check if user can edit another user's data
 */
export function canEditUser(currentUser: UserContext | null, targetUser: UserContext): boolean {
  if (!currentUser) return false;

  // Users can always edit their own data
  if (currentUser.id === targetUser.id) {
    return hasPermission(currentUser, Permission.USER_UPDATE_SELF);
  }

  // Admins can edit anyone
  if (isAdmin(currentUser)) {
    return hasPermission(currentUser, Permission.USER_MANAGE_ALL);
  }

  // HODs can edit users in their department
  if (isHOD(currentUser) && currentUser.departmentId === targetUser.departmentId) {
    return hasPermission(currentUser, Permission.USER_READ_DEPT);
  }

  return false;
}

/**
 * Format user context for display
 */
export function formatUserContext(user: UserContext): {
  displayName: string;
  roleDisplay: string;
  departmentDisplay: string;
  initials: string;
} {
  return {
    displayName: getUserDisplayName(user),
    roleDisplay: getRoleDisplayName(user.role),
    departmentDisplay: user.departmentName || 'No Department',
    initials: `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase(),
  };
}

/**
 * Get permission level for a specific resource
 */
export function getPermissionLevel(
  user: UserContext | null,
  resourceType: string
): 'NONE' | 'READ' | 'WRITE' | 'ADMIN' {
  if (!user) return 'NONE';

  if (isAdmin(user)) return 'ADMIN';

  // Check specific resource permissions
  const writePermissions = getAvailableActions(user, resourceType as any);
  
  if (writePermissions.includes('CREATE') || writePermissions.includes('UPDATE') || writePermissions.includes('DELETE')) {
    return 'WRITE';
  }
  
  if (writePermissions.includes('read')) {
    return 'READ';
  }
  
  return 'NONE';
}

/**
 * Check if user can access sensitive data
 */
export function canAccessSensitiveData(user: UserContext | null): boolean {
  return hasAnyPermission(user, [
    Permission.REPORTS_ALL,
    Permission.AUDIT_READ_ALL,
    Permission.PAYMENT_EXECUTE,
    Permission.SYSTEM_SETTINGS,
  ]);
}

/**
 * Get scope display text based on user role
 */
export function getScopeDisplay(user: UserContext | null): string {
  if (!user) return 'No Access';
  
  switch (user.role) {
    case 'ADMIN':
      return 'Tenant-wide Access';
    case 'HOD':
      return `Department Access (${user.departmentName || 'Unknown'})`;
    case 'EMPLOYEE':
      return 'Personal Access';
    default:
      return 'Limited Access';
  }
}