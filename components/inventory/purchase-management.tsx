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
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Send,
  Check,
  X,
  ShoppingCart,
  Building2,
  Calendar,
  DollarSign,
  Package,
  Truck,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2
} from "lucide-react"
import { PurchaseOrder, PurchaseOrderLine, Supplier } from "@/lib/inventory-types"

interface PurchaseManagementProps {
  className?: string
}

export function PurchaseManagement({ className }: PurchaseManagementProps) {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("orders")
  const [isCreatePOOpen, setIsCreatePOOpen] = useState(false)
  const [isCreateSupplierOpen, setIsCreateSupplierOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data
  const mockSuppliers: Supplier[] = [
    {
      id: "sup1",
      name: "Apple Inc.",
      displayName: "Apple Inc.",
      email: "orders@apple.com",
      phone: "+1-800-275-2273",
      website: "apple.com",
      isCompany: true,
      isVendor: true,
      isCustomer: false,
      address: {
        street: "One Apple Park Way",
        city: "Cupertino",
        state: "CA",
        zip: "95014",
        country: "USA"
      },
      currency: "USD",
      paymentTerms: "Net 30",
      creditLimit: 1000000,
      isActive: true,
      supplierRank: 1,
      customerRank: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "sup2",
      name: "Dell Technologies",
      displayName: "Dell Technologies",
      email: "purchasing@dell.com",
      phone: "+1-800-915-3355",
      isCompany: true,
      isVendor: true,
      isCustomer: false,
      address: {
        street: "One Dell Way",
        city: "Round Rock",
        state: "TX",
        zip: "78682",
        country: "USA"
      },
      currency: "USD",
      paymentTerms: "Net 45",
      creditLimit: 500000,
      isActive: true,
      supplierRank: 1,
      customerRank: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const mockPurchaseOrders: PurchaseOrder[] = [
    {
      id: "po1",
      name: "PO001",
      supplier: mockSuppliers[0],
      orderDate: new Date(),
      expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      currency: "USD",
      state: "purchase",
      totalAmount: 24999.90,
      notes: "Urgent order for new MacBook Pro models",
      orderLines: [
        {
          id: "pol1",
          product: {
            id: "p1",
            name: "MacBook Pro 16-inch",
            internalReference: "MBP16-2023",
            productType: "storable",
            salesPrice: 2499.99,
            cost: 1999.99,
            currency: "USD",
            isActive: true,
            canBeSold: true,
            canBePurchased: true,
            trackingMethod: "serial",
            expirationTracking: false,
            routes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            category: {
              id: "cat1",
              name: "Electronics",
              routes: [],
              removalStrategy: "fifo"
            },
            unitOfMeasure: {
              id: "uom1",
              name: "Units",
              category: "Unit",
              type: "reference",
              ratio: 1,
              rounding: 0.01,
              isActive: true
            }
          },
          description: "MacBook Pro 16-inch M3 Chip",
          quantity: 10,
          unitPrice: 2499.99,
          taxes: [],
          subtotal: 24999.90,
          receivedQuantity: 0,
          billedQuantity: 0,
          expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      ],
      pickings: [],
      invoices: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const [poForm, setPOForm] = useState({
    supplier: "",
    expectedDate: "",
    notes: "",
    orderLines: [
      {
        product: "",
        description: "",
        quantity: 0,
        unitPrice: 0
      }
    ]
  })

  const [supplierForm, setSupplierForm] = useState({
    name: "",
    displayName: "",
    email: "",
    phone: "",
    website: "",
    isCompany: true,
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "USA",
    currency: "USD",
    paymentTerms: "Net 30"
  })

  useEffect(() => {
    setTimeout(() => {
      setSuppliers(mockSuppliers)
      setPurchaseOrders(mockPurchaseOrders)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "to_approve":
        return "bg-yellow-100 text-yellow-800"
      case "purchase":
        return "bg-green-100 text-green-800"
      case "done":
        return "bg-emerald-100 text-emerald-800"
      case "cancel":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const handleCreateSupplier = () => {
    if (!supplierForm.name) return

    const newSupplier: Supplier = {
      id: `sup${Date.now()}`,
      name: supplierForm.name,
      displayName: supplierForm.displayName || supplierForm.name,
      email: supplierForm.email,
      phone: supplierForm.phone,
      website: supplierForm.website,
      isCompany: supplierForm.isCompany,
      isVendor: true,
      isCustomer: false,
      address: {
        street: supplierForm.street,
        city: supplierForm.city,
        state: supplierForm.state,
        zip: supplierForm.zip,
        country: supplierForm.country
      },
      currency: supplierForm.currency,
      paymentTerms: supplierForm.paymentTerms,
      isActive: true,
      supplierRank: 1,
      customerRank: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setSuppliers([...suppliers, newSupplier])
    setSupplierForm({
      name: "",
      displayName: "",
      email: "",
      phone: "",
      website: "",
      isCompany: true,
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "USA",
      currency: "USD",
      paymentTerms: "Net 30"
    })
    setIsCreateSupplierOpen(false)
  }

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.state === statusFilter
    return matchesSearch && matchesStatus
  })

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
          <h1 className="text-3xl font-bold">Purchase Management</h1>
          <p className="text-muted-foreground">
            Manage purchase orders, vendors, and procurement processes
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            RFQ Template
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create PO
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseOrders.length}</div>
            <div className="text-xs text-muted-foreground">
              {purchaseOrders.filter(po => po.state === 'purchase').length} confirmed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0))}
            </div>
            <div className="text-xs text-muted-foreground">
              This month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Receipts</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <div className="text-xs text-muted-foreground">
              2 overdue
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.filter(s => s.isActive).length}</div>
            <div className="text-xs text-muted-foreground">
              Total: {suppliers.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Purchase Orders
                </CardTitle>
                <Dialog open={isCreatePOOpen} onOpenChange={setIsCreatePOOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Create PO
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create Purchase Order</DialogTitle>
                      <DialogDescription>
                        Create a new purchase order for your suppliers
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="supplier">Supplier *</Label>
                          <Select
                            value={poForm.supplier}
                            onValueChange={(value) => setPOForm({ ...poForm, supplier: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select supplier" />
                            </SelectTrigger>
                            <SelectContent>
                              {suppliers.map((supplier) => (
                                <SelectItem key={supplier.id} value={supplier.id}>
                                  {supplier.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expectedDate">Expected Delivery Date</Label>
                          <Input
                            id="expectedDate"
                            type="date"
                            value={poForm.expectedDate}
                            onChange={(e) => setPOForm({ ...poForm, expectedDate: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Order Lines</h4>
                          <Button variant="outline" size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Line
                          </Button>
                        </div>
                        
                        <div className="border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead>Unit Price</TableHead>
                                <TableHead>Subtotal</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {poForm.orderLines.map((line, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select product" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="p1">MacBook Pro 16-inch</SelectItem>
                                        <SelectItem value="p2">iPhone 15 Pro</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      value={line.description}
                                      onChange={(e) => {
                                        const newLines = [...poForm.orderLines]
                                        newLines[index].description = e.target.value
                                        setPOForm({ ...poForm, orderLines: newLines })
                                      }}
                                      placeholder="Description"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={line.quantity || ""}
                                      onChange={(e) => {
                                        const newLines = [...poForm.orderLines]
                                        newLines[index].quantity = parseFloat(e.target.value) || 0
                                        setPOForm({ ...poForm, orderLines: newLines })
                                      }}
                                      className="w-20"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={line.unitPrice || ""}
                                      onChange={(e) => {
                                        const newLines = [...poForm.orderLines]
                                        newLines[index].unitPrice = parseFloat(e.target.value) || 0
                                        setPOForm({ ...poForm, orderLines: newLines })
                                      }}
                                      className="w-24"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {formatCurrency(line.quantity * line.unitPrice)}
                                  </TableCell>
                                  <TableCell>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={poForm.notes}
                          onChange={(e) => setPOForm({ ...poForm, notes: e.target.value })}
                          placeholder="Additional notes..."
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreatePOOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="outline">
                        Save as Draft
                      </Button>
                      <Button>
                        Create & Send
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search purchase orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="to_approve">To Approve</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="cancel">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Expected Date</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">{order.name}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.supplier.name}</p>
                          <p className="text-sm text-muted-foreground">{order.supplier.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.orderDate)}</TableCell>
                      <TableCell>{formatDate(order.expectedDate)}</TableCell>
                      <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.state)} variant="secondary">
                          {order.state.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="mr-2 h-4 w-4" />
                              Send by Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Confirm Order
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Truck className="mr-2 h-4 w-4" />
                              Receive Products
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <X className="mr-2 h-4 w-4" />
                              Cancel
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

        <TabsContent value="suppliers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5" />
                  Suppliers
                </CardTitle>
                <Dialog open={isCreateSupplierOpen} onOpenChange={setIsCreateSupplierOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Supplier
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Supplier</DialogTitle>
                      <DialogDescription>
                        Add a new supplier to your vendor database
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="supplierName">Company Name *</Label>
                          <Input
                            id="supplierName"
                            value={supplierForm.name}
                            onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                            placeholder="Enter company name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="displayName">Display Name</Label>
                          <Input
                            id="displayName"
                            value={supplierForm.displayName}
                            onChange={(e) => setSupplierForm({ ...supplierForm, displayName: e.target.value })}
                            placeholder="Display name"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={supplierForm.email}
                            onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                            placeholder="contact@supplier.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={supplierForm.phone}
                            onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                            placeholder="+1-xxx-xxx-xxxx"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Address</h4>
                        <div className="grid gap-4">
                          <Input
                            placeholder="Street Address"
                            value={supplierForm.street}
                            onChange={(e) => setSupplierForm({ ...supplierForm, street: e.target.value })}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              placeholder="City"
                              value={supplierForm.city}
                              onChange={(e) => setSupplierForm({ ...supplierForm, city: e.target.value })}
                            />
                            <Input
                              placeholder="State"
                              value={supplierForm.state}
                              onChange={(e) => setSupplierForm({ ...supplierForm, state: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="currency">Currency</Label>
                          <Select
                            value={supplierForm.currency}
                            onValueChange={(value) => setSupplierForm({ ...supplierForm, currency: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paymentTerms">Payment Terms</Label>
                          <Select
                            value={supplierForm.paymentTerms}
                            onValueChange={(value) => setSupplierForm({ ...supplierForm, paymentTerms: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Net 15">Net 15</SelectItem>
                              <SelectItem value="Net 30">Net 30</SelectItem>
                              <SelectItem value="Net 45">Net 45</SelectItem>
                              <SelectItem value="Net 60">Net 60</SelectItem>
                              <SelectItem value="COD">Cash on Delivery</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateSupplierOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateSupplier}>
                        Create Supplier
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search purchase orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="to_approve">To Approve</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="cancel">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Expected Date</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">{order.name}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.supplier.name}</p>
                          <p className="text-sm text-muted-foreground">{order.supplier.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.orderDate)}</TableCell>
                      <TableCell>{formatDate(order.expectedDate)}</TableCell>
                      <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.state)} variant="secondary">
                          {order.state.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="mr-2 h-4 w-4" />
                              Send by Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Confirm Order
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Truck className="mr-2 h-4 w-4" />
                              Receive Products
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <X className="mr-2 h-4 w-4" />
                              Cancel
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

        <TabsContent value="suppliers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                Supplier Directory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{supplier.name}</p>
                          <p className="text-sm text-muted-foreground">{supplier.website}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{supplier.email}</p>
                          <p className="text-muted-foreground">{supplier.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{supplier.address.city}, {supplier.address.state}</p>
                          <p className="text-muted-foreground">{supplier.address.country}</p>
                        </div>
                      </TableCell>
                      <TableCell>{supplier.paymentTerms}</TableCell>
                      <TableCell>
                        <Badge variant={supplier.isActive ? "default" : "secondary"}>
                          {supplier.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Create PO
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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

        <TabsContent value="receipts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Receipts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Receipt management coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Purchase analytics coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
