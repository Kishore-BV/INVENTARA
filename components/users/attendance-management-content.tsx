'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Home, Plus, Calendar, Users, Target, TrendingUp, Clock, AlertTriangle, CheckCircle, XCircle, Play, User, CalendarDays, MapPin, Timer, FileText, Download, Filter, Search } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from "recharts"

interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  employeeId: string
  status: "active" | "inactive"
  avatar?: string
}

interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkIn: string
  checkOut: string
  totalHours: number
  status: "present" | "absent" | "late" | "half-day" | "leave"
  location: string
  notes?: string
}

interface TimeSheet {
  id: string
  employeeId: string
  employeeName: string
  weekStart: string
  weekEnd: string
  totalHours: number
  projects: string[]
  status: "pending" | "approved" | "rejected"
}

const sampleEmployees: Employee[] = [
  {
    id: "EMP-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@inventara.com",
    department: "Engineering",
    position: "Project Manager",
    employeeId: "EMP001",
    status: "active"
  },
  {
    id: "EMP-002",
    name: "Mike Wilson",
    email: "mike.wilson@inventara.com",
    department: "Engineering",
    position: "Senior Developer",
    employeeId: "EMP002",
    status: "active"
  },
  {
    id: "EMP-003",
    name: "Emily Davis",
    email: "emily.davis@inventara.com",
    department: "Engineering",
    position: "Backend Developer",
    employeeId: "EMP003",
    status: "active"
  },
  {
    id: "EMP-004",
    name: "Jennifer Martinez",
    email: "jennifer.martinez@inventara.com",
    department: "Design",
    position: "UI/UX Designer",
    employeeId: "EMP004",
    status: "active"
  },
  {
    id: "EMP-005",
    name: "David Brown",
    email: "david.brown@inventara.com",
    department: "Engineering",
    position: "DevOps Engineer",
    employeeId: "EMP005",
    status: "active"
  }
]

const sampleAttendanceRecords: AttendanceRecord[] = [
  {
    id: "ATT-001",
    employeeId: "EMP-001",
    employeeName: "Sarah Johnson",
    date: "2024-01-15",
    checkIn: "09:00",
    checkOut: "17:30",
    totalHours: 8.5,
    status: "present",
    location: "Office - Floor 2"
  },
  {
    id: "ATT-002",
    employeeId: "EMP-002",
    employeeName: "Mike Wilson",
    date: "2024-01-15",
    checkIn: "08:45",
    checkOut: "18:00",
    totalHours: 9.25,
    status: "present",
    location: "Office - Floor 2"
  },
  {
    id: "ATT-003",
    employeeId: "EMP-003",
    employeeName: "Emily Davis",
    date: "2024-01-15",
    checkIn: "09:15",
    checkOut: "17:45",
    totalHours: 8.5,
    status: "late",
    location: "Office - Floor 2"
  },
  {
    id: "ATT-004",
    employeeId: "EMP-004",
    employeeName: "Jennifer Martinez",
    date: "2024-01-15",
    checkIn: "09:00",
    checkOut: "17:00",
    totalHours: 8.0,
    status: "present",
    location: "Office - Floor 1"
  },
  {
    id: "ATT-005",
    employeeId: "EMP-005",
    employeeName: "David Brown",
    date: "2024-01-15",
    checkIn: "08:30",
    checkOut: "17:30",
    totalHours: 9.0,
    status: "present",
    location: "Office - Floor 2"
  }
]

const sampleTimeSheets: TimeSheet[] = [
  {
    id: "TS-001",
    employeeId: "EMP-001",
    employeeName: "Sarah Johnson",
    weekStart: "2024-01-15",
    weekEnd: "2024-01-19",
    totalHours: 42.5,
    projects: ["Warehouse Automation System"],
    status: "approved"
  },
  {
    id: "TS-002",
    employeeId: "EMP-002",
    employeeName: "Mike Wilson",
    weekStart: "2024-01-15",
    weekEnd: "2024-01-19",
    totalHours: 45.0,
    projects: ["Warehouse Automation System"],
    status: "approved"
  },
  {
    id: "TS-003",
    employeeId: "EMP-003",
    employeeName: "Emily Davis",
    weekStart: "2024-01-15",
    weekEnd: "2024-01-19",
    totalHours: 40.0,
    projects: ["Warehouse Automation System"],
    status: "pending"
  }
]

const attendanceTrends = [
  { day: 'Mon', present: 45, absent: 3, late: 2 },
  { day: 'Tue', present: 47, absent: 1, late: 2 },
  { day: 'Wed', present: 44, absent: 4, late: 2 },
  { day: 'Thu', present: 46, absent: 2, late: 2 },
  { day: 'Fri', present: 43, absent: 5, late: 2 }
]

const departmentAttendance = [
  { name: 'Engineering', value: 65, color: '#8884d8' },
  { name: 'Design', value: 20, color: '#82ca9d' },
  { name: 'Sales', value: 10, color: '#ffc658' },
  { name: 'HR', value: 5, color: '#ff7300' }
]

const getStatusColor = (status: AttendanceRecord["status"]) => {
  switch (status) {
    case "present": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "absent": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    case "late": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "half-day": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    case "leave": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getStatusIcon = (status: AttendanceRecord["status"]) => {
  switch (status) {
    case "present": return <CheckCircle className="h-4 w-4" />
    case "absent": return <XCircle className="h-4 w-4" />
    case "late": return <AlertTriangle className="h-4 w-4" />
    case "half-day": return <Clock className="h-4 w-4" />
    case "leave": return <Calendar className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

const getTimeSheetStatusColor = (status: TimeSheet["status"]) => {
  switch (status) {
    case "approved": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

export function AttendanceManagementContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState<AttendanceRecord["status"] | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAttendance = sampleAttendanceRecords.filter(record => {
    if (selectedDepartment !== "all") {
      const employee = sampleEmployees.find(emp => emp.id === record.employeeId)
      if (!employee || employee.department !== selectedDepartment) return false
    }
    if (selectedStatus !== "all" && record.status !== selectedStatus) return false
    if (searchQuery && !record.employeeName.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const totalEmployees = sampleEmployees.length
  const presentToday = sampleAttendanceRecords.filter(r => r.status === "present").length
  const absentToday = sampleAttendanceRecords.filter(r => r.status === "absent").length
  const lateToday = sampleAttendanceRecords.filter(r => r.status === "late").length
  const attendanceRate = (presentToday / totalEmployees) * 100

  const uniqueDepartments = Array.from(new Set(sampleEmployees.map(emp => emp.department)))

  const exportToCSV = () => {
    const headers = ["Employee", "Date", "Check In", "Check Out", "Total Hours", "Status", "Location"]
    const csvContent = [
      headers.join(","),
      ...filteredAttendance.map(record => [
        record.employeeName,
        record.date,
        record.checkIn,
        record.checkOut,
        record.totalHours,
        record.status,
        record.location
      ].join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance-${selectedDate}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      {/* Header with Home Button and New Record Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2" title="Go to Dashboard">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Attendance Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Track employee attendance, time sheets, and work schedules</p>
          </div>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Record
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              Active staff
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentToday}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <Target className="h-3 w-3" />
              {attendanceRate.toFixed(1)}% rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <XCircle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{absentToday}</div>
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <AlertTriangle className="h-3 w-3" />
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Late Today</CardTitle>
            <Clock className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lateToday}</div>
            <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
              <Timer className="h-3 w-3" />
              Arrived late
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Label htmlFor="date" className="text-sm font-medium">Date:</Label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40"
          />
        </div>

        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {uniqueDepartments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={(value: AttendanceRecord["status"] | "all") => setSelectedStatus(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="late">Late</SelectItem>
            <SelectItem value="half-day">Half Day</SelectItem>
            <SelectItem value="leave">Leave</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>

        <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Attendance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Trends</CardTitle>
            <CardDescription>Daily attendance patterns for the current week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" stackId="a" fill="#10b981" name="Present" />
                <Bar dataKey="late" stackId="a" fill="#f59e0b" name="Late" />
                <Bar dataKey="absent" stackId="a" fill="#ef4444" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance by Department</CardTitle>
            <CardDescription>Distribution of attendance across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={departmentAttendance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentAttendance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>Daily attendance records for all employees</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">{record.employeeName}</div>
                        <div className="text-sm text-gray-500">
                          {sampleEmployees.find(emp => emp.id === record.employeeId)?.department}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3 text-gray-500" />
                      {new Date(record.date).toLocaleDateString('en-US')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      {record.checkIn}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      {record.checkOut}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{record.totalHours}h</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(record.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(record.status)}
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      {record.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Time Sheets Section */}
      <Card>
        <CardHeader>
          <CardTitle>Time Sheets</CardTitle>
          <CardDescription>Weekly time tracking and project allocation</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Week Period</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleTimeSheets.map((timesheet) => (
                <TableRow key={timesheet.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="font-medium">{timesheet.employeeName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(timesheet.weekStart).toLocaleDateString('en-US')} - {new Date(timesheet.weekEnd).toLocaleDateString('en-US')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{timesheet.totalHours}h</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {timesheet.projects.map(project => (
                        <Badge key={project} variant="secondary" className="text-xs">
                          {project}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTimeSheetStatusColor(timesheet.status)}>
                      {timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">Review</Button>
                      <Button variant="outline" size="sm">Approve</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Attendance Record Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Attendance Record</DialogTitle>
            <DialogDescription>Record employee attendance for a specific date</DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Employee</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleEmployees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.employeeId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkIn">Check In Time</Label>
                <Input id="checkIn" type="time" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOut">Check Out Time</Label>
                <Input id="checkOut" type="time" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="half-day">Half Day</SelectItem>
                    <SelectItem value="leave">Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., Office - Floor 2" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" placeholder="Additional notes or comments" />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Record
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
