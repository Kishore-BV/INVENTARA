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
  Copy,
  Upload,
  Download,
  Package,
  Barcode,
  DollarSign,
  Weight,
  Archive
} from "lucide-react"
import { Product, ProductCategory, UnitOfMeasure } from "@/lib/inventory-types"

interface ProductManagementProps {
  className?: string
}

export function ProductManagement({ className }: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedTab, setSelectedTab] = useState("list")

  // Mock data
  const mockProducts: Product[] = [
    {
      id: "p1",
      name: "MacBook Pro 16-inch",
      internalReference: "MBP16-2023",
      barcode: "1234567890123",
      productType: "storable",
      category: {
        id: "cat1",
        name: "Electronics",
        routes: [],
        removalStrategy: "fifo"
      },
      salesPrice: 2499.99,
      cost: 1999.99,
      currency: "USD",
      unitOfMeasure: {
        id: "uom1",
        name: "Units",
        category: "Unit",
        type: "reference",
        ratio: 1,
        rounding: 0.01,
        isActive: true
      },
      weight: 2.1,
      volume: 0.05,
      description: "Latest MacBook Pro with M3 chip",
      isActive: true,
      canBeSold: true,
      canBePurchased: true,
      trackingMethod: "serial",
      expirationTracking: false,
      routes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "p2",
      name: "iPhone 15 Pro",
      internalReference: "IPH15P-2023",
      barcode: "2345678901234",
      productType: "storable",
      category: {
        id: "cat1",
        name: "Electronics",
        routes: [],
        removalStrategy: "fifo"
      },
      salesPrice: 999.99,
      cost: 799.99,
      currency: "USD",
      unitOfMeasure: {
        id: "uom1",
        name: "Units",
        category: "Unit",
        type: "reference",
        ratio: 1,
        rounding: 0.01,
        isActive: true
      },
      weight: 0.187,
      description: "Latest iPhone with titanium design",
      isActive: true,
      canBeSold: true,
      canBePurchased: true,
      trackingMethod: "serial",
      expirationTracking: false,
      routes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const mockCategories: ProductCategory[] = [
    { id: "cat1", name: "Electronics", routes: [], removalStrategy: "fifo" },
    { id: "cat2", name: "Clothing", routes: [], removalStrategy: "fifo" },
    { id: "cat3", name: "Books", routes: [], removalStrategy: "fifo" }
  ]

  const mockUnitsOfMeasure: UnitOfMeasure[] = [
    { id: "uom1", name: "Units", category: "Unit", type: "reference", ratio: 1, rounding: 0.01, isActive: true },
    { id: "uom2", name: "Kilograms", category: "Weight", type: "reference", ratio: 1, rounding: 0.001, isActive: true },
    { id: "uom3", name: "Liters", category: "Volume", type: "reference", ratio: 1, rounding: 0.01, isActive: true }
  ]

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    internalReference: "",
    barcode: "",
    productType: "storable",
    salesPrice: 0,
    cost: 0,
    currency: "USD",
    description: "",
    isActive: true,
    canBeSold: true,
    canBePurchased: true,
    trackingMethod: "none",
    expirationTracking: false,
    weight: 0,
    volume: 0
  })

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  const handleCreateProduct = () => {
    if (!formData.name || !formData.internalReference) return

    const newProduct: Product = {
      ...formData as Product,
      id: `p${Date.now()}`,
      category: mockCategories[0],
      unitOfMeasure: mockUnitsOfMeasure[0],
      routes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setProducts([...products, newProduct])
    setFormData({
      name: "",
      internalReference: "",
      barcode: "",
      productType: "storable",
      salesPrice: 0,
      cost: 0,
      currency: "USD",
      description: "",
      isActive: true,
      canBeSold: true,
      canBePurchased: true,
      trackingMethod: "none",
      expirationTracking: false,
      weight: 0,
      volume: 0
    })
    setIsCreateDialogOpen(false)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData(product)
    setIsEditDialogOpen(true)
  }

  const handleUpdateProduct = () => {
    if (!editingProduct || !formData.name || !formData.internalReference) return

    const updatedProduct: Product = {
      ...editingProduct,
      ...formData as Product,
      updatedAt: new Date()
    }

    setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p))
    setEditingProduct(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId))
  }

  const handleDuplicateProduct = (product: Product) => {
    const duplicatedProduct: Product = {
      ...product,
      id: `p${Date.now()}`,
      name: `${product.name} (Copy)`,
      internalReference: `${product.internalReference}-COPY`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setProducts([...products, duplicatedProduct])
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.internalReference.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category.id === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
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
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">
            Manage your product catalog, pricing, and inventory settings
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
                <DialogDescription>
                  Add a new product to your inventory catalog
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                    <TabsTrigger value="accounting">Accounting</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                          id="name"
                          value={formData.name || ""}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter product name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="internalReference">Internal Reference *</Label>
                        <Input
                          id="internalReference"
                          value={formData.internalReference || ""}
                          onChange={(e) => setFormData({ ...formData, internalReference: e.target.value })}
                          placeholder="SKU or internal code"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="barcode">Barcode</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="barcode"
                            value={formData.barcode || ""}
                            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                            placeholder="Scan or enter barcode"
                          />
                          <Button variant="outline" size="sm">
                            <Barcode className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="productType">Product Type</Label>
                        <Select
                          value={formData.productType}
                          onValueChange={(value: any) => setFormData({ ...formData, productType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="storable">Storable Product</SelectItem>
                            <SelectItem value="consumable">Consumable</SelectItem>
                            <SelectItem value="service">Service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Product description..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.001"
                          value={formData.weight || ""}
                          onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="volume">Volume (m³)</Label>
                        <Input
                          id="volume"
                          type="number"
                          step="0.001"
                          value={formData.volume || ""}
                          onChange={(e) => setFormData({ ...formData, volume: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="inventory" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="trackingMethod">Tracking Method</Label>
                        <Select
                          value={formData.trackingMethod}
                          onValueChange={(value: any) => setFormData({ ...formData, trackingMethod: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Tracking</SelectItem>
                            <SelectItem value="lot">By Lots</SelectItem>
                            <SelectItem value="serial">By Serial Numbers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="expirationTracking"
                          checked={formData.expirationTracking}
                          onChange={(e) => setFormData({ ...formData, expirationTracking: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="expirationTracking">Track Expiration Dates</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="canBeSold"
                          checked={formData.canBeSold}
                          onChange={(e) => setFormData({ ...formData, canBeSold: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="canBeSold">Can be Sold</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="canBePurchased"
                          checked={formData.canBePurchased}
                          onChange={(e) => setFormData({ ...formData, canBePurchased: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="canBePurchased">Can be Purchased</Label>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="accounting" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="salesPrice">Sales Price</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="salesPrice"
                            type="number"
                            step="0.01"
                            value={formData.salesPrice || ""}
                            onChange={(e) => setFormData({ ...formData, salesPrice: parseFloat(e.target.value) || 0 })}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cost">Cost</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="cost"
                            type="number"
                            step="0.01"
                            value={formData.cost || ""}
                            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProduct}>
                  Create Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {mockCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Product List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Products ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Sales Price</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>{product.internalReference}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {product.productType}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(product.salesPrice)}</TableCell>
                  <TableCell>{formatCurrency(product.cost)}</TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
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
                        <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateProduct(product)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Stock
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information
            </DialogDescription>
          </DialogHeader>
          {/* Same form content as create dialog */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct}>
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
