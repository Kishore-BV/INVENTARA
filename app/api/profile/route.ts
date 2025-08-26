import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { findUserById } from '@/lib/user-store';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const decoded = verifyToken(token);
    const user = findUserById(decoded.id);
    
    if (!user || !user.isActive) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return user data in the format expected by the frontend
    const userData = {
      id: parseInt(user.id.replace('user_', '')),
      username: user.username,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      department: user.department,
      employeeId: user.employeeId,
      phone: user.phone,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      permissions: user.permissions,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
