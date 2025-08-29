"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Award,
  Download,
  RefreshCw,
  Truck,
  Package,
  DollarSign,
  Star,
  Home
} from "lucide-react"
import { toast } from "sonner"
import type { Supplier, SupplierPerformance } from "@/lib/inventory-types"

// Helper function to get initials
const getInitials = (name: string) => {
  return name.split(" ").map(part => part[0]).join("").toUpperCase().slice(0, 2)
}

// Mock data
const mockSuppliers: Supplier[] = [
  {
    id: "SUP-001", name: "TechCorp Solutions", displayName: "TechCorp Solutions Ltd.",
    isCompany: true, isVendor: true, isCustomer: false,
    address: { city: "Mumbai", state: "Maharashtra", country: "India" },
    currency: "INR", paymentTerms: "Net 30", isActive: true,
    supplierRank: 5, customerRank: 0,
    createdAt: new Date("2023-01-15"), updatedAt: new Date("2024-01-20")
  },
  {
    id: "SUP-002", name: "Global Industrial Supplies", displayName: "Global Industrial Supplies Pvt Ltd",
    isCompany: true, isVendor: true, isCustomer: false,
    address: { city: "Delhi", state: "NCR", country: "India" },
    currency: "INR", paymentTerms: "Net 45", isActive: true,
    supplierRank: 4, customerRank: 0,
    createdAt: new Date("2023-02-10"), updatedAt: new Date("2024-01-18")
  },
  {
    id: "SUP-003", name: "Quality Materials Ltd", displayName: "Quality Materials Limited",
    isCompany: true, isVendor: true, isCustomer: false,
    address: { city: "Bangalore", state: "Karnataka", country: "India" },
    currency: "INR", paymentTerms: "Net 15", isActive: true,
    supplierRank: 5, customerRank: 0,
    createdAt: new Date("2023-03-05"), updatedAt: new Date("2024-01-15")
  }
]

const mockPerformanceData: SupplierPerformance[] = [
  {
    id: "PERF-001", supplierId: "SUP-001", supplier: mockSuppliers[0],
    period: "monthly", startDate: new Date("2024-01-01"), endDate: new Date("2024-01-31"),
    metrics: {
      deliveryPerformance: { onTimeDeliveryRate: 95, averageDeliveryTime: 3.2, lateDeliveries: 2, earlyDeliveries: 8 },
      qualityPerformance: { defectRate: 0.5, rejectionRate: 1.2, qualityIncidents: 1, correctionRequests: 2 },
      servicePerformance: { responsiveness: 92, communicationRating: 88, supportQuality: 90, issueResolutionTime: 2.1 },
      costPerformance: { priceCompetitiveness: 87, costSavings: 12000, priceStability: 94, paymentCompliance: 100 }
    },
    overallRating: 93, qualityRating: 89, deliveryRating: 95, serviceRating: 90, costRating: 87,
    totalOrders: 42, totalValue: 850000, onTimeDeliveries: 40, qualityIssues: 1,
    reviewedBy: "John Manager", reviewDate: new Date("2024-02-01"), createdAt: new Date("2024-02-01")
  },
  {
    id: "PERF-002", supplierId: "SUP-002", supplier: mockSuppliers[1],
    period: "monthly", startDate: new Date("2024-01-01"), endDate: new Date("2024-01-31"),
    metrics: {
      deliveryPerformance: { onTimeDeliveryRate: 82, averageDeliveryTime: 4.8, lateDeliveries: 7, earlyDeliveries: 3 },
      qualityPerformance: { defectRate: 2.1, rejectionRate: 3.5, qualityIncidents: 3, correctionRequests: 5 },
      servicePerformance: { responsiveness: 78, communicationRating: 75, supportQuality: 80, issueResolutionTime: 4.2 },
      costPerformance: { priceCompetitiveness: 92, costSavings: 8500, priceStability: 88, paymentCompliance: 95 }
    },
    overallRating: 81, qualityRating: 76, deliveryRating: 82, serviceRating: 78, costRating: 92,
    totalOrders: 38, totalValue: 720000, onTimeDeliveries: 31, qualityIssues: 3,
    reviewedBy: "John Manager", reviewDate: new Date("2024-02-01"), createdAt: new Date("2024-02-01")
  },
  {
    id: "PERF-003", supplierId: "SUP-003", supplier: mockSuppliers[2],
    period: "monthly", startDate: new Date("2024-01-01"), endDate: new Date("2024-01-31"),
    metrics: {
      deliveryPerformance: { onTimeDeliveryRate: 98, averageDeliveryTime: 2.1, lateDeliveries: 1, earlyDeliveries: 12 },
      qualityPerformance: { defectRate: 0.2, rejectionRate: 0.5, qualityIncidents: 0, correctionRequests: 1 },
      servicePerformance: { responsiveness: 96, communicationRating: 94, supportQuality: 95, issueResolutionTime: 1.2 },
      costPerformance: { priceCompetitiveness: 85, costSavings: 5200, priceStability: 96, paymentCompliance: 100 }
    },
    overallRating: 96, qualityRating: 98, deliveryRating: 98, serviceRating: 95, costRating: 85,
    totalOrders: 28, totalValue: 420000, onTimeDeliveries: 27, qualityIssues: 0,
    reviewedBy: "John Manager", reviewDate: new Date("2024-02-01"), createdAt: new Date("2024-02-01")
  }
]

export function SupplierPerformanceContent() {
  const router = useRouter()
  const [performanceData] = useState<SupplierPerformance[]>(mockPerformanceData)
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all")
  const [loading, setLoading] = useState(false)

  const filteredData = selectedSupplier === "all" 
    ? performanceData 
    : performanceData.filter(p => p.supplierId === selectedSupplier)

  const averageMetrics = {
    overallRating: filteredData.reduce((acc, p) => acc + p.overallRating, 0) / filteredData.length,
    deliveryRating: filteredData.reduce((acc, p) => acc + p.deliveryRating, 0) / filteredData.length,
    totalOrders: filteredData.reduce((acc, p) => acc + p.totalOrders, 0),
    totalValue: filteredData.reduce((acc, p) => acc + p.totalValue, 0),
    onTimeDeliveryRate: filteredData.reduce((acc, p) => acc + p.metrics.deliveryPerformance.onTimeDeliveryRate, 0) / filteredData.length
  }

  const exportPerformanceData = () => {
    toast.success("Performance data exported successfully")
  }

  const refreshData = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success("Performance data refreshed")
    }, 1000)
  }

  const getPerformanceColor = (rating: number) => {
    if (rating >= 90) return "text-green-600"
    if (rating >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceBadge = (rating: number) => {
    if (rating >= 90) return { variant: "default" as const, label: "Excellent" }
    if (rating >= 75) return { variant: "secondary" as const, label: "Good" }
    return { variant: "destructive" as const, label: "Needs Improvement" }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Supplier Performance</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor and analyze supplier performance metrics and KPIs
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard')}
            className="text-[#4B6587] border-[#4B6587] hover:bg-[#4B6587] hover:text-white"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="outline" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportPerformanceData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Supplier</label>
              <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  {mockSuppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-[#4B6587]" />
              <span className="text-sm font-medium">Overall Rating</span>
            </div>
            <p className={`text-2xl font-bold mt-2 ${getPerformanceColor(averageMetrics.overallRating)}`}>
              {averageMetrics.overallRating.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-[#6B8A7A]" />
              <span className="text-sm font-medium">On-Time Delivery</span>
            </div>
            <p className={`text-2xl font-bold mt-2 ${getPerformanceColor(averageMetrics.onTimeDeliveryRate)}`}>
              {averageMetrics.onTimeDeliveryRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-[#F4A261]" />
              <span className="text-sm font-medium">Total Orders</span>
            </div>
            <p className="text-2xl font-bold mt-2">{averageMetrics.totalOrders}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-[#E76F51]" />
              <span className="text-sm font-medium">Total Value</span>
            </div>
            <p className="text-2xl font-bold mt-2">₹{(averageMetrics.totalValue / 100000).toFixed(1)}L</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="service">Service</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Overall</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((perf) => {
                    const badge = getPerformanceBadge(perf.overallRating)
                    return (
                      <TableRow key={perf.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{getInitials(perf.supplier.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{perf.supplier.name}</p>
                              <p className="text-sm text-muted-foreground">{perf.supplier.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className={`font-medium ${getPerformanceColor(perf.overallRating)}`}>
                              {perf.overallRating}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={getPerformanceColor(perf.deliveryRating)}>
                            {perf.deliveryRating}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={getPerformanceColor(perf.qualityRating)}>
                            {perf.qualityRating}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={getPerformanceColor(perf.serviceRating)}>
                            {perf.serviceRating}%
                          </span>
                        </TableCell>
                        <TableCell>{perf.totalOrders}</TableCell>
                        <TableCell>
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-[#4B6587]" />
                  <span className="text-sm font-medium">Avg Delivery Time</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {(filteredData.reduce((acc, p) => acc + p.metrics.deliveryPerformance.averageDeliveryTime, 0) / filteredData.length).toFixed(1)} days
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-[#6B8A7A]" />
                  <span className="text-sm font-medium">On-Time Rate</span>
                </div>
                <p className="text-2xl font-bold mt-2 text-green-600">
                  {averageMetrics.onTimeDeliveryRate.toFixed(1)}%
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-[#F4A261]" />
                  <span className="text-sm font-medium">Late Deliveries</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {filteredData.reduce((acc, p) => acc + p.metrics.deliveryPerformance.lateDeliveries, 0)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-[#E76F51]" />
                  <span className="text-sm font-medium">Early Deliveries</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {filteredData.reduce((acc, p) => acc + p.metrics.deliveryPerformance.earlyDeliveries, 0)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>On-Time Rate</TableHead>
                    <TableHead>Avg Delivery Time</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((perf) => (
                    <TableRow key={perf.id}>
                      <TableCell>{perf.supplier.name}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <span>{perf.metrics.deliveryPerformance.onTimeDeliveryRate}%</span>
                          <Progress value={perf.metrics.deliveryPerformance.onTimeDeliveryRate} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>{perf.metrics.deliveryPerformance.averageDeliveryTime} days</TableCell>
                      <TableCell>
                        <Badge variant={getPerformanceBadge(perf.deliveryRating).variant}>
                          {getPerformanceBadge(perf.deliveryRating).label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-[#F4A261]" />
                  <span className="text-sm font-medium">Avg Defect Rate</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {(filteredData.reduce((acc, p) => acc + p.metrics.qualityPerformance.defectRate, 0) / filteredData.length).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-[#E76F51]" />
                  <span className="text-sm font-medium">Rejection Rate</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {(filteredData.reduce((acc, p) => acc + p.metrics.qualityPerformance.rejectionRate, 0) / filteredData.length).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-[#4B6587]" />
                  <span className="text-sm font-medium">Quality Incidents</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {filteredData.reduce((acc, p) => acc + p.metrics.qualityPerformance.qualityIncidents, 0)}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="service" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-[#4B6587]" />
                  <span className="text-sm font-medium">Responsiveness</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {(filteredData.reduce((acc, p) => acc + p.metrics.servicePerformance.responsiveness, 0) / filteredData.length).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-[#6B8A7A]" />
                  <span className="text-sm font-medium">Communication</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {(filteredData.reduce((acc, p) => acc + p.metrics.servicePerformance.communicationRating, 0) / filteredData.length).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-[#F4A261]" />
                  <span className="text-sm font-medium">Support Quality</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {(filteredData.reduce((acc, p) => acc + p.metrics.servicePerformance.supportQuality, 0) / filteredData.length).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}