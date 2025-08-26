'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Home, Clock, CheckCircle, XCircle, Eye, Download, Filter, Search, AlertTriangle, Calendar, Building2, Package, DollarSign, Hash } from "lucide-react"
import Link from "next/link"

interface PendingPurchaseOrder {
  id: string
  poNumber: string
  supplier: string
  supplierId: string
  orderDate: string
  expectedDelivery: string
  totalValue: number
  status: "pending" | "under_review" | "requires_approval"
  priority: "low" | "medium" | "high" | "urgent"
  items: number
  requester: string
  department: string
  notes?: string
}

const samplePendingOrders: PendingPurchaseOrder[] = [
  {
    id: "PO-001",
    poNumber: "PO-2024-001",
    supplier: "TechCorp Solutions",
    supplierId: "SUP-001",
    orderDate: "2024-01-15",
    expectedDelivery: "2024-01-25",
    totalValue: 75000,
    status: "pending",
    priority: "high",
    items: 3,
    requester: "Sarah Johnson",
    department: "Engineering",
    notes: "Urgent order for warehouse automation project"
  },
  {
    id: "PO-002",
    poNumber: "PO-2024-002",
    supplier: "Global Industrial Supplies",
    supplierId: "SUP-002",
    orderDate: "2024-01-14",
    expectedDelivery: "2024-01-30",
    totalValue: 125000,
    status: "under_review",
    priority: "medium",
    items: 5,
    requester: "Mike Wilson",
    department: "Operations",
    notes: "Regular maintenance supplies"
  },
  {
    id: "PO-003",
    poNumber: "PO-2024-003",
    supplier: "Quality Materials Ltd",
    supplierId: "SUP-003",
    orderDate: "2024-01-13",
    expectedDelivery: "2024-01-28",
    totalValue: 45000,
    status: "requires_approval",
    priority: "low",
    items: 2,
    requester: "Emily Davis",
    department: "Design",
    notes: "Raw materials for new product line"
  },
  {
    id: "PO-004",
    poNumber: "PO-2024-004",
    supplier: "TechCorp Solutions",
    supplierId: "SUP-001",
    orderDate: "2024-01-12",
    expectedDelivery: "2024-01-22",
    totalValue: 95000,
    status: "pending",
    priority: "urgent",
    items: 4,
    requester: "David Brown",
    department: "IT",
    notes: "Critical infrastructure upgrade"
  },
  {
    id: "PO-005",
    poNumber: "PO-2024-005",
    supplier: "Global Industrial Supplies",
    supplierId: "SUP-002",
    orderDate: "2024-01-11",
    expectedDelivery: "2024-01-26",
    totalValue: 68000,
    status: "under_review",
    priority: "medium",
    items: 3,
    requester: "Jennifer Martinez",
    department: "Quality Assurance",
    notes: "Testing equipment replacement"
  }
]

const getStatusColor = (status: PendingPurchaseOrder["status"]) => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "under_review": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "requires_approval": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getStatusIcon = (status: PendingPurchaseOrder["status"]) => {
  switch (status) {
    case "pending": return <Clock className="h-4 w-4" />
    case "under_review": return <Eye className="h-4 w-4" />
    case "requires_approval": return <AlertTriangle className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

const getPriorityColor = (priority: PendingPurchaseOrder["priority"]) => {
  switch (priority) {
    case "low": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    case "medium": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    case "urgent": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

export function PendingPurchaseOrdersContent() {
  const [selectedStatus, setSelectedStatus] = useState<PendingPurchaseOrder["status"] | "all">("all")
  const [selectedPriority, setSelectedPriority] = useState<PendingPurchaseOrder["priority"] | "all">("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<PendingPurchaseOrder | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const filteredOrders = samplePendingOrders.filter(order => {
    if (selectedStatus !== "all" && order.status !== selectedStatus) return false
    if (selectedPriority !== "all" && order.priority !== selectedPriority) return false
    if (selectedDepartment !== "all" && order.department !== selectedDepartment) return false
    if (searchQuery && !order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !order.supplier.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !order.requester.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const totalPendingValue = filteredOrders.reduce((sum, order) => sum + order.totalValue, 0)
  const totalPendingOrders = filteredOrders.length
  const urgentOrders = filteredOrders.filter(order => order.priority === "urgent").length
  const highPriorityOrders = filteredOrders.filter(order => order.priority === "high").length

  const uniqueDepartments = Array.from(new Set(samplePendingOrders.map(order => order.department)))

  const exportToCSV = () => {
    const headers = ["PO Number", "Supplier", "Order Date", "Expected Delivery", "Total Value", "Status", "Priority", "Requester", "Department"]
    const csvContent = [
      headers.join(","),
      ...filteredOrders.map(order => [
        order.poNumber,
        order.supplier,
        order.orderDate,
        order.expectedDelivery,
        order.totalValue,
        order.status,
        order.priority,
        order.requester,
        order.department
      ].join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pending-purchase-orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const approveOrder = (orderId: string) => {
    // Handle order approval
    console.log("Approving order:", orderId)
  }

  const rejectOrder = (orderId: string) => {
    // Handle order rejection
    console.log("Rejecting order:", orderId)
  }

  const viewOrderDetails = (order: PendingPurchaseOrder) => {
    setSelectedOrder(order)
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
            <h1 className="text-3xl font-bold">Pending Purchase Orders</h1>
            <p className="text-gray-600 dark:text-gray-400">Review and approve pending purchase orders</p>
          </div>
        </div>
        <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <Clock className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPendingOrders}</div>
            <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
              <AlertTriangle className="h-3 w-3" />
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPendingValue.toLocaleString()}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <Package className="h-3 w-3" />
              Pending amount
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Urgent Orders</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgentOrders}</div>
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" />
              Need immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityOrders}</div>
            <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" />
              Review required
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 flex-wrap">
        <Select value={selectedStatus} onValueChange={(value: PendingPurchaseOrder["status"] | "all") => setSelectedStatus(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="requires_approval">Requires Approval</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedPriority} onValueChange={(value: PendingPurchaseOrder["priority"] | "all") => setSelectedPriority(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>

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

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search PO number, supplier, or requester..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Pending Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Purchase Orders</CardTitle>
          <CardDescription>Review and manage pending purchase orders requiring approval</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Delivery</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">{order.poNumber}</div>
                    <div className="text-sm text-gray-500">{order.items} items</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.supplier}</div>
                      <div className="text-sm text-gray-500">{order.department}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      {new Date(order.orderDate).toLocaleDateString('en-US')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      {new Date(order.expectedDelivery).toLocaleDateString('en-US')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">₹{order.totalValue.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.replace('_', ' ').slice(1)}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(order.priority)}>
                      {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.requester}</div>
                      <div className="text-sm text-gray-500">{order.department}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewOrderDetails(order)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => approveOrder(order.id)}
                        className="text-green-600 hover:text-green-700"
                        title="Approve Order"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => rejectOrder(order.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Reject Order"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Purchase Order Details</DialogTitle>
            <DialogDescription>Detailed view of the selected purchase order</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">PO Number</Label>
                  <p className="font-medium">{selectedOrder.poNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status.replace('_', ' ').charAt(0).toUpperCase() + selectedOrder.status.replace('_', ' ').slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Order Date</Label>
                  <p>{new Date(selectedOrder.orderDate).toLocaleDateString('en-US')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Expected Delivery</Label>
                  <p>{new Date(selectedOrder.expectedDelivery).toLocaleDateString('en-US')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <Badge className={getPriorityColor(selectedOrder.priority)}>
                    {selectedOrder.priority.charAt(0).toUpperCase() + selectedOrder.priority.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Value</Label>
                  <p className="font-medium text-lg">₹{selectedOrder.totalValue.toLocaleString()}</p>
                </div>
              </div>

              {/* Supplier Information */}
              <div>
                <Label className="text-sm font-medium">Supplier</Label>
                <p className="font-medium">{selectedOrder.supplier}</p>
              </div>

              {/* Requester Information */}
              <div>
                <Label className="text-sm font-medium">Requester</Label>
                <p>{selectedOrder.requester} - {selectedOrder.department}</p>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-gray-600 dark:text-gray-400">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => approveOrder(selectedOrder.id)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve Order
                </Button>
                <Button
                  onClick={() => rejectOrder(selectedOrder.id)}
                  variant="outline"
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <XCircle className="h-4 w-4" />
                  Reject Order
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
