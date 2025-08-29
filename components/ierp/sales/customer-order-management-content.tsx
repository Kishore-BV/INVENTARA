'use client'

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  DollarSign,
  Plus,
  Eye,
  Edit,
  Download,
  MapPin,
  Calendar,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

export function CustomerOrderManagementContent() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [customerFilter, setCustomerFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(12);
  const [page, setPage] = useState<number>(1);

  const orderData = {
    overview: {
      totalOrders: 2847,
      activeOrders: 156,
      completedThisMonth: 342,
      totalRevenue: "₹45,67,89,000",
      averageOrderValue: "₹1,60,450",
      pendingShipments: 89,
      onTimeDelivery: "94.2%"
    },
    orders: [
      {
        id: "SO-2024-001",
        customer: "Apex Industries Ltd",
        customerContact: "rajesh.kumar@apex.com",
        products: "Industrial Equipment",
        items: [
          { name: "Hydraulic Press", quantity: 2, unitPrice: 250000, total: 500000 },
          { name: "Motor Assembly", quantity: 5, unitPrice: 50000, total: 250000 },
          { name: "Control Panel", quantity: 3, unitPrice: 35000, total: 105000 }
        ],
        totalValue: 855000,
        status: "Confirmed",
        priority: "High",
        orderDate: "2024-01-20",
        expectedDelivery: "2024-01-25",
        actualDelivery: null,
        salesRep: "John Smith",
        shippingAddress: "123 Industrial Area, Mumbai, MH 400001",
        paymentStatus: "Pending",
        notes: "Express delivery required for production line"
      },
      {
        id: "SO-2024-002",
        customer: "Global Tech Corp",
        customerContact: "sarah.wilson@globaltech.com",
        products: "IT Hardware",
        items: [
          { name: "Servers", quantity: 10, unitPrice: 45000, total: 450000 },
          { name: "Network Switches", quantity: 8, unitPrice: 15000, total: 120000 },
          { name: "UPS Systems", quantity: 5, unitPrice: 18000, total: 90000 }
        ],
        totalValue: 660000,
        status: "Processing",
        priority: "Medium",
        orderDate: "2024-01-19",
        expectedDelivery: "2024-01-28",
        actualDelivery: null,
        salesRep: "Sarah Wilson",
        shippingAddress: "456 Tech Park, Bangalore, KA 560001",
        paymentStatus: "Partial",
        notes: "Installation support required"
      },
      {
        id: "SO-2024-003",
        customer: "Manufacturing Plus",
        customerContact: "mike.johnson@mfgplus.com",
        products: "Raw Materials",
        items: [
          { name: "Steel Sheets", quantity: 1000, unitPrice: 350, total: 350000 },
          { name: "Aluminum Rods", quantity: 500, unitPrice: 120, total: 60000 },
          { name: "Fasteners", quantity: 2000, unitPrice: 5, total: 10000 }
        ],
        totalValue: 420000,
        status: "Shipped",
        priority: "Medium",
        orderDate: "2024-01-18",
        expectedDelivery: "2024-01-22",
        actualDelivery: "2024-01-21",
        salesRep: "Mike Johnson",
        shippingAddress: "789 Manufacturing District, Chennai, TN 600001",
        paymentStatus: "Paid",
        notes: "Quality certificate required"
      },
      {
        id: "SO-2024-004",
        customer: "Retail Solutions",
        customerContact: "emily.davis@retailsol.com",
        products: "Consumer Goods",
        items: [
          { name: "Display Units", quantity: 50, unitPrice: 4500, total: 225000 },
          { name: "Storage Racks", quantity: 30, unitPrice: 2800, total: 84000 },
          { name: "POS Systems", quantity: 8, unitPrice: 15000, total: 120000 }
        ],
        totalValue: 429000,
        status: "Delivered",
        priority: "Low",
        orderDate: "2024-01-17",
        expectedDelivery: "2024-01-21",
        actualDelivery: "2024-01-20",
        salesRep: "Emily Davis",
        shippingAddress: "321 Retail Plaza, Delhi, DL 110001",
        paymentStatus: "Paid",
        notes: "Installation completed successfully"
      },
      {
        id: "SO-2024-005",
        customer: "Construction Co",
        customerContact: "robert.brown@constructco.com",
        products: "Building Materials",
        items: [
          { name: "Cement Bags", quantity: 500, unitPrice: 450, total: 225000 },
          { name: "Steel Beams", quantity: 100, unitPrice: 3500, total: 350000 },
          { name: "Electrical Cables", quantity: 1000, unitPrice: 125, total: 125000 }
        ],
        totalValue: 700000,
        status: "Cancelled",
        priority: "Medium",
        orderDate: "2024-01-16",
        expectedDelivery: "2024-01-26",
        actualDelivery: null,
        salesRep: "Robert Brown",
        shippingAddress: "654 Construction Site, Pune, MH 411001",
        paymentStatus: "Refunded",
        notes: "Customer cancelled due to project delay"
      }
    ],
    chart: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      orders: [45, 52, 48, 61],
      revenue: [2800000, 3200000, 2950000, 3800000],
      delivered: [42, 48, 45, 58]
    }
  };

  const chartData = orderData.chart.labels.map((label, idx) => ({
    week: label,
    orders: orderData.chart.orders[idx],
    revenue: orderData.chart.revenue[idx],
    delivered: orderData.chart.delivered[idx]
  }));

  const openOrder = (order: any) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const customers = useMemo(() => {
    return Array.from(new Set(orderData.orders.map(o => o.customer)))
  }, []);

  const filteredOrders = useMemo(() => {
    let data = orderData.orders;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      data = data.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.products.toLowerCase().includes(q) ||
        o.salesRep.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "ALL") {
      data = data.filter(o => o.status === statusFilter);
    }
    if (customerFilter !== "ALL") {
      data = data.filter(o => o.customer === customerFilter);
    }
    return data;
  }, [orderData.orders, searchTerm, statusFilter, customerFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const pagedOrders = filteredOrders.slice(pageStart, pageEnd);

  const resetToFirstPage = () => setPage(1);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <Badge variant="default" className="bg-blue-500">Confirmed</Badge>;
      case "Processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "Shipped":
        return <Badge variant="default" className="bg-orange-500">Shipped</Badge>;
      case "Delivered":
        return <Badge variant="default" className="bg-green-500">Delivered</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">High</Badge>;
      case "Medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "Low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge variant="default" className="bg-green-500">Paid</Badge>;
      case "Partial":
        return <Badge variant="secondary">Partial</Badge>;
      case "Pending":
        return <Badge variant="outline">Pending</Badge>;
      case "Refunded":
        return <Badge variant="default" className="bg-gray-500">Refunded</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const downloadCsv = () => {
    const rows = [
      ["Order ID", "Customer", "Products", "Total Value", "Status", "Order Date", "Expected Delivery", "Sales Rep", "Payment Status"],
      ...filteredOrders.map((o) => [
        o.id,
        o.customer,
        o.products,
        String(o.totalValue),
        o.status,
        o.orderDate,
        o.expectedDelivery,
        o.salesRep,
        o.paymentStatus
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer-orders-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2" 
            title="Go to Sales & Distribution"
            onClick={() => router.push('/ierp/sales')}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Sales & Distribution</span>
          </Button>
          <h1 className="text-3xl font-bold">Customer Order Management</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); resetToFirstPage(); }} 
            placeholder="Search order, customer, or product" 
            className="w-[220px]" 
          />
          <Select value={customerFilter} onValueChange={(v) => { setCustomerFilter(v); resetToFirstPage(); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Customers</SelectItem>
              {customers.map((customer) => (
                <SelectItem key={customer} value={customer}>{customer}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); resetToFirstPage(); }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={downloadCsv}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderData.overview.totalOrders}</div>
            <p className="text-xs text-blue-600">
              {orderData.overview.activeOrders} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderData.overview.totalRevenue}</div>
            <p className="text-xs text-green-600">
              Avg: {orderData.overview.averageOrderValue}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Shipments</CardTitle>
            <Truck className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderData.overview.pendingShipments}</div>
            <p className="text-xs text-orange-600">
              Require shipping
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <CheckCircle className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderData.overview.onTimeDelivery}</div>
            <p className="text-xs text-purple-600">
              Delivery performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Order Performance Trends</CardTitle>
          <CardDescription>Weekly order volume, revenue, and delivery performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ 
            orders: { label: "Orders" }, 
            revenue: { label: "Revenue" },
            delivered: { label: "Delivered" }
          }}>
            <LineChart data={chartData} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <YAxis width={60} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value, name) => {
                if (name === 'revenue') return formatCurrency(Number(value));
                return value;
              }} />
              <Line type="monotone" dataKey="orders" stroke="#4B6587" strokeWidth={2} name="Orders" />
              <Line type="monotone" dataKey="delivered" stroke="#6B8A7A" strokeWidth={2} name="Delivered" />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Order Cards Grid */}
      <div>
        <div className="mb-3">
          <h2 className="text-xl font-semibold">Customer Orders</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Click an order to view detailed information and order history</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pagedOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openOrder(order)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{order.id}</div>
                    <div className="text-xs text-gray-500">{order.customer}</div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Products:</span>
                    <span className="text-xs">{order.products}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Value:</span>
                    <span className="font-medium">{formatCurrency(order.totalValue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Priority:</span>
                    {getPriorityBadge(order.priority)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Payment:</span>
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-xs text-gray-500">
                      Sales Rep: {order.salesRep} • Due: {order.expectedDelivery}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <div>
            Showing {filteredOrders.length === 0 ? 0 : pageStart + 1}-{Math.min(pageEnd, filteredOrders.length)} of {filteredOrders.length}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled={currentPage <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
            <div>Page {currentPage} / {totalPages}</div>
            <Button variant="outline" disabled={currentPage >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Order Management Summary</CardTitle>
              <CardDescription>Complete overview of all customer orders and their current status</CardDescription>
            </div>
            <Button variant="outline" size="sm">
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
                <TableHead>Expected Delivery</TableHead>
                <TableHead>Sales Rep</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderData.orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.products}</TableCell>
                  <TableCell className="text-right">{formatCurrency(order.totalValue)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{order.expectedDelivery}</TableCell>
                  <TableCell>{order.salesRep}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openOrder(order)}>
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

      {/* Order Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedOrder?.id} - {selectedOrder?.customer}</DialogTitle>
            <DialogDescription>
              <div className="mt-3 grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    {selectedOrder && getStatusBadge(selectedOrder.status)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">Priority</div>
                    {selectedOrder && getPriorityBadge(selectedOrder.priority)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">Payment Status</div>
                    {selectedOrder && getPaymentStatusBadge(selectedOrder.paymentStatus)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Customer Contact</div>
                    <div className="text-sm text-gray-600">{selectedOrder?.customerContact}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Sales Representative</div>
                    <div className="text-sm text-gray-600">{selectedOrder?.salesRep}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Shipping Address</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {selectedOrder?.shippingAddress}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">Order Date</div>
                    <div className="text-sm text-gray-600">{selectedOrder?.orderDate}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Expected Delivery</div>
                    <div className="text-sm text-gray-600">{selectedOrder?.expectedDelivery}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Actual Delivery</div>
                    <div className="text-sm text-gray-600">{selectedOrder?.actualDelivery || 'Not delivered yet'}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Order Items</div>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder?.items?.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t-2">
                          <TableCell colSpan={3} className="font-medium">Total Order Value</TableCell>
                          <TableCell className="text-right font-bold text-lg">
                            {selectedOrder && formatCurrency(selectedOrder.totalValue)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
                {selectedOrder?.notes && (
                  <div>
                    <div className="text-sm font-medium mb-1">Order Notes</div>
                    <div className="text-sm text-gray-600 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {selectedOrder.notes}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm">
                    <Truck className="h-4 w-4 mr-2" />
                    Track Shipment
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Order
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Invoice
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}