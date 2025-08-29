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
import { Home, Download, Package, CheckCircle, AlertTriangle, Eye, Search, Calendar, Building2, DollarSign, FileText, MapPin, Clock, Truck, Quality, Inventory } from "lucide-react"
import Link from "next/link"

interface ReceivedPurchaseOrder {
  id: string
  poNumber: string
  supplier: string
  supplierId: string
  orderDate: string
  receivedDate: string
  totalValue: number
  status: "received" | "quality_check" | "inventory_updated" | "completed"
  qualityStatus: "pending" | "passed" | "failed" | "partial"
  items: number
  receivedItems: number
  requester: string
  department: string
  receivedBy: string
  deliveryAddress: string
  notes?: string
  qualityIssues?: string[]
}

const sampleReceivedOrders: ReceivedPurchaseOrder[] = [
  {
    id: "PO-001",
    poNumber: "PO-2024-001",
    supplier: "TechCorp Solutions",
    supplierId: "SUP-001",
    orderDate: "2024-01-10",
    receivedDate: "2024-01-20",
    totalValue: 75000,
    status: "quality_check",
    qualityStatus: "pending",
    items: 3,
    receivedItems: 3,
    requester: "Sarah Johnson",
    department: "Engineering",
    receivedBy: "Warehouse Staff",
    deliveryAddress: "Warehouse A, Floor 2, Mumbai",
    notes: "All items received in good condition"
  },
  {
    id: "PO-002",
    poNumber: "PO-2024-002",
    supplier: "Global Industrial Supplies",
    supplierId: "SUP-002",
    orderDate: "2024-01-08",
    receivedDate: "2024-01-18",
    totalValue: 125000,
    status: "inventory_updated",
    qualityStatus: "passed",
    items: 5,
    receivedItems: 5,
    requester: "Mike Wilson",
    department: "Operations",
    receivedBy: "Warehouse Staff",
    deliveryAddress: "Main Warehouse, Delhi",
    notes: "Equipment received and tested"
  },
  {
    id: "PO-003",
    poNumber: "PO-2024-003",
    supplier: "Quality Materials Ltd",
    supplierId: "SUP-003",
    orderDate: "2024-01-05",
    receivedDate: "2024-01-15",
    totalValue: 45000,
    status: "completed",
    qualityStatus: "passed",
    items: 2,
    receivedItems: 2,
    requester: "Emily Davis",
    department: "Design",
    receivedBy: "Design Team",
    deliveryAddress: "Design Studio, Bangalore",
    notes: "Materials received and stored"
  },
  {
    id: "PO-004",
    poNumber: "PO-2024-004",
    supplier: "TechCorp Solutions",
    supplierId: "SUP-001",
    orderDate: "2024-01-03",
    receivedDate: "2024-01-18",
    totalValue: 95000,
    status: "quality_check",
    qualityStatus: "partial",
    items: 4,
    receivedItems: 3,
    requester: "David Brown",
    department: "IT",
    receivedBy: "IT Staff",
    deliveryAddress: "IT Department, Mumbai",
    notes: "1 item missing, quality check in progress",
    qualityIssues: ["Missing item: Network Switch", "Damaged packaging on 2 items"]
  },
  {
    id: "PO-005",
    poNumber: "PO-2024-005",
    supplier: "Global Industrial Supplies",
    supplierId: "SUP-002",
    orderDate: "2024-01-01",
    receivedDate: "2024-01-16",
    totalValue: 68000,
    status: "received",
    qualityStatus: "pending",
    items: 3,
    receivedItems: 3,
    requester: "Jennifer Martinez",
    department: "Quality Assurance",
    receivedBy: "QA Team",
    deliveryAddress: "QA Lab, Delhi",
    notes: "Testing equipment received, pending quality inspection"
  }
]

const getStatusColor = (status: ReceivedPurchaseOrder["status"]) => {
  switch (status) {
    case "received": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "quality_check": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "inventory_updated": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getStatusIcon = (status: ReceivedPurchaseOrder["status"]) => {
  switch (status) {
    case "received": return <Package className="h-4 w-4" />
    case "quality_check": return <Quality className="h-4 w-4" />
    case "inventory_updated": return <Inventory className="h-4 w-4" />
    case "completed": return <CheckCircle className="h-4 w-4" />
    default: return <Package className="h-4 w-4" />
  }
}

const getQualityStatusColor = (qualityStatus: ReceivedPurchaseOrder["qualityStatus"]) => {
  switch (qualityStatus) {
    case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "passed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "failed": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    case "partial": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

export function ReceivedPurchaseOrdersContent() {
  const [selectedStatus, setSelectedStatus] = useState<ReceivedPurchaseOrder["status"] | "all">("all")
  const [selectedQualityStatus, setSelectedQualityStatus] = useState<ReceivedPurchaseOrder["qualityStatus"] | "all">("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<ReceivedPurchaseOrder | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const filteredOrders = sampleReceivedOrders.filter(order => {
    if (selectedStatus !== "all" && order.status !== selectedStatus) return false
    if (selectedQualityStatus !== "all" && order.qualityStatus !== selectedQualityStatus) return false
    if (selectedDepartment !== "all" && order.department !== selectedDepartment) return false
    if (searchQuery && !order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !order.supplier.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !order.requester.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const totalReceivedValue = filteredOrders.reduce((sum, order) => sum + order.totalValue, 0)
  const totalReceivedOrders = filteredOrders.length
  const qualityCheckOrders = filteredOrders.filter(order => order.status === "quality_check").length
  const completedOrders = filteredOrders.filter(order => order.status === "completed").length

  const uniqueDepartments = Array.from(new Set(sampleReceivedOrders.map(order => order.department)))

  const exportToCSV = () => {
    const headers = ["PO Number", "Supplier", "Order Date", "Received Date", "Status", "Quality Status", "Total Value", "Items", "Received Items", "Requester", "Department", "Received By"]
    const csvContent = [
      headers.join(","),
      ...filteredOrders.map(order => [
        order.poNumber,
        order.supplier,
        order.orderDate,
        order.receivedDate,
        order.status,
        order.qualityStatus,
        order.totalValue,
        order.items,
        order.receivedItems,
        order.requester,
        order.department,
        order.receivedBy
      ].join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `received-purchase-orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const viewOrderDetails = (order: ReceivedPurchaseOrder) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }

  const startQualityCheck = (orderId: string) => {
    // Handle starting quality check
    console.log("Starting quality check for order:", orderId)
  }

  const updateInventory = (orderId: string) => {
    // Handle updating inventory
    console.log("Updating inventory for order:", orderId)
  }

  const markQualityPassed = (orderId: string) => {
    // Handle marking quality as passed
    console.log("Marking quality as passed for order:", orderId)
  }

  const markQualityFailed = (orderId: string) => {
    // Handle marking quality as failed
    console.log("Marking quality as failed for order:", orderId)
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
            <h1 className="text-3xl font-bold">Received Purchase Orders</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage received orders, quality control, and inventory updates</p>
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
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <Package className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReceivedOrders}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <Truck className="h-3 w-3" />
              Received orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalReceivedValue.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <Package className="h-3 w-3" />
              Received amount
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quality Check</CardTitle>
            <Quality className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualityCheckOrders}</div>
            <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" />
              Pending inspection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <CheckCircle className="h-3 w-3" />
              Fully processed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 flex-wrap">
        <Select value={selectedStatus} onValueChange={(value: ReceivedPurchaseOrder["status"] | "all") => setSelectedStatus(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="quality_check">Quality Check</SelectItem>
            <SelectItem value="inventory_updated">Inventory Updated</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedQualityStatus} onValueChange={(value: ReceivedPurchaseOrder["qualityStatus"] | "all") => setSelectedQualityStatus(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Quality</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="passed">Passed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
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

      {/* Received Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Received Purchase Orders</CardTitle>
          <CardDescription>Manage received orders through quality control and inventory updates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Received Date</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quality Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">{order.poNumber}</div>
                    <div className="text-sm text-gray-500">{order.receivedItems}/{order.items} received</div>
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
                      {new Date(order.receivedDate).toLocaleDateString('en-US')}
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
                    <Badge className={getQualityStatusColor(order.qualityStatus)}>
                      {order.qualityStatus.charAt(0).toUpperCase() + order.qualityStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">{order.receivedItems}</div>
                      <div className="text-sm text-gray-500">of {order.items}</div>
                    </div>
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
                      {order.status === "received" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startQualityCheck(order.id)}
                          title="Start Quality Check"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Quality className="h-4 w-4" />
                        </Button>
                      )}
                      {order.status === "quality_check" && order.qualityStatus === "passed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateInventory(order.id)}
                          title="Update Inventory"
                          className="text-green-600 hover:text-green-700"
                        >
                          <Inventory className="h-4 w-4" />
                        </Button>
                      )}
                      {order.status === "quality_check" && order.qualityStatus === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markQualityPassed(order.id)}
                            title="Mark Quality Passed"
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markQualityFailed(order.id)}
                            title="Mark Quality Failed"
                            className="text-red-600 hover:text-red-700"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
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
            <DialogTitle>Received Order Details</DialogTitle>
            <DialogDescription>Detailed view of the selected received purchase order</DialogDescription>
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
                  <Label className="text-sm font-medium">Received Date</Label>
                  <p>{new Date(selectedOrder.receivedDate).toLocaleDateString('en-US')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Quality Status</Label>
                  <Badge className={getQualityStatusColor(selectedOrder.qualityStatus)}>
                    {selectedOrder.qualityStatus.charAt(0).toUpperCase() + selectedOrder.qualityStatus.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Value</Label>
                  <p className="font-medium text-lg">₹{selectedOrder.totalValue.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Items</Label>
                  <p>{selectedOrder.receivedItems} of {selectedOrder.items} received</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Received By</Label>
                  <p>{selectedOrder.receivedBy}</p>
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

              {/* Delivery Information */}
              <div>
                <Label className="text-sm font-medium">Delivery Address</Label>
                <p className="text-gray-600 dark:text-gray-400">{selectedOrder.deliveryAddress}</p>
              </div>

              {/* Quality Issues */}
              {selectedOrder.qualityIssues && selectedOrder.qualityIssues.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Quality Issues</Label>
                  <div className="space-y-2">
                    {selectedOrder.qualityIssues.map((issue, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-gray-600 dark:text-gray-400">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                {selectedOrder.status === "received" && (
                  <Button
                    onClick={() => startQualityCheck(selectedOrder.id)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Quality className="h-4 w-4" />
                    Start Quality Check
                  </Button>
                )}
                {selectedOrder.status === "quality_check" && selectedOrder.qualityStatus === "pending" && (
                  <>
                    <Button
                      onClick={() => markQualityPassed(selectedOrder.id)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark Quality Passed
                    </Button>
                    <Button
                      onClick={() => markQualityFailed(selectedOrder.id)}
                      variant="outline"
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Mark Quality Failed
                    </Button>
                  </>
                )}
                {selectedOrder.status === "quality_check" && selectedOrder.qualityStatus === "passed" && (
                  <Button
                    onClick={() => updateInventory(selectedOrder.id)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Inventory className="h-4 w-4" />
                    Update Inventory
                  </Button>
                )}
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





