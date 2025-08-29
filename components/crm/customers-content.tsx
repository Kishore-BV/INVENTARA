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
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Home,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  TrendingUp,
  Activity
} from "lucide-react"
import Link from "next/link"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: "active" | "inactive" | "prospect"
  value: number
  lastContact: string
  totalOrders: number
  location: string
  industry: string
  assignedTo: string
}

const customers: Customer[] = [
  {
    id: "cust1",
    name: "Tech Solutions Inc",
    email: "contact@techsolutions.com",
    phone: "+91 98765 43210",
    company: "Tech Solutions Inc",
    status: "active",
    value: 125000,
    lastContact: "2024-01-15",
    totalOrders: 15,
    location: "Bangalore, India",
    industry: "Technology",
    assignedTo: "Sarah Johnson"
  },
  {
    id: "cust2",
    name: "Global Manufacturing",
    email: "info@globalmfg.com",
    phone: "+91 87654 32109",
    company: "Global Manufacturing Ltd",
    status: "active",
    value: 89000,
    lastContact: "2024-01-14",
    totalOrders: 8,
    location: "Mumbai, India",
    industry: "Manufacturing",
    assignedTo: "Mike Wilson"
  },
  {
    id: "cust3",
    name: "Retail Chain Ltd",
    email: "sales@retailchain.com",
    phone: "+91 76543 21098",
    company: "Retail Chain Ltd",
    status: "prospect",
    value: 45000,
    lastContact: "2024-01-13",
    totalOrders: 3,
    location: "Delhi, India",
    industry: "Retail",
    assignedTo: "Emily Davis"
  },
  {
    id: "cust4",
    name: "Healthcare Systems",
    email: "admin@healthcare.com",
    phone: "+91 65432 10987",
    company: "Healthcare Systems Pvt Ltd",
    status: "active",
    value: 200000,
    lastContact: "2024-01-12",
    totalOrders: 22,
    location: "Chennai, India",
    industry: "Healthcare",
    assignedTo: "Sarah Johnson"
  },
  {
    id: "cust5",
    name: "Education First",
    email: "info@educationfirst.com",
    phone: "+91 54321 09876",
    company: "Education First Foundation",
    status: "inactive",
    value: 25000,
    lastContact: "2024-01-10",
    totalOrders: 2,
    location: "Pune, India",
    industry: "Education",
    assignedTo: "Mike Wilson"
  }
]

const getStatusColor = (status: Customer["status"]) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "inactive": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    case "prospect": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getStatusIcon = (status: Customer["status"]) => {
  switch (status) {
    case "active": return <CheckCircle className="h-4 w-4" />
    case "inactive": return <AlertTriangle className="h-4 w-4" />
    case "prospect": return <Star className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

export function CustomersContent() {
  const [customersState, setCustomersState] = useState<Customer[]>(customers)
  const [selectedStatus, setSelectedStatus] = useState<Customer["status"] | "all">("all")
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "id" | "totalOrders" | "lastContact"> & { lastContact?: string; totalOrders?: number}>(
    {
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "prospect",
      value: 0,
      location: "",
      industry: "",
      assignedTo: ""
    }
  )

  const filteredCustomers = customersState.filter(customer => {
    if (selectedStatus !== "all" && customer.status !== selectedStatus) return false
    if (selectedIndustry !== "all" && customer.industry !== selectedIndustry) return false
    if (searchQuery && !customer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !customer.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !customer.company.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const totalCustomers = customersState.length
  const activeCustomers = customersState.filter(c => c.status === "active").length
  const totalValue = customersState.reduce((sum, c) => sum + c.value, 0)
  const avgValue = totalValue / totalCustomers

  const uniqueIndustries = Array.from(new Set(customersState.map(c => c.industry)))

  const exportToCSV = () => {
    const headers = ["Name", "Company", "Email", "Phone", "Status", "Value", "Location", "Industry", "Assigned To"]
    const csvContent = [
      headers.join(","),
      ...filteredCustomers.map(customer => [
        customer.name,
        customer.company,
        customer.email,
        customer.phone,
        customer.status,
        customer.value,
        customer.location,
        customer.industry,
        customer.assignedTo
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const viewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsViewDialogOpen(true)
  }

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.company) return
    const customerToAdd: Customer = {
      id: `cust-${Date.now()}`,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      company: newCustomer.company,
      status: newCustomer.status,
      value: Number(newCustomer.value) || 0,
      lastContact: newCustomer.lastContact || new Date().toISOString().split('T')[0],
      totalOrders: newCustomer.totalOrders ?? 0,
      location: newCustomer.location,
      industry: newCustomer.industry,
      assignedTo: newCustomer.assignedTo
    }
    setCustomersState(prev => [customerToAdd, ...prev])
    setIsAddDialogOpen(false)
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "prospect",
      value: 0,
      location: "",
      industry: "",
      assignedTo: ""
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
            <h1 className="text-3xl font-bold">Customer Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage customer relationships and data</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button className="bg-[#4B6587] hover:bg-[#3A5068]" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              {activeCustomers} active
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
              <Activity className="h-3 w-3" />
              Customer portfolio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Customer Value</CardTitle>
            <Star className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(avgValue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
              <DollarSign className="h-3 w-3" />
              Per customer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <CheckCircle className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers}</div>
            <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
              <CheckCircle className="h-3 w-3" />
              Engaged customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 flex-wrap">
        <Select value={selectedStatus} onValueChange={(value: Customer["status"] | "all") => setSelectedStatus(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="prospect">Prospect</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {uniqueIndustries.map(industry => (
              <SelectItem key={industry} value={industry}>{industry}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
          <CardDescription>Manage and view all customer information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{customer.company}</div>
                    <div className="text-sm text-gray-500">{customer.industry}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-gray-500" />
                      <span className="text-sm">{customer.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(customer.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(customer.status)}
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">₹{(customer.value / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-gray-500">{customer.totalOrders} orders</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span className="text-sm">{customer.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{customer.assignedTo}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewCustomerDetails(customer)}
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

      {/* Customer Details Dialog */}
      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
            <DialogDescription>Enter customer details</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Company *</Label>
              <Input value={newCustomer.company} onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={newCustomer.phone} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={newCustomer.status}
                onChange={(e) => setNewCustomer({ ...newCustomer, status: e.target.value as Customer["status"] })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="prospect">Prospect</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input type="number" value={newCustomer.value} onChange={(e) => setNewCustomer({ ...newCustomer, value: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input value={newCustomer.industry} onChange={(e) => setNewCustomer({ ...newCustomer, industry: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={newCustomer.location} onChange={(e) => setNewCustomer({ ...newCustomer, location: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Assigned To</Label>
              <Input value={newCustomer.assignedTo} onChange={(e) => setNewCustomer({ ...newCustomer, assignedTo: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>Comprehensive view of customer information and history</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Customer Name</Label>
                  <p className="font-medium">{selectedCustomer.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Company</Label>
                  <p className="font-medium">{selectedCustomer.company}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p>{selectedCustomer.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p>{selectedCustomer.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedCustomer.status)}>
                    {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Industry</Label>
                  <p>{selectedCustomer.industry}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p>{selectedCustomer.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Assigned To</Label>
                  <p>{selectedCustomer.assignedTo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Value</Label>
                  <p className="font-medium text-lg">₹{(selectedCustomer.value / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Orders</Label>
                  <p className="font-medium">{selectedCustomer.totalOrders}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Contact</Label>
                  <p>{new Date(selectedCustomer.lastContact).toLocaleDateString('en-US')}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="flex-1">
                  Close
                </Button>
                <Button className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Customer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

