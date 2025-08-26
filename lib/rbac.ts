// Role-Based Access Control (RBAC) System for INVENTARA

export type UserRole = 'admin' | 'manager';

export interface Permission {
  module: string;
  action: string;
  description: string;
}

export interface RolePermissions {
  [key: string]: Permission[];
}

// Define permissions for each module
const PERMISSIONS = {
  // Dashboard permissions
  DASHBOARD_VIEW: { module: 'dashboard', action: 'view', description: 'View dashboard' },
  DASHBOARD_EXPORT: { module: 'dashboard', action: 'export', description: 'Export dashboard data' },
  
  // Product Management permissions
  PRODUCTS_VIEW: { module: 'products', action: 'view', description: 'View products' },
  PRODUCTS_CREATE: { module: 'products', action: 'create', description: 'Create products' },
  PRODUCTS_EDIT: { module: 'products', action: 'edit', description: 'Edit products' },
  PRODUCTS_DELETE: { module: 'products', action: 'delete', description: 'Delete products' },
  PRODUCTS_IMPORT: { module: 'products', action: 'import', description: 'Import products' },
  PRODUCTS_EXPORT: { module: 'products', action: 'export', description: 'Export products' },
  
  // Warehouse Management permissions
  WAREHOUSES_VIEW: { module: 'warehouses', action: 'view', description: 'View warehouses' },
  WAREHOUSES_CREATE: { module: 'warehouses', action: 'create', description: 'Create warehouses' },
  WAREHOUSES_EDIT: { module: 'warehouses', action: 'edit', description: 'Edit warehouses' },
  WAREHOUSES_DELETE: { module: 'warehouses', action: 'delete', description: 'Delete warehouses' },
  
  // Location Management permissions
  LOCATIONS_VIEW: { module: 'locations', action: 'view', description: 'View locations' },
  LOCATIONS_CREATE: { module: 'locations', action: 'create', description: 'Create locations' },
  LOCATIONS_EDIT: { module: 'locations', action: 'edit', description: 'Edit locations' },
  LOCATIONS_DELETE: { module: 'locations', action: 'delete', description: 'Delete locations' },
  
  // Utilization & Analytics permissions
  ANALYTICS_VIEW: { module: 'analytics', action: 'view', description: 'View analytics' },
  ANALYTICS_EXPORT: { module: 'analytics', action: 'export', description: 'Export analytics' },
  UTILIZATION_VIEW: { module: 'utilization', action: 'view', description: 'View utilization data' },
  
  // Stock Movement permissions
  STOCK_VIEW: { module: 'stock', action: 'view', description: 'View stock movements' },
  STOCK_CREATE: { module: 'stock', action: 'create', description: 'Create stock movements' },
  STOCK_ADJUST: { module: 'stock', action: 'adjust', description: 'Adjust stock levels' },
  
  // Reports permissions
  REPORTS_VIEW: { module: 'reports', action: 'view', description: 'View reports' },
  REPORTS_GENERATE: { module: 'reports', action: 'generate', description: 'Generate reports' },
  REPORTS_EXPORT: { module: 'reports', action: 'export', description: 'Export reports' },
  
  // User Management permissions (Admin only)
  USERS_VIEW: { module: 'users', action: 'view', description: 'View users' },
  USERS_CREATE: { module: 'users', action: 'create', description: 'Create users' },
  USERS_EDIT: { module: 'users', action: 'edit', description: 'Edit users' },
  USERS_DELETE: { module: 'users', action: 'delete', description: 'Delete users' },
  
  // System Settings permissions (Admin only)
  SETTINGS_VIEW: { module: 'settings', action: 'view', description: 'View system settings' },
  SETTINGS_EDIT: { module: 'settings', action: 'edit', description: 'Edit system settings' },
  
  // Audit & Logs permissions (Admin only)
  AUDIT_VIEW: { module: 'audit', action: 'view', description: 'View audit logs' },
  AUDIT_EXPORT: { module: 'audit', action: 'export', description: 'Export audit logs' },
};

// Define what each role can do
const ROLE_PERMISSIONS: RolePermissions = {
  admin: [
    // Administrators have full access to everything
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_EXPORT,
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_EDIT,
    PERMISSIONS.PRODUCTS_DELETE,
    PERMISSIONS.PRODUCTS_IMPORT,
    PERMISSIONS.PRODUCTS_EXPORT,
    PERMISSIONS.WAREHOUSES_VIEW,
    PERMISSIONS.WAREHOUSES_CREATE,
    PERMISSIONS.WAREHOUSES_EDIT,
    PERMISSIONS.WAREHOUSES_DELETE,
    PERMISSIONS.LOCATIONS_VIEW,
    PERMISSIONS.LOCATIONS_CREATE,
    PERMISSIONS.LOCATIONS_EDIT,
    PERMISSIONS.LOCATIONS_DELETE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.UTILIZATION_VIEW,
    PERMISSIONS.STOCK_VIEW,
    PERMISSIONS.STOCK_CREATE,
    PERMISSIONS.STOCK_ADJUST,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_GENERATE,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.AUDIT_EXPORT,
  ],
  manager: [
    // Managers have operational access but no user/system management
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_EXPORT,
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_EDIT,
    PERMISSIONS.PRODUCTS_EXPORT, // Can't delete products
    PERMISSIONS.WAREHOUSES_VIEW,
    PERMISSIONS.WAREHOUSES_CREATE,
    PERMISSIONS.WAREHOUSES_EDIT,
    // Can't delete warehouses
    PERMISSIONS.LOCATIONS_VIEW,
    PERMISSIONS.LOCATIONS_CREATE,
    PERMISSIONS.LOCATIONS_EDIT,
    // Can't delete locations
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.UTILIZATION_VIEW,
    PERMISSIONS.STOCK_VIEW,
    PERMISSIONS.STOCK_CREATE,
    PERMISSIONS.STOCK_ADJUST,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_GENERATE,
    PERMISSIONS.REPORTS_EXPORT,
    // No user management permissions
    // No system settings permissions
    // No audit log permissions
  ],
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(userRole: UserRole, module: string, action: string): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.some(permission => 
    permission.module === module && permission.action === action
  );
}

/**
 * Check if a user can access a specific module
 */
export function canAccessModule(userRole: UserRole, module: string): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.some(permission => permission.module === module);
}

/**
 * Get all permissions for a specific role
 */
export function getRolePermissions(userRole: UserRole): Permission[] {
  return ROLE_PERMISSIONS[userRole] || [];
}

/**
 * Get permissions for a specific module for a role
 */
export function getModulePermissions(userRole: UserRole, module: string): Permission[] {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.filter(permission => permission.module === module);
}

/**
 * Check if user is admin
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === 'admin';
}

/**
 * Check if user is manager
 */
export function isManager(userRole: UserRole): boolean {
  return userRole === 'manager';
}

/**
 * Get user role display name
 */
export function getRoleDisplayName(userRole: UserRole): string {
  const roleNames = {
    admin: 'Administrator',
    manager: 'Manager'
  };
  return roleNames[userRole] || userRole;
}

/**
 * Get available modules for a role
 */
export function getAvailableModules(userRole: UserRole): string[] {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  const modules = new Set(rolePermissions.map(permission => permission.module));
  return Array.from(modules);
}

// Permission constants for easy import
export { PERMISSIONS };

// Default export with all utility functions
export default {
  hasPermission,
  canAccessModule,
  getRolePermissions,
  getModulePermissions,
  isAdmin,
  isManager,
  getRoleDisplayName,
  getAvailableModules,
  PERMISSIONS
};
