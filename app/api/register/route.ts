import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { addUser } from '@/lib/user-store';

export async function POST(req: NextRequest) {
  try {
    const { username, password, role } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }
    const passwordHash = await hashPassword(password);
    addUser(username, passwordHash, role === 'admin' ? 'admin' : 'user');
    return NextResponse.json({ message: 'Registered successfully' }, { status: 201 });
  } catch (err: any) {
    const msg = err?.message === 'User already exists' ? err.message : 'Invalid request';
    const code = err?.message === 'User already exists' ? 409 : 400;
    return NextResponse.json({ message: msg }, { status: code });
  }
}
