"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  Users, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Calendar, 
  UserPlus, 
  Settings, 
  BarChart3, 
  TrendingUp, 
  Target, 
  Award, 
  Shield, 
  FileText, 
  Download, 
  Edit, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Home,
  Briefcase,
  GraduationCap,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Zap,
  Users2,
  PieChart,
  LineChart
} from "lucide-react"
import Link from "next/link"
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from "recharts"

interface Department {
  id: string
  name: string
  manager: string
  employeeCount: number
  budget: number
  status: "active" | "inactive"
  location: string
  description: string
}

interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  startDate: string
  status: "active" | "inactive" | "on_leave"
  avatar?: string
}

interface OrganizationStats {
  totalEmployees: number
  totalDepartments: number
  activeProjects: number
  totalRevenue: number
  employeeGrowth: number
  departmentEfficiency: number
}

const departments: Department[] = [
  {
    id: "dept1",
    name: "Engineering",
    manager: "Sarah Johnson",
    employeeCount: 12,
    budget: 850000,
    status: "active",
    location: "Main Office",
    description: "Software development and technical operations"
  },
  {
    id: "dept2",
    name: "Sales & Marketing",
    manager: "Mike Wilson",
    employeeCount: 8,
    budget: 650000,
    status: "active",
    location: "Main Office",
    description: "Customer acquisition and brand management"
  },
  {
    id: "dept3",
    name: "Operations",
    manager: "Emily Davis",
    employeeCount: 6,
    budget: 450000,
    status: "active",
    location: "Warehouse",
    description: "Inventory and logistics management"
  },
  {
    id: "dept4",
    name: "Human Resources",
    manager: "Jennifer Martinez",
    employeeCount: 3,
    budget: 250000,
    status: "active",
    location: "Main Office",
    description: "Employee relations and recruitment"
  },
  {
    id: "dept5",
    name: "Finance",
    manager: "David Brown",
    employeeCount: 4,
    budget: 350000,
    status: "active",
    location: "Main Office",
    description: "Financial planning and accounting"
  }
]

const employees: Employee[] = [
  {
    id: "emp1",
    name: "Sarah Johnson",
    email: "sarah.johnson@inventara.com",
    department: "Engineering",
    position: "Engineering Manager",
    startDate: "2024-01-15",
    status: "active"
  },
  {
    id: "emp2",
    name: "Mike Wilson",
    email: "mike.wilson@inventara.com",
    department: "Sales & Marketing",
    position: "Sales Director",
    startDate: "2024-02-01",
    status: "active"
  },
  {
    id: "emp3",
    name: "Emily Davis",
    email: "emily.davis@inventara.com",
    department: "Operations",
    position: "Operations Manager",
    startDate: "2024-01-20",
    status: "active"
  },
  {
    id: "emp4",
    name: "Jennifer Martinez",
    email: "jennifer.martinez@inventara.com",
    department: "Human Resources",
    position: "HR Manager",
    startDate: "2024-03-01",
    status: "active"
  },
  {
    id: "emp5",
    name: "David Brown",
    email: "david.brown@inventara.com",
    department: "Finance",
    position: "Finance Manager",
    startDate: "2024-02-15",
    status: "active"
  },
  {
    id: "emp6",
    name: "Alex Thompson",
    email: "alex.thompson@inventara.com",
    department: "Engineering",
    position: "Senior Developer",
    startDate: "2024-01-10",
    status: "on_leave"
  }
]

const employeeGrowthData = [
  { month: 'Jan', employees: 18, growth: 12 },
  { month: 'Feb', employees: 22, growth: 22 },
  { month: 'Mar', employees: 25, growth: 14 },
  { month: 'Apr', employees: 28, growth: 12 },
  { month: 'May', employees: 30, growth: 7 },
  { month: 'Jun', employees: 33, growth: 10 }
]

const departmentDistribution = [
  { name: 'Engineering', value: 36, color: '#8884d8' },
  { name: 'Sales & Marketing', value: 24, color: '#82ca9d' },
  { name: 'Operations', value: 18, color: '#ffc658' },
  { name: 'Finance', value: 12, color: '#ff7300' },
  { name: 'HR', value: 9, color: '#00C49F' }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "inactive": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    case "on_leave": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active": return <CheckCircle className="h-4 w-4" />
    case "inactive": return <AlertTriangle className="h-4 w-4" />
    case "on_leave": return <Clock className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

export function OrganizationContent() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDepartmentDialogOpen, setIsAddDepartmentDialogOpen] = useState(false)

  const filteredEmployees = employees.filter(employee => {
    if (selectedDepartment !== "all" && employee.department !== selectedDepartment) return false
    if (searchQuery && !employee.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !employee.email.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const totalEmployees = employees.length
  const activeEmployees = employees.filter(emp => emp.status === "active").length
  const totalDepartments = departments.length
  const totalBudget = departments.reduce((sum, dept) => sum + dept.budget, 0)
  const avgBudgetPerDept = totalBudget / totalDepartments

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Department", "Position", "Start Date", "Status"]
    const csvContent = [
      headers.join(","),
      ...filteredEmployees.map(employee => [
        employee.name,
        employee.email,
        employee.department,
        employee.position,
        employee.startDate,
        employee.status
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `organization-employees-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      {/* Header with Home Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2" title="Go to Dashboard">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Organization Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your organization structure, departments, and employees</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
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
              {activeEmployees} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDepartments}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <Target className="h-3 w-3" />
              All active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <BarChart3 className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalBudget / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
              <Activity className="h-3 w-3" />
              Annual allocation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Budget/Dept</CardTitle>
            <Zap className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(avgBudgetPerDept / 1000).toFixed(0)}K</div>
            <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
              <Award className="h-3 w-3" />
              Per department
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Employee Growth</CardTitle>
            <CardDescription>Monthly employee count and growth rate</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={employeeGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="employees" stroke="#8884d8" strokeWidth={2} name="Employees" />
                <Line type="monotone" dataKey="growth" stroke="#82ca9d" strokeWidth={2} name="Growth %" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Employee distribution across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Company Information</span>
                  </CardTitle>
                  <CardDescription>Update your organization's basic information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input id="company-name" defaultValue="Inventara Solutions" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input id="industry" defaultValue="Inventory Management" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      defaultValue="Leading provider of smart inventory management solutions for small and medium businesses."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="founded">Founded</Label>
                      <Input id="founded" defaultValue="2024" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employees">Number of Employees</Label>
                      <Input id="employees" defaultValue="25-50" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Contact Information</span>
                  </CardTitle>
                  <CardDescription>Organization contact details and address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="contact@inventara.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue="+91 (555) 123-4567" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      defaultValue="123 Business District, Suite 456&#10;Tech City, TC 12345&#10;India"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue="https://inventara.com" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Users</span>
                    <span className="text-lg font-bold text-[#4B6587]">{totalEmployees}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Active Warehouses</span>
                    <span className="text-lg font-bold text-[#6B8A7A]">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Products Managed</span>
                    <span className="text-lg font-bold text-[#F4A261]">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Monthly Transactions</span>
                    <span className="text-lg font-bold text-[#E7B10A]">892</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Organization Logo</CardTitle>
                  <CardDescription>Upload your company logo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                      <img src="/INVENTARA-logo-transparent.png" alt="Inventara Logo" className="h-full w-full object-contain" />
                    </div>
                    <Button variant="outline" size="sm">
                      Upload Logo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          {/* Filters and Search */}
          <div className="flex items-center gap-4 flex-wrap">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {Array.from(new Set(employees.map(emp => emp.department))).map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
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
          </div>

          {/* Employees Table */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>Manage and view all organization employees</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{employee.department}</Badge>
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        {new Date(employee.startDate).toLocaleDateString('en-US')}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(employee.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(employee.status)}
                            {employee.status.replace('_', ' ').charAt(0).toUpperCase() + employee.status.replace('_', ' ').slice(1)}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
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
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Department Management</h3>
              <p className="text-sm text-gray-600">Manage organizational departments and their budgets</p>
            </div>
            <Button onClick={() => setIsAddDepartmentDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Department
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((department) => (
              <Card key={department.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Briefcase className="h-5 w-5" />
                        <span>{department.name}</span>
                      </CardTitle>
                      <CardDescription>{department.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(department.status)}>
                      {department.status.charAt(0).toUpperCase() + department.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Manager</p>
                      <p className="font-medium">{department.manager}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Employees</p>
                      <p className="font-medium">{department.employeeCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Budget</p>
                      <p className="font-medium">₹{(department.budget / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                      <p className="font-medium">{department.location}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Organization Settings</span>
              </CardTitle>
              <CardDescription>Configure organization-wide settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">General Settings</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Default Timezone</Label>
                      <Select defaultValue="ist">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="est">Eastern Standard Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Default Currency</Label>
                      <Select defaultValue="inr">
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                          <SelectItem value="usd">US Dollar ($)</SelectItem>
                          <SelectItem value="eur">Euro (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Security Settings</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input id="session-timeout" type="number" defaultValue="30" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-policy">Password Policy</Label>
                      <Select defaultValue="strong">
                        <SelectTrigger>
                          <SelectValue placeholder="Select policy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="strong">Strong</SelectItem>
                          <SelectItem value="very-strong">Very Strong</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>



      {/* Add Department Dialog */}
      <Dialog open={isAddDepartmentDialogOpen} onOpenChange={setIsAddDepartmentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>Create a new department in the organization</DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deptName">Department Name</Label>
              <Input id="deptName" placeholder="Enter department name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deptDescription">Description</Label>
              <Textarea id="deptDescription" placeholder="Enter department description" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Input id="manager" placeholder="Enter manager name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Annual Budget (₹)</Label>
                <Input id="budget" type="number" placeholder="Enter budget amount" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Enter department location" />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddDepartmentDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Department
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-[#4B6587] hover:bg-[#3A5068]">Save Changes</Button>
      </div>
    </div>
  )
}
