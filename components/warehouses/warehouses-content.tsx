"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2, 
  MapPin, 
  Package, 
  Users, 
  Plus, 
  Settings, 
  BarChart3, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Truck, 
  Warehouse as WarehouseIcon,
  Activity,
  Zap,
  Target,
  Gauge,
  Thermometer,
  Home
} from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

interface Warehouse {
  id: string
  name: string
  code: string
  location: string
  status: "Active" | "Maintenance" | "Inactive"
  capacity: number
  usedCapacity: number
  products: number
  staff: number
  zones: number
  temperature: number
  humidity: number
  lastUpdated: string
  alerts: number
  efficiency: number
}

const warehouses: Warehouse[] = [
  {
    id: "wh1",
    name: "Main Distribution Center",
    code: "MDC001",
    location: "123 Industrial Ave, City Center",
    status: "Active",
    capacity: 100000,
    usedCapacity: 85000,
    products: 847,
    staff: 12,
    zones: 8,
    temperature: 22,
    humidity: 45,
    lastUpdated: "2024-01-15T10:30:00",
    alerts: 2,
    efficiency: 92
  },
  {
    id: "wh2",
    name: "Distribution Center North",
    code: "DCN001",
    location: "456 Logistics Blvd, North District",
    status: "Active",
    capacity: 75000,
    usedCapacity: 46500,
    products: 523,
    staff: 8,
    zones: 6,
    temperature: 21,
    humidity: 48,
    lastUpdated: "2024-01-15T10:25:00",
    alerts: 0,
    efficiency: 88
  },
  {
    id: "wh3",
    name: "Storage Facility East",
    code: "SFE001",
    location: "789 Storage St, East Side",
    status: "Maintenance",
    capacity: 50000,
    usedCapacity: 22500,
    products: 234,
    staff: 4,
    zones: 4,
    temperature: 24,
    humidity: 52,
    lastUpdated: "2024-01-15T09:45:00",
    alerts: 3,
    efficiency: 65
  },
  {
    id: "wh4",
    name: "Cold Storage Facility",
    code: "CSF001",
    location: "321 Freezer Lane, Industrial Park",
    status: "Active",
    capacity: 30000,
    usedCapacity: 24000,
    products: 156,
    staff: 6,
    zones: 3,
    temperature: -18,
    humidity: 35,
    lastUpdated: "2024-01-15T10:15:00",
    alerts: 1,
    efficiency: 95
  }
]

const capacityTrends = [
  { month: 'Jan', capacity: 78, efficiency: 89 },
  { month: 'Feb', capacity: 82, efficiency: 91 },
  { month: 'Mar', capacity: 79, efficiency: 88 },
  { month: 'Apr', capacity: 85, efficiency: 92 },
  { month: 'May', capacity: 81, efficiency: 90 },
  { month: 'Jun', capacity: 87, efficiency: 93 }
]

const zoneDistribution = [
  { name: 'Storage', value: 45, color: '#8884d8' },
  { name: 'Picking', value: 25, color: '#82ca9d' },
  { name: 'Shipping', value: 20, color: '#ffc658' },
  { name: 'Receiving', value: 10, color: '#ff7300' }
]

const getStatusColor = (status: Warehouse["status"]) => {
  switch (status) {
    case "Active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "Maintenance": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "Inactive": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getStatusIcon = (status: Warehouse["status"]) => {
  switch (status) {
    case "Active": return <CheckCircle className="h-4 w-4" />
    case "Maintenance": return <Clock className="h-4 w-4" />
    case "Inactive": return <AlertTriangle className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

export function WarehousesContent() {
  const [selectedStatus, setSelectedStatus] = useState<Warehouse["status"] | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const filteredWarehouses = warehouses.filter(warehouse => {
    if (selectedStatus !== "all" && warehouse.status !== selectedStatus) return false
    if (searchQuery && !warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !warehouse.code.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const totalWarehouses = warehouses.length
  const activeWarehouses = warehouses.filter(w => w.status === "Active").length
  const totalProducts = warehouses.reduce((sum, w) => sum + w.products, 0)
  const totalStaff = warehouses.reduce((sum, w) => sum + w.staff, 0)
  const avgCapacity = warehouses.reduce((sum, w) => sum + (w.usedCapacity / w.capacity * 100), 0) / warehouses.length
  const totalAlerts = warehouses.reduce((sum, w) => sum + w.alerts, 0)

  const exportToCSV = () => {
    const headers = ["Name", "Code", "Location", "Status", "Capacity", "Used Capacity", "Products", "Staff", "Zones", "Efficiency"]
    const csvContent = [
      headers.join(","),
      ...filteredWarehouses.map(warehouse => [
        warehouse.name,
        warehouse.code,
        warehouse.location,
        warehouse.status,
        warehouse.capacity,
        warehouse.usedCapacity,
        warehouse.products,
        warehouse.staff,
        warehouse.zones,
        warehouse.efficiency
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `warehouses-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const viewWarehouseDetails = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse)
    setIsViewDialogOpen(true)
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
            <h1 className="text-3xl font-bold">Warehouse Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your warehouse locations, capacity, and operations</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button className="bg-[#4B6587] hover:bg-[#3A5068]">
            <Plus className="mr-2 h-4 w-4" />
            Add Warehouse
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
            <Building2 className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWarehouses}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              {activeWarehouses} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <Package className="h-3 w-3" />
              Across all warehouses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
              <Users className="h-3 w-3" />
              Warehouse personnel
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Capacity</CardTitle>
            <Gauge className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCapacity.toFixed(1)}%</div>
            <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
              <Target className="h-3 w-3" />
              Utilization rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Capacity & Efficiency Trends</CardTitle>
            <CardDescription>Monthly capacity utilization and efficiency metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={capacityTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line type="monotone" dataKey="capacity" stroke="#8884d8" strokeWidth={2} name="Capacity" />
                <Line type="monotone" dataKey="efficiency" stroke="#82ca9d" strokeWidth={2} name="Efficiency" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zone Distribution</CardTitle>
            <CardDescription>Distribution of warehouse zones by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={zoneDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {zoneDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 flex-wrap">
        <Select value={selectedStatus} onValueChange={(value: Warehouse["status"] | "all") => setSelectedStatus(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search warehouses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWarehouses.map((warehouse) => (
          <Card key={warehouse.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <WarehouseIcon className="h-5 w-5" />
                    <span>{warehouse.name}</span>
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-1 mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>{warehouse.location}</span>
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(warehouse.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(warehouse.status)}
                    {warehouse.status}
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Capacity Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Capacity Usage</span>
                  <span className="font-medium">{((warehouse.usedCapacity / warehouse.capacity) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(warehouse.usedCapacity / warehouse.capacity) * 100} className="h-2" />
                <div className="text-xs text-gray-500">
                  {warehouse.usedCapacity.toLocaleString()} / {warehouse.capacity.toLocaleString()} sq ft
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Products</p>
                  <p className="text-lg font-semibold">{warehouse.products.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Staff</p>
                  <p className="text-lg font-semibold">{warehouse.staff}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Zones</p>
                  <p className="text-lg font-semibold">{warehouse.zones}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Efficiency</p>
                  <p className="text-lg font-semibold">{warehouse.efficiency}%</p>
                </div>
              </div>

              {/* Environmental Conditions */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-xs text-gray-500">Temperature</p>
                    <p className="text-sm font-medium">{warehouse.temperature}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Humidity</p>
                    <p className="text-sm font-medium">{warehouse.humidity}%</p>
                  </div>
                </div>
              </div>

              {/* Alerts */}
              {warehouse.alerts > 0 && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700 dark:text-yellow-300">
                    {warehouse.alerts} alert{warehouse.alerts > 1 ? 's' : ''} requiring attention
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => viewWarehouseDetails(warehouse)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Warehouse Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Warehouse Details</DialogTitle>
            <DialogDescription>Comprehensive view of warehouse information and metrics</DialogDescription>
          </DialogHeader>
          {selectedWarehouse && (
            <div className="space-y-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="operations">Operations</TabsTrigger>
                  <TabsTrigger value="environment">Environment</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Warehouse Code</Label>
                      <p className="font-medium">{selectedWarehouse.code}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge className={getStatusColor(selectedWarehouse.status)}>
                        {selectedWarehouse.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Location</Label>
                      <p>{selectedWarehouse.location}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Last Updated</Label>
                      <p>{new Date(selectedWarehouse.lastUpdated).toLocaleString('en-US')}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Capacity Overview</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{selectedWarehouse.capacity.toLocaleString()}</p>
                        <p className="text-sm text-blue-600">Total Capacity (sq ft)</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{selectedWarehouse.usedCapacity.toLocaleString()}</p>
                        <p className="text-sm text-green-600">Used Capacity (sq ft)</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{((selectedWarehouse.usedCapacity / selectedWarehouse.capacity) * 100).toFixed(1)}%</p>
                        <p className="text-sm text-purple-600">Utilization Rate</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="operations" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Total Products</Label>
                      <p className="text-2xl font-bold">{selectedWarehouse.products.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Staff Members</Label>
                      <p className="text-2xl font-bold">{selectedWarehouse.staff}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Active Zones</Label>
                      <p className="text-2xl font-bold">{selectedWarehouse.zones}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Operational Efficiency</Label>
                      <p className="text-2xl font-bold">{selectedWarehouse.efficiency}%</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="environment" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Thermometer className="h-5 w-5 text-red-600" />
                        <Label className="text-sm font-medium">Temperature</Label>
                      </div>
                      <p className="text-3xl font-bold text-red-600">{selectedWarehouse.temperature}°C</p>
                      <p className="text-sm text-gray-600">Current reading</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        <Label className="text-sm font-medium">Humidity</Label>
                      </div>
                      <p className="text-3xl font-bold text-blue-600">{selectedWarehouse.humidity}%</p>
                      <p className="text-sm text-gray-600">Current reading</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Performance Metrics</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-500">Efficiency Score</p>
                        <p className="text-xl font-bold">{selectedWarehouse.efficiency}/100</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-500">Active Alerts</p>
                        <p className="text-xl font-bold">{selectedWarehouse.alerts}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="flex-1">
                  Close
                </Button>
                <Button className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Warehouse
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
