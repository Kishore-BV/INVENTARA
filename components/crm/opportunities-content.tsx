"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  Plus, 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Calendar, 
  DollarSign, 
  Home,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Activity,
  Target,
  Users
} from "lucide-react"
import Link from "next/link"

interface Opportunity {
  id: string
  name: string
  customer: string
  value: number
  stage: "prospecting" | "qualification" | "proposal" | "negotiation" | "closed_won" | "closed_lost"
  probability: number
  expectedCloseDate: string
  assignedTo: string
  source: string
  description: string
  lastActivity: string
}

const opportunities: Opportunity[] = [
  {
    id: "opp1",
    name: "Enterprise Inventory System",
    customer: "Tech Solutions Inc",
    value: 250000,
    stage: "negotiation",
    probability: 75,
    expectedCloseDate: "2024-02-15",
    assignedTo: "Sarah Johnson",
    source: "Website",
    description: "Complete inventory management solution for enterprise client",
    lastActivity: "2024-01-15"
  },
  {
    id: "opp2",
    name: "Manufacturing Automation",
    customer: "Global Manufacturing",
    value: 180000,
    stage: "proposal",
    probability: 60,
    expectedCloseDate: "2024-02-28",
    assignedTo: "Mike Wilson",
    source: "Referral",
    description: "Automated inventory tracking for manufacturing facility",
    lastActivity: "2024-01-14"
  },
  {
    id: "opp3",
    name: "Retail Chain Integration",
    customer: "Retail Chain Ltd",
    value: 120000,
    stage: "qualification",
    probability: 40,
    expectedCloseDate: "2024-03-15",
    assignedTo: "Emily Davis",
    source: "Cold Call",
    description: "Multi-location inventory management for retail chain",
    lastActivity: "2024-01-13"
  },
  {
    id: "opp4",
    name: "Healthcare Inventory System",
    customer: "Healthcare Systems",
    value: 300000,
    stage: "closed_won",
    probability: 100,
    expectedCloseDate: "2024-01-20",
    assignedTo: "Sarah Johnson",
    source: "Website",
    description: "Specialized inventory management for healthcare facilities",
    lastActivity: "2024-01-12"
  },
  {
    id: "opp5",
    name: "Education Platform",
    customer: "Education First",
    value: 80000,
    stage: "prospecting",
    probability: 20,
    expectedCloseDate: "2024-04-15",
    assignedTo: "Mike Wilson",
    source: "Social Media",
    description: "Inventory management for educational institutions",
    lastActivity: "2024-01-11"
  }
]

const getStageColor = (stage: Opportunity["stage"]) => {
  switch (stage) {
    case "prospecting": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    case "qualification": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "proposal": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
    case "negotiation": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    case "closed_won": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "closed_lost": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getStageIcon = (stage: Opportunity["stage"]) => {
  switch (stage) {
    case "prospecting": return <Target className="h-4 w-4" />
    case "qualification": return <Users className="h-4 w-4" />
    case "proposal": return <Edit className="h-4 w-4" />
    case "negotiation": return <TrendingUp className="h-4 w-4" />
    case "closed_won": return <CheckCircle className="h-4 w-4" />
    case "closed_lost": return <AlertTriangle className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

export function OpportunitiesContent() {
  const [oppsState, setOppsState] = useState<Opportunity[]>(opportunities)
  const [selectedStage, setSelectedStage] = useState<Opportunity["stage"] | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newOpp, setNewOpp] = useState<Omit<Opportunity, "id" | "lastActivity"> & { lastActivity?: string}>(
    {
      name: "",
      customer: "",
      value: 0,
      stage: "prospecting",
      probability: 10,
      expectedCloseDate: new Date().toISOString().split('T')[0],
      assignedTo: "",
      source: "Website",
      description: ""
    }
  )

  const filteredOpportunities = oppsState.filter(opportunity => {
    if (selectedStage !== "all" && opportunity.stage !== selectedStage) return false
    if (searchQuery && !opportunity.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !opportunity.customer.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const totalOpportunities = oppsState.length
  const totalValue = oppsState.reduce((sum, o) => sum + o.value, 0)
  const wonOpportunities = oppsState.filter(o => o.stage === "closed_won").length
  const avgProbability = oppsState.length ? (oppsState.reduce((sum, o) => sum + o.probability, 0) / oppsState.length) : 0

  const exportToCSV = () => {
    const headers = ["Name", "Customer", "Value", "Stage", "Probability", "Expected Close Date", "Assigned To"]
    const csvContent = [
      headers.join(","),
      ...filteredOpportunities.map(opportunity => [
        opportunity.name,
        opportunity.customer,
        opportunity.value,
        opportunity.stage,
        opportunity.probability,
        opportunity.expectedCloseDate,
        opportunity.assignedTo
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `opportunities-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const viewOpportunityDetails = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity)
    setIsViewDialogOpen(true)
  }

  const handleAddOpportunity = () => {
    if (!newOpp.name || !newOpp.customer) return
    const oppToAdd: Opportunity = {
      id: `opp-${Date.now()}`,
      name: newOpp.name,
      customer: newOpp.customer,
      value: Number(newOpp.value) || 0,
      stage: newOpp.stage,
      probability: Number(newOpp.probability) || 0,
      expectedCloseDate: newOpp.expectedCloseDate,
      assignedTo: newOpp.assignedTo,
      source: newOpp.source,
      description: newOpp.description,
      lastActivity: newOpp.lastActivity || new Date().toISOString().split('T')[0]
    }
    setOppsState(prev => [oppToAdd, ...prev])
    setIsAddDialogOpen(false)
    setNewOpp({
      name: "",
      customer: "",
      value: 0,
      stage: "prospecting",
      probability: 10,
      expectedCloseDate: new Date().toISOString().split('T')[0],
      assignedTo: "",
      source: "Website",
      description: ""
    })
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
            <h1 className="text-3xl font-bold">Sales Opportunities</h1>
            <p className="text-gray-600 dark:text-gray-400">Track sales opportunities and deals</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button className="bg-[#4B6587] hover:bg-[#3A5068]" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Opportunity
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOpportunities}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <Activity className="h-3 w-3" />
              In pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalValue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              Pipeline value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Won Deals</CardTitle>
            <CheckCircle className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wonOpportunities}</div>
            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
              <Star className="h-3 w-3" />
              Closed successfully
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Probability</CardTitle>
            <Target className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProbability.toFixed(0)}%</div>
            <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
              <Target className="h-3 w-3" />
              Success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 flex-wrap">
        <Select value={selectedStage} onValueChange={(value: Opportunity["stage"] | "all") => setSelectedStage(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="prospecting">Prospecting</SelectItem>
            <SelectItem value="qualification">Qualification</SelectItem>
            <SelectItem value="proposal">Proposal</SelectItem>
            <SelectItem value="negotiation">Negotiation</SelectItem>
            <SelectItem value="closed_won">Closed Won</SelectItem>
            <SelectItem value="closed_lost">Closed Lost</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Opportunities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Pipeline</CardTitle>
          <CardDescription>Track and manage sales opportunities through the pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opportunity</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Expected Close</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpportunities.map((opportunity) => (
                <TableRow key={opportunity.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{opportunity.name}</div>
                        <div className="text-sm text-gray-500">{opportunity.source}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{opportunity.customer}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">₹{(opportunity.value / 1000).toFixed(0)}K</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStageColor(opportunity.stage)}>
                      <div className="flex items-center gap-1">
                        {getStageIcon(opportunity.stage)}
                        {opportunity.stage.replace('_', ' ').charAt(0).toUpperCase() + opportunity.stage.replace('_', ' ').slice(1)}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={opportunity.probability} className="w-16 h-2" />
                      <span className="text-sm font-medium">{opportunity.probability}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(opportunity.expectedCloseDate).toLocaleDateString('en-US')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{opportunity.assignedTo}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewOpportunityDetails(opportunity)}
                      >
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

      {/* Opportunity Details Dialog */}
      {/* Add Opportunity Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Opportunity</DialogTitle>
            <DialogDescription>Enter opportunity details</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Opportunity Name *</Label>
              <Input value={newOpp.name} onChange={(e) => setNewOpp({ ...newOpp, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Customer *</Label>
              <Input value={newOpp.customer} onChange={(e) => setNewOpp({ ...newOpp, customer: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input type="number" value={newOpp.value} onChange={(e) => setNewOpp({ ...newOpp, value: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Stage</Label>
              <select className="w-full px-3 py-2 border rounded-md" value={newOpp.stage} onChange={(e) => setNewOpp({ ...newOpp, stage: e.target.value as Opportunity["stage"] })}>
                <option value="prospecting">Prospecting</option>
                <option value="qualification">Qualification</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed_won">Closed Won</option>
                <option value="closed_lost">Closed Lost</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Probability (%)</Label>
              <Input type="number" value={newOpp.probability} onChange={(e) => setNewOpp({ ...newOpp, probability: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Expected Close</Label>
              <Input type="date" value={newOpp.expectedCloseDate} onChange={(e) => setNewOpp({ ...newOpp, expectedCloseDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Assigned To</Label>
              <Input value={newOpp.assignedTo} onChange={(e) => setNewOpp({ ...newOpp, assignedTo: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Source</Label>
              <Input value={newOpp.source} onChange={(e) => setNewOpp({ ...newOpp, source: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Input value={newOpp.description} onChange={(e) => setNewOpp({ ...newOpp, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddOpportunity}>Add Opportunity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Opportunity Details</DialogTitle>
            <DialogDescription>Comprehensive view of opportunity information and progress</DialogDescription>
          </DialogHeader>
          {selectedOpportunity && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Opportunity Name</Label>
                  <p className="font-medium">{selectedOpportunity.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p className="font-medium">{selectedOpportunity.customer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Value</Label>
                  <p className="font-medium text-lg">₹{(selectedOpportunity.value / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Stage</Label>
                  <Badge className={getStageColor(selectedOpportunity.stage)}>
                    {selectedOpportunity.stage.replace('_', ' ').charAt(0).toUpperCase() + selectedOpportunity.stage.replace('_', ' ').slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Probability</Label>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedOpportunity.probability} className="w-24 h-2" />
                    <span className="font-medium">{selectedOpportunity.probability}%</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Expected Close Date</Label>
                  <p>{new Date(selectedOpportunity.expectedCloseDate).toLocaleDateString('en-US')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Assigned To</Label>
                  <p>{selectedOpportunity.assignedTo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Source</Label>
                  <p>{selectedOpportunity.source}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Activity</Label>
                  <p>{new Date(selectedOpportunity.lastActivity).toLocaleDateString('en-US')}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedOpportunity.description}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="flex-1">
                  Close
                </Button>
                <Button className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Opportunity
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

