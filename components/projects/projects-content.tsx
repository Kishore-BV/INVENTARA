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
import { Home, Plus, Calendar, Users, Target, TrendingUp, Clock, AlertTriangle, CheckCircle, XCircle, Play, Folder } from "lucide-react"
import Link from "next/link"

type ProjectStatus = "planning" | "active" | "on-hold" | "completed" | "cancelled"
type ProjectPriority = "low" | "medium" | "high" | "critical"

interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  progress: number
  startDate: string
  endDate: string
  manager: string
  team: string[]
  budget: number
  spent: number
  tasks: number
  completedTasks: number
}

const sampleProjects: Project[] = [
  {
    id: "PRJ-001",
    name: "Warehouse Automation System",
    description: "Implement automated picking and sorting systems for improved efficiency",
    status: "active",
    priority: "high",
    progress: 65,
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    manager: "Sarah Johnson",
    team: ["Mike Wilson", "Emily Davis", "David Brown"],
    budget: 2500000,
    spent: 1625000,
    tasks: 24,
    completedTasks: 16
  },
  {
    id: "PRJ-002",
    name: "Inventory Management App",
    description: "Develop mobile application for real-time inventory tracking",
    status: "planning",
    priority: "medium",
    progress: 15,
    startDate: "2024-03-01",
    endDate: "2024-08-31",
    manager: "Robert Taylor",
    team: ["Jennifer Martinez", "Christopher Garcia"],
    budget: 800000,
    spent: 120000,
    tasks: 18,
    completedTasks: 3
  },
  {
    id: "PRJ-003",
    name: "Supplier Portal Integration",
    description: "Connect supplier systems for automated order processing",
    status: "on-hold",
    priority: "low",
    progress: 30,
    startDate: "2024-02-01",
    endDate: "2024-05-31",
    manager: "Lisa Anderson",
    team: ["Kevin Clark", "Amanda Rodriguez"],
    budget: 500000,
    spent: 150000,
    tasks: 12,
    completedTasks: 4
  },
  {
    id: "PRJ-004",
    name: "Quality Control System",
    description: "Implement comprehensive quality control and testing procedures",
    status: "completed",
    priority: "high",
    progress: 100,
    startDate: "2023-10-01",
    endDate: "2024-01-31",
    manager: "James Wilson",
    team: ["Michelle Lee", "Daniel Thompson"],
    budget: 1200000,
    spent: 1180000,
    tasks: 20,
    completedTasks: 20
  }
]

const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case "planning": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "on-hold": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "completed": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getPriorityColor = (priority: ProjectPriority) => {
  switch (priority) {
    case "low": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    case "medium": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    case "critical": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getStatusIcon = (status: ProjectStatus) => {
  switch (status) {
    case "planning": return <Clock className="h-4 w-4" />
    case "active": return <Play className="h-4 w-4" />
    case "on-hold": return <AlertTriangle className="h-4 w-4" />
    case "completed": return <CheckCircle className="h-4 w-4" />
    case "cancelled": return <XCircle className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

export function ProjectsContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | "all">("all")
  const [filterPriority, setFilterPriority] = useState<ProjectPriority | "all">("all")

  const filteredProjects = sampleProjects.filter(project => {
    if (filterStatus !== "all" && project.status !== filterStatus) return false
    if (filterPriority !== "all" && project.priority !== filterPriority) return false
    return true
  })

  const totalBudget = sampleProjects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = sampleProjects.reduce((sum, p) => sum + p.spent, 0)
  const activeProjects = sampleProjects.filter(p => p.status === "active").length
  const completedProjects = sampleProjects.filter(p => p.status === "completed").length

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      {/* Header with Home Button and New Project Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2" title="Go to Dashboard">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Project Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Track projects, timelines, and team progress</p>
          </div>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Folder className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleProjects.length}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +2 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Play className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <Target className="h-3 w-3" />
              In progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Target className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalBudget.toLocaleString()}</div>
            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
              <Calendar className="h-3 w-3" />
              All projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <CheckCircle className="h-3 w-3" />
              Successfully delivered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={filterStatus} onValueChange={(value: ProjectStatus | "all") => setFilterStatus(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={(value: ProjectPriority | "all") => setFilterPriority(value)}>
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
      </div>

      {/* Project Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="mt-2">{project.description}</CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getStatusColor(project.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(project.status)}
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </div>
                  </Badge>
                  <Badge className={getPriorityColor(project.priority)}>
                    {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Manager</p>
                  <p className="font-medium">{project.manager}</p>
                </div>
                <div>
                  <p className="text-gray-500">Team Size</p>
                  <p className="font-medium">{project.team.length} members</p>
                </div>
                <div>
                  <p className="text-gray-500">Start Date</p>
                  <p className="font-medium">{new Date(project.startDate).toLocaleDateString('en-US')}</p>
                </div>
                <div>
                  <p className="text-gray-500">End Date</p>
                  <p className="font-medium">{new Date(project.endDate).toLocaleDateString('en-US')}</p>
                </div>
              </div>

              {/* Budget and Tasks */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Budget</p>
                  <p className="font-medium">₹{project.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tasks</p>
                  <p className="font-medium">{project.completedTasks}/{project.tasks}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Add a new project to track and manage</DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input id="name" placeholder="Enter project name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager">Project Manager</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="robert">Robert Taylor</SelectItem>
                    <SelectItem value="lisa">Lisa Anderson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe the project objectives and scope" rows={3} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (₹)</Label>
                <Input id="budget" type="number" placeholder="Enter budget amount" required />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create Project
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
