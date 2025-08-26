'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Home, Plus, Users, Target, TrendingUp, Clock, AlertTriangle, CheckCircle, XCircle, Play, Calendar, BarChart3, PieChart, Activity } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from "recharts"

interface Resource {
  id: string
  name: string
  role: string
  department: string
  skills: string[]
  availability: number
  currentAllocation: number
  projects: string[]
  hourlyRate: number
  totalHours: number
  status: "available" | "busy" | "overloaded" | "unavailable"
}

interface ResourceAllocation {
  resourceId: string
  resourceName: string
  projectId: string
  projectName: string
  allocatedHours: number
  startDate: string
  endDate: string
  role: string
}

const sampleResources: Resource[] = [
  {
    id: "RES-001",
    name: "Sarah Johnson",
    role: "Project Manager",
    department: "Engineering",
    skills: ["Project Management", "Agile", "Risk Management", "Team Leadership"],
    availability: 40,
    currentAllocation: 32,
    projects: ["Warehouse Automation System"],
    hourlyRate: 2500,
    totalHours: 160,
    status: "busy"
  },
  {
    id: "RES-002",
    name: "Mike Wilson",
    role: "Senior Developer",
    department: "Engineering",
    skills: ["React", "Node.js", "TypeScript", "Database Design"],
    availability: 40,
    currentAllocation: 40,
    projects: ["Warehouse Automation System"],
    hourlyRate: 2000,
    totalHours: 160,
    status: "overloaded"
  },
  {
    id: "RES-003",
    name: "Emily Davis",
    role: "Backend Developer",
    department: "Engineering",
    skills: ["Python", "Django", "API Development", "PostgreSQL"],
    availability: 40,
    currentAllocation: 24,
    projects: ["Warehouse Automation System"],
    hourlyRate: 1800,
    totalHours: 160,
    status: "available"
  },
  {
    id: "RES-004",
    name: "Jennifer Martinez",
    role: "UI/UX Designer",
    department: "Design",
    skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
    availability: 40,
    currentAllocation: 0,
    projects: [],
    hourlyRate: 2200,
    totalHours: 0,
    status: "available"
  },
  {
    id: "RES-005",
    name: "David Brown",
    role: "DevOps Engineer",
    department: "Engineering",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    availability: 40,
    currentAllocation: 16,
    projects: ["Supplier Portal Integration"],
    hourlyRate: 2400,
    totalHours: 160,
    status: "available"
  }
]

const sampleAllocations: ResourceAllocation[] = [
  {
    resourceId: "RES-001",
    resourceName: "Sarah Johnson",
    projectId: "PRJ-001",
    projectName: "Warehouse Automation System",
    allocatedHours: 32,
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    role: "Project Manager"
  },
  {
    resourceId: "RES-002",
    resourceName: "Mike Wilson",
    projectId: "PRJ-001",
    projectName: "Warehouse Automation System",
    allocatedHours: 40,
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    role: "Senior Developer"
  },
  {
    resourceId: "RES-003",
    resourceName: "Emily Davis",
    projectId: "PRJ-001",
    projectName: "Warehouse Automation System",
    allocatedHours: 24,
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    role: "Backend Developer"
  },
  {
    resourceId: "RES-005",
    resourceName: "David Brown",
    projectId: "PRJ-003",
    projectName: "Supplier Portal Integration",
    allocatedHours: 16,
    startDate: "2024-02-01",
    endDate: "2024-05-31",
    role: "DevOps Engineer"
  }
]

const resourceUtilization = [
  { month: 'Jan', planned: 75, actual: 70 },
  { month: 'Feb', planned: 80, actual: 78 },
  { month: 'Mar', planned: 85, actual: 82 },
  { month: 'Apr', planned: 90, actual: 88 },
  { month: 'May', planned: 95, actual: 92 },
  { month: 'Jun', planned: 100, actual: 95 }
]

const skillDistribution = [
  { name: 'Development', value: 45, color: '#8884d8' },
  { name: 'Design', value: 20, color: '#82ca9d' },
  { name: 'Project Management', value: 15, color: '#ffc658' },
  { name: 'DevOps', value: 20, color: '#ff7300' }
]

const getResourceStatusColor = (status: Resource["status"]) => {
  switch (status) {
    case "available": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "busy": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "overloaded": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    case "unavailable": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getResourceStatusIcon = (status: Resource["status"]) => {
  switch (status) {
    case "available": return <CheckCircle className="h-4 w-4" />
    case "busy": return <Clock className="h-4 w-4" />
    case "overloaded": return <AlertTriangle className="h-4 w-4" />
    case "unavailable": return <XCircle className="h-4 w-4" />
    default: return <Activity className="h-4 w-4" />
  }
}

export function ResourcesContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState<Resource["status"] | "all">("all")

  const filteredResources = sampleResources.filter(resource => {
    if (selectedDepartment !== "all" && resource.department !== selectedDepartment) return false
    if (selectedStatus !== "all" && resource.status !== selectedStatus) return false
    return true
  })

  const totalResources = sampleResources.length
  const availableResources = sampleResources.filter(r => r.status === "available").length
  const busyResources = sampleResources.filter(r => r.status === "busy").length
  const overloadedResources = sampleResources.filter(r => r.status === "overloaded").length

  const totalAllocatedHours = sampleResources.reduce((sum, r) => sum + r.currentAllocation, 0)
  const totalAvailableHours = sampleResources.reduce((sum, r) => sum + r.availability, 0)
  const utilizationRate = (totalAllocatedHours / totalAvailableHours) * 100

  const uniqueDepartments = Array.from(new Set(sampleResources.map(r => r.department)))

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      {/* Header with Home Button and New Resource Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2" title="Go to Dashboard">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Resource Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage resource allocation and team capacity planning</p>
          </div>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Resource
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResources}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              Team members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableResources}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <Target className="h-3 w-3" />
              Ready for assignment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            <BarChart3 className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{utilizationRate.toFixed(1)}%</div>
            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
              <Activity className="h-3 w-3" />
              Resource efficiency
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overloaded</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overloadedResources}</div>
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <AlertTriangle className="h-3 w-3" />
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
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

        <Select value={selectedStatus} onValueChange={(value: Resource["status"] | "all") => setSelectedStatus(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="busy">Busy</SelectItem>
            <SelectItem value="overloaded">Overloaded</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Resource Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Utilization</CardTitle>
            <CardDescription>Planned vs Actual resource utilization over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={resourceUtilization}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line type="monotone" dataKey="planned" stroke="#8884d8" strokeWidth={2} name="Planned" />
                <Line type="monotone" dataKey="actual" stroke="#82ca9d" strokeWidth={2} name="Actual" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skill Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Distribution</CardTitle>
            <CardDescription>Distribution of skills across the team</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={skillDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resources Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Overview</CardTitle>
          <CardDescription>Detailed view of all team resources and their allocation</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Allocation</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{resource.name}</div>
                      <div className="text-sm text-gray-500">₹{resource.hourlyRate}/hr</div>
                    </div>
                  </TableCell>
                  <TableCell>{resource.role}</TableCell>
                  <TableCell>{resource.department}</TableCell>
                  <TableCell>
                    <div className="w-24">
                      <Progress value={(resource.currentAllocation / resource.availability) * 100} className="h-2" />
                      <div className="text-xs text-center mt-1">
                        {resource.currentAllocation}/{resource.availability} hrs
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {resource.skills.slice(0, 2).map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {resource.skills.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{resource.skills.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {resource.projects.length > 0 ? (
                      <div className="text-sm">
                        {resource.projects.slice(0, 1).map(project => (
                          <div key={project} className="truncate max-w-32">{project}</div>
                        ))}
                        {resource.projects.length > 1 && (
                          <div className="text-xs text-gray-500">+{resource.projects.length - 1} more</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No projects</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getResourceStatusColor(resource.status)}>
                      <div className="flex items-center gap-1">
                        {getResourceStatusIcon(resource.status)}
                        {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Resource Allocation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Allocations</CardTitle>
          <CardDescription>Current project assignments and time allocation</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Allocated Hours</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleAllocations.map((allocation) => (
                <TableRow key={`${allocation.resourceId}-${allocation.projectId}`}>
                  <TableCell className="font-medium">{allocation.resourceName}</TableCell>
                  <TableCell>{allocation.projectName}</TableCell>
                  <TableCell>{allocation.role}</TableCell>
                  <TableCell>{allocation.allocatedHours} hrs/week</TableCell>
                                     <TableCell>
                     {new Date(allocation.startDate).toLocaleDateString('en-US')} - {new Date(allocation.endDate).toLocaleDateString('en-US')}
                   </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Remove</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Resource Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
            <DialogDescription>Add a new team member to the resource pool</DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project-manager">Project Manager</SelectItem>
                    <SelectItem value="senior-developer">Senior Developer</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">UI/UX Designer</SelectItem>
                    <SelectItem value="devops">DevOps Engineer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="qa">Quality Assurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
                <Input id="hourlyRate" type="number" placeholder="Enter hourly rate" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input id="skills" placeholder="Enter skills separated by commas" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availability">Weekly Availability (hours)</Label>
                <Input id="availability" type="number" placeholder="40" defaultValue="40" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" required />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Resource
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
