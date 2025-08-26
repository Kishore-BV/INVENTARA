import bcrypt from 'bcryptjs';
import { User, Employee, Permission } from './inventory-types';

export type Role = 'admin' | 'manager' | 'user' | 'warehouse_worker' | 'quality_controller';

export interface StoredUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  passwordHash: string;
  role: Role;
  department?: string;
  employeeId?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: Date;
  permissions: string[]; // permission IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredEmployee extends StoredUser {
  badgeNumber?: string;
  shiftType: 'day' | 'night' | 'rotating';
  workScheduleId?: string;
  supervisor?: string;
  joinDate: Date;
  salary?: number;
}

export interface StoredPermission {
  id: string;
  name: string;
  description: string;
  module: 'inventory' | 'users' | 'attendance' | 'inward' | 'outward' | 'reports';
}

// Default permissions
const defaultPermissions: StoredPermission[] = [
  { id: 'perm1', name: 'view_inventory', description: 'View inventory data', module: 'inventory' },
  { id: 'perm2', name: 'manage_inventory', description: 'Manage inventory items', module: 'inventory' },
  { id: 'perm3', name: 'view_users', description: 'View user list', module: 'users' },
  { id: 'perm4', name: 'manage_users', description: 'Create, edit, delete users', module: 'users' },
  { id: 'perm5', name: 'view_attendance', description: 'View attendance records', module: 'attendance' },
  { id: 'perm6', name: 'manage_attendance', description: 'Manage attendance records', module: 'attendance' },
  { id: 'perm7', name: 'view_inward', description: 'View inward operations', module: 'inward' },
  { id: 'perm8', name: 'manage_inward', description: 'Manage inward operations', module: 'inward' },
  { id: 'perm9', name: 'view_outward', description: 'View outward operations', module: 'outward' },
  { id: 'perm10', name: 'manage_outward', description: 'Manage outward operations', module: 'outward' },
  { id: 'perm11', name: 'view_reports', description: 'View system reports', module: 'reports' },
  { id: 'perm12', name: 'admin_access', description: 'Full administrative access', module: 'users' },
];

// Use a global to persist across hot reloads in dev
const g = global as any;
if (!g.__inventaraUserStore) {
  const adminPasswordHash = bcrypt.hashSync('Admin@123!', 10);
  const managerPasswordHash = bcrypt.hashSync('Manager@123!', 10);
  const userPasswordHash = bcrypt.hashSync('User@123!', 10);
  
  g.__inventaraUserStore = {
    users: [
      {
        id: 'user_1',
        username: 'admin',
        email: 'admin@inventara.local',
        firstName: 'System',
        lastName: 'Administrator',
        passwordHash: adminPasswordHash,
        role: 'admin' as Role,
        department: 'IT',
        employeeId: 'EMP001',
        isActive: true,
        permissions: ['perm1', 'perm2', 'perm3', 'perm4', 'perm5', 'perm6', 'perm7', 'perm8', 'perm9', 'perm10', 'perm11', 'perm12'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user_2',
        username: 'manager',
        email: 'manager@inventara.local',
        firstName: 'Warehouse',
        lastName: 'Manager',
        passwordHash: managerPasswordHash,
        role: 'manager' as Role,
        department: 'Warehouse',
        employeeId: 'EMP002',
        isActive: true,
        permissions: ['perm1', 'perm2', 'perm5', 'perm6', 'perm7', 'perm8', 'perm9', 'perm10', 'perm11'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user_3',
        username: 'worker',
        email: 'worker@inventara.local',
        firstName: 'Warehouse',
        lastName: 'Worker',
        passwordHash: userPasswordHash,
        role: 'warehouse_worker' as Role,
        department: 'Warehouse',
        employeeId: 'EMP003',
        isActive: true,
        permissions: ['perm1', 'perm5', 'perm7', 'perm9'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    permissions: defaultPermissions,
    nextId: 4,
  } as { users: StoredUser[]; permissions: StoredPermission[]; nextId: number };
}

const store: { users: StoredUser[]; permissions: StoredPermission[]; nextId: number } = g.__inventaraUserStore;

// User management functions
export function findUserByUsername(username: string): StoredUser | undefined {
  return store.users.find(u => u.username === username);
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return store.users.find(u => u.email === email);
}

export function findUserById(id: string): StoredUser | undefined {
  return store.users.find(u => u.id === id);
}

export function getAllUsers(): StoredUser[] {
  return store.users;
}

export function getActiveUsers(): StoredUser[] {
  return store.users.filter(u => u.isActive);
}

export function getUsersByRole(role: Role): StoredUser[] {
  return store.users.filter(u => u.role === role);
}

export function addUser(userData: {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
  role: Role;
  department?: string;
  employeeId?: string;
  phone?: string;
  permissions?: string[];
}): StoredUser {
  const existingByUsername = findUserByUsername(userData.username);
  const existingByEmail = findUserByEmail(userData.email);
  
  if (existingByUsername) throw new Error('Username already exists');
  if (existingByEmail) throw new Error('Email already exists');
  
  const passwordHash = bcrypt.hashSync(userData.password, 10);
  
  const user: StoredUser = {
    id: `user_${store.nextId++}`,
    username: userData.username,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    passwordHash,
    role: userData.role,
    department: userData.department,
    employeeId: userData.employeeId,
    phone: userData.phone,
    isActive: true,
    permissions: userData.permissions || getDefaultPermissionsForRole(userData.role),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  store.users.push(user);
  return user;
}

export function updateUser(id: string, updates: Partial<StoredUser>): StoredUser {
  const userIndex = store.users.findIndex(u => u.id === id);
  if (userIndex === -1) throw new Error('User not found');
  
  // Check for username/email conflicts if they're being changed
  if (updates.username && updates.username !== store.users[userIndex].username) {
    const existing = findUserByUsername(updates.username);
    if (existing && existing.id !== id) throw new Error('Username already exists');
  }
  
  if (updates.email && updates.email !== store.users[userIndex].email) {
    const existing = findUserByEmail(updates.email);
    if (existing && existing.id !== id) throw new Error('Email already exists');
  }
  
  store.users[userIndex] = {
    ...store.users[userIndex],
    ...updates,
    updatedAt: new Date(),
  };
  
  return store.users[userIndex];
}

export function deleteUser(id: string): boolean {
  const userIndex = store.users.findIndex(u => u.id === id);
  if (userIndex === -1) return false;
  
  store.users.splice(userIndex, 1);
  return true;
}

export function deactivateUser(id: string): StoredUser {
  return updateUser(id, { isActive: false });
}

export function activateUser(id: string): StoredUser {
  return updateUser(id, { isActive: true });
}

export function updateLastLogin(id: string): StoredUser {
  return updateUser(id, { lastLogin: new Date() });
}

export function changePassword(id: string, newPassword: string): StoredUser {
  const passwordHash = bcrypt.hashSync(newPassword, 10);
  return updateUser(id, { passwordHash });
}

// Permission management functions
export function getAllPermissions(): StoredPermission[] {
  return store.permissions;
}

export function getPermissionsByModule(module: StoredPermission['module']): StoredPermission[] {
  return store.permissions.filter(p => p.module === module);
}

export function getUserPermissions(userId: string): StoredPermission[] {
  const user = findUserById(userId);
  if (!user) return [];
  
  return store.permissions.filter(p => user.permissions.includes(p.id));
}

export function userHasPermission(userId: string, permissionName: string): boolean {
  const userPermissions = getUserPermissions(userId);
  return userPermissions.some(p => p.name === permissionName);
}

export function getDefaultPermissionsForRole(role: Role): string[] {
  switch (role) {
    case 'admin':
      return store.permissions.map(p => p.id); // All permissions
    case 'manager':
      return ['perm1', 'perm2', 'perm5', 'perm6', 'perm7', 'perm8', 'perm9', 'perm10', 'perm11'];
    case 'warehouse_worker':
      return ['perm1', 'perm5', 'perm7', 'perm9'];
    case 'quality_controller':
      return ['perm1', 'perm5', 'perm7', 'perm8'];
    case 'user':
    default:
      return ['perm1', 'perm5'];
  }
}
