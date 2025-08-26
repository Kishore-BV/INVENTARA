"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { 
  Target, 
  Plus, 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  Home,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  TrendingUp,
  Activity,
  UserPlus
} from "lucide-react"
import Link from "next/link"

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  source: string
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost"
  value: number
  assignedTo: string
  createdDate: string
  lastContact: string
  notes: string
}

const leads: Lead[] = [
  {
    id: "lead1",
    name: "Innovation Corp",
    email: "hello@innovationcorp.com",
    phone: "+91 65432 10987",
    company: "Innovation Corp",
    source: "Website",
    status: "new",
    value: 75000,
    assignedTo: "Sarah Johnson",
    createdDate: "2024-01-15",
    lastContact: "2024-01-15",
    notes: "Interested in inventory management solution"
  },
  {
    id: "lead2",
    name: "Startup Ventures",
    email: "contact@startupventures.com",
    phone: "+91 54321 09876",
    company: "Startup Ventures",
    source: "Referral",
    status: "contacted",
    value: 55000,
    assignedTo: "Mike Wilson",
    createdDate: "2024-01-14",
    lastContact: "2024-01-14",
    notes: "Follow up scheduled for next week"
  },
  {
    id: "lead3",
    name: "Enterprise Solutions",
    email: "info@enterprisesolutions.com",
    phone: "+91 43210 98765",
    company: "Enterprise Solutions",
    source: "Social Media",
    status: "qualified",
    value: 120000,
    assignedTo: "Emily Davis",
    createdDate: "2024-01-13",
    lastContact: "2024-01-13",
    notes: "Ready for proposal presentation"
  },
  {
    id: "lead4",
    name: "Tech Startup",
    email: "hello@techstartup.com",
    phone: "+91 32109 87654",
    company: "Tech Startup",
    source: "Cold Call",
    status: "proposal",
    value: 85000,
    assignedTo: "Sarah Johnson",
    createdDate: "2024-01-12",
    lastContact: "2024-01-12",
    notes: "Proposal sent, awaiting response"
  },
  {
    id: "lead5",
    name: "Manufacturing Plus",
    email: "contact@manufacturingplus.com",
    phone: "+91 21098 76543",
    company: "Manufacturing Plus",
    source: "Website",
    status: "negotiation",
    value: 150000,
    assignedTo: "Mike Wilson",
    createdDate: "2024-01-11",
    lastContact: "2024-01-11",
    notes: "Price negotiation in progress"
  }
]

const getStatusColor = (status: Lead["status"]) => {
  switch (status) {
    case "new": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "contacted": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "qualified": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "proposal": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
    case "negotiation": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    case "won": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
    case "lost": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getStatusIcon = (status: Lead["status"]) => {
  switch (status) {
    case "new": return <Clock className="h-4 w-4" />
    case "contacted": return <Phone className="h-4 w-4" />
    case "qualified": return <CheckCircle className="h-4 w-4" />
    case "proposal": return <Mail className="h-4 w-4" />
    case "negotiation": return <TrendingUp className="h-4 w-4" />
    case "won": return <Star className="h-4 w-4" />
    case "lost": return <AlertTriangle className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

export function LeadsContent() {
  const [selectedStatus, setSelectedStatus] = useState<Lead["status"] | "all">("all")
  const [selectedSource, setSelectedSource] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const filteredLeads = leads.filter(lead => {
    if (selectedStatus !== "all" && lead.status !== selectedStatus) return false
    if (selectedSource !== "all" && lead.source !== selectedSource) return false
    if (searchQuery && !lead.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !lead.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !lead.company.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const totalLeads = leads.length
  const newLeads = leads.filter(l => l.status === "new").length
  const qualifiedLeads = leads.filter(l => l.status === "qualified").length
  const totalValue = leads.reduce((sum, l) => sum + l.value, 0)

  const uniqueSources = Array.from(new Set(leads.map(l => l.source)))

  const exportToCSV = () => {
    const headers = ["Name", "Company", "Email", "Phone", "Source", "Status", "Value", "Assigned To", "Created Date"]
    const csvContent = [
      headers.join(","),
      ...filteredLeads.map(lead => [
        lead.name,
        lead.company,
        lead.email,
        lead.phone,
        lead.source,
        lead.status,
        lead.value,
        lead.assignedTo,
        lead.createdDate
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const viewLeadDetails = (lead: Lead) => {
    setSelectedLead(lead)
    setIsViewDialogOpen(true)
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
            <h1 className="text-3xl font-bold">Lead Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Track and manage potential customers</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button className="bg-[#4B6587] hover:bg-[#3A5068]">
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Target className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <Activity className="h-3 w-3" />
              In pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Clock className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newLeads}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <Target className="h-3 w-3" />
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
            <CheckCircle className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualifiedLeads}</div>
            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
              <Star className="h-3 w-3" />
              Ready for proposal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalValue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              Pipeline value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 flex-wrap">
        <Select value={selectedStatus} onValueChange={(value: Lead["status"] | "all") => setSelectedStatus(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="proposal">Proposal</SelectItem>
            <SelectItem value="negotiation">Negotiation</SelectItem>
            <SelectItem value="won">Won</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSource} onValueChange={setSelectedSource}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {uniqueSources.map(source => (
              <SelectItem key={source} value={source}>{source}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Pipeline</CardTitle>
          <CardDescription>Track and manage leads through the sales funnel</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Target className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{lead.company}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-gray-500" />
                      <span className="text-sm">{lead.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{lead.source}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(lead.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(lead.status)}
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">₹{(lead.value / 1000).toFixed(0)}K</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{lead.assignedTo}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(lead.createdDate).toLocaleDateString('en-US')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewLeadDetails(lead)}
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

      {/* Lead Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>Comprehensive view of lead information and progress</DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Lead Name</Label>
                  <p className="font-medium">{selectedLead.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Company</Label>
                  <p className="font-medium">{selectedLead.company}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p>{selectedLead.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p>{selectedLead.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Source</Label>
                  <Badge variant="secondary">{selectedLead.source}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedLead.status)}>
                    {selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Value</Label>
                  <p className="font-medium text-lg">₹{(selectedLead.value / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Assigned To</Label>
                  <p>{selectedLead.assignedTo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created Date</Label>
                  <p>{new Date(selectedLead.createdDate).toLocaleDateString('en-US')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Contact</Label>
                  <p>{new Date(selectedLead.lastContact).toLocaleDateString('en-US')}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Notes</Label>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedLead.notes}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="flex-1">
                  Close
                </Button>
                <Button className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Lead
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
