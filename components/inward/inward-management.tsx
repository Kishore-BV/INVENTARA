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
  ClipboardCheck
} from "lucide-react"

// Mock interfaces for the demo
interface InwardReceipt {
  id: string
  receiptNumber: string
  purchaseOrderId?: string
  supplierId: string
  supplierName: string
  receiptDate: Date
  expectedDate?: Date
  warehouseId: string
  warehouseName: string
  receivedBy: string
  status: 'draft' | 'received' | 'inspected' | 'accepted' | 'rejected' | 'partial'
  items: InwardItem[]
  totalValue: number
  currency: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

interface InwardItem {
  id: string
  productId: string
  productName: string
  expectedQuantity: number
  receivedQuantity: number
  acceptedQuantity: number
  rejectedQuantity: number
  unitPrice: number
  totalValue: number
  batchNumber?: string
  expiryDate?: Date
  qualityStatus: 'pending' | 'passed' | 'failed' | 'on_hold'
  qualityNotes?: string
  inspectedBy?: string
  inspectionDate?: Date
  storageLocation?: string
}

interface InwardManagementProps {
  className?: string
}

export function InwardManagement({ className }: InwardManagementProps) {
  const [inwardReceipts, setInwardReceipts] = useState<InwardReceipt[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState("receipts")

  // Mock data
  const mockInwardReceipts: InwardReceipt[] = [
    {
      id: "inw_1",
      receiptNumber: "INW/001/2024",
      purchaseOrderId: "PO001",
      supplierId: "sup1",
      supplierName: "Apple Inc.",
      receiptDate: new Date(),
      expectedDate: new Date(),
      warehouseId: "wh1",
      warehouseName: "Main Warehouse",
      receivedBy: "John Doe",
      status: "received",
      items: [
        {
          id: "item1",
          productId: "p1",
          productName: "MacBook Pro 16-inch",
          expectedQuantity: 10,
          receivedQuantity: 10,
          acceptedQuantity: 9,
          rejectedQuantity: 1,
          unitPrice: 2499.99,
          totalValue: 24999.90,
          batchNumber: "BATCH001",
          qualityStatus: "passed",
          qualityNotes: "1 unit with minor scratch",
          inspectedBy: "QC Inspector",
          inspectionDate: new Date(),
          storageLocation: "A1-B2-C3"
        }
      ],
      totalValue: 24999.90,
      currency: "USD",
      notes: "Delivery completed on time",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "inw_2",
      receiptNumber: "INW/002/2024",
      supplierId: "sup2",
      supplierName: "Dell Technologies",
      receiptDate: new Date(),
      warehouseId: "wh1",
      warehouseName: "Main Warehouse",
      receivedBy: "Jane Smith",
      status: "inspected",
      items: [
        {
          id: "item2",
          productId: "p2",
          productName: "Dell XPS 13",
          expectedQuantity: 15,
          receivedQuantity: 15,
          acceptedQuantity: 0,
          rejectedQuantity: 0,
          unitPrice: 1299.99,
          totalValue: 19499.85,
          qualityStatus: "pending",
          storageLocation: "A1-B3-C1"
        }
      ],
      totalValue: 19499.85,
      currency: "USD",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const [formData, setFormData] = useState({
    supplierName: "",
    purchaseOrderId: "",
    expectedDate: "",
    warehouseName: "Main Warehouse",
    notes: "",
    items: [
      {
        productName: "",
        expectedQuantity: 0,
        unitPrice: 0,
      }
    ]
  })

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInwardReceipts(mockInwardReceipts)
      setLoading(false)
    }, 1000)
  }, [])

  const handleCreateReceipt = () => {
    // This would normally call an API
    const newReceipt: InwardReceipt = {
      id: `inw_${Date.now()}`,
      receiptNumber: `INW/${String(inwardReceipts.length + 1).padStart(3, '0')}/2024`,
      supplierId: "sup_new",
      supplierName: formData.supplierName,
      receiptDate: new Date(),
      expectedDate: formData.expectedDate ? new Date(formData.expectedDate) : undefined,
      warehouseId: "wh1",
      warehouseName: formData.warehouseName,
      receivedBy: "Current User",
      status: "draft",
      items: formData.items.map((item, index) => ({
        id: `item_${Date.now()}_${index}`,
        productId: `p_${Date.now()}_${index}`,
        productName: item.productName,
        expectedQuantity: item.expectedQuantity,
        receivedQuantity: 0,
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        unitPrice: item.unitPrice,
        totalValue: item.expectedQuantity * item.unitPrice,
        qualityStatus: 'pending' as const
      })),
      totalValue: formData.items.reduce((sum, item) => sum + (item.expectedQuantity * item.unitPrice), 0),
      currency: "USD",
      notes: formData.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setInwardReceipts([newReceipt, ...inwardReceipts])
    setFormData({
      supplierName: "",
      purchaseOrderId: "",
      expectedDate: "",
      warehouseName: "Main Warehouse",
      notes: "",
      items: [
        {
          productName: "",
          expectedQuantity: 0,
          unitPrice: 0,
        }
      ]
    })
    setIsCreateDialogOpen(false)
  }

  const filteredReceipts = inwardReceipts.filter(receipt => {
    const matchesSearch = (
      receipt.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const matchesStatus = selectedStatus === "all" || receipt.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'received':
        return 'bg-blue-100 text-blue-800'
      case 'inspected':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'partial':
        return 'bg-purple-100 text-purple-800'
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
          <h1 className="text-3xl font-bold">Inward Management</h1>
          <p className="text-muted-foreground">
            Manage incoming inventory, receiving, and quality control
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Scan className="mr-2 h-4 w-4" />
            Scan Receipt
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Receipt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Inward Receipt</DialogTitle>
                <DialogDescription>
                  Record new incoming inventory from suppliers
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplierName">Supplier Name *</Label>
                    <Input
                      id="supplierName"
                      value={formData.supplierName}
                      onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                      placeholder="Enter supplier name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaseOrderId">Purchase Order ID</Label>
                    <Input
                      id="purchaseOrderId"
                      value={formData.purchaseOrderId}
                      onChange={(e) => setFormData({ ...formData, purchaseOrderId: e.target.value })}
                      placeholder="Link to purchase order"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expectedDate">Expected Date</Label>
                    <Input
                      id="expectedDate"
                      type="date"
                      value={formData.expectedDate}
                      onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
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
                </div>

                <div className="space-y-4">
                  <Label>Items</Label>
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
                        <Label>Expected Qty</Label>
                        <Input
                          type="number"
                          value={item.expectedQuantity}
                          onChange={(e) => {
                            const newItems = [...formData.items]
                            newItems[index].expectedQuantity = parseInt(e.target.value) || 0
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
                          value={formatCurrency(item.expectedQuantity * item.unitPrice)}
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
                      items: [...formData.items, { productName: "", expectedQuantity: 0, unitPrice: 0 }]
                    })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes..."
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
                <Button onClick={handleCreateReceipt}>
                  Create Receipt
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
            <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inwardReceipts.length}</div>
            <div className="text-xs text-muted-foreground">
              This month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Inspection</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {inwardReceipts.filter(r => r.status === 'inspected' || r.status === 'received').length}
            </div>
            <div className="text-xs text-muted-foreground">
              Awaiting quality check
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {inwardReceipts.filter(r => r.status === 'accepted').length}
            </div>
            <div className="text-xs text-muted-foreground">
              Quality approved
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
              {formatCurrency(inwardReceipts.reduce((sum, r) => sum + r.totalValue, 0))}
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
          <TabsTrigger value="receipts">Inward Receipts</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="receiving">Receiving Dock</TabsTrigger>
        </TabsList>

        <TabsContent value="receipts" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search receipts..."
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
                    <SelectItem value="received">Received</SelectItem>
                    <SelectItem value="inspected">Inspected</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Receipts Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PackageOpen className="mr-2 h-5 w-5" />
                Inward Receipts ({filteredReceipts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReceipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{receipt.receiptNumber}</p>
                          {receipt.purchaseOrderId && (
                            <p className="text-sm text-muted-foreground">PO: {receipt.purchaseOrderId}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{receipt.supplierName}</TableCell>
                      <TableCell>{formatDate(receipt.receiptDate)}</TableCell>
                      <TableCell>{receipt.warehouseName}</TableCell>
                      <TableCell>{receipt.items.length} items</TableCell>
                      <TableCell>{formatCurrency(receipt.totalValue)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(receipt.status)} variant="secondary">
                          {receipt.status}
                        </Badge>
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
                              Edit Receipt
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ClipboardCheck className="mr-2 h-4 w-4" />
                              Quality Check
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Print Receipt
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

        <TabsContent value="quality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Quality control interface coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receiving" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Receiving Dock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Receiving dock management coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
