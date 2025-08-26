"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
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
  Move3D,
  Activity,
  Users,
  Truck,
  Archive,
  BarChart3,
  Settings,
  Copy,
  Eye,
  Download,
  Filter,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import { Warehouse, Location, WarehouseUtilization } from "@/lib/inventory-types"

interface WarehouseManagementProps {
  className?: string
}

interface WarehouseFormData {
  name: string
  code: string
  street: string
  street2: string
  city: string
  state: string
  zip: string
  country: string
  isActive: boolean
  company: string
  notes: string
}

interface WarehouseStats {
  totalWarehouses: number
  activeWarehouses: number
  totalLocations: number
  totalCapacity: number
  utilizationRate: number
  pendingTransfers: number
  criticalAlerts: number
  monthlyInbound: number
  monthlyOutbound: number
}

export function WarehouseManagement({ className }: WarehouseManagementProps) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [warehouseStats, setWarehouseStats] = useState<WarehouseStats | null>(null)
  const [warehouseUtilization, setWarehouseUtilization] = useState<WarehouseUtilization[]>([])
  
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("overview")
  const [isCreateWarehouseOpen, setIsCreateWarehouseOpen] = useState(false)
  const [isEditWarehouseOpen, setIsEditWarehouseOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null)
  const [warehouseToDelete, setWarehouseToDelete] = useState<string | null>(null)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  
  const initialFormState: WarehouseFormData = {
    name: "",
    code: "",
    street: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    country: "USA",
    isActive: true,
    company: "Inventara Inc",
    notes: ""
  }
  
  const [warehouseForm, setWarehouseForm] = useState<WarehouseFormData>(initialFormState)

  // Mock data - Enhanced
  const mockWarehouses: Warehouse[] = [
    {
      id: "wh1",
      name: "Main Distribution Center",
      code: "MDC001",
      address: {
        street: "2500 Industrial Boulevard",
        street2: "Suite 100",
        city: "Atlanta",
        state: "GA",
        zip: "30309",
        country: "USA"
      },
      isActive: true,
      company: "Inventara Inc",
      locations: [],
      routes: [],
      resupplyRoutes: [],
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-08-20")
    },
    {
      id: "wh2",
      name: "West Coast Facility",
      code: "WCF001",
      address: {
        street: "1234 Logistics Drive",
        city: "Los Angeles",
        state: "CA",
        zip: "90210",
        country: "USA"
      },
      isActive: true,
      company: "Inventara Inc",
      locations: [],
      routes: [],
      resupplyRoutes: [],
      createdAt: new Date("2024-02-10"),
      updatedAt: new Date("2024-08-18")
    },
    {
      id: "wh3",
      name: "Northeast Hub",
      code: "NEH001",
      address: {
        street: "567 Commerce Street",
        city: "Boston",
        state: "MA",
        zip: "02108",
        country: "USA"
      },
      isActive: false,
      company: "Inventara Inc",
      locations: [],
      routes: [],
      resupplyRoutes: [],
      createdAt: new Date("2024-03-05"),
      updatedAt: new Date("2024-07-15")
    }
  ]

  const mockStats: WarehouseStats = {
    totalWarehouses: 3,
    activeWarehouses: 2,
    totalLocations: 28,
    totalCapacity: 150000,
    utilizationRate: 78,
    pendingTransfers: 12,
    criticalAlerts: 3,
    monthlyInbound: 1250,
    monthlyOutbound: 1180
  }

  const mockUtilization: WarehouseUtilization[] = [
    {
      warehouse: mockWarehouses[0],
      totalLocations: 15,
      usedLocations: 12,
      utilizationPercent: 80,
      totalValue: 2500000
    },
    {
      warehouse: mockWarehouses[1],
      totalLocations: 10,
      usedLocations: 7,
      utilizationPercent: 70,
      totalValue: 1800000
    },
    {
      warehouse: mockWarehouses[2],
      totalLocations: 8,
      usedLocations: 2,
      utilizationPercent: 25,
      totalValue: 400000
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      setWarehouses(mockWarehouses)
      setWarehouseStats(mockStats)
      setWarehouseUtilization(mockUtilization)
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
        street2: warehouseForm.street2,
        city: warehouseForm.city,
        state: warehouseForm.state,
        zip: warehouseForm.zip,
        country: warehouseForm.country
      },
      isActive: warehouseForm.isActive,
      company: warehouseForm.company,
      locations: [],
      routes: [],
      resupplyRoutes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setWarehouses([...warehouses, newWarehouse])
    setWarehouseForm(initialFormState)
    setIsCreateWarehouseOpen(false)
  }

  const handleEditWarehouse = () => {
    if (!selectedWarehouse || !warehouseForm.name || !warehouseForm.code) return

    const updatedWarehouses = warehouses.map(w => 
      w.id === selectedWarehouse.id 
        ? {
            ...w,
            name: warehouseForm.name,
            code: warehouseForm.code,
            address: {
              street: warehouseForm.street,
              street2: warehouseForm.street2,
              city: warehouseForm.city,
              state: warehouseForm.state,
              zip: warehouseForm.zip,
              country: warehouseForm.country
            },
            isActive: warehouseForm.isActive,
            company: warehouseForm.company,
            updatedAt: new Date()
          }
        : w
    )

    setWarehouses(updatedWarehouses)
    setWarehouseForm(initialFormState)
    setSelectedWarehouse(null)
    setIsEditWarehouseOpen(false)
  }

  const handleDeleteWarehouse = () => {
    if (!warehouseToDelete) return
    
    setWarehouses(warehouses.filter(w => w.id !== warehouseToDelete))
    setWarehouseToDelete(null)
    setIsDeleteAlertOpen(false)
  }

  const openEditDialog = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse)
    setWarehouseForm({
      name: warehouse.name,
      code: warehouse.code,
      street: warehouse.address.street || "",
      street2: warehouse.address.street2 || "",
      city: warehouse.address.city || "",
      state: warehouse.address.state || "",
      zip: warehouse.address.zip || "",
      country: warehouse.address.country || "USA",
      isActive: warehouse.isActive,
      company: warehouse.company,
      notes: ""
    })
    setIsEditWarehouseOpen(true)
  }

  const filteredWarehouses = warehouses.filter(warehouse => {
    const matchesSearch = warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warehouse.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warehouse.address.city?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && warehouse.isActive) ||
                         (statusFilter === "inactive" && !warehouse.isActive)
    
    return matchesSearch && matchesStatus
  })

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  const getUtilizationBadgeVariant = (percentage: number) => {
    if (percentage >= 90) return "destructive"
    if (percentage >= 75) return "secondary"
    return "default"
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
          <h1 className="text-3xl font-bold">Warehouse Management</h1>
          <p className="text-muted-foreground">
            Manage warehouses, locations, capacity, and operations
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Dialog open={isCreateWarehouseOpen} onOpenChange={setIsCreateWarehouseOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Warehouse
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Warehouse</DialogTitle>
                <DialogDescription>
                  Add a new warehouse facility to your inventory network
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="warehouseName">Warehouse Name *</Label>
                      <Input
                        id="warehouseName"
                        value={warehouseForm.name}
                        onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                        placeholder="Main Distribution Center"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="warehouseCode">Short Code *</Label>
                      <Input
                        id="warehouseCode"
                        value={warehouseForm.code}
                        onChange={(e) => setWarehouseForm({ ...warehouseForm, code: e.target.value.toUpperCase() })}
                        placeholder="MDC001"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={warehouseForm.company}
                        onChange={(e) => setWarehouseForm({ ...warehouseForm, company: e.target.value })}
                        placeholder="Inventara Inc"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <Switch
                        id="isActive"
                        checked={warehouseForm.isActive}
                        onCheckedChange={(checked) => setWarehouseForm({ ...warehouseForm, isActive: checked })}
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Address Information
                  </h4>
                  <div className="grid gap-4">
                    <Input
                      placeholder="Street Address"
                      value={warehouseForm.street}
                      onChange={(e) => setWarehouseForm({ ...warehouseForm, street: e.target.value })}
                    />
                    <Input
                      placeholder="Street Address 2 (Optional)"
                      value={warehouseForm.street2}
                      onChange={(e) => setWarehouseForm({ ...warehouseForm, street2: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="City"
                        value={warehouseForm.city}
                        onChange={(e) => setWarehouseForm({ ...warehouseForm, city: e.target.value })}
                      />
                      <Input
                        placeholder="State/Province"
                        value={warehouseForm.state}
                        onChange={(e) => setWarehouseForm({ ...warehouseForm, state: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="ZIP/Postal Code"
                        value={warehouseForm.zip}
                        onChange={(e) => setWarehouseForm({ ...warehouseForm, zip: e.target.value })}
                      />
                      <Select
                        value={warehouseForm.country}
                        onValueChange={(value) => setWarehouseForm({ ...warehouseForm, country: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USA">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Mexico">Mexico</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={warehouseForm.notes}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, notes: e.target.value })}
                    placeholder="Additional notes about this warehouse..."
                    rows={3}
                  />
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
      </div>

      {/* Stats Cards */}
      {warehouseStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{warehouseStats.totalWarehouses}</div>
              <div className="text-xs text-muted-foreground">
                {warehouseStats.activeWarehouses} active, {warehouseStats.totalWarehouses - warehouseStats.activeWarehouses} inactive
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Locations</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{warehouseStats.totalLocations}</div>
              <div className="text-xs text-muted-foreground">
                {warehouseStats.utilizationRate}% utilized
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Transfers</CardTitle>
              <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{warehouseStats.pendingTransfers}</div>
              <div className="text-xs text-muted-foreground">
                {warehouseStats.criticalAlerts} critical alerts
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Activity</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{warehouseStats.monthlyInbound}</div>
              <div className="text-xs text-muted-foreground">
                {warehouseStats.monthlyInbound} in, {warehouseStats.monthlyOutbound} out
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Warehouse Status Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Warehouse Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {warehouses.slice(0, 3).map((warehouse) => (
                  <div key={warehouse.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${warehouse.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium">{warehouse.name}</p>
                        <p className="text-sm text-muted-foreground">{warehouse.code}</p>
                      </div>
                    </div>
                    <Badge variant={warehouse.isActive ? "default" : "secondary"}>
                      {warehouse.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Internal Transfer
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Inventory Adjustment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Routes
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search warehouses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Warehouses ({filteredWarehouses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Locations</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWarehouses.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <WarehouseIcon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{warehouse.name}</p>
                            <p className="text-sm text-muted-foreground">{warehouse.company}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{warehouse.code}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{warehouse.address.city}, {warehouse.address.state}</p>
                          <p className="text-muted-foreground">{warehouse.address.country}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {locations.filter(l => l.warehouse === warehouse.id).length} locations
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${warehouse.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                          <Badge variant={warehouse.isActive ? "default" : "secondary"}>
                            {warehouse.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(warehouse.createdAt).toLocaleDateString('en-US')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEditDialog(warehouse)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Locations
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Archive className="mr-2 h-4 w-4" />
                              {warehouse.isActive ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                setWarehouseToDelete(warehouse.id)
                                setIsDeleteAlertOpen(true)
                              }}
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
        </TabsContent>

        <TabsContent value="utilization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Warehouse Utilization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {warehouseUtilization.map((util) => (
                <div key={util.warehouse.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{util.warehouse.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {util.usedLocations}/{util.totalLocations} locations used
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={getUtilizationBadgeVariant(util.utilizationPercent)}>
                        {util.utilizationPercent}%
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        ${util.totalValue.toLocaleString()} value
                      </p>
                    </div>
                  </div>
                  <Progress value={util.utilizationPercent} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowRightLeft className="mr-2 h-5 w-5" />
                Internal Transfers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Active Transfers</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first internal transfer to move inventory between locations
                </p>
                <div className="flex justify-center space-x-4">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Transfer
                  </Button>
                  <Button variant="outline">
                    <Clock className="mr-2 h-4 w-4" />
                    View History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Warehouse Dialog */}
      <Dialog open={isEditWarehouseOpen} onOpenChange={setIsEditWarehouseOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Warehouse</DialogTitle>
            <DialogDescription>
              Update warehouse information and settings
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Same form structure as create, but for editing */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Basic Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editWarehouseName">Warehouse Name *</Label>
                  <Input
                    id="editWarehouseName"
                    value={warehouseForm.name}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                    placeholder="Main Distribution Center"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editWarehouseCode">Short Code *</Label>
                  <Input
                    id="editWarehouseCode"
                    value={warehouseForm.code}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, code: e.target.value.toUpperCase() })}
                    placeholder="MDC001"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editCompany">Company</Label>
                  <Input
                    id="editCompany"
                    value={warehouseForm.company}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, company: e.target.value })}
                    placeholder="Inventara Inc"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="editIsActive"
                    checked={warehouseForm.isActive}
                    onCheckedChange={(checked) => setWarehouseForm({ ...warehouseForm, isActive: checked })}
                  />
                  <Label htmlFor="editIsActive">Active</Label>
                </div>
              </div>
            </div>

            {/* Address section same as create */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Address Information
              </h4>
              <div className="grid gap-4">
                <Input
                  placeholder="Street Address"
                  value={warehouseForm.street}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, street: e.target.value })}
                />
                <Input
                  placeholder="Street Address 2 (Optional)"
                  value={warehouseForm.street2}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, street2: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="City"
                    value={warehouseForm.city}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, city: e.target.value })}
                  />
                  <Input
                    placeholder="State/Province"
                    value={warehouseForm.state}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, state: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="ZIP/Postal Code"
                    value={warehouseForm.zip}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, zip: e.target.value })}
                  />
                  <Select
                    value={warehouseForm.country}
                    onValueChange={(value) => setWarehouseForm({ ...warehouseForm, country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USA">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Mexico">Mexico</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditWarehouseOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditWarehouse}>
              Update Warehouse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the warehouse
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWarehouse} className="bg-red-600 hover:bg-red-700">
              Delete Warehouse
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
