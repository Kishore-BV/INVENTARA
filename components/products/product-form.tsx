"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  Package,
  Plus,
  X,
  Upload,
  Barcode,
  Tag,
  Truck,
  ShoppingCart,
  AlertCircle,
  Save,
  Trash2,
  Copy,
  Camera,
} from "lucide-react"
import { Product, ProductCategory, UnitOfMeasure, Supplier } from "@/lib/inventory-types"

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  internalReference: z.string().min(1, "Internal reference is required"),
  barcode: z.string().optional(),
  productType: z.enum(["consumable", "service", "storable"]),
  categoryId: z.string().min(1, "Category is required"),
  salesPrice: z.number().min(0, "Sales price must be positive"),
  cost: z.number().min(0, "Cost must be positive"),
  currency: z.string().default("USD"),
  unitOfMeasureId: z.string().min(1, "Unit of measure is required"),
  purchaseUnitOfMeasureId: z.string().optional(),
  weight: z.number().optional(),
  volume: z.number().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
  canBeSold: z.boolean().default(true),
  canBePurchased: z.boolean().default(true),
  trackingMethod: z.enum(["none", "lot", "serial"]),
  expirationTracking: z.boolean().default(false),
  supplierId: z.string().optional(),
  minQuantity: z.number().optional(),
  maxQuantity: z.number().optional(),
  leadTimeDays: z.number().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: Product
  categories: ProductCategory[]
  unitOfMeasures: UnitOfMeasure[]
  suppliers: Supplier[]
  onSave: (data: ProductFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ProductForm({
  product,
  categories,
  unitOfMeasures,
  suppliers,
  onSave,
  onCancel,
  isLoading = false
}: ProductFormProps) {
  const [image, setImage] = useState<string | null>(product?.image || null)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      internalReference: product?.internalReference || "",
      barcode: product?.barcode || "",
      productType: product?.productType || "storable",
      categoryId: product?.category?.id || "",
      salesPrice: product?.salesPrice || 0,
      cost: product?.cost || 0,
      currency: product?.currency || "USD",
      unitOfMeasureId: product?.unitOfMeasure?.id || "",
      purchaseUnitOfMeasureId: product?.purchaseUnitOfMeasure?.id || "",
      weight: product?.weight || 0,
      volume: product?.volume || 0,
      description: product?.description || "",
      notes: product?.notes || "",
      isActive: product?.isActive ?? true,
      canBeSold: product?.canBeSold ?? true,
      canBePurchased: product?.canBePurchased ?? true,
      trackingMethod: product?.trackingMethod || "none",
      expirationTracking: product?.expirationTracking || false,
      supplierId: product?.supplier?.id || "",
    }
  })

  const watchedProductType = watch("productType")
  const watchedTrackingMethod = watch("trackingMethod")

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateBarcode = () => {
    // Generate a simple EAN-13 barcode format
    const timestamp = Date.now().toString()
    const barcode = "800" + timestamp.slice(-10)
    setValue("barcode", barcode)
  }

  const onSubmit = (data: ProductFormData) => {
    onSave(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <h2 className="text-lg font-semibold">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
        </div>
        <div className="flex space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="purchase">Purchase</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="accounting">Accounting</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Product Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  {image ? (
                    <div className="relative w-full h-full">
                      <img
                        src={image}
                        alt="Product"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setImage(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Upload image</p>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Label htmlFor="image-upload" className="cursor-pointer flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </Label>
                  <Button type="button" variant="outline" size="sm">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Basic Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="Enter product name"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="internalReference">Internal Reference *</Label>
                      <Input
                        id="internalReference"
                        {...register("internalReference")}
                        placeholder="SKU or product code"
                      />
                      {errors.internalReference && (
                        <p className="text-sm text-red-600">{errors.internalReference.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="barcode">Barcode</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="barcode"
                          {...register("barcode")}
                          placeholder="Product barcode"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generateBarcode}
                        >
                          <Tag className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowBarcodeScanner(true)}
                        >
                          <Barcode className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productType">Product Type *</Label>
                      <select
                        id="productType"
                        {...register("productType")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="storable">Storable Product</option>
                        <option value="consumable">Consumable</option>
                        <option value="service">Service</option>
                      </select>
                      {errors.productType && (
                        <p className="text-sm text-red-600">{errors.productType.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoryId">Category *</Label>
                      <select
                        id="categoryId"
                        {...register("categoryId")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.categoryId && (
                        <p className="text-sm text-red-600">{errors.categoryId.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supplierId">Primary Supplier</Label>
                      <select
                        id="supplierId"
                        {...register("supplierId")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select supplier</option>
                        {suppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Product description"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Internal Notes</Label>
                    <Textarea
                      id="notes"
                      {...register("notes")}
                      placeholder="Internal notes for reference"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Product Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Product Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      {...register("isActive")}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canBeSold"
                      {...register("canBeSold")}
                    />
                    <Label htmlFor="canBeSold">Can be Sold</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canBePurchased"
                      {...register("canBePurchased")}
                    />
                    <Label htmlFor="canBePurchased">Can be Purchased</Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Sales Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salesPrice">Sales Price *</Label>
                  <Input
                    id="salesPrice"
                    type="number"
                    step="0.01"
                    {...register("salesPrice", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {errors.salesPrice && (
                    <p className="text-sm text-red-600">{errors.salesPrice.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    {...register("currency")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitOfMeasureId">Sales Unit *</Label>
                  <select
                    id="unitOfMeasureId"
                    {...register("unitOfMeasureId")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select unit</option>
                    {unitOfMeasures.map((uom) => (
                      <option key={uom.id} value={uom.id}>
                        {uom.name}
                      </option>
                    ))}
                  </select>
                  {errors.unitOfMeasureId && (
                    <p className="text-sm text-red-600">{errors.unitOfMeasureId.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchase" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-4 w-4" />
                <span>Purchase Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost Price *</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    {...register("cost", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {errors.cost && (
                    <p className="text-sm text-red-600">{errors.cost.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseUnitOfMeasureId">Purchase Unit</Label>
                  <select
                    id="purchaseUnitOfMeasureId"
                    {...register("purchaseUnitOfMeasureId")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Same as sales unit</option>
                    {unitOfMeasures.map((uom) => (
                      <option key={uom.id} value={uom.id}>
                        {uom.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leadTimeDays">Lead Time (Days)</Label>
                  <Input
                    id="leadTimeDays"
                    type="number"
                    {...register("leadTimeDays", { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.001"
                    {...register("weight", { valueAsNumber: true })}
                    placeholder="0.000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="volume">Volume (m³)</Label>
                  <Input
                    id="volume"
                    type="number"
                    step="0.001"
                    {...register("volume", { valueAsNumber: true })}
                    placeholder="0.000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Inventory Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trackingMethod">Tracking Method</Label>
                  <select
                    id="trackingMethod"
                    {...register("trackingMethod")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={watchedProductType !== "storable"}
                  >
                    <option value="none">No Tracking</option>
                    <option value="lot">By Lots</option>
                    <option value="serial">By Serial Numbers</option>
                  </select>
                  {watchedProductType !== "storable" && (
                    <p className="text-sm text-gray-500">
                      Only available for storable products
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="expirationTracking"
                    {...register("expirationTracking")}
                    disabled={watchedTrackingMethod === "none"}
                  />
                  <Label htmlFor="expirationTracking">Track Expiration Dates</Label>
                </div>
              </div>

              {watchedProductType === "storable" && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Reordering Rules</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minQuantity">Minimum Quantity</Label>
                        <Input
                          id="minQuantity"
                          type="number"
                          {...register("minQuantity", { valueAsNumber: true })}
                          placeholder="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxQuantity">Maximum Quantity</Label>
                        <Input
                          id="maxQuantity"
                          type="number"
                          {...register("maxQuantity", { valueAsNumber: true })}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Accounting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Accounting configuration will be available in future updates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Barcode Scanner Dialog */}
      <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan Barcode</DialogTitle>
            <DialogDescription>
              Position the barcode within the camera view to scan
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Barcode className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Camera access required</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowBarcodeScanner(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={() => setShowBarcodeScanner(false)}>
              Use Manual Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}
