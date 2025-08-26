'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, Calendar, Target, Clock, CheckCircle, AlertTriangle, TrendingUp, Milestone, CalendarDays, Play } from "lucide-react"
import Link from "next/link"

interface Milestone {
  id: string
  title: string
  description: string
  date: string
  status: "upcoming" | "in-progress" | "completed" | "overdue"
  project: string
  tasks: number
  completedTasks: number
}

interface TimelineEvent {
  id: string
  title: string
  startDate: string
  endDate: string
  progress: number
  status: "not-started" | "in-progress" | "completed" | "delayed"
  assignee: string
  project: string
}

const sampleMilestones: Milestone[] = [
  {
    id: "MIL-001",
    title: "Project Kickoff",
    description: "Official project initiation and team formation",
    date: "2024-01-15",
    status: "completed",
    project: "Warehouse Automation System",
    tasks: 5,
    completedTasks: 5
  },
  {
    id: "MIL-002",
    title: "Requirements Finalized",
    description: "Complete requirements gathering and documentation",
    date: "2024-02-01",
    status: "completed",
    project: "Warehouse Automation System",
    tasks: 8,
    completedTasks: 8
  },
  {
    id: "MIL-003",
    title: "Design Phase Complete",
    description: "System architecture and UI/UX design completed",
    date: "2024-02-28",
    status: "completed",
    project: "Warehouse Automation System",
    tasks: 12,
    completedTasks: 12
  },
  {
    id: "MIL-004",
    title: "Development 50%",
    description: "Core functionality development milestone",
    date: "2024-04-15",
    status: "in-progress",
    project: "Warehouse Automation System",
    tasks: 20,
    completedTasks: 10
  },
  {
    id: "MIL-005",
    title: "Testing Phase",
    description: "Begin comprehensive testing and quality assurance",
    date: "2024-05-15",
    status: "upcoming",
    project: "Warehouse Automation System",
    tasks: 15,
    completedTasks: 0
  },
  {
    id: "MIL-006",
    title: "Project Delivery",
    description: "Final delivery and deployment",
    date: "2024-06-30",
    status: "upcoming",
    project: "Warehouse Automation System",
    tasks: 10,
    completedTasks: 0
  }
]

const sampleTimelineEvents: TimelineEvent[] = [
  {
    id: "EVT-001",
    title: "Database Design",
    startDate: "2024-01-20",
    endDate: "2024-02-15",
    progress: 100,
    status: "completed",
    assignee: "Sarah Johnson",
    project: "Warehouse Automation System"
  },
  {
    id: "EVT-002",
    title: "Authentication System",
    startDate: "2024-02-01",
    endDate: "2024-03-01",
    progress: 75,
    status: "in-progress",
    assignee: "Mike Wilson",
    project: "Warehouse Automation System"
  },
  {
    id: "EVT-003",
    title: "API Development",
    startDate: "2024-02-10",
    endDate: "2024-03-15",
    progress: 60,
    status: "in-progress",
    assignee: "Emily Davis",
    project: "Warehouse Automation System"
  },
  {
    id: "EVT-004",
    title: "Mobile UI Design",
    startDate: "2024-03-15",
    endDate: "2024-04-01",
    progress: 0,
    status: "not-started",
    assignee: "Jennifer Martinez",
    project: "Inventory Management App"
  },
  {
    id: "EVT-005",
    title: "Integration Testing",
    startDate: "2024-05-01",
    endDate: "2024-05-31",
    progress: 0,
    status: "not-started",
    assignee: "David Brown",
    project: "Warehouse Automation System"
  }
]

const getMilestoneStatusColor = (status: Milestone["status"]) => {
  switch (status) {
    case "upcoming": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "in-progress": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "overdue": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getEventStatusColor = (status: TimelineEvent["status"]) => {
  switch (status) {
    case "not-started": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    case "in-progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "delayed": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "upcoming":
    case "not-started":
      return <Clock className="h-4 w-4" />
    case "in-progress":
      return <TrendingUp className="h-4 w-4" />
    case "completed":
      return <CheckCircle className="h-4 w-4" />
    case "overdue":
    case "delayed":
      return <AlertTriangle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export function TimelinesContent() {
  const [selectedProject, setSelectedProject] = useState("all")
  const [selectedView, setSelectedView] = useState<"milestones" | "timeline" | "gantt">("milestones")

  const filteredMilestones = selectedProject === "all" 
    ? sampleMilestones 
    : sampleMilestones.filter(m => m.project === selectedProject)

  const filteredEvents = selectedProject === "all" 
    ? sampleTimelineEvents 
    : sampleTimelineEvents.filter(e => e.project === selectedProject)

  const uniqueProjects = Array.from(new Set([
    ...sampleMilestones.map(m => m.project),
    ...sampleTimelineEvents.map(e => e.project)
  ]))

  const upcomingMilestones = sampleMilestones.filter(m => m.status === "upcoming").length
  const completedMilestones = sampleMilestones.filter(m => m.status === "completed").length
  const inProgressMilestones = sampleMilestones.filter(m => m.status === "in-progress").length

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
            <h1 className="text-3xl font-bold">Project Timelines</h1>
            <p className="text-gray-600 dark:text-gray-400">Track project milestones and timelines</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {uniqueProjects.map(project => (
                <SelectItem key={project} value={project}>{project}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Milestones</CardTitle>
            <Milestone className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleMilestones.length}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <Calendar className="h-3 w-3" />
              This quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingMilestones}</div>
            <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
              <Target className="h-3 w-3" />
              Next 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressMilestones}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <Play className="h-3 w-3" />
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
            <div className="text-2xl font-bold">{completedMilestones}</div>
            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
              <CheckCircle className="h-3 w-3" />
              Achieved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={selectedView === "milestones" ? "default" : "outline"}
          onClick={() => setSelectedView("milestones")}
          className="flex items-center gap-2"
        >
          <Milestone className="h-4 w-4" />
          Milestones
        </Button>
        <Button
          variant={selectedView === "timeline" ? "default" : "outline"}
          onClick={() => setSelectedView("timeline")}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Timeline
        </Button>
        <Button
          variant={selectedView === "gantt" ? "default" : "outline"}
          onClick={() => setSelectedView("gantt")}
          className="flex items-center gap-2"
        >
          <CalendarDays className="h-4 w-4" />
          Gantt Chart
        </Button>
      </div>

      {/* Milestones View */}
      {selectedView === "milestones" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMilestones.map((milestone) => (
            <Card key={milestone.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{milestone.title}</CardTitle>
                    <CardDescription className="mt-2">{milestone.description}</CardDescription>
                  </div>
                  <Badge className={getMilestoneStatusColor(milestone.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(milestone.status)}
                      {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Project</span>
                  <span className="font-medium">{milestone.project}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Due Date</span>
                  <span className="font-medium">{new Date(milestone.date).toLocaleDateString('en-US')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Tasks</span>
                  <span className="font-medium">{milestone.completedTasks}/{milestone.tasks}</span>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Timeline View */}
      {selectedView === "timeline" && (
        <Card>
          <CardHeader>
            <CardTitle>Project Timeline</CardTitle>
            <CardDescription>Chronological view of project events and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{event.title}</h3>
                      <Badge className={getEventStatusColor(event.status)}>
                        {event.status.replace('-', ' ').charAt(0).toUpperCase() + event.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{event.project}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                      <span>Start: {new Date(event.startDate).toLocaleDateString('en-US')}</span>
                <span>End: {new Date(event.endDate).toLocaleDateString('en-US')}</span>
                      <span>Assignee: {event.assignee}</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{event.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${event.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gantt Chart View */}
      {selectedView === "gantt" && (
        <Card>
          <CardHeader>
            <CardTitle>Gantt Chart</CardTitle>
            <CardDescription>Visual timeline representation of project tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 border-b pb-2 mb-4">
                  <div className="col-span-3 font-medium">Task</div>
                  <div className="col-span-2 font-medium">Assignee</div>
                  <div className="col-span-2 font-medium">Start</div>
                  <div className="col-span-2 font-medium">End</div>
                  <div className="col-span-2 font-medium">Progress</div>
                  <div className="col-span-1 font-medium">Status</div>
                </div>

                {/* Tasks */}
                {filteredEvents.map((event) => (
                  <div key={event.id} className="grid grid-cols-12 gap-2 items-center py-3 border-b border-gray-100">
                    <div className="col-span-3">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.project}</div>
                    </div>
                    <div className="col-span-2">{event.assignee}</div>
                                    <div className="col-span-2">{new Date(event.startDate).toLocaleDateString('en-US')}</div>
                <div className="col-span-2">{new Date(event.endDate).toLocaleDateString('en-US')}</div>
                    <div className="col-span-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${event.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-center mt-1">{event.progress}%</div>
                    </div>
                    <div className="col-span-1">
                      <Badge className={getEventStatusColor(event.status)}>
                        {event.status.charAt(0).toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
