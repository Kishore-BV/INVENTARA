'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  TrendingUp, 
  Home,
  ShoppingCart,
  DollarSign,
  Receipt,
  Truck,
  BarChart3,
  Target,
  Users,
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  MapPin,
  Calendar,
  Activity
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function SalesDistributionContent() {
  const router = useRouter();

  // Mock sales & distribution data
  const salesOverview = {
    totalRevenue: "₹45,67,89,000",
    monthlyGrowth: "+12.5%",
    totalOrders: 2847,
    activeCustomers: 432,
    averageOrderValue: "₹1,60,450",
    pendingInvoices: 89,
    deliveryPending: 156,
    conversionRate: "68.5%"
  };

  const recentSalesOrders = [
    { id: "SO-2024-001", customer: "Apex Industries", products: "Industrial Equipment", value: 850000, status: "Confirmed", date: "2024-01-20", deliveryDate: "2024-01-25", salesRep: "John Smith" },
    { id: "SO-2024-002", customer: "Global Tech Corp", products: "IT Hardware", value: 650000, status: "Processing", date: "2024-01-19", deliveryDate: "2024-01-28", salesRep: "Sarah Wilson" },
    { id: "SO-2024-003", customer: "Manufacturing Plus", products: "Raw Materials", value: 420000, status: "Shipped", date: "2024-01-18", deliveryDate: "2024-01-22", salesRep: "Mike Johnson" },
    { id: "SO-2024-004", customer: "Retail Solutions", products: "Consumer Goods", value: 320000, status: "Delivered", date: "2024-01-17", deliveryDate: "2024-01-21", salesRep: "Emily Davis" },
    { id: "SO-2024-005", customer: "Construction Co", products: "Building Materials", value: 950000, status: "Confirmed", date: "2024-01-16", deliveryDate: "2024-01-26", salesRep: "Robert Brown" }
  ];

  const salesTrends = [
    { month: "Jul", revenue: 3800000, orders: 245, customers: 89 },
    { month: "Aug", revenue: 4200000, orders: 268, customers: 95 },
    { month: "Sep", revenue: 3950000, orders: 255, customers: 92 },
    { month: "Oct", revenue: 4450000, orders: 285, customers: 105 },
    { month: "Nov", revenue: 4800000, orders: 295, customers: 112 },
    { month: "Dec", revenue: 5200000, orders: 315, customers: 125 }
  ];

  const pendingInvoices = [
    { id: "INV-2024-001", customer: "Apex Industries", amount: 850000, dueDate: "2024-02-05", overdue: false, salesOrder: "SO-2024-001" },
    { id: "INV-2024-002", customer: "Global Tech Corp", amount: 650000, dueDate: "2024-02-08", overdue: false, salesOrder: "SO-2024-002" },
    { id: "INV-2023-089", customer: "Old Client Ltd", amount: 120000, dueDate: "2024-01-15", overdue: true, salesOrder: "SO-2023-089" },
    { id: "INV-2024-003", customer: "Manufacturing Plus", amount: 420000, dueDate: "2024-02-10", overdue: false, salesOrder: "SO-2024-003" }
  ];

  const deliveryTracking = [
    { id: "DEL-001", order: "SO-2024-003", customer: "Manufacturing Plus", destination: "Mumbai", status: "In Transit", eta: "2024-01-22", driver: "Raj Kumar" },
    { id: "DEL-002", order: "SO-2024-001", customer: "Apex Industries", destination: "Delhi", status: "Scheduled", eta: "2024-01-25", driver: "Amit Singh" },
    { id: "DEL-003", order: "SO-2024-005", customer: "Construction Co", destination: "Bangalore", status: "Loading", eta: "2024-01-26", driver: "Suresh Reddy" },
    { id: "DEL-004", order: "SO-2024-002", customer: "Global Tech Corp", destination: "Chennai", status: "Scheduled", eta: "2024-01-28", driver: "Kiran Patel" }
  ];

  const topCustomers = [
    { name: "Apex Industries", orders: 28, revenue: 5250000, growth: "+15%" },
    { name: "Global Tech Corp", orders: 22, revenue: 4780000, growth: "+8%" },
    { name: "Manufacturing Plus", orders: 35, revenue: 6100000, growth: "+22%" },
    { name: "Construction Co", orders: 18, revenue: 3450000, growth: "+5%" }
  ];

  const salesByRegion = [
    { name: "North", value: 35, amount: 15800000, color: "#4B6587" },
    { name: "South", value: 28, amount: 12600000, color: "#6B8A7A" },
    { name: "East", value: 22, amount: 9900000, color: "#A8DADC" },
    { name: "West", value: 15, amount: 6700000, color: "#F1FAEE" }
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
      case "confirmed":
        return <Badge variant="default" className="bg-green-500">Confirmed</Badge>;
      case "processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "shipped":
        return <Badge variant="default" className="bg-blue-500">Shipped</Badge>;
      case "delivered":
        return <Badge variant="default" className="bg-green-600">Delivered</Badge>;
      case "in transit":
        return <Badge variant="outline" className="border-blue-500 text-blue-600">In Transit</Badge>;
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      case "loading":
        return <Badge variant="secondary">Loading</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
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
            <h1 className="text-3xl font-bold">Sales & Distribution (SD)</h1>
            <p className="text-gray-600 dark:text-gray-300">Customer Orders, Pricing, Invoicing & Delivery Management</p>
          </div>
        </div>
        <Badge variant="default" className="text-lg px-3 py-1">
          Phase 1 Active
        </Badge>
      </div>

      {/* Sales Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesOverview.totalRevenue}</div>
            <p className="text-xs text-green-600">
              {salesOverview.monthlyGrowth} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesOverview.totalOrders}</div>
            <p className="text-xs text-blue-600">
              315 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesOverview.activeCustomers}</div>
            <p className="text-xs text-purple-600">
              28 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesOverview.averageOrderValue}</div>
            <p className="text-xs text-orange-600">
              +8.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Modules */}
      <div>
        <h2 className="text-xl font-semibold mb-4">SD Modules</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/sales/orders')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <ShoppingCart className="h-10 w-10 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Customer Order Management</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Sales orders & order processing</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/sales/pricing')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <DollarSign className="h-10 w-10 text-green-600" />
                <div>
                  <h3 className="font-semibold">Pricing Management</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Price lists & discount management</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/sales/invoicing')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Receipt className="h-10 w-10 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Invoicing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Invoice generation & tracking</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/sales/delivery')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Truck className="h-10 w-10 text-indigo-600" />
                <div>
                  <h3 className="font-semibold">Delivery Tracking</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Shipment & delivery management</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/sales/reporting')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <BarChart3 className="h-10 w-10 text-orange-600" />
                <div>
                  <h3 className="font-semibold">Sales Reporting</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Performance analytics & reports</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/sales/forecasting')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Target className="h-10 w-10 text-red-600" />
                <div>
                  <h3 className="font-semibold">Sales Forecasting</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Demand prediction & planning</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sales Trends and Regional Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance Trends</CardTitle>
            <CardDescription>Monthly revenue, orders, and customer growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ 
              revenue: { label: "Revenue" }, 
              orders: { label: "Orders" },
              customers: { label: "Customers" }
            }}>
              <LineChart data={salesTrends} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis width={60} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`} />
                <Tooltip formatter={(value, name) => {
                  if (name === 'revenue') return formatCurrency(Number(value));
                  return value;
                }} />
                <Line type="monotone" dataKey="revenue" stroke="#4B6587" strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="orders" stroke="#6B8A7A" strokeWidth={2} name="Orders" />
                <Line type="monotone" dataKey="customers" stroke="#A8DADC" strokeWidth={2} name="Customers" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Region</CardTitle>
            <CardDescription>Revenue distribution across geographic regions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByRegion}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {salesByRegion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [
                    `${value}% (${formatCurrency(props.payload.amount)})`,
                    'Region Share'
                  ]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Sales Orders</CardTitle>
              <CardDescription>Latest customer orders and their status</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push('/ierp/sales/orders')}>
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
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Sales Rep</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSalesOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.products}</TableCell>
                  <TableCell className="text-right">{formatCurrency(order.value)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.deliveryDate}</TableCell>
                  <TableCell>{order.salesRep}</TableCell>
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

      {/* Pending Invoices and Delivery Tracking */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Invoices</CardTitle>
            <CardDescription>Outstanding customer invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {invoice.overdue ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                    <div>
                      <div className="font-medium">{invoice.id}</div>
                      <div className="text-sm text-gray-600">
                        {invoice.customer} • Due: {invoice.dueDate}
                      </div>
                      <div className="text-xs text-gray-500">
                        Order: {invoice.salesOrder}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{formatCurrency(invoice.amount)}</span>
                    {invoice.overdue && (
                      <Badge variant="destructive" className="text-xs">Overdue</Badge>
                    )}
                    <Button variant="outline" size="sm">
                      Process
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Tracking</CardTitle>
            <CardDescription>Active shipments and delivery status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveryTracking.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Truck className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">{delivery.order}</div>
                      <div className="text-sm text-gray-600">
                        {delivery.customer} → {delivery.destination}
                      </div>
                      <div className="text-xs text-gray-500">
                        Driver: {delivery.driver} • ETA: {delivery.eta}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(delivery.status)}
                    <Button variant="outline" size="sm">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
          <CardDescription>Highest value customers by revenue and order volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-gray-600">
                      {customer.orders} orders • {formatCurrency(customer.revenue)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {customer.growth}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}