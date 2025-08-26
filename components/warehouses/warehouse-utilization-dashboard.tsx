"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Building,
  MapPin,
  Package,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  Target,
  Clock,
  DollarSign,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  RefreshCcw,
  Download,
  Filter,
  Calendar,
  Thermometer,
  Gauge,
  PieChart,
  BarChart,
  LineChart,
  Eye,
  Settings
} from "lucide-react"
import { Warehouse, Location, WarehouseUtilization } from "@/lib/inventory-types"

interface UtilizationDashboardProps {
  className?: string
}

interface CapacityMetrics {
  totalCapacity: number
  usedCapacity: number
  availableCapacity: number
  utilizationPercentage: number
  trend: "up" | "down" | "stable"
  changePercent: number
}

interface LocationHeatMapData {
  locationId: string
  locationName: string
  completeName: string
  utilization: number
  capacity: number
  value: number
  status: "optimal" | "high" | "critical" | "low"
  lastUpdated: Date
}

interface PerformanceMetrics {
  throughput: number
  turnoverRate: number
  pickingEfficiency: number
  accuracyRate: number
  cycleTime: number
  costPerUnit: number
}

interface AlertData {
  id: string
  type: "capacity" | "efficiency" | "maintenance" | "safety"
  severity: "low" | "medium" | "high" | "critical"
  location: string
  message: string
  timestamp: Date
  resolved: boolean
}

export function WarehouseUtilizationDashboard({ className }: UtilizationDashboardProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all")
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("7d")
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("overview")
  
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [capacityMetrics, setCapacityMetrics] = useState<CapacityMetrics | null>(null)
  const [locationHeatMap, setLocationHeatMap] = useState<LocationHeatMapData[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null)
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [warehouseUtilization, setWarehouseUtilization] = useState<WarehouseUtilization[]>([])

  // Mock data
  const mockWarehouses: Warehouse[] = [
    {
      id: "wh1",
      name: "Main Distribution Center",
      code: "MDC001",
      address: { city: "Atlanta", state: "GA", country: "USA" },
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
      name: "West Coast Facility",
      code: "WCF001",
      address: { city: "Los Angeles", state: "CA", country: "USA" },
      isActive: true,
      company: "Inventara Inc",
      locations: [],
      routes: [],
      resupplyRoutes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "wh3",
      name: "Northeast Hub",
      code: "NEH001",
      address: { city: "Boston", state: "MA", country: "USA" },
      isActive: true,
      company: "Inventara Inc",
      locations: [],
      routes: [],
      resupplyRoutes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const mockCapacityMetrics: CapacityMetrics = {
    totalCapacity: 150000,
    usedCapacity: 117000,
    availableCapacity: 33000,
    utilizationPercentage: 78,
    trend: "up",
    changePercent: 5.2
  }

  const mockHeatMapData: LocationHeatMapData[] = [
    {
      locationId: "loc1",
      locationName: "Receiving Area",
      completeName: "MDC001/Stock/Receiving",
      utilization: 85,
      capacity: 5000,
      value: 125000,
      status: "high",
      lastUpdated: new Date()
    },
    {
      locationId: "loc2",
      locationName: "Aisle A",
      completeName: "MDC001/Stock/Aisle-A",
      utilization: 95,
      capacity: 8000,
      value: 245000,
      status: "critical",
      lastUpdated: new Date()
    },
    {
      locationId: "loc3",
      locationName: "Aisle B",
      completeName: "MDC001/Stock/Aisle-B",
      utilization: 65,
      capacity: 8000,
      value: 185000,
      status: "optimal",
      lastUpdated: new Date()
    },
    {
      locationId: "loc4",
      locationName: "Cold Storage",
      completeName: "MDC001/Cold/Zone-1",
      utilization: 45,
      capacity: 3000,
      value: 89000,
      status: "low",
      lastUpdated: new Date()
    },
    {
      locationId: "loc5",
      locationName: "Returns Area",
      completeName: "MDC001/Returns/Processing",
      utilization: 30,
      capacity: 2000,
      value: 15000,
      status: "low",
      lastUpdated: new Date()
    }
  ]

  const mockPerformanceMetrics: PerformanceMetrics = {
    throughput: 1250,
    turnoverRate: 12.5,
    pickingEfficiency: 94.2,
    accuracyRate: 99.1,
    cycleTime: 2.3,
    costPerUnit: 3.45
  }

  const mockAlerts: AlertData[] = [
    {
      id: "alert1",
      type: "capacity",
      severity: "critical",
      location: "MDC001/Stock/Aisle-A",
      message: "Location at 95% capacity - immediate attention required",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      resolved: false
    },
    {
      id: "alert2",
      type: "efficiency",
      severity: "high",
      location: "WCF001/Shipping",
      message: "Picking efficiency dropped to 78% - below target",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolved: false
    },
    {
      id: "alert3",
      type: "maintenance",
      severity: "medium",
      location: "MDC001/Equipment/Forklift-03",
      message: "Scheduled maintenance due in 2 days",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      resolved: false
    },
    {
      id: "alert4",
      type: "safety",
      severity: "low",
      location: "NEH001/Receiving",
      message: "Temperature sensor calibration recommended",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      resolved: true
    }
  ]

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
      usedLocations: 6,
      utilizationPercent: 75,
      totalValue: 1200000
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      setWarehouses(mockWarehouses)
      setCapacityMetrics(mockCapacityMetrics)
      setLocationHeatMap(mockHeatMapData)
      setPerformanceMetrics(mockPerformanceMetrics)
      setAlerts(mockAlerts)
      setWarehouseUtilization(mockUtilization)
      setLoading(false)
    }, 1000)
  }, [])

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-yellow-600"
    if (percentage >= 50) return "text-green-600"
    return "text-blue-600"
  }

  const getUtilizationBadgeVariant = (percentage: number) => {
    if (percentage >= 90) return "destructive"
    if (percentage >= 75) return "secondary"
    return "default"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "optimal":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "capacity":
        return <Package className="h-4 w-4" />
      case "efficiency":
        return <Zap className="h-4 w-4" />
      case "maintenance":
        return <Settings className="h-4 w-4" />
      case "safety":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const formatValue = (value: number, type: "currency" | "percentage" | "number" | "decimal") => {
    switch (type) {
      case "currency":
        return `$${value.toLocaleString()}`
      case "percentage":
        return `${value}%`
      case "decimal":
        return value.toFixed(1)
      default:
        return value.toLocaleString()
    }
  }

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved)
  const criticalAlerts = unresolvedAlerts.filter(alert => alert.severity === "critical")

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
          <h1 className="text-3xl font-bold">Warehouse Utilization Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor capacity, performance, and efficiency across all facilities
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
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
          
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-800 dark:text-red-200">
                {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''} Requiring Attention
              </span>
              <Button variant="outline" size="sm" className="ml-auto">
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Metrics */}
      {capacityMetrics && performanceMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatValue(capacityMetrics.totalCapacity, "number")}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatValue(capacityMetrics.availableCapacity, "number")} available
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilization</CardTitle>
              <Gauge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getUtilizationColor(capacityMetrics.utilizationPercentage)}`}>
                {capacityMetrics.utilizationPercentage}%
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {capacityMetrics.trend === "up" ? (
                  <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                ) : capacityMetrics.trend === "down" ? (
                  <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
                ) : (
                  <ArrowRight className="h-3 w-3 text-gray-600 mr-1" />
                )}
                {formatValue(capacityMetrics.changePercent, "decimal")}% vs last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Throughput</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatValue(performanceMetrics.throughput, "number")}
              </div>
              <div className="text-xs text-muted-foreground">
                units/day
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatValue(performanceMetrics.pickingEfficiency, "decimal")}%
              </div>
              <div className="text-xs text-muted-foreground">
                picking efficiency
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatValue(performanceMetrics.accuracyRate, "decimal")}%
              </div>
              <div className="text-xs text-muted-foreground">
                order accuracy
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost/Unit</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatValue(performanceMetrics.costPerUnit, "currency")}
              </div>
              <div className="text-xs text-muted-foreground">
                avg handling cost
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="heatmap">Location Heat Map</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Warehouse Utilization Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Warehouse Utilization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {warehouseUtilization.map((util) => (
                  <div key={util.warehouse.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{util.warehouse.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {util.usedLocations}/{util.totalLocations} locations
                        </p>
                      </div>
                      <Badge variant={getUtilizationBadgeVariant(util.utilizationPercent)}>
                        {util.utilizationPercent}%
                      </Badge>
                    </div>
                    <Progress value={util.utilizationPercent} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {formatValue(util.totalValue, "currency")} total value
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Capacity Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Capacity Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                {capacityMetrics && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Used Capacity</span>
                        <span className="font-medium">
                          {formatValue(capacityMetrics.usedCapacity, "number")}
                        </span>
                      </div>
                      <Progress value={capacityMetrics.utilizationPercentage} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {formatValue(capacityMetrics.availableCapacity, "number")}
                        </div>
                        <div className="text-xs text-muted-foreground">Available</div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatValue(capacityMetrics.utilizationPercentage, "percentage")}
                        </div>
                        <div className="text-xs text-muted-foreground">Utilized</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Thermometer className="mr-2 h-5 w-5" />
                Location Utilization Heat Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationHeatMap.map((location) => (
                  <div key={location.locationId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col space-y-1">
                        <div className="font-medium">{location.locationName}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {location.completeName}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">
                          {formatValue(location.value, "currency")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatValue(location.capacity, "number")} capacity
                        </div>
                      </div>
                      
                      <div className="w-32">
                        <Progress value={location.utilization} className="h-2" />
                        <div className="text-xs text-center mt-1">
                          {location.utilization}%
                        </div>
                      </div>
                      
                      <Badge className={getStatusColor(location.status)} variant="secondary">
                        {location.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Operational Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceMetrics && (
                  <>
                    <div className="flex justify-between">
                      <span>Turnover Rate</span>
                      <span className="font-medium">{performanceMetrics.turnoverRate}x/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cycle Time</span>
                      <span className="font-medium">{performanceMetrics.cycleTime} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Throughput</span>
                      <span className="font-medium">{formatValue(performanceMetrics.throughput, "number")}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceMetrics && (
                  <>
                    <div className="flex justify-between">
                      <span>Picking Accuracy</span>
                      <span className="font-medium text-green-600">
                        {performanceMetrics.accuracyRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Picking Efficiency</span>
                      <span className="font-medium text-green-600">
                        {performanceMetrics.pickingEfficiency}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Rate</span>
                      <span className="font-medium">
                        {(100 - performanceMetrics.accuracyRate).toFixed(1)}%
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceMetrics && (
                  <>
                    <div className="flex justify-between">
                      <span>Cost per Unit</span>
                      <span className="font-medium">
                        {formatValue(performanceMetrics.costPerUnit, "currency")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor Cost</span>
                      <span className="font-medium">
                        {formatValue(performanceMetrics.costPerUnit * 0.6, "currency")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equipment Cost</span>
                      <span className="font-medium">
                        {formatValue(performanceMetrics.costPerUnit * 0.4, "currency")}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <LineChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Performance Analytics</h3>
                <p className="text-muted-foreground">
                  Detailed performance charts and trend analysis coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Alert Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alert Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Critical</span>
                  <Badge variant="destructive">
                    {alerts.filter(a => a.severity === "critical" && !a.resolved).length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>High</span>
                  <Badge variant="secondary">
                    {alerts.filter(a => a.severity === "high" && !a.resolved).length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Medium</span>
                  <Badge variant="outline">
                    {alerts.filter(a => a.severity === "medium" && !a.resolved).length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Low</span>
                  <Badge variant="outline">
                    {alerts.filter(a => a.severity === "low" && !a.resolved).length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.slice(0, 6).map((alert) => (
                      <div
                        key={alert.id}
                        className={`flex items-start space-x-3 p-3 border rounded-lg ${
                          alert.resolved ? "opacity-50" : ""
                        }`}
                      >
                        <div className={`mt-0.5 ${getSeverityColor(alert.severity)}`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {alert.type}
                            </Badge>
                            <Badge 
                              variant={alert.severity === "critical" ? "destructive" : "outline"}
                              className="text-xs"
                            >
                              {alert.severity}
                            </Badge>
                            {alert.resolved && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <p className="text-sm font-medium mt-1">{alert.message}</p>
                          <div className="text-xs text-muted-foreground mt-1">
                            <span>{alert.location}</span>
                            <span className="mx-2">•</span>
                            <span>{alert.timestamp.toLocaleString('en-US')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
