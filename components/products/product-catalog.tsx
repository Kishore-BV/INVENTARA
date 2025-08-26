"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Eye,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Upload,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Barcode,
  Tag,
  TrendingUp,
  TrendingDown,
  X,
} from "lucide-react"
import { Product, ProductCategory, ProductFilter, Supplier, UnitOfMeasure } from "@/lib/inventory-types"
import { ProductForm } from "./product-form"

interface ProductCatalogProps {
  products: Product[]
  categories: ProductCategory[]
  suppliers: Supplier[]
  unitOfMeasures: UnitOfMeasure[]
  onProductAdd?: (product: Product) => void
  onProductEdit?: (product: Product) => void
  onProductDelete?: (productId: string) => void
  isLoading?: boolean
}

export function ProductCatalog({
  products,
  categories,
  suppliers,
  unitOfMeasures,
  onProductAdd,
  onProductEdit,
  onProductDelete,
  isLoading = false
}: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<ProductFilter>({})
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [sortBy, setSortBy] = useState<string>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.internalReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = !filters.category || product.category.id === filters.category
      const matchesSupplier = !filters.supplier || product.supplier?.id === filters.supplier
      const matchesActive = filters.isActive === undefined || product.isActive === filters.isActive
      const matchesTrackingMethod = !filters.trackingMethod || product.trackingMethod === filters.trackingMethod
      
      return matchesSearch && matchesCategory && matchesSupplier && matchesActive && matchesTrackingMethod
    })

    // Sort products
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Product]
      let bValue: any = b[sortBy as keyof Product]

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [products, searchTerm, filters, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleProductSave = (data: any) => {
    console.log('Saving product:', data)
    setShowProductForm(false)
    setEditingProduct(null)
  }

  const handleProductEdit = (product: Product) => {
    setEditingProduct(product)
    setShowProductForm(true)
  }

  const handleProductDelete = (productId: string) => {
    if (onProductDelete) {
      onProductDelete(productId)
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on products:`, selectedProducts)
  }

  const getStockStatus = (product: Product) => {
    // Mock stock status - in real app this would come from inventory data
    const stockLevel = Math.floor(Math.random() * 100)
    if (stockLevel === 0) return { status: 'out-of-stock', color: 'bg-red-100 text-red-800', label: 'Out of Stock' }
    if (stockLevel < 10) return { status: 'low-stock', color: 'bg-yellow-100 text-yellow-800', label: 'Low Stock' }
    return { status: 'in-stock', color: 'bg-green-100 text-green-800', label: 'In Stock' }
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount)
  }

  const ProductGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {paginatedProducts.map((product) => {
        const stockStatus = getStockStatus(product)
        return (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="h-12 w-12 text-gray-400" />
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                <p className="text-xs text-gray-500">{product.internalReference}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className={stockStatus.color}>
                    {stockStatus.label}
                  </Badge>
                  <Badge variant="outline">
                    {product.category.name}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {formatCurrency(product.salesPrice, product.currency)}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedProduct(product)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleProductEdit(product)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleProductDelete(product.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  const ProductTableView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedProducts(paginatedProducts.map(p => p.id))
                } else {
                  setSelectedProducts([])
                }
              }}
            />
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => {
              if (sortBy === 'name') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              } else {
                setSortBy('name')
                setSortOrder('asc')
              }
            }}
          >
            Product
            {sortBy === 'name' && (
              sortOrder === 'asc' ? <SortAsc className="inline ml-1 h-3 w-3" /> : <SortDesc className="inline ml-1 h-3 w-3" />
            )}
          </TableHead>
          <TableHead>Reference</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Stock Status</TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => {
              if (sortBy === 'salesPrice') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              } else {
                setSortBy('salesPrice')
                setSortOrder('desc')
              }
            }}
          >
            Price
            {sortBy === 'salesPrice' && (
              sortOrder === 'asc' ? <SortAsc className="inline ml-1 h-3 w-3" /> : <SortDesc className="inline ml-1 h-3 w-3" />
            )}
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-16">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedProducts.map((product) => {
          const stockStatus = getStockStatus(product)
          return (
            <TableRow key={product.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProducts([...selectedProducts, product.id])
                    } else {
                      setSelectedProducts(selectedProducts.filter(id => id !== product.id))
                    }
                  }}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    {product.barcode && (
                      <p className="text-sm text-gray-500 flex items-center">
                        <Barcode className="mr-1 h-3 w-3" />
                        {product.barcode}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-mono text-sm">{product.internalReference}</span>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{product.category.name}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="capitalize">
                  {product.productType}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={stockStatus.color}>
                  {stockStatus.label}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(product.salesPrice, product.currency)}</p>
                  <p className="text-sm text-gray-500">Cost: {formatCurrency(product.cost, product.currency)}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  {product.isActive ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  {product.canBeSold && <Tag className="h-3 w-3 text-blue-500" />}
                  {product.canBePurchased && <Package className="h-3 w-3 text-purple-500" />}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedProduct(product)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleProductEdit(product)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleProductDelete(product.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )

  if (showProductForm) {
    return (
      <ProductForm
        product={editingProduct || undefined}
        categories={categories}
        unitOfMeasures={unitOfMeasures}
        suppliers={suppliers}
        onSave={handleProductSave}
        onCancel={() => {
          setShowProductForm(false)
          setEditingProduct(null)
        }}
        isLoading={isLoading}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Product Catalog</h1>
          <p className="text-gray-600">
            Manage your product inventory and catalog
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
          <Button onClick={() => setShowProductForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category.id}
                      checked={filters.category === category.id}
                      onCheckedChange={(checked) => {
                        setFilters({
                          ...filters,
                          category: checked ? category.id : undefined
                        })
                      }}
                    >
                      {category.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filters.isActive === true}
                    onCheckedChange={(checked) => {
                      setFilters({
                        ...filters,
                        isActive: checked ? true : undefined
                      })
                    }}
                  >
                    Active Only
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.isActive === false}
                    onCheckedChange={(checked) => {
                      setFilters({
                        ...filters,
                        isActive: checked ? false : undefined
                      })
                    }}
                  >
                    Inactive Only
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-l-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.category || filters.isActive !== undefined) && (
            <div className="flex items-center space-x-2 mt-4">
              <span className="text-sm text-gray-500">Active filters:</span>
              {filters.category && (
                <Badge 
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setFilters({ ...filters, category: undefined })}
                >
                  Category: {categories.find(c => c.id === filters.category)?.name}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
              {filters.isActive !== undefined && (
                <Badge 
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setFilters({ ...filters, isActive: undefined })}
                >
                  Status: {filters.isActive ? 'Active' : 'Inactive'}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({})}
                className="text-sm"
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('export')}
                >
                  Export Selected
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('deactivate')}
                >
                  Deactivate
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                  className="text-red-600"
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || Object.keys(filters).length > 0
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first product"
                }
              </p>
              {!searchTerm && Object.keys(filters).length === 0 && (
                <Button onClick={() => setShowProductForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              )}
            </div>
          ) : (
            <div className="p-6">
              {viewMode === 'table' ? <ProductTableView /> : <ProductGridView />}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
              .map((page, index, array) => (
                <div key={page} className="flex space-x-2">
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-3 py-1 text-gray-400">...</span>
                  )}
                  <Button
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                </div>
              ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Product Details Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              View detailed information about this product
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span> {selectedProduct.name}
                    </div>
                    <div>
                      <span className="text-gray-500">Reference:</span> {selectedProduct.internalReference}
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span> {selectedProduct.category.name}
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span> {selectedProduct.productType}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Pricing</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Sales Price:</span> {formatCurrency(selectedProduct.salesPrice, selectedProduct.currency)}
                    </div>
                    <div>
                      <span className="text-gray-500">Cost:</span> {formatCurrency(selectedProduct.cost, selectedProduct.currency)}
                    </div>
                    <div>
                      <span className="text-gray-500">Margin:</span> {(((selectedProduct.salesPrice - selectedProduct.cost) / selectedProduct.salesPrice) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
              {selectedProduct.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
