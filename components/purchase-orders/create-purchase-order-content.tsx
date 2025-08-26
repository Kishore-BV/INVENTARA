'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Home, Plus, Save, Send, Calculator, Package, Truck, Calendar, User, Building2, FileText, DollarSign, Hash, Trash2, Edit2 } from "lucide-react"
import Link from "next/link"

interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  rating: number
  category: string
}

interface Product {
  id: string
  name: string
  sku: string
  category: string
  unitPrice: number
  minOrderQuantity: number
  availableStock: number
  supplier: string
}

interface PurchaseOrderItem {
  id: string
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  totalPrice: number
  supplier: string
}

const sampleSuppliers: Supplier[] = [
  {
    id: "SUP-001",
    name: "TechCorp Solutions",
    email: "orders@techcorp.com",
    phone: "+91-98765-43210",
    address: "Mumbai, Maharashtra",
    rating: 4.8,
    category: "Electronics"
  },
  {
    id: "SUP-002",
    name: "Global Industrial Supplies",
    email: "sales@globalind.com",
    phone: "+91-98765-43211",
    address: "Delhi, NCR",
    rating: 4.6,
    category: "Industrial"
  },
  {
    id: "SUP-003",
    name: "Quality Materials Ltd",
    email: "info@qualitymaterials.com",
    phone: "+91-98765-43212",
    address: "Bangalore, Karnataka",
    rating: 4.9,
    category: "Raw Materials"
  }
]

const sampleProducts: Product[] = [
  {
    id: "PROD-001",
    name: "High-Speed Scanner",
    sku: "SCN-HS-001",
    category: "Electronics",
    unitPrice: 15000,
    minOrderQuantity: 5,
    availableStock: 50,
    supplier: "TechCorp Solutions"
  },
  {
    id: "PROD-002",
    name: "Industrial Pump",
    sku: "PUMP-IND-002",
    category: "Industrial",
    unitPrice: 25000,
    minOrderQuantity: 2,
    availableStock: 25,
    supplier: "Global Industrial Supplies"
  },
  {
    id: "PROD-003",
    name: "Steel Alloy Sheets",
    sku: "STEEL-AL-003",
    category: "Raw Materials",
    unitPrice: 8000,
    minOrderQuantity: 10,
    availableStock: 100,
    supplier: "Quality Materials Ltd"
  }
]

export function CreatePurchaseOrderContent() {
  const [selectedSupplier, setSelectedSupplier] = useState("")
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0])
  const [expectedDelivery, setExpectedDelivery] = useState("")
  const [orderItems, setOrderItems] = useState<PurchaseOrderItem[]>([])
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("")
  const [priority, setPriority] = useState("medium")

  const addItemToOrder = () => {
    if (!selectedProduct || quantity <= 0) return

    const product = sampleProducts.find(p => p.id === selectedProduct)
    if (!product) return

    const newItem: PurchaseOrderItem = {
      id: `ITEM-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: quantity,
      unitPrice: product.unitPrice,
      totalPrice: product.unitPrice * quantity,
      supplier: product.supplier
    }

    setOrderItems([...orderItems, newItem])
    setSelectedProduct("")
    setQuantity(1)
    setIsAddItemDialogOpen(false)
  }

  const removeItem = (itemId: string) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId))
  }

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: item.unitPrice * newQuantity
        }
      }
      return item
    }))
  }

  const totalOrderValue = orderItems.reduce((sum, item) => sum + item.totalPrice, 0)
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleSubmit = () => {
    // Handle purchase order submission
    console.log("Creating purchase order:", {
      supplier: selectedSupplier,
      orderDate,
      expectedDelivery,
      items: orderItems,
      totalValue: totalOrderValue,
      notes,
      priority
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
            <h1 className="text-3xl font-bold">Create Purchase Order</h1>
            <p className="text-gray-600 dark:text-gray-400">Create and manage new purchase orders for inventory</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={handleSubmit} className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Submit Order
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderDate">Order Date</Label>
                  <Input
                    id="orderDate"
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedDelivery">Expected Delivery</Label>
                  <Input
                    id="expectedDelivery"
                    type="date"
                    value={expectedDelivery}
                    onChange={(e) => setExpectedDelivery(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes or special instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supplier Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Select Supplier</Label>
                <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleSuppliers.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{supplier.name}</span>
                          <span className="text-sm text-gray-500">{supplier.category}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSupplier && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {(() => {
                    const supplier = sampleSuppliers.find(s => s.id === selectedSupplier)
                    if (!supplier) return null
                    return (
                      <>
                        <div>
                          <Label className="text-sm font-medium">Contact</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{supplier.email}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{supplier.phone}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Rating</Label>
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary">{supplier.rating}/5.0</Badge>
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
              <Button onClick={() => setIsAddItemDialogOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {orderItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No items added to the order yet</p>
                  <p className="text-sm">Click "Add Item" to start building your purchase order</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-sm text-gray-500">{item.supplier}</div>
                          </div>
                        </TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>₹{item.unitPrice.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">₹{item.totalPrice.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Order Value:</span>
                <span className="font-medium text-lg">₹{totalOrderValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18% GST):</span>
                <span className="font-medium">₹{(totalOrderValue * 0.18).toLocaleString()}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Grand Total:</span>
                <span>₹{(totalOrderValue * 1.18).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery Address</Label>
                <Textarea
                  id="deliveryAddress"
                  placeholder="Enter delivery address..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  placeholder="Name of contact person"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  placeholder="Phone number"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Item to Order</DialogTitle>
            <DialogDescription>Select a product and specify quantity for your purchase order</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  {sampleProducts.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-sm text-gray-500">{product.sku} - ₹{product.unitPrice.toLocaleString()}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                required
              />
            </div>

            {selectedProduct && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {(() => {
                  const product = sampleProducts.find(p => p.id === selectedProduct)
                  if (!product) return null
                  return (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Unit Price:</span>
                        <p>₹{product.unitPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Total Price:</span>
                        <p>₹{(product.unitPrice * quantity).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Available Stock:</span>
                        <p>{product.availableStock} units</p>
                      </div>
                      <div>
                        <span className="font-medium">Min Order:</span>
                        <p>{product.minOrderQuantity} units</p>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={addItemToOrder} className="flex-1" disabled={!selectedProduct || quantity <= 0}>
                Add to Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
