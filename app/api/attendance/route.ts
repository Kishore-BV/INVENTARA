import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { 
  getAllAttendanceRecords,
  getAttendanceRecordsByEmployee,
  getAttendanceRecordsByDateRange,
  getTodayAttendance,
  clockIn,
  clockOut,
  markAbsent,
  getAttendanceStats
} from '@/lib/attendance-store';
import { userHasPermission, findUserById } from '@/lib/user-store';

// GET /api/attendance - Get attendance records with filtering
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = verifyToken(token);
    
    // Check if user has permission to view attendance
    if (!userHasPermission(user.id, 'view_attendance')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const today = searchParams.get('today');
    const stats = searchParams.get('stats');

    // Return stats if requested
    if (stats === 'true') {
      const attendanceStats = getAttendanceStats();
      return NextResponse.json({ 
        success: true, 
        data: attendanceStats 
      });
    }

    let records;

    if (today === 'true') {
      records = getTodayAttendance();
    } else if (employeeId) {
      records = getAttendanceRecordsByEmployee(employeeId);
    } else if (startDate && endDate) {
      records = getAttendanceRecordsByDateRange(new Date(startDate), new Date(endDate));
    } else {
      records = getAllAttendanceRecords();
    }

    // Enrich records with employee information
    const enrichedRecords = await Promise.all(
      records.map(async (record) => {
        const employee = findUserById(record.employeeId);
        return {
          ...record,
          employee: employee ? {
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            employeeId: employee.employeeId,
          } : null
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      data: enrichedRecords,
      total: enrichedRecords.length 
    });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}

// POST /api/attendance - Handle attendance actions (clock in/out, mark absent)
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = verifyToken(token);
    const body = await req.json();
    const { action, employeeId, notes, date } = body;

    // Check permissions based on action
    if (action === 'mark_absent' && !userHasPermission(user.id, 'manage_attendance')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // For clock in/out, users can only manage their own attendance unless they have manage permission
    if ((action === 'clock_in' || action === 'clock_out') && 
        employeeId !== user.id && 
        !userHasPermission(user.id, 'manage_attendance')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    let record;

    switch (action) {
      case 'clock_in':
        const targetEmployeeId = employeeId || user.id;
        record = clockIn(targetEmployeeId, notes);
        
        // Enrich with employee info
        const clockInEmployee = findUserById(record.employeeId);
        const enrichedClockInRecord = {
          ...record,
          employee: clockInEmployee ? {
            id: clockInEmployee.id,
            firstName: clockInEmployee.firstName,
            lastName: clockInEmployee.lastName,
            email: clockInEmployee.email,
            employeeId: clockInEmployee.employeeId,
          } : null
        };

        return NextResponse.json({ 
          success: true, 
          data: enrichedClockInRecord,
          message: 'Clocked in successfully' 
        });

      case 'clock_out':
        const targetOutEmployeeId = employeeId || user.id;
        record = clockOut(targetOutEmployeeId, notes);
        
        // Enrich with employee info
        const clockOutEmployee = findUserById(record.employeeId);
        const enrichedClockOutRecord = {
          ...record,
          employee: clockOutEmployee ? {
            id: clockOutEmployee.id,
            firstName: clockOutEmployee.firstName,
            lastName: clockOutEmployee.lastName,
            email: clockOutEmployee.email,
            employeeId: clockOutEmployee.employeeId,
          } : null
        };

        return NextResponse.json({ 
          success: true, 
          data: enrichedClockOutRecord,
          message: 'Clocked out successfully' 
        });

      case 'mark_absent':
        if (!employeeId || !date) {
          return NextResponse.json({ 
            message: 'Employee ID and date are required for marking absent' 
          }, { status: 400 });
        }
        
        record = markAbsent(employeeId, new Date(date), notes);
        
        // Enrich with employee info
        const absentEmployee = findUserById(record.employeeId);
        const enrichedAbsentRecord = {
          ...record,
          employee: absentEmployee ? {
            id: absentEmployee.id,
            firstName: absentEmployee.firstName,
            lastName: absentEmployee.lastName,
            email: absentEmployee.email,
            employeeId: absentEmployee.employeeId,
          } : null
        };

        return NextResponse.json({ 
          success: true, 
          data: enrichedAbsentRecord,
          message: 'Marked as absent successfully' 
        });

      default:
        return NextResponse.json({ 
          message: 'Invalid action. Use clock_in, clock_out, or mark_absent' 
        }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Error processing attendance action:', error);
    return NextResponse.json({ 
      message: error.message || 'Failed to process attendance action' 
    }, { status: 400 });
  }
}
