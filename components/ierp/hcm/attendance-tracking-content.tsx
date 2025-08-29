'use client'

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Clock,
  Calendar,
  Users2,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  Edit,
  Download,
  Timer,
  MapPin,
  Coffee,
  LogIn,
  LogOut,
  BarChart3,
  Activity
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function AttendanceTrackingContent() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("2024-01-22");

  const attendanceData = {
    overview: {
      totalEmployees: 247,
      presentToday: 234,
      absentToday: 8,
      lateArrivals: 5,
      onLeave: 13,
      avgWorkingHours: "8.2 hrs",
      attendanceRate: "96.8%",
      overtimeHours: 145
    },
    employees: [
      {
        id: "EMP-001",
        employeeId: "INV2024001",
        name: "Rajesh Kumar",
        department: "Technology",
        checkIn: "09:15",
        checkOut: "18:45",
        workingHours: 9.5,
        breakTime: 1.0,
        overtimeHours: 1.5,
        status: "Present",
        location: "Office",
        date: "2024-01-22",
        lateMinutes: 15,
        attendanceScore: 98
      },
      {
        id: "EMP-002",
        employeeId: "INV2024002",
        name: "Priya Sharma",
        department: "Marketing",
        checkIn: "08:55",
        checkOut: "17:30",
        workingHours: 8.6,
        breakTime: 0.9,
        overtimeHours: 0.6,
        status: "Present",
        location: "Office",
        date: "2024-01-22",
        lateMinutes: 0,
        attendanceScore: 99
      },
      {
        id: "EMP-003",
        employeeId: "INV2024003",
        name: "Amit Patel",
        department: "Finance",
        checkIn: "09:00",
        checkOut: null,
        workingHours: 0,
        breakTime: 0,
        overtimeHours: 0,
        status: "Working",
        location: "Office",
        date: "2024-01-22",
        lateMinutes: 0,
        attendanceScore: 97
      },
      {
        id: "EMP-004",
        employeeId: "INV2024004",
        name: "Sneha Reddy",
        department: "Human Resources",
        checkIn: null,
        checkOut: null,
        workingHours: 0,
        breakTime: 0,
        overtimeHours: 0,
        status: "On Leave",
        location: "Remote",
        date: "2024-01-22",
        lateMinutes: 0,
        attendanceScore: 95
      },
      {
        id: "EMP-005",
        employeeId: "INV2024005",
        name: "Vikram Singh",
        department: "Production",
        checkIn: "09:30",
        checkOut: "19:15",
        workingHours: 9.8,
        breakTime: 1.2,
        overtimeHours: 1.8,
        status: "Present",
        location: "Factory",
        date: "2024-01-22",
        lateMinutes: 30,
        attendanceScore: 94
      }
    ],
    attendanceTrends: [
      { date: "Mon", present: 234, absent: 8, onLeave: 5, late: 3 },
      { date: "Tue", present: 238, absent: 5, onLeave: 4, late: 2 },
      { date: "Wed", present: 241, absent: 3, onLeave: 3, late: 4 },
      { date: "Thu", present: 236, absent: 6, onLeave: 5, late: 5 },
      { date: "Fri", present: 234, absent: 8, onLeave: 5, late: 5 },
      { date: "Sat", present: 98, absent: 2, onLeave: 147, late: 1 }
    ],
    departmentAttendance: [
      { department: "Technology", present: 76, absent: 1, onLeave: 1, rate: 97.4 },
      { department: "Marketing", present: 31, absent: 1, onLeave: 0, rate: 96.9 },
      { department: "Finance", present: 23, absent: 0, onLeave: 1, rate: 95.8 },
      { department: "HR", present: 17, absent: 0, onLeave: 1, rate: 94.4 },
      { department: "Production", present: 62, absent: 2, onLeave: 1, rate: 95.4 },
      { department: "Sales", present: 29, absent: 1, onLeave: 0, rate: 96.7 }
    ],
    workingHoursDistribution: [
      { hours: "6-7 hrs", count: 15, color: "#E63946" },
      { hours: "7-8 hrs", count: 45, color: "#F77F00" },
      { hours: "8-9 hrs", count: 156, color: "#FCBF49" },
      { hours: "9-10 hrs", count: 28, color: "#90E0EF" },
      { hours: "10+ hrs", count: 3, color: "#0077B6" }
    ]
  };

  const openEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const departments = useMemo(() => {
    return Array.from(new Set(attendanceData.employees.map(e => e.department)))
  }, []);

  const filteredEmployees = useMemo(() => {
    let data = attendanceData.employees;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      data = data.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q)
      );
    }
    if (departmentFilter !== "ALL") {
      data = data.filter(e => e.department === departmentFilter);
    }
    if (statusFilter !== "ALL") {
      data = data.filter(e => e.status === statusFilter);
    }
    return data;
  }, [attendanceData.employees, searchTerm, departmentFilter, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Present":
        return <Badge variant="default" className="bg-green-500">Present</Badge>;
      case "Working":
        return <Badge variant="default" className="bg-blue-500">Working</Badge>;
      case "Absent":
        return <Badge variant="destructive">Absent</Badge>;
      case "On Leave":
        return <Badge variant="secondary">On Leave</Badge>;
      case "Late":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Late</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getLocationBadge = (location: string) => {
    switch (location) {
      case "Office":
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Office</Badge>;
      case "Remote":
        return <Badge variant="outline" className="border-green-500 text-green-600">Remote</Badge>;
      case "Factory":
        return <Badge variant="outline" className="border-purple-500 text-purple-600">Factory</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getAttendanceColor = (score: number) => {
    if (score >= 98) return "text-green-600";
    if (score >= 95) return "text-blue-600";
    if (score >= 90) return "text-yellow-600";
    return "text-red-600";
  };

  const formatTime = (time: string | null) => {
    return time ? time : "—";
  };

  const formatHours = (hours: number) => {
    return hours > 0 ? `${hours.toFixed(1)}h` : "—";
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2" 
            onClick={() => router.push('/ierp/hcm')}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">HCM</span>
          </Button>
          <h1 className="text-3xl font-bold">Attendance Tracking</h1>
        </div>
        <div className="flex items-center gap-3">
          <Input 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Search employees" 
            className="w-[200px]" 
          />
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="Present">Present</SelectItem>
              <SelectItem value="Working">Working</SelectItem>
              <SelectItem value="Absent">Absent</SelectItem>
              <SelectItem value="On Leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceData.overview.presentToday}</div>
            <p className="text-xs text-green-600">
              {attendanceData.overview.totalEmployees} total employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceData.overview.attendanceRate}</div>
            <p className="text-xs text-blue-600">Monthly average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Working Hours</CardTitle>
            <Clock className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceData.overview.avgWorkingHours}</div>
            <p className="text-xs text-purple-600">Per employee</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceData.overview.lateArrivals}</div>
            <p className="text-xs text-orange-600">Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Trends</CardTitle>
            <CardDescription>Daily attendance patterns over the current week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ 
              present: { label: "Present" }, 
              absent: { label: "Absent" },
              onLeave: { label: "On Leave" },
              late: { label: "Late" }
            }}>
              <BarChart data={attendanceData.attendanceTrends} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis width={40} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="present" stackId="a" fill="#4B6587" name="Present" />
                <Bar dataKey="onLeave" stackId="a" fill="#6B8A7A" name="On Leave" />
                <Bar dataKey="absent" stackId="a" fill="#E63946" name="Absent" />
                <Bar dataKey="late" stackId="a" fill="#F77F00" name="Late" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Working Hours Distribution</CardTitle>
            <CardDescription>Distribution of daily working hours across employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData.workingHoursDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ hours, count }) => `${hours}: ${count}`}
                  >
                    {attendanceData.workingHoursDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Attendance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Department Attendance Summary</CardTitle>
          <CardDescription>Attendance breakdown by department for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceData.departmentAttendance.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Users2 className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">{dept.department}</div>
                    <div className="text-sm text-gray-600">
                      {dept.present} present • {dept.absent} absent • {dept.onLeave} on leave
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-lg">{dept.rate}%</div>
                  <div className="text-xs text-gray-600">Attendance rate</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Employee Attendance Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Employee Attendance - {dateFilter}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Manual Entry
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Working Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-xs text-gray-500">{employee.employeeId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <LogIn className="h-3 w-3 text-green-500" />
                      {formatTime(employee.checkIn)}
                      {employee.lateMinutes > 0 && (
                        <span className="text-xs text-red-500">({employee.lateMinutes}m late)</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <LogOut className="h-3 w-3 text-red-500" />
                      {formatTime(employee.checkOut)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{formatHours(employee.workingHours)}</div>
                      {employee.overtimeHours > 0 && (
                        <div className="text-xs text-blue-500">+{formatHours(employee.overtimeHours)} OT</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(employee.status)}</TableCell>
                  <TableCell>{getLocationBadge(employee.location)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEmployee(employee)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Employee Attendance Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Attendance Details - {selectedEmployee?.name}</DialogTitle>
            <DialogDescription>
              <div className="mt-3 grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">Employee ID</div>
                    <div className="text-sm text-gray-600">{selectedEmployee?.employeeId}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Department</div>
                    <div className="text-sm text-gray-600">{selectedEmployee?.department}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Date</div>
                    <div className="text-sm text-gray-600">{selectedEmployee?.date}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Check In Time</div>
                    <div className="text-lg font-semibold text-green-600">
                      {formatTime(selectedEmployee?.checkIn)}
                    </div>
                    {selectedEmployee?.lateMinutes > 0 && (
                      <div className="text-xs text-red-500">{selectedEmployee.lateMinutes} minutes late</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium">Check Out Time</div>
                    <div className="text-lg font-semibold text-red-600">
                      {formatTime(selectedEmployee?.checkOut)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">Working Hours</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {formatHours(selectedEmployee?.workingHours || 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Break Time</div>
                    <div className="text-lg font-semibold text-orange-600">
                      {formatHours(selectedEmployee?.breakTime || 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Overtime Hours</div>
                    <div className="text-lg font-semibold text-purple-600">
                      {formatHours(selectedEmployee?.overtimeHours || 0)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    {selectedEmployee && getStatusBadge(selectedEmployee.status)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">Location</div>
                    {selectedEmployee && getLocationBadge(selectedEmployee.location)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">Attendance Score</div>
                    <div className={`text-lg font-semibold ${selectedEmployee && getAttendanceColor(selectedEmployee.attendanceScore)}`}>
                      {selectedEmployee?.attendanceScore}%
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Entry
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    View History
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Attendance Report
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}