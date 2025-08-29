'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  Package, 
  Home,
  ShoppingCart,
  FileText,
  Receipt,
  Database,
  Users2,
  Building2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Edit,
  Truck,
  BarChart3,
  Target
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from "recharts";

export function MaterialsManagementContent() {
  const router = useRouter();

  // Mock materials management data
  const materialsOverview = {
    totalInventoryValue: "₹28,45,67,000",
    totalSuppliers: 156,
    activeOrders: 42,
    pendingRequisitions: 18,
    lowStockItems: 23,
    receivedThisMonth: 145,
    averageLeadTime: "12 days"
  };

  const recentPurchaseOrders = [
    { id: "PO-2024-001", supplier: "TechCorp Solutions", items: "Laptops & Accessories", value: 750000, status: "Approved", date: "2024-01-20", deliveryDate: "2024-01-25" },
    { id: "PO-2024-002", supplier: "Global Industrial", items: "Raw Materials", value: 320000, status: "Pending", date: "2024-01-19", deliveryDate: "2024-01-28" },
    { id: "PO-2024-003", supplier: "Quality Materials", items: "Office Supplies", value: 125000, status: "Received", date: "2024-01-18", deliveryDate: "2024-01-22" },
    { id: "PO-2024-004", supplier: "Steel Works Ltd", items: "Steel Components", value: 890000, status: "In Transit", date: "2024-01-17", deliveryDate: "2024-01-24" },
    { id: "PO-2024-005", supplier: "Chemical Supplies Co", items: "Chemical Raw Materials", value: 450000, status: "Approved", date: "2024-01-16", deliveryDate: "2024-01-26" }
  ];

  const inventoryTrends = [
    { month: "Jul", received: 145, issued: 132, balance: 1245 },
    { month: "Aug", received: 158, issued: 142, balance: 1261 },
    { month: "Sep", received: 142, issued: 156, balance: 1247 },
    { month: "Oct", received: 165, issued: 148, balance: 1264 },
    { month: "Nov", received: 178, issued: 162, balance: 1280 },
    { month: "Dec", received: 185, issued: 169, balance: 1296 }
  ];

  const pendingRequisitions = [
    { id: "REQ-001", requestor: "Production Dept", items: "Steel Sheets", quantity: 500, priority: "High", date: "2024-01-18", estimatedCost: "₹2,50,000" },
    { id: "REQ-002", requestor: "IT Department", items: "Network Equipment", quantity: 15, priority: "Medium", date: "2024-01-17", estimatedCost: "₹1,85,000" },
    { id: "REQ-003", requestor: "Maintenance", items: "Spare Parts", quantity: 120, priority: "Low", date: "2024-01-16", estimatedCost: "₹75,000" },
    { id: "REQ-004", requestor: "Quality Control", items: "Testing Equipment", quantity: 8, priority: "High", date: "2024-01-15", estimatedCost: "₹3,20,000" }
  ];

  const lowStockAlerts = [
    { id: "MAT-001", name: "Steel Rods", currentStock: 25, minStock: 100, supplier: "Steel Works Ltd", lastOrder: "2024-01-10" },
    { id: "MAT-002", name: "Packaging Materials", currentStock: 45, minStock: 200, supplier: "Pack Solutions", lastOrder: "2024-01-08" },
    { id: "MAT-003", name: "Chemical Additives", currentStock: 12, minStock: 50, supplier: "Chemical Supplies Co", lastOrder: "2024-01-05" },
    { id: "MAT-004", name: "Office Paper", currentStock: 30, minStock: 150, supplier: "Office Mart", lastOrder: "2024-01-12" }
  ];

  const topSuppliers = [
    { name: "TechCorp Solutions", orders: 28, value: 5250000, performance: 98, reliability: "Excellent" },
    { name: "Global Industrial", orders: 35, value: 4780000, performance: 95, reliability: "Good" },
    { name: "Steel Works Ltd", orders: 22, value: 6100000, performance: 92, reliability: "Good" },
    { name: "Chemical Supplies Co", orders: 18, value: 3450000, performance: 89, reliability: "Average" }
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
      case "approved":
        return <Badge variant="default" className="bg-green-500">Approved</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "received":
        return <Badge variant="default" className="bg-blue-500">Received</Badge>;
      case "in transit":
        return <Badge variant="outline">In Transit</Badge>;
      default:
        return <Badge variant="destructive">Unknown</Badge>;
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
            <h1 className="text-3xl font-bold">Materials Management (MM)</h1>
            <p className="text-gray-600 dark:text-gray-300">Procurement, Inventory Management & Supplier Relations</p>
          </div>
        </div>
        <Badge variant="default" className="text-lg px-3 py-1">
          Phase 1 Active
        </Badge>
      </div>

      {/* Materials Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Database className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materialsOverview.totalInventoryValue}</div>
            <p className="text-xs text-blue-600">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
            <Users2 className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materialsOverview.totalSuppliers}</div>
            <p className="text-xs text-green-600">
              12 new this quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Receipt className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materialsOverview.activeOrders}</div>
            <p className="text-xs text-purple-600">
              18 pending delivery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materialsOverview.lowStockItems}</div>
            <p className="text-xs text-red-600">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Modules */}
      <div>
        <h2 className="text-xl font-semibold mb-4">MM Modules</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/materials/procurement')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <ShoppingCart className="h-10 w-10 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Procurement Workflows</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">End-to-end procurement process</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/materials/requisitions')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <FileText className="h-10 w-10 text-green-600" />
                <div>
                  <h3 className="font-semibold">Purchase Requisitions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Request & approval workflows</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/materials/purchase-orders')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Receipt className="h-10 w-10 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Purchase Orders</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Order management & tracking</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/materials/inventory')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Database className="h-10 w-10 text-indigo-600" />
                <div>
                  <h3 className="font-semibold">Inventory Management</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Stock levels & movements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/materials/suppliers')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users2 className="h-10 w-10 text-orange-600" />
                <div>
                  <h3 className="font-semibold">Supplier Database</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Supplier information & performance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/materials/vendors')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Building2 className="h-10 w-10 text-red-600" />
                <div>
                  <h3 className="font-semibold">Vendor Management</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Vendor relationships & contracts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Inventory Trends and Supplier Performance */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Movement Trends</CardTitle>
            <CardDescription>Monthly received vs issued materials</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ 
              received: { label: "Received" }, 
              issued: { label: "Issued" },
              balance: { label: "Balance" }
            }}>
              <LineChart data={inventoryTrends} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis width={40} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="received" stroke="#4B6587" strokeWidth={2} name="Received" />
                <Line type="monotone" dataKey="issued" stroke="#E63946" strokeWidth={2} name="Issued" />
                <Line type="monotone" dataKey="balance" stroke="#6B8A7A" strokeWidth={2} name="Balance" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Suppliers by Value</CardTitle>
            <CardDescription>Supplier performance and order values</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSuppliers.map((supplier, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{supplier.name}</div>
                    <div className="text-sm text-gray-600">
                      {supplier.orders} orders • {formatCurrency(supplier.value)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{supplier.performance}%</div>
                    <div className="text-xs text-gray-600">{supplier.reliability}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Purchase Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Purchase Orders</CardTitle>
              <CardDescription>Latest purchase orders and their status</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push('/ierp/materials/purchase-orders')}>
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
                <TableHead>Supplier</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPurchaseOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.supplier}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell className="text-right">{formatCurrency(order.value)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.deliveryDate}</TableCell>
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

      {/* Pending Requisitions and Low Stock Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Requisitions</CardTitle>
            <CardDescription>Purchase requests awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequisitions.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">{req.items}</div>
                      <div className="text-sm text-gray-600">
                        {req.requestor} • Qty: {req.quantity} • {req.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getPriorityBadge(req.priority)}
                    <span className="font-medium">{req.estimatedCost}</span>
                    <Button variant="outline" size="sm">
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Items requiring immediate replenishment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockAlerts.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        Current: {item.currentStock} • Min: {item.minStock}
                      </div>
                      <div className="text-xs text-gray-500">
                        Supplier: {item.supplier} • Last order: {item.lastOrder}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Reorder
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}