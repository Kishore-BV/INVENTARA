'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  Users, 
  Home,
  Users2,
  Wallet,
  UserPlus,
  Clock,
  Calendar,
  Star,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  User,
  Plus,
  Eye,
  Edit,
  Award,
  Target,
  BarChart3,
  Building2,
  Phone,
  Mail
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function HumanCapitalManagementContent() {
  const router = useRouter();

  // Mock HCM data
  const hcmOverview = {
    totalEmployees: 247,
    activeEmployees: 238,
    newHiresThisMonth: 12,
    turnoverRate: "3.2%",
    averageSalary: "₹8,45,000",
    performanceRating: "4.2",
    attendanceRate: "96.8%"
  };

  const recentEmployees = [
    { id: "EMP-001", name: "Rajesh Kumar", position: "Senior Software Engineer", department: "Technology", joinDate: "2024-01-15", salary: 1200000, status: "Active", performance: 4.5, attendance: 98 },
    { id: "EMP-002", name: "Priya Sharma", position: "Marketing Manager", department: "Marketing", joinDate: "2024-01-10", salary: 950000, status: "Active", performance: 4.2, attendance: 95 },
    { id: "EMP-003", name: "Amit Patel", position: "Financial Analyst", department: "Finance", joinDate: "2024-01-08", salary: 750000, status: "Active", performance: 4.0, attendance: 97 },
    { id: "EMP-004", name: "Sneha Reddy", position: "HR Specialist", department: "Human Resources", joinDate: "2024-01-12", salary: 650000, status: "Active", performance: 4.3, attendance: 99 },
    { id: "EMP-005", name: "Vikram Singh", position: "Production Supervisor", department: "Production", joinDate: "2024-01-05", salary: 850000, status: "Active", performance: 4.1, attendance: 94 }
  ];

  const departmentData = [
    { name: "Technology", employees: 78, budget: 85000000, avgSalary: 1150000 },
    { name: "Marketing", employees: 32, budget: 45000000, avgSalary: 920000 },
    { name: "Finance", employees: 24, budget: 28000000, avgSalary: 780000 },
    { name: "Human Resources", employees: 18, budget: 18000000, avgSalary: 680000 },
    { name: "Production", employees: 65, budget: 52000000, avgSalary: 720000 },
    { name: "Sales", employees: 30, budget: 35000000, avgSalary: 850000 }
  ];

  const attendanceTrends = [
    { month: "Jul", attendance: 96.2, leaves: 42, overtime: 128 },
    { month: "Aug", attendance: 95.8, leaves: 38, overtime: 145 },
    { month: "Sep", attendance: 97.1, leaves: 29, overtime: 132 },
    { month: "Oct", attendance: 96.5, leaves: 35, overtime: 156 },
    { month: "Nov", attendance: 96.9, leaves: 31, overtime: 167 },
    { month: "Dec", attendance: 96.8, leaves: 45, overtime: 189 }
  ];

  const performanceDistribution = [
    { rating: "Excellent (4.5-5.0)", count: 89, color: "#10B981" },
    { rating: "Good (4.0-4.4)", count: 124, color: "#3B82F6" },
    { rating: "Average (3.5-3.9)", count: 28, color: "#F59E0B" },
    { rating: "Below Average (3.0-3.4)", count: 6, color: "#EF4444" }
  ];

  const pendingActions = [
    { type: "Leave Approvals", count: 8, priority: "Medium", department: "Various", description: "Pending leave requests requiring approval" },
    { type: "Performance Reviews", count: 15, priority: "High", department: "All", description: "Quarterly performance reviews due" },
    { type: "Onboarding", count: 3, priority: "High", department: "HR", description: "New employee onboarding in progress" },
    { type: "Training Completion", count: 22, priority: "Low", department: "Technology", description: "Mandatory training programs to complete" }
  ];

  const upcomingEvents = [
    { date: "2024-01-25", event: "Quarterly All-Hands Meeting", attendees: 247, type: "Company-wide" },
    { date: "2024-01-28", event: "Technical Skills Workshop", attendees: 45, type: "Training" },
    { date: "2024-01-30", event: "Performance Review Cycle", attendees: 15, type: "HR Process" },
    { date: "2024-02-02", event: "New Employee Orientation", attendees: 8, type: "Onboarding" }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "on leave":
        return <Badge variant="outline">On Leave</Badge>;
      case "terminated":
        return <Badge variant="destructive">Terminated</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-blue-600";
    if (rating >= 3.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return "text-green-600";
    if (attendance >= 90) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2" 
            title="Go to iERP Dashboard"
            onClick={() => router.push('/ierp')}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">iERP</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Human Capital Management (HCM)</h1>
            <p className="text-gray-600 dark:text-gray-300">Employee Records, Payroll, Attendance & Performance Management</p>
          </div>
        </div>
        <Badge variant="default" className="text-lg px-3 py-1 bg-green-600">
          Phase 2 Active
        </Badge>
      </div>

      {/* HCM Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users2 className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hcmOverview.totalEmployees}</div>
            <p className="text-xs text-blue-600">
              {hcmOverview.activeEmployees} active employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Hires</CardTitle>
            <UserPlus className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hcmOverview.newHiresThisMonth}</div>
            <p className="text-xs text-green-600">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Clock className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hcmOverview.attendanceRate}</div>
            <p className="text-xs text-purple-600">
              Average monthly
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <Star className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hcmOverview.performanceRating}</div>
            <p className="text-xs text-orange-600">
              Out of 5.0
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Modules */}
      <div>
        <h2 className="text-xl font-semibold mb-4">HCM Modules</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/hcm/employees')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users2 className="h-10 w-10 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Employee Records</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Employee information management</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/hcm/payroll')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Wallet className="h-10 w-10 text-green-600" />
                <div>
                  <h3 className="font-semibold">Payroll</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Salary & compensation management</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/hcm/recruitment')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <UserPlus className="h-10 w-10 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Recruitment</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Hiring & onboarding process</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/hcm/attendance')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Clock className="h-10 w-10 text-indigo-600" />
                <div>
                  <h3 className="font-semibold">Attendance Tracking</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Time & attendance management</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/hcm/leave')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Calendar className="h-10 w-10 text-orange-600" />
                <div>
                  <h3 className="font-semibold">Leave Management</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Leave requests & approvals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/hcm/performance')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Star className="h-10 w-10 text-red-600" />
                <div>
                  <h3 className="font-semibold">Performance Tracking</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Performance reviews & goals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Attendance Trends and Performance Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance & Leave Trends</CardTitle>
            <CardDescription>Monthly attendance rates and leave patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ 
              attendance: { label: "Attendance %" }, 
              leaves: { label: "Leave Days" },
              overtime: { label: "Overtime Hours" }
            }}>
              <LineChart data={attendanceTrends} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis width={40} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#4B6587" strokeWidth={2} name="Attendance %" />
                <Line type="monotone" dataKey="leaves" stroke="#E63946" strokeWidth={2} name="Leave Days" />
                <Line type="monotone" dataKey="overtime" stroke="#6B8A7A" strokeWidth={2} name="Overtime Hrs" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Distribution</CardTitle>
            <CardDescription>Employee performance rating distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ rating, count }) => `${count}`}
                  >
                    {performanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {performanceDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span>{item.rating}: {item.count} employees</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Employees */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Employees</CardTitle>
              <CardDescription>Newly hired employees and their details</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push('/ierp/hcm/employees')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Salary</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.joinDate}</TableCell>
                  <TableCell className="text-right">{formatCurrency(employee.salary)}</TableCell>
                  <TableCell>
                    <div className={`font-medium ${getPerformanceColor(employee.performance)}`}>
                      {employee.performance}/5.0
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`font-medium ${getAttendanceColor(employee.attendance)}`}>
                      {employee.attendance}%
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(employee.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
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

      {/* Department Overview and Pending Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>Employee distribution and budget by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">{dept.name}</div>
                      <div className="text-sm text-gray-600">
                        {dept.employees} employees • Avg: {formatCurrency(dept.avgSalary)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(dept.budget)}</div>
                    <div className="text-xs text-gray-600">Annual budget</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
            <CardDescription>HR tasks requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingActions.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">{action.type}</div>
                      <div className="text-sm text-gray-600">
                        {action.department} • {action.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getPriorityBadge(action.priority)}
                    <Badge variant="outline">{action.count}</Badge>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events & Schedules</CardTitle>
          <CardDescription>Important dates and company events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">{event.event}</div>
                    <div className="text-sm text-gray-600">
                      {event.date} • {event.attendees} attendees • {event.type}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}