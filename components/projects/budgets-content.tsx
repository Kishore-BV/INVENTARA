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
import { Home, Plus, DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Users, Package, BarChart3, PieChart, Activity } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from "recharts"

interface ProjectBudget {
  id: string
  name: string
  totalBudget: number
  spent: number
  remaining: number
  status: "under-budget" | "on-track" | "over-budget" | "critical"
  startDate: string
  endDate: string
  manager: string
  team: string[]
  categories: BudgetCategory[]
}

interface BudgetCategory {
  name: string
  budget: number
  spent: number
  remaining: number
}

const sampleBudgets: ProjectBudget[] = [
  {
    id: "BUD-001",
    name: "Warehouse Automation System",
    totalBudget: 2500000,
    spent: 1625000,
    remaining: 875000,
    status: "on-track",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    manager: "Sarah Johnson",
    team: ["Mike Wilson", "Emily Davis", "David Brown"],
    categories: [
      { name: "Development", budget: 1200000, spent: 800000, remaining: 400000 },
      { name: "Hardware", budget: 800000, spent: 600000, remaining: 200000 },
      { name: "Testing", budget: 300000, spent: 150000, remaining: 150000 },
      { name: "Deployment", budget: 200000, spent: 75000, remaining: 125000 }
    ]
  },
  {
    id: "BUD-002",
    name: "Inventory Management App",
    totalBudget: 800000,
    spent: 120000,
    remaining: 680000,
    status: "under-budget",
    startDate: "2024-03-01",
    endDate: "2024-08-31",
    manager: "Robert Taylor",
    team: ["Jennifer Martinez", "Christopher Garcia"],
    categories: [
      { name: "Development", budget: 500000, spent: 80000, remaining: 420000 },
      { name: "Design", budget: 200000, spent: 30000, remaining: 170000 },
      { name: "Testing", budget: 100000, spent: 10000, remaining: 90000 }
    ]
  },
  {
    id: "BUD-003",
    name: "Supplier Portal Integration",
    totalBudget: 500000,
    spent: 150000,
    remaining: 350000,
    status: "on-track",
    startDate: "2024-02-01",
    endDate: "2024-05-31",
    manager: "Lisa Anderson",
    team: ["Kevin Clark", "Amanda Rodriguez"],
    categories: [
      { name: "Development", budget: 300000, spent: 90000, remaining: 210000 },
      { name: "Integration", budget: 150000, spent: 50000, remaining: 100000 },
      { name: "Testing", budget: 50000, spent: 10000, remaining: 40000 }
    ]
  }
]

const budgetTrends = [
  { month: 'Jan', planned: 500000, actual: 450000 },
  { month: 'Feb', planned: 800000, actual: 750000 },
  { month: 'Mar', planned: 1200000, actual: 1100000 },
  { month: 'Apr', planned: 1500000, actual: 1400000 },
  { month: 'May', planned: 1800000, actual: 1700000 },
  { month: 'Jun', planned: 2000000, actual: 1900000 }
]

const categoryDistribution = [
  { name: 'Development', value: 45, color: '#8884d8' },
  { name: 'Hardware', value: 25, color: '#82ca9d' },
  { name: 'Testing', value: 20, color: '#ffc658' },
  { name: 'Design', value: 10, color: '#ff7300' }
]

const getBudgetStatusColor = (status: ProjectBudget["status"]) => {
  switch (status) {
    case "under-budget": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "on-track": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "over-budget": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "critical": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getBudgetStatusIcon = (status: ProjectBudget["status"]) => {
  switch (status) {
    case "under-budget": return <TrendingDown className="h-4 w-4" />
    case "on-track": return <CheckCircle className="h-4 w-4" />
    case "over-budget": return <AlertTriangle className="h-4 w-4" />
    case "critical": return <AlertTriangle className="h-4 w-4" />
    default: return <Activity className="h-4 w-4" />
  }
}

export function BudgetsContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState("all")

  const filteredBudgets = selectedProject === "all" 
    ? sampleBudgets 
    : sampleBudgets.filter(b => b.id === selectedProject)

  const totalBudget = sampleBudgets.reduce((sum, b) => sum + b.totalBudget, 0)
  const totalSpent = sampleBudgets.reduce((sum, b) => sum + b.spent, 0)
  const totalRemaining = sampleBudgets.reduce((sum, b) => sum + b.remaining, 0)
  const underBudgetProjects = sampleBudgets.filter(b => b.status === "under-budget").length
  const overBudgetProjects = sampleBudgets.filter(b => b.status === "over-budget" || b.status === "critical").length

  const uniqueProjects = sampleBudgets.map(b => ({ id: b.id, name: b.name }))

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      {/* Header with Home Button and New Budget Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2" title="Go to Dashboard">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Project Budgets</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage project budgets and resource allocation</p>
          </div>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Budget
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalBudget.toLocaleString()}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <BarChart3 className="h-3 w-3" />
              All projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <CheckCircle className="h-3 w-3" />
              {((totalSpent / totalBudget) * 100).toFixed(1)}% used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <Package className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRemaining.toLocaleString()}</div>
            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
              <Activity className="h-3 w-3" />
              Available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Under Budget</CardTitle>
            <TrendingDown className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{underBudgetProjects}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <CheckCircle className="h-3 w-3" />
              Projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Filter */}
      <div className="flex items-center gap-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {uniqueProjects.map(project => (
              <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Budget Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Trends</CardTitle>
            <CardDescription>Planned vs Actual spending over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={budgetTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Line type="monotone" dataKey="planned" stroke="#8884d8" strokeWidth={2} name="Planned" />
                <Line type="monotone" dataKey="actual" stroke="#82ca9d" strokeWidth={2} name="Actual" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Budget by Category</CardTitle>
            <CardDescription>Distribution of budget across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Project Budgets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Project Budgets</CardTitle>
          <CardDescription>Detailed budget breakdown for all projects</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Total Budget</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{budget.name}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(budget.startDate).toLocaleDateString('en-US')} - {new Date(budget.endDate).toLocaleDateString('en-US')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      {budget.manager}
                    </div>
                  </TableCell>
                  <TableCell>₹{budget.totalBudget.toLocaleString()}</TableCell>
                  <TableCell>₹{budget.spent.toLocaleString()}</TableCell>
                  <TableCell>₹{budget.remaining.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="w-20">
                      <Progress value={(budget.spent / budget.totalBudget) * 100} className="h-2" />
                      <div className="text-xs text-center mt-1">
                        {((budget.spent / budget.totalBudget) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getBudgetStatusColor(budget.status)}>
                      <div className="flex items-center gap-1">
                        {getBudgetStatusIcon(budget.status)}
                        {budget.status.replace('-', ' ').charAt(0).toUpperCase() + budget.status.slice(1).replace('-', ' ')}
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

      {/* Budget Categories Breakdown */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBudgets.map((budget) => (
          <Card key={budget.id}>
            <CardHeader>
              <CardTitle className="text-lg">{budget.name}</CardTitle>
              <CardDescription>Budget breakdown by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {budget.categories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span>₹{category.spent.toLocaleString()}/₹{category.budget.toLocaleString()}</span>
                  </div>
                  <Progress value={(category.spent / category.budget) * 100} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{((category.spent / category.budget) * 100).toFixed(1)}% used</span>
                    <span>₹{category.remaining.toLocaleString()} remaining</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Budget Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>Set up a new project budget with categories</DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input id="projectName" placeholder="Enter project name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalBudget">Total Budget (₹)</Label>
                <Input id="totalBudget" type="number" placeholder="Enter total budget" required />
              </div>
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

            <div className="space-y-2">
              <Label>Budget Categories</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="Category name" />
                  <Input type="number" placeholder="Budget amount" />
                  <Button variant="outline" size="sm">Add</Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create Budget
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
