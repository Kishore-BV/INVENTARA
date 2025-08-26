import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { 
  findUserById, 
  updateUser, 
  deleteUser, 
  getUserPermissions, 
  userHasPermission 
} from '@/lib/user-store';

// GET /api/users/[id] - Get user by ID
export async function GET(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  const auth = req.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const currentUser = verifyToken(token);
    const { id } = params;
    
    // Users can view their own profile, or admin can view any user
    if (currentUser.id !== id && !userHasPermission(currentUser.id, 'view_users')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const user = findUserById(id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Remove sensitive data
    const { passwordHash, ...safeUser } = user;

    return NextResponse.json({ 
      success: true, 
      data: {
        ...safeUser,
        permissions: getUserPermissions(user.id)
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  const auth = req.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const currentUser = verifyToken(token);
    const { id } = params;
    
    // Users can update their own profile (limited fields), or admin can update any user
    const canManageUsers = userHasPermission(currentUser.id, 'manage_users') || currentUser.role === 'admin';
    const isSelfUpdate = currentUser.id === id;
    
    if (!canManageUsers && !isSelfUpdate) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const user = findUserById(id);
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // For self-updates, limit fields that can be changed
    let allowedUpdates = body;
    if (isSelfUpdate && !canManageUsers) {
      allowedUpdates = {
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        email: body.email // Allow email change for self
      };
    }

    // Validate email if provided
    if (allowedUpdates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(allowedUpdates.email)) {
        return NextResponse.json({ 
          message: 'Invalid email format' 
        }, { status: 400 });
      }
    }

    // Validate role if provided (admin only)
    if (allowedUpdates.role && canManageUsers) {
      const validRoles = ['admin', 'manager', 'user', 'warehouse_worker', 'quality_controller'];
      if (!validRoles.includes(allowedUpdates.role)) {
        return NextResponse.json({ 
          message: 'Invalid role' 
        }, { status: 400 });
      }
    }

    const updatedUser = updateUser(id, allowedUpdates);
    
    // Remove sensitive data
    const { passwordHash, ...safeUser } = updatedUser;

    return NextResponse.json({ 
      success: true, 
      data: {
        ...safeUser,
        permissions: getUserPermissions(safeUser.id)
      },
      message: 'User updated successfully' 
    });

  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ 
      message: error.message || 'Failed to update user' 
    }, { status: 400 });
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  const auth = req.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const currentUser = verifyToken(token);
    const { id } = params;
    
    // Only admin can delete users
    if (!userHasPermission(currentUser.id, 'manage_users') && currentUser.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Prevent self-deletion
    if (currentUser.id === id) {
      return NextResponse.json({ 
        message: 'You cannot delete your own account' 
      }, { status: 400 });
    }

    const user = findUserById(id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const deleted = deleteUser(id);
    
    if (deleted) {
      return NextResponse.json({ 
        success: true, 
        message: 'User deleted successfully' 
      });
    } else {
      return NextResponse.json({ 
        message: 'Failed to delete user' 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ 
      message: error.message || 'Failed to delete user' 
    }, { status: 500 });
  }
}
