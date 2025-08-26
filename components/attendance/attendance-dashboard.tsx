"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Timer,
  MoreHorizontal,
  Plus,
  Search,
  Download,
  UserCheck,
  UserX,
  Activity,
  ClockIcon,
  LogIn,
  LogOut
} from "lucide-react"

interface AttendanceRecord {
  id: string
  employeeId: string
  employee: {
    id: string
    firstName?: string
    lastName?: string
    email: string
    employeeId?: string
  } | null
  date: Date
  clockIn?: Date
  clockOut?: Date
  breakStart?: Date
  breakEnd?: Date
  totalHours?: number
  overtimeHours?: number
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave'
  notes?: string
  approvedBy?: string
  createdAt: Date
  updatedAt: Date
}

interface AttendanceStats {
  totalEmployees: number
  presentToday: number
  absentToday: number
  lateToday: number
  overtimeHours: number
}

interface AttendanceDashboardProps {
  className?: string
}

export function AttendanceDashboard({ className }: AttendanceDashboardProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedTab, setSelectedTab] = useState("today")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Clock in/out state
  const [clockInOut, setClock] = useState({ loading: false, error: "" })

  // Fetch attendance data
  useEffect(() => {
    fetchAttendanceData()
    fetchAttendanceStats()
  }, [selectedTab, selectedDate])

  const fetchAttendanceData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      let url = '/api/attendance'
      
      if (selectedTab === 'today') {
        url += '?today=true'
      } else if (selectedTab === 'date' && selectedDate) {
        const startDate = new Date(selectedDate)
        const endDate = new Date(selectedDate)
        endDate.setHours(23, 59, 59, 999)
        url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAttendanceRecords(data.data || [])
      } else {
        console.error('Failed to fetch attendance data')
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendanceStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/attendance?stats=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAttendanceStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching attendance stats:', error)
    }
  }

  const handleClockIn = async () => {
    setClock({ loading: true, error: "" })
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'clock_in'
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        await fetchAttendanceData()
        await fetchAttendanceStats()
      } else {
        setClock(prev => ({ ...prev, error: data.message || 'Failed to clock in' }))
      }
    } catch (error) {
      setClock(prev => ({ ...prev, error: 'Failed to clock in' }))
    } finally {
      setClock(prev => ({ ...prev, loading: false }))
    }
  }

  const handleClockOut = async () => {
    setClock({ loading: true, error: "" })
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'clock_out'
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        await fetchAttendanceData()
        await fetchAttendanceStats()
      } else {
        setClock(prev => ({ ...prev, error: data.message || 'Failed to clock out' }))
      }
    } catch (error) {
      setClock(prev => ({ ...prev, error: 'Failed to clock out' }))
    } finally {
      setClock(prev => ({ ...prev, loading: false }))
    }
  }

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = (
      record.employee?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employee?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employee?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employee?.employeeId?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800'
      case 'absent':
        return 'bg-red-100 text-red-800'
      case 'late':
        return 'bg-yellow-100 text-yellow-800'
      case 'half_day':
        return 'bg-blue-100 text-blue-800'
      case 'on_leave':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString()
  }

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.floor((hours % 1) * 60)
    return `${h}h ${m}m`
  }

  // Check if current user has clocked in today
  const getCurrentUserTodayRecord = () => {
    const currentUserId = localStorage.getItem('userId') // Assuming we store this
    return attendanceRecords.find(record => 
      record.employeeId === currentUserId && 
      new Date(record.date).toDateString() === new Date().toDateString()
    )
  }

  const currentRecord = getCurrentUserTodayRecord()
  const hasCheckedIn = currentRecord?.clockIn && !currentRecord?.clockOut
  const hasCheckedOut = currentRecord?.clockOut

  if (loading && attendanceRecords.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">
            Track employee attendance, working hours, and time management
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Clock In/Out Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Time Clock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {currentRecord && (
                <div className="text-sm">
                  {currentRecord.clockIn && !currentRecord.clockOut && (
                    <span className="text-green-600">
                      Clocked in at {formatTime(currentRecord.clockIn)}
                    </span>
                  )}
                  {currentRecord.clockOut && (
                    <span className="text-blue-600">
                      Worked {formatDuration(currentRecord.totalHours || 0)} today
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              {!hasCheckedIn && !hasCheckedOut && (
                <Button 
                  onClick={handleClockIn} 
                  disabled={clockInOut.loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {clockInOut.loading ? "Clocking In..." : "Clock In"}
                </Button>
              )}
              {hasCheckedIn && !hasCheckedOut && (
                <Button 
                  onClick={handleClockOut} 
                  disabled={clockInOut.loading}
                  variant="destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {clockInOut.loading ? "Clocking Out..." : "Clock Out"}
                </Button>
              )}
              {hasCheckedOut && (
                <div className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded">
                  Work day completed
                </div>
              )}
            </div>
          </div>
          {clockInOut.error && (
            <div className="text-red-600 text-sm mt-2">{clockInOut.error}</div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {attendanceStats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats.totalEmployees}</div>
              <div className="text-xs text-muted-foreground">
                Registered employees
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{attendanceStats.presentToday}</div>
              <div className="text-xs text-muted-foreground">
                Including late arrivals
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{attendanceStats.absentToday}</div>
              <div className="text-xs text-muted-foreground">
                No attendance recorded
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{attendanceStats.lateToday}</div>
              <div className="text-xs text-muted-foreground">
                After scheduled time
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overtime Hours</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatDuration(attendanceStats.overtimeHours)}
              </div>
              <div className="text-xs text-muted-foreground">
                Total today
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="today">Today's Attendance</TabsTrigger>
            <TabsTrigger value="date">By Date</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>
          
          {selectedTab === 'date' && (
            <div className="flex items-center space-x-2">
              <Label htmlFor="date">Date:</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
          )}
        </div>

        <TabsContent value="today" className="space-y-6">
          <AttendanceTable 
            records={filteredRecords}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            getStatusBadgeColor={getStatusBadgeColor}
            formatTime={formatTime}
            formatDuration={formatDuration}
          />
        </TabsContent>

        <TabsContent value="date" className="space-y-6">
          <AttendanceTable 
            records={filteredRecords}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            getStatusBadgeColor={getStatusBadgeColor}
            formatTime={formatTime}
            formatDuration={formatDuration}
          />
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Attendance summary and reports coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface AttendanceTableProps {
  records: AttendanceRecord[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedStatus: string
  setSelectedStatus: (status: string) => void
  getStatusBadgeColor: (status: string) => string
  formatTime: (date: Date | string) => string
  formatDuration: (hours: number) => string
}

function AttendanceTable({
  records,
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  getStatusBadgeColor,
  formatTime,
  formatDuration
}: AttendanceTableProps) {
  return (
    <>
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="half_day">Half Day</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Attendance Records ({records.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Hours Worked</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {record.employee?.firstName || record.employee?.lastName
                          ? `${record.employee?.firstName || ''} ${record.employee?.lastName || ''}`.trim()
                          : record.employee?.email || 'Unknown'
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {record.employee?.employeeId || record.employee?.email || '-'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.clockIn ? formatTime(record.clockIn) : '-'}
                  </TableCell>
                  <TableCell>
                    {record.clockOut ? formatTime(record.clockOut) : '-'}
                  </TableCell>
                  <TableCell>
                    {record.totalHours ? formatDuration(record.totalHours) : '-'}
                  </TableCell>
                  <TableCell>
                    {record.overtimeHours ? formatDuration(record.overtimeHours) : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(record.status)} variant="secondary">
                      {record.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {record.notes || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <ClockIcon className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Edit Record
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
