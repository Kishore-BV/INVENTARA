"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Search, Filter, Plus, Edit, Eye, AlertTriangle, Home as HomeIcon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { ProductForm } from "@/components/products/product-form"
import { ProductCategory, UnitOfMeasure, Supplier } from "@/lib/inventory-types"
import Link from "next/link"
// Using external webhook directly for stock levels

export function AllProductsContent() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false)
  const [stockData, setStockData] = useState<any[]>([])
  const [stockColumns, setStockColumns] = useState<string[]>([])
  const [stockLoading, setStockLoading] = useState(false)
  const [products, setProducts] = useState([
    {
      id: "PRD-001",
      name: "Industrial Steel Pipes",
      category: "Raw Materials",
      sku: "ISP-2024-001",
      stock: 245,
      minStock: 50,
      price: "$125.00",
      status: "In Stock",
    },
    {
      id: "PRD-002",
      name: "Premium Office Chair",
      category: "Finished Goods",
      sku: "POC-2024-002",
      stock: 12,
      minStock: 20,
      price: "$299.99",
      status: "Low Stock",
    },
    {
      id: "PRD-003",
      name: "Cleaning Supplies Kit",
      category: "Consumables",
      sku: "CSK-2024-003",
      stock: 89,
      minStock: 25,
      price: "$45.50",
      status: "In Stock",
    },
    {
      id: "PRD-004",
      name: "Electronic Components Set",
      category: "Raw Materials",
      sku: "ECS-2024-004",
      stock: 156,
      minStock: 75,
      price: "$89.99",
      status: "In Stock",
    },
    {
      id: "PRD-005",
      name: "Safety Equipment Bundle",
      category: "Finished Goods",
      sku: "SEB-2024-005",
      stock: 3,
      minStock: 15,
      price: "$199.99",
      status: "Critical",
    },
  ])

  const mockCategories: ProductCategory[] = [
    { id: "cat-raw", name: "Raw Materials" } as any,
    { id: "cat-fg", name: "Finished Goods" } as any,
    { id: "cat-cons", name: "Consumables" } as any,
  ]
  const mockUnits: UnitOfMeasure[] = [
    { id: "uom-ea", name: "Each" } as any,
    { id: "uom-box", name: "Box" } as any,
    { id: "uom-kg", name: "Kilogram" } as any,
  ]
  const mockSuppliers: Supplier[] = [
    { id: "sup-1", name: "Default Supplier" } as any,
  ]

  const handleSaveProduct = (data: any) => {
    const newId = `PRD-${(products.length + 1).toString().padStart(3, '0')}`
    setProducts(prev => [
      {
        id: newId,
        name: data.name,
        category: mockCategories.find(c => c.id === data.categoryId)?.name || "Uncategorized",
        sku: data.internalReference,
        stock: 0,
        minStock: 0,
        price: `$${Number(data.salesPrice || 0).toFixed(2)}`,
        status: "In Stock",
      },
      ...prev,
    ])
    setIsAddDialogOpen(false)
  }

  const loadStock = async () => {
    try {
      setStockLoading(true)
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)
      let data: any
      try {
        // Try direct webhook (may fail due to CORS in browser)
        const res = await fetch('https://n8n-pgct.onrender.com/webhook/STOCKlevels', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store',
          signal: controller.signal
        })
        if (!res.ok) throw new Error(`Webhook error (${res.status})`)
        data = await res.json()
      } catch (directErr) {
        // Fallback via Next API proxy (server-side avoids CORS)
        const proxyRes = await fetch('/api/stock-levels', { cache: 'no-store', signal: controller.signal })
        if (!proxyRes.ok) throw new Error(`Proxy error (${proxyRes.status})`)
        data = await proxyRes.json()
      } finally {
        clearTimeout(timeout)
      }
      const rows = Array.isArray(data) ? data : [data]
      setStockData(rows)
      // derive columns
      const cols = Array.from(
        rows.reduce((set: Set<string>, row: any) => {
          Object.keys(row || {}).forEach(k => set.add(k))
          return set
        }, new Set<string>())
      )
      setStockColumns(cols)

      // attempt merge by SKU/code
      const skuKeys = ["SKU", "sku", "Sku", "ProductCode", "productCode", "code", "Code"]
      const qtyKeys = ["Quantity", "Qty", "qty", "quantity", "Stock", "stock"]
      setProducts(prev => {
        return prev.map(p => {
          const match = rows.find(r => skuKeys.some(sk => String(r?.[sk] || '').toLowerCase() === String(p.sku).toLowerCase()))
          if (!match) return p
          const qtyKey = qtyKeys.find(qk => qk in match)
          if (!qtyKey) return p
          const newStock = Number(match[qtyKey])
          const status = newStock <= 0 ? "Critical" : newStock < (p.minStock || 0) ? "Low Stock" : "In Stock"
          return { ...p, stock: isNaN(newStock) ? p.stock : newStock, status }
        })
      })
      setIsStockDialogOpen(true)
    } catch (e) {
      setStockData([{ error: (e as Error).message || 'Failed to fetch', hint: 'If this persists, we will always fall back via /api/stock-levels to bypass CORS.' }])
      setIsStockDialogOpen(true)
    } finally {
      setStockLoading(false)
    }
  }

  useEffect(() => {
    // Auto-load stock on first render
    loadStock()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2" title="Go to Dashboard">
              <HomeIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Products</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Complete product catalog and inventory management</p>
          </div>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3A5068]" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-[#4B6587]" />
              <span className="text-sm font-medium">Total Products</span>
            </div>
            <p className="text-2xl font-bold mt-2">1,247</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-[#F4A261]" />
              <span className="text-sm font-medium">Low Stock</span>
            </div>
            <p className="text-2xl font-bold mt-2">23</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-[#6B8A7A]" />
              <span className="text-sm font-medium">Categories</span>
            </div>
            <p className="text-2xl font-bold mt-2">12</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-[#E7B10A]" />
              <span className="text-sm font-medium">Total Value</span>
            </div>
            <p className="text-2xl font-bold mt-2">$2.4M</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>Manage your complete product catalog</CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search products..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" onClick={loadStock} disabled={stockLoading}>
                <Filter className="mr-2 h-4 w-4" />
                {stockLoading ? 'Loading Stock...' : 'View Stock'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.stock}</p>
                      <p className="text-xs text-gray-500">Min: {product.minStock}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.price}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "In Stock"
                          ? "default"
                          : product.status === "Low Stock"
                            ? "secondary"
                            : "destructive"
                      }
                      className={
                        product.status === "In Stock"
                          ? "bg-[#6B8A7A]"
                          : product.status === "Low Stock"
                            ? "bg-[#F4A261]"
                            : ""
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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

      {/* Live Stock Levels (Table) */}
      {stockData.length > 0 && stockColumns.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Live Stock Levels</CardTitle>
                <CardDescription>Fetched from connected stock service</CardDescription>
              </div>
              <Button variant="outline" onClick={loadStock} disabled={stockLoading}>
                {stockLoading ? 'Refreshing…' : 'Refresh'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {stockColumns.slice(0, 8).map(col => (
                      <TableHead key={col}>{col}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockData.slice(0, 200).map((row, idx) => (
                    <TableRow key={idx}>
                      {stockColumns.slice(0, 8).map(col => (
                        <TableCell key={col} className="whitespace-nowrap text-sm">
                          {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '')}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Live Stock Levels</DialogTitle>
            <DialogDescription>Data fetched from the stock service</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto space-y-2 text-sm">
            {stockData.map((row, idx) => (
              <pre key={idx} className="bg-muted p-2 rounded">
{JSON.stringify(row, null, 2)}
              </pre>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStockDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Fill in product details and save</DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-auto pr-2">
            <ProductForm
              categories={mockCategories}
              unitOfMeasures={mockUnits}
              suppliers={mockSuppliers}
              onSave={handleSaveProduct}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </div>
          <DialogFooter />
        </DialogContent>
      </Dialog>
    </div>
  )
}
