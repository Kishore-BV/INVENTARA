"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  AlertTriangle,
  Package,
  Warehouse,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Download,
  Scan,
  MapPin,
  Calendar,
  DollarSign,
  BarChart3,
  Activity,
  Truck,
  ShoppingCart,
  AlertCircle,
  TreePine,
  Building,
  Gauge,
  Settings,
  Eye,
  Zap
} from "lucide-react"
import { InventoryDashboard, ProductStockInfo, StockMove, Product, ProductCategory, Supplier, UnitOfMeasure } from "@/lib/inventory-types"
import { ProductCatalog } from "@/components/products/product-catalog"
import { WarehouseManagement } from "@/components/warehouses/warehouse-management"
import { LocationHierarchy } from "@/components/locations/location-hierarchy"
import { WarehouseUtilizationDashboard } from "@/components/warehouses/warehouse-utilization-dashboard"

interface InventoryDashboardProps {
  className?: string
}

export function InventoryDashboardComponent({ className }: InventoryDashboardProps) {
  const [dashboardData, setDashboardData] = useState<InventoryDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("overview")

  // Mock data for product catalog - In real app, this would come from API
  const mockCategories: ProductCategory[] = [
    {
      id: "cat1",
      name: "Electronics",
      routes: [],
      removalStrategy: "fifo"
    },
    {
      id: "cat2", 
      name: "Furniture",
      routes: [],
      removalStrategy: "fifo"
    },
    {
      id: "cat3",
      name: "Office Supplies", 
      routes: [],
      removalStrategy: "fifo"
    }
  ]

  const mockSuppliers: Supplier[] = [
    {
      id: "sup1",
      name: "Apple Inc.",
      displayName: "Apple Inc.",
      email: "orders@apple.com",
      isCompany: true,
      isVendor: true,
      isCustomer: false,
      address: {
        street: "1 Apple Park Way",
        city: "Cupertino", 
        state: "CA",
        zip: "95014",
        country: "USA"
      },
      currency: "USD",
      isActive: true,
      supplierRank: 1,
      customerRank: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const mockUnitOfMeasures: UnitOfMeasure[] = [
    {
      id: "uom1",
      name: "Units",
      category: "Unit",
      type: "reference",
      ratio: 1,
      rounding: 0.01,
      isActive: true
    },
    {
      id: "uom2",
      name: "Kilograms",
      category: "Weight",
      type: "reference",
      ratio: 1,
      rounding: 0.001,
      isActive: true
    }
  ]

  const mockProducts: Product[] = [
    {
      id: "p1",
      name: "MacBook Pro 16-inch",
      internalReference: "MBP16-2023",
      barcode: "8001234567890",
      productType: "storable",
      salesPrice: 2499.99,
      cost: 1999.99,
      currency: "USD",
      isActive: true,
      canBeSold: true,
      canBePurchased: true,
      trackingMethod: "serial",
      expirationTracking: false,
      routes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      category: mockCategories[0],
      unitOfMeasure: mockUnitOfMeasures[0],
      supplier: mockSuppliers[0],
      description: "Latest MacBook Pro with M2 Pro chip"
    },
    {
      id: "p2",
      name: "Dell Monitor 27-inch",
      internalReference: "DELL27-2023",
      barcode: "8001234567891",
      productType: "storable",
      salesPrice: 599.99,
      cost: 399.99,
      currency: "USD",
      isActive: true,
      canBeSold: true,
      canBePurchased: true,
      trackingMethod: "none",
      expirationTracking: false,
      routes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      category: mockCategories[0],
      unitOfMeasure: mockUnitOfMeasures[0],
      description: "4K Ultra HD Monitor with USB-C"
    }
  ]

  // Mock data - In real app, this would come from API
  const mockDashboardData: InventoryDashboard = {
    totalProducts: 1247,
    totalLocations: 45,
    totalValue: 892450.75,
    lowStockAlerts: 23,
    pendingMoves: 156,
    recentMovements: [
      {
        id: "1",
        name: "WH/IN/00001",
        product: {
          id: "p1",
          name: "MacBook Pro 16-inch",
          internalReference: "MBP16-2023",
          productType: "storable",
          salesPrice: 2499.99,
          cost: 1999.99,
          currency: "USD",
          isActive: true,
          canBeSold: true,
          canBePurchased: true,
          trackingMethod: "serial",
          expirationTracking: false,
          routes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          category: {
            id: "cat1",
            name: "Electronics",
            routes: [],
            removalStrategy: "fifo"
          },
          unitOfMeasure: {
            id: "uom1",
            name: "Units",
            category: "Unit",
            type: "reference",
            ratio: 1,
            rounding: 0.01,
            isActive: true
          }
        },
        productQty: 10,
        productUom: {
          id: "uom1",
          name: "Units",
          category: "Unit",
          type: "reference",
          ratio: 1,
          rounding: 0.01,
          isActive: true
        },
        locationId: {
          id: "loc1",
          name: "Stock",
          completeName: "WH/Stock",
          warehouse: "WH",
          locationType: "internal",
          isScrapLocation: false,
          isReturnLocation: false,
          stockQuants: []
        },
        locationDestId: {
          id: "loc2",
          name: "Customers",
          completeName: "Partners/Customers",
          warehouse: "WH",
          locationType: "customer",
          isScrapLocation: false,
          isReturnLocation: false,
          stockQuants: []
        },
        state: "assigned",
        dateExpected: new Date(),
        date: new Date(),
        reference: "SO001",
        moveDestIds: [],
        moveOrigIds: [],
        scrapped: false,
        sequence: 1,
        priority: "1",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    topProducts: [
      {
        product: {
          id: "p1",
          name: "MacBook Pro 16-inch",
          internalReference: "MBP16-2023",
          productType: "storable",
          salesPrice: 2499.99,
          cost: 1999.99,
          currency: "USD",
          isActive: true,
          canBeSold: true,
          canBePurchased: true,
          trackingMethod: "serial",
          expirationTracking: false,
          routes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          category: {
            id: "cat1",
            name: "Electronics",
            routes: [],
            removalStrategy: "fifo"
          },
          unitOfMeasure: {
            id: "uom1",
            name: "Units",
            category: "Unit",
            type: "reference",
            ratio: 1,
            rounding: 0.01,
            isActive: true
          }
        },
        onHandQuantity: 25,
        forecastedQuantity: 30,
        reservedQuantity: 5,
        value: 49999.75,
        locations: []
      }
    ],
    warehouseUtilization: [
      {
        warehouse: {
          id: "wh1",
          name: "Main Warehouse",
          code: "WH",
          address: {
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "USA"
          },
          isActive: true,
          company: "Company",
          locations: [],
          routes: [],
          resupplyRoutes: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        totalLocations: 25,
        usedLocations: 18,
        utilizationPercent: 72,
        totalValue: 650000
      }
    ]
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDashboardData(mockDashboardData)
      setLoading(false)
    }, 1000)
  }, [])

  const getStateColor = (state: string) => {
    switch (state) {
      case "done":
        return "bg-green-100 text-green-800"
      case "assigned":
        return "bg-blue-100 text-blue-800"
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "cancel":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage your inventory, track stock movements, and optimize operations
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setSelectedTab("warehouses")}>
            <Building className="mr-2 h-4 w-4" />
            Warehouses
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSelectedTab("locations")}>
            <TreePine className="mr-2 h-4 w-4" />
            Locations
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSelectedTab("utilization")}>
            <Gauge className="mr-2 h-4 w-4" />
            Utilization
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Scan className="mr-2 h-4 w-4" />
            Scan Barcode
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalProducts.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>+12% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalValue)}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>+8% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warehouses</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.warehouseUtilization.length}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-blue-500" />
              <span>All active</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalLocations}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Gauge className="h-3 w-3 text-blue-500" />
              <span>78% utilization</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{dashboardData.lowStockAlerts}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-red-500" />
              <span>3 critical items</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Moves</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.pendingMoves}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3 text-yellow-500" />
              <span>12 overdue</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
          <TabsTrigger value="moves">Stock Moves</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Movements */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Stock Movements</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentMovements.map((move) => (
                    <div key={move.id} className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                      <div className="flex-shrink-0">
                        {move.locationId.locationType === 'internal' ? (
                          <Warehouse className="h-8 w-8 text-blue-500" />
                        ) : (
                          <Truck className="h-8 w-8 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{move.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {move.locationId.name} → {move.locationDestId.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{move.productQty} units</p>
                        <Badge className={getStateColor(move.state)} variant="secondary">
                          {move.state}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Top Products by Value</CardTitle>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.topProducts.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.product.internalReference}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(item.value)}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.onHandQuantity} on hand
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Warehouse Utilization */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Gauge className="mr-2 h-5 w-5" />
                  Warehouse Utilization
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => setSelectedTab("utilization")}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dashboardData.warehouseUtilization.map((warehouse) => (
                  <div key={warehouse.warehouse.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{warehouse.warehouse.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">
                          {warehouse.usedLocations}/{warehouse.totalLocations} locations
                        </span>
                        <span className="ml-2 text-sm font-medium">
                          {warehouse.utilizationPercent}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          warehouse.utilizationPercent >= 90 
                            ? 'bg-red-500' 
                            : warehouse.utilizationPercent >= 75 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                        }`}
                        style={{ width: `${warehouse.utilizationPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Total Value: {formatCurrency(warehouse.totalValue)}</span>
                      <span>{warehouse.warehouse.address.city}, {warehouse.warehouse.address.state}</span>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm font-medium text-green-600">Optimal</div>
                      <div className="text-xs text-muted-foreground">50-75%</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-yellow-600">High</div>
                      <div className="text-xs text-muted-foreground">75-90%</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-red-600">Critical</div>
                      <div className="text-xs text-muted-foreground">90%+</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <ProductCatalog 
            products={mockProducts}
            categories={mockCategories}
            suppliers={mockSuppliers}
            unitOfMeasures={mockUnitOfMeasures}
            onProductAdd={(product) => console.log('Add product:', product)}
            onProductEdit={(product) => console.log('Edit product:', product)}
            onProductDelete={(productId) => console.log('Delete product:', productId)}
          />
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-6">
          <WarehouseManagement />
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <LocationHierarchy />
        </TabsContent>

        <TabsContent value="utilization" className="space-y-6">
          <WarehouseUtilizationDashboard />
        </TabsContent>

        <TabsContent value="moves" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Stock movement tracking coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Reporting dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { InventoryDashboardComponent as InventoryDashboard }
