import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { 
  getAllUsers, 
  addUser, 
  findUserById,
  getAllPermissions,
  getUserPermissions,
  userHasPermission 
} from '@/lib/user-store';

// GET /api/users - Get all users (Admin only)
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = verifyToken(token);
    
    // Check if user has permission to view users
    if (!userHasPermission(user.id, 'view_users') && user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const users = getAllUsers();
    
    // Remove sensitive data
    const safeUsers = users.map(({ passwordHash, ...user }) => ({
      ...user,
      permissions: getUserPermissions(user.id)
    }));

    return NextResponse.json({ 
      success: true, 
      data: safeUsers,
      total: safeUsers.length 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}

// POST /api/users - Create new user (Admin only)
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = verifyToken(token);
    
    // Check if user has permission to manage users
    if (!userHasPermission(user.id, 'manage_users') && user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { 
      username, 
      email, 
      firstName, 
      lastName, 
      password, 
      role, 
      department, 
      employeeId, 
      phone, 
      permissions 
    } = body;

    // Validation
    if (!username || !email || !password || !role) {
      return NextResponse.json({ 
        message: 'Username, email, password, and role are required' 
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ 
        message: 'Password must be at least 6 characters long' 
      }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        message: 'Invalid email format' 
      }, { status: 400 });
    }

    const validRoles = ['admin', 'manager', 'user', 'warehouse_worker', 'quality_controller'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ 
        message: 'Invalid role' 
      }, { status: 400 });
    }

    const newUser = addUser({
      username,
      email,
      firstName,
      lastName,
      password,
      role,
      department,
      employeeId,
      phone,
      permissions
    });

    // Remove sensitive data
    const { passwordHash, ...safeUser } = newUser;

    return NextResponse.json({ 
      success: true, 
      data: {
        ...safeUser,
        permissions: getUserPermissions(safeUser.id)
      },
      message: 'User created successfully' 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ 
      message: error.message || 'Failed to create user' 
    }, { status: 400 });
  }
}
