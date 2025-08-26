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
import { Textarea } from "@/components/ui/textarea"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Home, Plus, Calendar, Users, Target, TrendingUp, Clock, AlertTriangle, CheckCircle, XCircle, Play, Link as LinkIcon, User, CalendarDays, Flag } from "lucide-react"
import Link from "next/link"

type TaskStatus = "todo" | "in-progress" | "review" | "completed" | "blocked"
type TaskPriority = "low" | "medium" | "high" | "critical"

interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  progress: number
  assignedTo: string
  project: string
  dueDate: string
  startDate: string
  estimatedHours: number
  actualHours: number
  dependencies: string[]
  tags: string[]
}

const sampleTasks: Task[] = [
  {
    id: "TASK-001",
    title: "Design Database Schema",
    description: "Create comprehensive database design for warehouse management system",
    status: "completed",
    priority: "high",
    progress: 100,
    assignedTo: "Sarah Johnson",
    project: "Warehouse Automation System",
    dueDate: "2024-02-15",
    startDate: "2024-01-20",
    estimatedHours: 40,
    actualHours: 38,
    dependencies: [],
    tags: ["database", "design", "planning"]
  },
  {
    id: "TASK-002",
    title: "Implement User Authentication",
    description: "Develop secure user authentication and authorization system",
    status: "in-progress",
    priority: "high",
    progress: 75,
    assignedTo: "Mike Wilson",
    project: "Warehouse Automation System",
    dueDate: "2024-03-01",
    startDate: "2024-02-01",
    estimatedHours: 32,
    actualHours: 24,
    dependencies: ["TASK-001"],
    tags: ["authentication", "security", "backend"]
  },
  {
    id: "TASK-003",
    title: "Create API Endpoints",
    description: "Develop RESTful API endpoints for inventory management",
    status: "in-progress",
    priority: "medium",
    progress: 60,
    assignedTo: "Emily Davis",
    project: "Warehouse Automation System",
    dueDate: "2024-03-15",
    startDate: "2024-02-10",
    estimatedHours: 48,
    actualHours: 28,
    dependencies: ["TASK-001"],
    tags: ["api", "backend", "integration"]
  },
  {
    id: "TASK-004",
    title: "Design Mobile UI",
    description: "Create user interface designs for mobile inventory app",
    status: "todo",
    priority: "medium",
    progress: 0,
    assignedTo: "Jennifer Martinez",
    project: "Inventory Management App",
    dueDate: "2024-04-01",
    startDate: "2024-03-15",
    estimatedHours: 56,
    actualHours: 0,
    dependencies: [],
    tags: ["ui", "design", "mobile"]
  },
  {
    id: "TASK-005",
    title: "Setup Development Environment",
    description: "Configure development tools and project structure",
    status: "completed",
    priority: "low",
    progress: 100,
    assignedTo: "David Brown",
    project: "Supplier Portal Integration",
    dueDate: "2024-02-10",
    startDate: "2024-02-01",
    estimatedHours: 16,
    actualHours: 14,
    dependencies: [],
    tags: ["setup", "configuration", "devops"]
  }
]

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case "todo": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    case "in-progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "review": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "blocked": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case "low": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    case "medium": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    case "critical": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case "todo": return <Clock className="h-4 w-4" />
    case "in-progress": return <Play className="h-4 w-4" />
    case "review": return <AlertTriangle className="h-4 w-4" />
    case "completed": return <CheckCircle className="h-4 w-4" />
    case "blocked": return <XCircle className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

export function TasksContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all")
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "all">("all")
  const [filterProject, setFilterProject] = useState<string>("all")

  const filteredTasks = sampleTasks.filter(task => {
    if (filterStatus !== "all" && task.status !== filterStatus) return false
    if (filterPriority !== "all" && task.priority !== filterPriority) return false
    if (filterProject !== "all" && task.project !== filterProject) return false
    return true
  })

  const totalTasks = sampleTasks.length
  const completedTasks = sampleTasks.filter(t => t.status === "completed").length
  const inProgressTasks = sampleTasks.filter(t => t.status === "in-progress").length
  const blockedTasks = sampleTasks.filter(t => t.status === "blocked").length

  const uniqueProjects = Array.from(new Set(sampleTasks.map(t => t.project)))

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      {/* Header with Home Button and New Task Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2" title="Go to Dashboard">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Task Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Track task assignments, dependencies, and progress</p>
          </div>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Target className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +5 this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Play className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <Target className="h-3 w-3" />
              Active work
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
              <CheckCircle className="h-3 w-3" />
              Delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Blocked</CardTitle>
            <XCircle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blockedTasks}</div>
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <AlertTriangle className="h-3 w-3" />
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={filterStatus} onValueChange={(value: TaskStatus | "all") => setFilterStatus(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={(value: TaskPriority | "all") => setFilterPriority(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterProject} onValueChange={setFilterProject}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {uniqueProjects.map(project => (
              <SelectItem key={project} value={project}>{project}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
          <CardDescription>All tasks with their current status and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Dependencies</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.description}</div>
                      <div className="flex gap-1 mt-1">
                        {task.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      {task.assignedTo}
                    </div>
                  </TableCell>
                  <TableCell>{task.project}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(task.status)}
                        {task.status.replace('-', ' ').charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(task.priority)}>
                      <div className="flex items-center gap-1">
                        <Flag className="h-3 w-3" />
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-20">
                      <Progress value={task.progress} className="h-2" />
                      <div className="text-xs text-center mt-1">{task.progress}%</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3 text-gray-500" />
                      {new Date(task.dueDate).toLocaleDateString('en-US')}
                    </div>
                  </TableCell>
                  <TableCell>
                    {task.dependencies.length > 0 ? (
                      <div className="flex gap-1">
                        {task.dependencies.map(dep => (
                          <Badge key={dep} variant="outline" className="text-xs">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">None</span>
                    )}
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

      {/* New Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task with assignments and dependencies</DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input id="title" placeholder="Enter task title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="mike">Mike Wilson</SelectItem>
                    <SelectItem value="emily">Emily Davis</SelectItem>
                    <SelectItem value="jennifer">Jennifer Martinez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe the task requirements" rows={3} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warehouse">Warehouse Automation System</SelectItem>
                    <SelectItem value="inventory">Inventory Management App</SelectItem>
                    <SelectItem value="supplier">Supplier Portal Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <Input id="estimatedHours" type="number" placeholder="Enter estimated hours" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dependencies">Dependencies</Label>
                <Input id="dependencies" placeholder="Task IDs separated by commas" />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create Task
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
