"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  FileText,
  Scan,
  Download,
  Upload,
  PackageOpen,
  ClipboardList,
  Send,
  MapPin,
  ShoppingCart,
  Users
} from "lucide-react"

// Mock interfaces for the demo
interface OutwardShipment {
  id: string
  shipmentNumber: string
  salesOrderId?: string
  customerId: string
  customerName: string
  shipmentDate: Date
  expectedDeliveryDate?: Date
  warehouseId: string
  warehouseName: string
  packedBy: string
  shippedBy?: string
  status: 'draft' | 'picking' | 'picked' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
  items: OutwardItem[]
  totalValue: number
  currency: string
  shippingMethod: 'pickup' | 'standard' | 'express' | 'overnight'
  trackingNumber?: string
  carrier?: string
  shippingCost?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

interface OutwardItem {
  id: string
  productId: string
  productName: string
  requestedQuantity: number
  pickedQuantity: number
  shippedQuantity: number
  unitPrice: number
  totalValue: number
  batchNumber?: string
  serialNumbers: string[]
  pickingLocation?: string
  pickedBy?: string
  packingNotes?: string
}

interface OutwardManagementProps {
  className?: string
}

export function OutwardManagement({ className }: OutwardManagementProps) {
  const [outwardShipments, setOutwardShipments] = useState<OutwardShipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState("shipments")

  // Mock data
  const mockOutwardShipments: OutwardShipment[] = [
    {
      id: "out_1",
      shipmentNumber: "OUT/001/2024",
      salesOrderId: "SO001",
      customerId: "cus1",
      customerName: "Tech Corp Inc.",
      shipmentDate: new Date(),
      expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      warehouseId: "wh1",
      warehouseName: "Main Warehouse",
      packedBy: "John Doe",
      shippedBy: "Express Logistics",
      status: "shipped",
      items: [
        {
          id: "item1",
          productId: "p1",
          productName: "MacBook Pro 16-inch",
          requestedQuantity: 5,
          pickedQuantity: 5,
          shippedQuantity: 5,
          unitPrice: 2499.99,
          totalValue: 12499.95,
          batchNumber: "BATCH001",
          serialNumbers: ["SN001", "SN002", "SN003", "SN004", "SN005"],
          pickingLocation: "A1-B2-C3",
          pickedBy: "Picker 1",
          packingNotes: "Handle with care - fragile items"
        }
      ],
      totalValue: 12499.95,
      currency: "USD",
      shippingMethod: "express",
      trackingNumber: "EXP123456789",
      carrier: "Express Logistics",
      shippingCost: 50.00,
      notes: "Rush order - customer requested express delivery",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "out_2",
      shipmentNumber: "OUT/002/2024",
      customerId: "cus2",
      customerName: "Digital Solutions Ltd",
      shipmentDate: new Date(),
      warehouseId: "wh1",
      warehouseName: "Main Warehouse",
      packedBy: "Jane Smith",
      status: "picking",
      items: [
        {
          id: "item2",
          productId: "p2",
          productName: "Dell XPS 13",
          requestedQuantity: 3,
          pickedQuantity: 0,
          shippedQuantity: 0,
          unitPrice: 1299.99,
          totalValue: 3899.97,
          serialNumbers: [],
          pickingLocation: "A1-B3-C1"
        }
      ],
      totalValue: 3899.97,
      currency: "USD",
      shippingMethod: "standard",
      shippingCost: 25.00,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const [formData, setFormData] = useState({
    customerName: "",
    salesOrderId: "",
    expectedDeliveryDate: "",
    warehouseName: "Main Warehouse",
    shippingMethod: "standard" as const,
    notes: "",
    items: [
      {
        productName: "",
        requestedQuantity: 0,
        unitPrice: 0,
      }
    ]
  })

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOutwardShipments(mockOutwardShipments)
      setLoading(false)
    }, 1000)
  }, [])

  const handleCreateShipment = () => {
    // This would normally call an API
    const newShipment: OutwardShipment = {
      id: `out_${Date.now()}`,
      shipmentNumber: `OUT/${String(outwardShipments.length + 1).padStart(3, '0')}/2024`,
      customerId: "cus_new",
      customerName: formData.customerName,
      shipmentDate: new Date(),
      expectedDeliveryDate: formData.expectedDeliveryDate ? new Date(formData.expectedDeliveryDate) : undefined,
      warehouseId: "wh1",
      warehouseName: formData.warehouseName,
      packedBy: "Current User",
      status: "draft",
      items: formData.items.map((item, index) => ({
        id: `item_${Date.now()}_${index}`,
        productId: `p_${Date.now()}_${index}`,
        productName: item.productName,
        requestedQuantity: item.requestedQuantity,
        pickedQuantity: 0,
        shippedQuantity: 0,
        unitPrice: item.unitPrice,
        totalValue: item.requestedQuantity * item.unitPrice,
        serialNumbers: []
      })),
      totalValue: formData.items.reduce((sum, item) => sum + (item.requestedQuantity * item.unitPrice), 0),
      currency: "USD",
      shippingMethod: formData.shippingMethod,
      shippingCost: formData.shippingMethod === 'express' ? 50 : formData.shippingMethod === 'overnight' ? 100 : 25,
      notes: formData.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setOutwardShipments([newShipment, ...outwardShipments])
    setFormData({
      customerName: "",
      salesOrderId: "",
      expectedDeliveryDate: "",
      warehouseName: "Main Warehouse",
      shippingMethod: "standard",
      notes: "",
      items: [
        {
          productName: "",
          requestedQuantity: 0,
          unitPrice: 0,
        }
      ]
    })
    setIsCreateDialogOpen(false)
  }

  const filteredShipments = outwardShipments.filter(shipment => {
    const matchesSearch = (
      shipment.shipmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shipment.trackingNumber && shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    const matchesStatus = selectedStatus === "all" || shipment.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'picking':
        return 'bg-blue-100 text-blue-800'
      case 'picked':
        return 'bg-yellow-100 text-yellow-800'
      case 'packed':
        return 'bg-purple-100 text-purple-800'
      case 'shipped':
        return 'bg-green-100 text-green-800'
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getShippingMethodBadge = (method: string) => {
    switch (method) {
      case 'pickup':
        return 'bg-gray-100 text-gray-800'
      case 'standard':
        return 'bg-blue-100 text-blue-800'
      case 'express':
        return 'bg-orange-100 text-orange-800'
      case 'overnight':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Outward Management</h1>
          <p className="text-muted-foreground">
            Manage outgoing inventory, picking, packing, and shipping
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Scan className="mr-2 h-4 w-4" />
            Scan Shipment
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import Orders
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Shipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Outward Shipment</DialogTitle>
                <DialogDescription>
                  Create new shipment for outgoing inventory to customers
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salesOrderId">Sales Order ID</Label>
                    <Input
                      id="salesOrderId"
                      value={formData.salesOrderId}
                      onChange={(e) => setFormData({ ...formData, salesOrderId: e.target.value })}
                      placeholder="Link to sales order"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expectedDeliveryDate">Expected Delivery</Label>
                    <Input
                      id="expectedDeliveryDate"
                      type="date"
                      value={formData.expectedDeliveryDate}
                      onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warehouseName">Warehouse</Label>
                    <Select value={formData.warehouseName} onValueChange={(value) => setFormData({ ...formData, warehouseName: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                        <SelectItem value="Secondary Warehouse">Secondary Warehouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingMethod">Shipping Method</Label>
                    <Select value={formData.shippingMethod} onValueChange={(value: any) => setFormData({ ...formData, shippingMethod: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pickup">Customer Pickup</SelectItem>
                        <SelectItem value="standard">Standard Shipping</SelectItem>
                        <SelectItem value="express">Express Shipping</SelectItem>
                        <SelectItem value="overnight">Overnight Shipping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Items to Ship</Label>
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded">
                      <div className="space-y-2">
                        <Label>Product Name</Label>
                        <Input
                          value={item.productName}
                          onChange={(e) => {
                            const newItems = [...formData.items]
                            newItems[index].productName = e.target.value
                            setFormData({ ...formData, items: newItems })
                          }}
                          placeholder="Product name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={item.requestedQuantity}
                          onChange={(e) => {
                            const newItems = [...formData.items]
                            newItems[index].requestedQuantity = parseInt(e.target.value) || 0
                            setFormData({ ...formData, items: newItems })
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => {
                            const newItems = [...formData.items]
                            newItems[index].unitPrice = parseFloat(e.target.value) || 0
                            setFormData({ ...formData, items: newItems })
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Total</Label>
                        <Input
                          value={formatCurrency(item.requestedQuantity * item.unitPrice)}
                          disabled
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({
                      ...formData,
                      items: [...formData.items, { productName: "", requestedQuantity: 0, unitPrice: 0 }]
                    })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Shipping Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Special delivery instructions..."
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateShipment}>
                  Create Shipment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outwardShipments.length}</div>
            <div className="text-xs text-muted-foreground">
              This month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Pickup</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {outwardShipments.filter(s => s.status === 'picking' || s.status === 'draft').length}
            </div>
            <div className="text-xs text-muted-foreground">
              Awaiting picking
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped Today</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {outwardShipments.filter(s => s.status === 'shipped' || s.status === 'delivered').length}
            </div>
            <div className="text-xs text-muted-foreground">
              Out for delivery
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(outwardShipments.reduce((sum, s) => sum + s.totalValue, 0))}
            </div>
            <div className="text-xs text-muted-foreground">
              This month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="shipments">Outward Shipments</TabsTrigger>
          <TabsTrigger value="picking">Picking Lists</TabsTrigger>
          <TabsTrigger value="shipping">Shipping Dock</TabsTrigger>
        </TabsList>

        <TabsContent value="shipments" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search shipments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="picking">Picking</SelectItem>
                    <SelectItem value="picked">Picked</SelectItem>
                    <SelectItem value="packed">Packed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shipments Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="mr-2 h-5 w-5" />
                Outward Shipments ({filteredShipments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shipment #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Shipping</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tracking</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{shipment.shipmentNumber}</p>
                          {shipment.salesOrderId && (
                            <p className="text-sm text-muted-foreground">SO: {shipment.salesOrderId}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{shipment.customerName}</TableCell>
                      <TableCell>{formatDate(shipment.shipmentDate)}</TableCell>
                      <TableCell>
                        <Badge className={getShippingMethodBadge(shipment.shippingMethod)} variant="secondary">
                          {shipment.shippingMethod}
                        </Badge>
                      </TableCell>
                      <TableCell>{shipment.items.length} items</TableCell>
                      <TableCell>{formatCurrency(shipment.totalValue)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(shipment.status)} variant="secondary">
                          {shipment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {shipment.trackingNumber ? (
                          <span className="text-sm font-mono">{shipment.trackingNumber}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Shipment
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ClipboardList className="mr-2 h-4 w-4" />
                              Generate Pick List
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <MapPin className="mr-2 h-4 w-4" />
                              Track Shipment
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Print Label
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="picking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Picking Lists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Picking list management coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Dock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Shipping dock management coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
