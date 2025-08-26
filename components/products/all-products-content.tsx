"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Search, Filter, Plus, Edit, Eye, AlertTriangle } from "lucide-react"

export function AllProductsContent() {
  const products = [
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
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Products</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Complete product catalog and inventory management</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3A5068]">
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
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
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
    </div>
  )
}
