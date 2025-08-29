'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  Settings, 
  Home,
  CheckSquare,
  Layers,
  Monitor,
  Activity,
  Play,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Edit,
  Package,
  Users2,
  Calendar,
  Target,
  BarChart3,
  Wrench
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from "recharts";

export function ProductionPlanningContent() {
  const router = useRouter();

  // Mock production planning data
  const productionOverview = {
    totalManufacturingOrders: 89,
    activeProduction: 23,
    completedThisMonth: 156,
    capacityUtilization: "87%",
    workCenters: 12,
    plannedEfficiency: "94%",
    averageLeadTime: "8.5 days"
  };

  const manufacturingOrders = [
    { id: "MO-2024-001", product: "Steel Frame Assembly", quantity: 500, status: "In Progress", startDate: "2024-01-15", endDate: "2024-01-22", workCenter: "Assembly Line 1", priority: "High", completion: 75 },
    { id: "MO-2024-002", product: "Engine Component Set", quantity: 200, status: "Scheduled", startDate: "2024-01-20", endDate: "2024-01-28", workCenter: "Machining Center", priority: "Medium", completion: 0 },
    { id: "MO-2024-003", product: "Electronic Control Unit", quantity: 1000, status: "Completed", startDate: "2024-01-08", endDate: "2024-01-18", workCenter: "Electronics Assembly", priority: "Low", completion: 100 },
    { id: "MO-2024-004", product: "Hydraulic Pump", quantity: 150, status: "Quality Check", startDate: "2024-01-12", endDate: "2024-01-20", workCenter: "Testing Station", priority: "High", completion: 95 },
    { id: "MO-2024-005", product: "Gear Box Assembly", quantity: 300, status: "Released", startDate: "2024-01-18", endDate: "2024-01-25", workCenter: "Assembly Line 2", priority: "Medium", completion: 25 }
  ];

  const productionTrends = [
    { month: "Jul", planned: 245, actual: 238, efficiency: 87 },
    { month: "Aug", planned: 267, actual: 259, efficiency: 89 },
    { month: "Sep", planned: 289, actual: 285, efficiency: 91 },
    { month: "Oct", planned: 312, actual: 298, efficiency: 88 },
    { month: "Nov", planned: 334, actual: 329, efficiency: 92 },
    { month: "Dec", planned: 356, actual: 348, efficiency: 94 }
  ];

  const workCenters = [
    { name: "Assembly Line 1", status: "Active", capacity: "85%", efficiency: "92%", currentOrder: "MO-2024-001", shift: "Day Shift" },
    { name: "Machining Center", status: "Scheduled", capacity: "65%", efficiency: "89%", currentOrder: "Preparing", shift: "Night Shift" },
    { name: "Electronics Assembly", status: "Maintenance", capacity: "0%", efficiency: "95%", currentOrder: "Under Maintenance", shift: "Day Shift" },
    { name: "Testing Station", status: "Active", capacity: "78%", efficiency: "96%", currentOrder: "MO-2024-004", shift: "Day Shift" }
  ];

  const bomComponents = [
    { id: "BOM-001", product: "Steel Frame Assembly", components: 45, status: "Active", lastUpdated: "2024-01-15", cost: 12500 },
    { id: "BOM-002", product: "Engine Component Set", components: 28, status: "Under Review", lastUpdated: "2024-01-18", cost: 8750 },
    { id: "BOM-003", product: "Electronic Control Unit", components: 67, status: "Active", lastUpdated: "2024-01-12", cost: 5600 },
    { id: "BOM-004", product: "Hydraulic Pump", components: 22, status: "Active", lastUpdated: "2024-01-14", cost: 4200 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "in progress":
        return <Badge variant="default" className="bg-blue-500">In Progress</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case "scheduled":
        return <Badge variant="secondary">Scheduled</Badge>;
      case "quality check":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Quality Check</Badge>;
      case "released":
        return <Badge variant="outline">Released</Badge>;
      case "active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case "maintenance":
        return <Badge variant="destructive">Maintenance</Badge>;
      case "under review":
        return <Badge variant="secondary">Under Review</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getCompletionColor = (completion: number) => {
    if (completion >= 90) return "text-green-600";
    if (completion >= 60) return "text-blue-600";
    if (completion >= 30) return "text-yellow-600";
    return "text-gray-600";
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2" 
            title="Go to iERP Dashboard"
            onClick={() => router.push('/ierp')}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">iERP</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Production Planning (PP)</h1>
            <p className="text-gray-600 dark:text-gray-300">Manufacturing Orders, BOM Management & Capacity Planning</p>
          </div>
        </div>
        <Badge variant="default" className="text-lg px-3 py-1 bg-green-600">
          Phase 2 Active
        </Badge>
      </div>

      {/* Production Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Manufacturing Orders</CardTitle>
            <CheckSquare className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionOverview.totalManufacturingOrders}</div>
            <p className="text-xs text-blue-600">
              {productionOverview.activeProduction} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Capacity Utilization</CardTitle>
            <Activity className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionOverview.capacityUtilization}</div>
            <p className="text-xs text-green-600">
              {productionOverview.plannedEfficiency} planned efficiency
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Work Centers</CardTitle>
            <Monitor className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionOverview.workCenters}</div>
            <p className="text-xs text-purple-600">
              Production facilities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Lead Time</CardTitle>
            <Clock className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionOverview.averageLeadTime}</div>
            <p className="text-xs text-orange-600">
              {productionOverview.completedThisMonth} completed this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Modules */}
      <div>
        <h2 className="text-xl font-semibold mb-4">PP Modules</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/production/orders')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <CheckSquare className="h-10 w-10 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Manufacturing Orders</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Production order management</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/production/bom')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Layers className="h-10 w-10 text-green-600" />
                <div>
                  <h3 className="font-semibold">Bill of Materials</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">BOM structure & components</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/production/workcenters')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Monitor className="h-10 w-10 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Work Centers</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Production facility management</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/production/capacity')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Activity className="h-10 w-10 text-indigo-600" />
                <div>
                  <h3 className="font-semibold">Capacity Planning</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Resource capacity optimization</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/production/shop-floor')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Play className="h-10 w-10 text-orange-600" />
                <div>
                  <h3 className="font-semibold">Shop-floor Control</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Real-time production control</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Target className="h-10 w-10 text-red-600" />
                <div>
                  <h3 className="font-semibold">Quality Control</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Production quality management</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Production Trends and Work Center Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Production Performance</CardTitle>
            <CardDescription>Monthly planned vs actual production with efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ 
              planned: { label: "Planned" }, 
              actual: { label: "Actual" },
              efficiency: { label: "Efficiency" }
            }}>
              <LineChart data={productionTrends} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis width={40} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="planned" stroke="#4B6587" strokeWidth={2} name="Planned" />
                <Line type="monotone" dataKey="actual" stroke="#6B8A7A" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="efficiency" stroke="#E63946" strokeWidth={2} name="Efficiency %" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Work Center Status</CardTitle>
            <CardDescription>Current status and capacity of production work centers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workCenters.map((center, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Monitor className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">{center.name}</div>
                      <div className="text-sm text-gray-600">
                        {center.currentOrder} • {center.shift}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(center.status)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Capacity: {center.capacity} • Eff: {center.efficiency}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Manufacturing Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manufacturing Orders</CardTitle>
              <CardDescription>Current production orders and their status</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push('/ierp/production/orders')}>
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Work Center</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {manufacturingOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.workCenter}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                  <TableCell>
                    <div className={`font-medium ${getCompletionColor(order.completion)}`}>
                      {order.completion}%
                    </div>
                  </TableCell>
                  <TableCell>{order.startDate}</TableCell>
                  <TableCell>{order.endDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
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

      {/* Bill of Materials Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Bill of Materials (BOM)</CardTitle>
          <CardDescription>Product structures and component management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bomComponents.map((bom) => (
              <div key={bom.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Layers className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">{bom.product}</div>
                    <div className="text-sm text-gray-600">
                      {bom.components} components • Updated: {bom.lastUpdated}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(bom.status)}
                  <span className="font-medium">{formatCurrency(bom.cost)}</span>
                  <Button variant="outline" size="sm" onClick={() => router.push('/ierp/production/bom')}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}