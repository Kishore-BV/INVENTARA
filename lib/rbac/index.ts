// RBAC System Exports
export * from './types';
export * from './utils';
export * from './hooks';

// Components
export * from './components/feature-gate';
export * from './components/protected-route';
export * from './components/role-badge';

// Re-export context
export { AuthProvider, AuthContext, useAuth } from '../contexts/auth-context';

// Convenience aliases
export { Can } from './components/feature-gate';
export { 
  PermissionGate, 
  RoleGate, 
  AdminGate, 
  HODGate, 
  EmployeeGate 
} from './components/feature-gate';
export { 
  ProtectedRoute, 
  AdminRoute, 
  HODRoute, 
  EmployeeRoute,
  PermissionRoute,
  FeatureRoute 
} from './components/protected-route';
export { 
  RoleBadge, 
  UserRoleBadge, 
  PermissionBadge, 
  RoleCard,
  RoleIndicator 
} from './components/role-badge';