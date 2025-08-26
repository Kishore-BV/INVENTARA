"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  MapPin,
  Warehouse as WarehouseIcon,
  Building,
  ArrowRightLeft,
  Package,
  TrendingUp,
  AlertTriangle,
  Move3D
} from "lucide-react"
import { Warehouse, Location, StockQuant } from "@/lib/inventory-types"

interface WarehouseManagementProps {
  className?: string
}

export function WarehouseManagement({ className }: WarehouseManagementProps) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("warehouses")
  const [isCreateWarehouseOpen, setIsCreateWarehouseOpen] = useState(false)
  const [isCreateLocationOpen, setIsCreateLocationOpen] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all")

  // Mock data
  const mockWarehouses: Warehouse[] = [
    {
      id: "wh1",
      name: "Main Warehouse",
      code: "WH001",
      address: {
        street: "123 Industrial Blvd",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "USA"
      },
      isActive: true,
      company: "Inventara Inc",
      locations: [],
      routes: [],
      resupplyRoutes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "wh2",
      name: "Distribution Center East",
      code: "DCE001",
      address: {
        street: "456 Logistics Way",
        city: "Atlanta",
        state: "GA",
        zip: "30301",
        country: "USA"
      },
      isActive: true,
      company: "Inventara Inc",
      locations: [],
      routes: [],
      resupplyRoutes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const mockLocations: Location[] = [
    {
      id: "loc1",
      name: "Stock",
      completeName: "WH001/Stock",
      warehouse: "wh1",
      locationType: "internal",
      isScrapLocation: false,
      isReturnLocation: false,
      barcode: "LOC001",
      stockQuants: []
    },
    {
      id: "loc2",
      name: "Quality Control",
      completeName: "WH001/Stock/QC",
      warehouse: "wh1",
      parentLocation: "loc1",
      locationType: "internal",
      isScrapLocation: false,
      isReturnLocation: false,
      barcode: "LOC002",
      stockQuants: []
    },
    {
      id: "loc3",
      name: "Damage Returns",
      completeName: "WH001/Stock/Returns",
      warehouse: "wh1",
      parentLocation: "loc1",
      locationType: "internal",
      isScrapLocation: false,
      isReturnLocation: true,
      barcode: "LOC003",
      stockQuants: []
    },
    {
      id: "loc4",
      name: "Shipping Dock",
      completeName: "WH001/Output",
      warehouse: "wh1",
      locationType: "internal",
      isScrapLocation: false,
      isReturnLocation: false,
      barcode: "LOC004",
      stockQuants: []
    }
  ]

  const [warehouseForm, setWarehouseForm] = useState({
    name: "",
    code: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "USA"
  })

  const [locationForm, setLocationForm] = useState({
    name: "",
    warehouse: "",
    parentLocation: "",
    locationType: "internal" as const,
    isScrapLocation: false,
    isReturnLocation: false,
    barcode: ""
  })

  useEffect(() => {
    setTimeout(() => {
      setWarehouses(mockWarehouses)
      setLocations(mockLocations)
      setLoading(false)
    }, 1000)
  }, [])

  const handleCreateWarehouse = () => {
    if (!warehouseForm.name || !warehouseForm.code) return

    const newWarehouse: Warehouse = {
      id: `wh${Date.now()}`,
      name: warehouseForm.name,
      code: warehouseForm.code,
      address: {
        street: warehouseForm.street,
        city: warehouseForm.city,
        state: warehouseForm.state,
        zip: warehouseForm.zip,
        country: warehouseForm.country
      },
      isActive: true,
      company: "Inventara Inc",
      locations: [],
      routes: [],
      resupplyRoutes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setWarehouses([...warehouses, newWarehouse])
    setWarehouseForm({
      name: "",
      code: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "USA"
    })
    setIsCreateWarehouseOpen(false)
  }

  const handleCreateLocation = () => {
    if (!locationForm.name || !locationForm.warehouse) return

    const warehouse = warehouses.find(w => w.id === locationForm.warehouse)
    if (!warehouse) return

    const newLocation: Location = {
      id: `loc${Date.now()}`,
      name: locationForm.name,
      completeName: `${warehouse.code}/${locationForm.name}`,
      warehouse: locationForm.warehouse,
      parentLocation: locationForm.parentLocation || undefined,
      locationType: locationForm.locationType,
      isScrapLocation: locationForm.isScrapLocation,
      isReturnLocation: locationForm.isReturnLocation,
      barcode: locationForm.barcode,
      stockQuants: []
    }

    setLocations([...locations, newLocation])
    setLocationForm({
      name: "",
      warehouse: "",
      parentLocation: "",
      locationType: "internal",
      isScrapLocation: false,
      isReturnLocation: false,
      barcode: ""
    })
    setIsCreateLocationOpen(false)
  }

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case "internal":
        return "bg-blue-100 text-blue-800"
      case "vendor":
        return "bg-purple-100 text-purple-800"
      case "customer":
        return "bg-green-100 text-green-800"
      case "inventory":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredLocations = locations.filter(location => {
    if (selectedWarehouse === "all") return true
    return location.warehouse === selectedWarehouse
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
          <h1 className="text-3xl font-bold">Warehouse Management</h1>
          <p className="text-muted-foreground">
            Manage warehouses, locations, and stock transfers
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Move3D className="mr-2 h-4 w-4" />
            Internal Transfer
          </Button>
          <Button variant="outline" size="sm">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Stock Move
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouses.length}</div>
            <div className="text-xs text-muted-foreground">
              {warehouses.filter(w => w.isActive).length} active
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.length}</div>
            <div className="text-xs text-muted-foreground">
              Across {warehouses.length} warehouses
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transfers</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-muted-foreground">
              3 urgent
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Location Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <div className="text-xs text-muted-foreground">
              +5% from last week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="inventory">Inventory by Location</TabsTrigger>
        </TabsList>

        <TabsContent value="warehouses" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Warehouses
                </CardTitle>
                <Dialog open={isCreateWarehouseOpen} onOpenChange={setIsCreateWarehouseOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Warehouse
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Warehouse</DialogTitle>
                      <DialogDescription>
                        Add a new warehouse to your inventory system
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="warehouseName">Warehouse Name *</Label>
                          <Input
                            id="warehouseName"
                            value={warehouseForm.name}
                            onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                            placeholder="Enter warehouse name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="warehouseCode">Short Code *</Label>
                          <Input
                            id="warehouseCode"
                            value={warehouseForm.code}
                            onChange={(e) => setWarehouseForm({ ...warehouseForm, code: e.target.value })}
                            placeholder="WH001"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Address</h4>
                        <div className="grid gap-4">
                          <Input
                            placeholder="Street Address"
                            value={warehouseForm.street}
                            onChange={(e) => setWarehouseForm({ ...warehouseForm, street: e.target.value })}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              placeholder="City"
                              value={warehouseForm.city}
                              onChange={(e) => setWarehouseForm({ ...warehouseForm, city: e.target.value })}
                            />
                            <Input
                              placeholder="State"
                              value={warehouseForm.state}
                              onChange={(e) => setWarehouseForm({ ...warehouseForm, state: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              placeholder="ZIP Code"
                              value={warehouseForm.zip}
                              onChange={(e) => setWarehouseForm({ ...warehouseForm, zip: e.target.value })}
                            />
                            <Input
                              placeholder="Country"
                              value={warehouseForm.country}
                              onChange={(e) => setWarehouseForm({ ...warehouseForm, country: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateWarehouseOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateWarehouse}>
                        Create Warehouse
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Locations</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouses.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <WarehouseIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{warehouse.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{warehouse.code}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{warehouse.address.street}</p>
                          <p className="text-muted-foreground">
                            {warehouse.address.city}, {warehouse.address.state} {warehouse.address.zip}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {locations.filter(l => l.warehouse === warehouse.id).length} locations
                      </TableCell>
                      <TableCell>
                        <Badge variant={warehouse.isActive ? "default" : "secondary"}>
                          {warehouse.isActive ? "Active" : "Inactive"}
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
                              <MapPin className="mr-2 h-4 w-4" />
                              View Locations
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

        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Storage Locations
                </CardTitle>
                <div className="flex space-x-2">
                  <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All Warehouses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Warehouses</SelectItem>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={isCreateLocationOpen} onOpenChange={setIsCreateLocationOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Location
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Location</DialogTitle>
                        <DialogDescription>
                          Add a new storage location within a warehouse
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="locationName">Location Name *</Label>
                            <Input
                              id="locationName"
                              value={locationForm.name}
                              onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                              placeholder="Stock, QC, Shipping..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="warehouseSelect">Warehouse *</Label>
                            <Select
                              value={locationForm.warehouse}
                              onValueChange={(value) => setLocationForm({ ...locationForm, warehouse: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select warehouse" />
                              </SelectTrigger>
                              <SelectContent>
                                {warehouses.map((warehouse) => (
                                  <SelectItem key={warehouse.id} value={warehouse.id}>
                                    {warehouse.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="locationType">Location Type</Label>
                            <Select
                              value={locationForm.locationType}
                              onValueChange={(value: any) => setLocationForm({ ...locationForm, locationType: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="internal">Internal Location</SelectItem>
                                <SelectItem value="vendor">Vendor Location</SelectItem>
                                <SelectItem value="customer">Customer Location</SelectItem>
                                <SelectItem value="inventory">Inventory Adjustment</SelectItem>
                                <SelectItem value="procurement">Procurement</SelectItem>
                                <SelectItem value="production">Production</SelectItem>
                                <SelectItem value="transit">Transit Location</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="locationBarcode">Barcode</Label>
                            <Input
                              id="locationBarcode"
                              value={locationForm.barcode}
                              onChange={(e) => setLocationForm({ ...locationForm, barcode: e.target.value })}
                              placeholder="Scan or enter barcode"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="isScrapLocation"
                              checked={locationForm.isScrapLocation}
                              onChange={(e) => setLocationForm({ ...locationForm, isScrapLocation: e.target.checked })}
                              className="rounded"
                            />
                            <Label htmlFor="isScrapLocation">Scrap Location</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="isReturnLocation"
                              checked={locationForm.isReturnLocation}
                              onChange={(e) => setLocationForm({ ...locationForm, isReturnLocation: e.target.checked })}
                              className="rounded"
                            />
                            <Label htmlFor="isReturnLocation">Return Location</Label>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateLocationOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateLocation}>
                          Create Location
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Complete Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Stock Items</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLocations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{location.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {location.completeName}
                      </TableCell>
                      <TableCell>
                        <Badge className={getLocationTypeColor(location.locationType)} variant="secondary">
                          {location.locationType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {warehouses.find(w => w.id === location.warehouse)?.name}
                      </TableCell>
                      <TableCell>
                        {location.stockQuants.length} items
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {location.isScrapLocation && (
                            <Badge variant="destructive" className="text-xs">Scrap</Badge>
                          )}
                          {location.isReturnLocation && (
                            <Badge variant="outline" className="text-xs">Return</Badge>
                          )}
                        </div>
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
                              <Package className="mr-2 h-4 w-4" />
                              View Stock
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

        <TabsContent value="transfers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Internal Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ArrowRightLeft className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Transfer management coming soon...</p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Transfer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory by Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Location inventory view coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
