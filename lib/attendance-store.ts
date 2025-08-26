import { AttendanceRecord, Employee, WorkSchedule, LeaveRequest } from './inventory-types';
import { findUserById } from './user-store';

export interface StoredAttendanceRecord {
  id: string;
  employeeId: string;
  date: Date;
  clockIn?: Date;
  clockOut?: Date;
  breakStart?: Date;
  breakEnd?: Date;
  totalHours?: number;
  overtimeHours?: number;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
  notes?: string;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredWorkSchedule {
  id: string;
  name: string;
  workDays: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  breakDuration: number; // minutes
  isActive: boolean;
}

export interface StoredLeaveRequest {
  id: string;
  employeeId: string;
  leaveType: 'sick' | 'vacation' | 'personal' | 'maternity' | 'emergency';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: Date;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Default work schedules
const defaultWorkSchedules: StoredWorkSchedule[] = [
  {
    id: 'schedule_1',
    name: 'Regular Day Shift',
    workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: 60,
    isActive: true,
  },
  {
    id: 'schedule_2',
    name: 'Night Shift',
    workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    startTime: '22:00',
    endTime: '06:00',
    breakDuration: 30,
    isActive: true,
  },
  {
    id: 'schedule_3',
    name: '6-Day Week',
    workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    startTime: '08:00',
    endTime: '16:00',
    breakDuration: 45,
    isActive: true,
  },
];

// Use a global to persist across hot reloads in dev
const g = global as any;
if (!g.__inventaraAttendanceStore) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Generate some mock attendance records
  const mockAttendanceRecords: StoredAttendanceRecord[] = [
    {
      id: 'att_1',
      employeeId: 'user_1', // admin
      date: today,
      clockIn: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 15),
      clockOut: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 30),
      totalHours: 8.25,
      overtimeHours: 0.25,
      status: 'present',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'att_2',
      employeeId: 'user_2', // manager
      date: today,
      clockIn: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 45),
      clockOut: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0),
      totalHours: 9.25,
      overtimeHours: 1.25,
      status: 'present',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'att_3',
      employeeId: 'user_3', // worker
      date: today,
      clockIn: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30),
      totalHours: 0,
      status: 'late',
      notes: 'Traffic jam',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'att_4',
      employeeId: 'user_1',
      date: yesterday,
      clockIn: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 9, 0),
      clockOut: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 17, 0),
      totalHours: 8,
      status: 'present',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Generate some mock leave requests
  const mockLeaveRequests: StoredLeaveRequest[] = [
    {
      id: 'leave_1',
      employeeId: 'user_2',
      leaveType: 'vacation',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // next week
      endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      days: 3,
      reason: 'Family vacation',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'leave_2',
      employeeId: 'user_3',
      leaveType: 'sick',
      startDate: yesterday,
      endDate: yesterday,
      days: 1,
      reason: 'Fever',
      status: 'approved',
      approvedBy: 'user_2',
      approvalDate: yesterday,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  g.__inventaraAttendanceStore = {
    attendanceRecords: mockAttendanceRecords,
    workSchedules: defaultWorkSchedules,
    leaveRequests: mockLeaveRequests,
    nextAttendanceId: 5,
    nextScheduleId: 4,
    nextLeaveId: 3,
  } as {
    attendanceRecords: StoredAttendanceRecord[];
    workSchedules: StoredWorkSchedule[];
    leaveRequests: StoredLeaveRequest[];
    nextAttendanceId: number;
    nextScheduleId: number;
    nextLeaveId: number;
  };
}

const store: {
  attendanceRecords: StoredAttendanceRecord[];
  workSchedules: StoredWorkSchedule[];
  leaveRequests: StoredLeaveRequest[];
  nextAttendanceId: number;
  nextScheduleId: number;
  nextLeaveId: number;
} = g.__inventaraAttendanceStore;

// Attendance record functions
export function getAllAttendanceRecords(): StoredAttendanceRecord[] {
  return store.attendanceRecords;
}

export function getAttendanceRecordsByEmployee(employeeId: string): StoredAttendanceRecord[] {
  return store.attendanceRecords.filter(record => record.employeeId === employeeId);
}

export function getAttendanceRecordsByDate(date: Date): StoredAttendanceRecord[] {
  const targetDate = date.toDateString();
  return store.attendanceRecords.filter(record => record.date.toDateString() === targetDate);
}

export function getAttendanceRecordsByDateRange(startDate: Date, endDate: Date): StoredAttendanceRecord[] {
  return store.attendanceRecords.filter(record => 
    record.date >= startDate && record.date <= endDate
  );
}

export function getTodayAttendance(): StoredAttendanceRecord[] {
  return getAttendanceRecordsByDate(new Date());
}

export function clockIn(employeeId: string, notes?: string): StoredAttendanceRecord {
  const today = new Date();
  const existingRecord = store.attendanceRecords.find(
    record => record.employeeId === employeeId && 
              record.date.toDateString() === today.toDateString()
  );

  if (existingRecord && existingRecord.clockIn) {
    throw new Error('Employee has already clocked in today');
  }

  const clockInTime = new Date();
  let status: StoredAttendanceRecord['status'] = 'present';
  
  // Check if employee is late (after 9:15 AM for now - should be configurable per schedule)
  const scheduleStartTime = new Date(today);
  scheduleStartTime.setHours(9, 15, 0, 0);
  if (clockInTime > scheduleStartTime) {
    status = 'late';
  }

  if (existingRecord) {
    // Update existing record
    existingRecord.clockIn = clockInTime;
    existingRecord.status = status;
    existingRecord.notes = notes;
    existingRecord.updatedAt = new Date();
    return existingRecord;
  } else {
    // Create new record
    const newRecord: StoredAttendanceRecord = {
      id: `att_${store.nextAttendanceId++}`,
      employeeId,
      date: today,
      clockIn: clockInTime,
      status,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.attendanceRecords.push(newRecord);
    return newRecord;
  }
}

export function clockOut(employeeId: string, notes?: string): StoredAttendanceRecord {
  const today = new Date();
  const existingRecord = store.attendanceRecords.find(
    record => record.employeeId === employeeId && 
              record.date.toDateString() === today.toDateString()
  );

  if (!existingRecord || !existingRecord.clockIn) {
    throw new Error('Employee must clock in before clocking out');
  }

  if (existingRecord.clockOut) {
    throw new Error('Employee has already clocked out today');
  }

  const clockOutTime = new Date();
  existingRecord.clockOut = clockOutTime;
  
  // Calculate total hours
  const totalMillis = clockOutTime.getTime() - existingRecord.clockIn!.getTime();
  const totalHours = totalMillis / (1000 * 60 * 60);
  existingRecord.totalHours = Math.round(totalHours * 100) / 100; // Round to 2 decimal places
  
  // Calculate overtime (assuming 8 hours is standard)
  const standardHours = 8;
  existingRecord.overtimeHours = Math.max(0, existingRecord.totalHours - standardHours);
  
  if (notes) {
    existingRecord.notes = existingRecord.notes ? `${existingRecord.notes}; ${notes}` : notes;
  }
  existingRecord.updatedAt = new Date();
  
  return existingRecord;
}

export function markAbsent(employeeId: string, date: Date, notes?: string): StoredAttendanceRecord {
  const existingRecord = store.attendanceRecords.find(
    record => record.employeeId === employeeId && 
              record.date.toDateString() === date.toDateString()
  );

  if (existingRecord) {
    existingRecord.status = 'absent';
    existingRecord.notes = notes;
    existingRecord.updatedAt = new Date();
    return existingRecord;
  } else {
    const newRecord: StoredAttendanceRecord = {
      id: `att_${store.nextAttendanceId++}`,
      employeeId,
      date,
      status: 'absent',
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.attendanceRecords.push(newRecord);
    return newRecord;
  }
}

// Work schedule functions
export function getAllWorkSchedules(): StoredWorkSchedule[] {
  return store.workSchedules;
}

export function getWorkScheduleById(id: string): StoredWorkSchedule | undefined {
  return store.workSchedules.find(schedule => schedule.id === id);
}

// Leave request functions
export function getAllLeaveRequests(): StoredLeaveRequest[] {
  return store.leaveRequests;
}

export function getLeaveRequestsByEmployee(employeeId: string): StoredLeaveRequest[] {
  return store.leaveRequests.filter(request => request.employeeId === employeeId);
}

export function getPendingLeaveRequests(): StoredLeaveRequest[] {
  return store.leaveRequests.filter(request => request.status === 'pending');
}

export function createLeaveRequest(data: {
  employeeId: string;
  leaveType: StoredLeaveRequest['leaveType'];
  startDate: Date;
  endDate: Date;
  reason: string;
}): StoredLeaveRequest {
  // Calculate days
  const timeDiff = data.endDate.getTime() - data.startDate.getTime();
  const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

  const newRequest: StoredLeaveRequest = {
    id: `leave_${store.nextLeaveId++}`,
    employeeId: data.employeeId,
    leaveType: data.leaveType,
    startDate: data.startDate,
    endDate: data.endDate,
    days,
    reason: data.reason,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  store.leaveRequests.push(newRequest);
  return newRequest;
}

export function approveLeaveRequest(leaveId: string, approvedBy: string, comments?: string): StoredLeaveRequest {
  const request = store.leaveRequests.find(req => req.id === leaveId);
  if (!request) {
    throw new Error('Leave request not found');
  }

  request.status = 'approved';
  request.approvedBy = approvedBy;
  request.approvalDate = new Date();
  request.comments = comments;
  request.updatedAt = new Date();

  return request;
}

export function rejectLeaveRequest(leaveId: string, approvedBy: string, comments?: string): StoredLeaveRequest {
  const request = store.leaveRequests.find(req => req.id === leaveId);
  if (!request) {
    throw new Error('Leave request not found');
  }

  request.status = 'rejected';
  request.approvedBy = approvedBy;
  request.approvalDate = new Date();
  request.comments = comments;
  request.updatedAt = new Date();

  return request;
}

// Analytics functions
export function getAttendanceStats() {
  const today = new Date();
  const todayRecords = getTodayAttendance();
  const totalEmployees = 3; // From user store - should be dynamic

  return {
    totalEmployees,
    presentToday: todayRecords.filter(r => r.status === 'present').length,
    absentToday: todayRecords.filter(r => r.status === 'absent').length,
    lateToday: todayRecords.filter(r => r.status === 'late').length,
    overtimeHours: todayRecords.reduce((sum, record) => sum + (record.overtimeHours || 0), 0),
  };
}
