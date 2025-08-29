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
  CheckSquare, 
  Monitor, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users2,
  Package,
  Plus,
  Eye,
  Edit,
  Download,
  Play,
  BarChart3,
  TrendingUp,
  Settings,
  Wrench,
  Target
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

export function ManufacturingOrdersContent() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [workCenterFilter, setWorkCenterFilter] = useState<string>("ALL");
  const [pageSize, setPageSize] = useState<number>(12);
  const [page, setPage] = useState<number>(1);

  const manufacturingData = {
    overview: {
      totalOrders: 89,
      activeOrders: 23,
      completedThisMonth: 156,
      averageLeadTime: "8.5 days",
      onTimeDelivery: "94%",
      capacityUtilization: "87%",
      qualityRate: "98.5%"
    },
    orders: [
      {
        id: "MO-2024-001",
        product: "Steel Frame Assembly",
        productCode: "SFA-2024-STD",
        quantity: 500,
        status: "In Progress",
        priority: "High",
        startDate: "2024-01-15",
        endDate: "2024-01-22",
        workCenter: "Assembly Line 1",
        completion: 75,
        plannedHours: 120,
        actualHours: 95,
        responsible: "John Smith",
        customer: "ABC Manufacturing",
        bomVersion: "V2.1",
        qualityStatus: "Passed",
        materials: "Available",
        description: "Heavy-duty steel frame assembly for industrial equipment"
      },
      {
        id: "MO-2024-002",
        product: "Engine Component Set",
        productCode: "ECS-2024-ADV", 
        quantity: 200,
        status: "Scheduled",
        priority: "Medium",
        startDate: "2024-01-20",
        endDate: "2024-01-28",
        workCenter: "Machining Center",
        completion: 0,
        plannedHours: 80,
        actualHours: 0,
        responsible: "Mike Johnson",
        customer: "TechCorp Industries",
        bomVersion: "V1.5",
        qualityStatus: "Pending",
        materials: "Partial",
        description: "Precision machined engine components for automotive applications"
      },
      {
        id: "MO-2024-003",
        product: "Electronic Control Unit",
        productCode: "ECU-2024-PRO",
        quantity: 1000,
        status: "Completed",
        priority: "Low",
        startDate: "2024-01-08",
        endDate: "2024-01-18",
        workCenter: "Electronics Assembly",
        completion: 100,
        plannedHours: 160,
        actualHours: 158,
        responsible: "Sarah Wilson",
        customer: "Electronics Corp",
        bomVersion: "V3.0",
        qualityStatus: "Passed",
        materials: "Complete",
        description: "Advanced electronic control units with embedded software"
      },
      {
        id: "MO-2024-004",
        product: "Hydraulic Pump",
        productCode: "HP-2024-HD",
        quantity: 150,
        status: "Quality Check",
        priority: "High",
        startDate: "2024-01-12",
        endDate: "2024-01-20",
        workCenter: "Testing Station",
        completion: 95,
        plannedHours: 60,
        actualHours: 58,
        responsible: "David Kumar",
        customer: "Hydraulics Inc",
        bomVersion: "V2.3",
        qualityStatus: "In Review",
        materials: "Complete",
        description: "High-pressure hydraulic pump for industrial machinery"
      },
      {
        id: "MO-2024-005",
        product: "Gear Box Assembly",
        productCode: "GBA-2024-STD",
        quantity: 300,
        status: "Released",
        priority: "Medium",
        startDate: "2024-01-18",
        endDate: "2024-01-25",
        workCenter: "Assembly Line 2",
        completion: 25,
        plannedHours: 100,
        actualHours: 22,
        responsible: "Emily Davis",
        customer: "Mechanical Systems Ltd",
        bomVersion: "V1.8",
        qualityStatus: "Passed",
        materials: "Available",
        description: "Multi-speed gear box assembly for transmission systems"
      }
    ],
    chart: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      planned: [18, 22, 25, 28],
      actual: [16, 20, 24, 27],
      efficiency: [89, 91, 96, 96]
    }
  };

  const chartData = manufacturingData.chart.labels.map((label, idx) => ({
    week: label,
    planned: manufacturingData.chart.planned[idx],
    actual: manufacturingData.chart.actual[idx],
    efficiency: manufacturingData.chart.efficiency[idx]
  }));

  const openOrder = (order: any) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const workCenters = useMemo(() => {
    return Array.from(new Set(manufacturingData.orders.map(o => o.workCenter)))
  }, []);

  const filteredOrders = useMemo(() => {
    let data = manufacturingData.orders;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      data = data.filter(o =>
        o.product.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.productCode.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.responsible.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "ALL") {
      data = data.filter(o => o.status === statusFilter);
    }
    if (priorityFilter !== "ALL") {
      data = data.filter(o => o.priority === priorityFilter);
    }
    if (workCenterFilter !== "ALL") {
      data = data.filter(o => o.workCenter === workCenterFilter);
    }
    return data;
  }, [manufacturingData.orders, searchTerm, statusFilter, priorityFilter, workCenterFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const pagedOrders = filteredOrders.slice(pageStart, pageEnd);

  const resetToFirstPage = () => setPage(1);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Progress":
        return <Badge variant="default" className="bg-blue-500">In Progress</Badge>;
      case "Completed":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case "Scheduled":
        return <Badge variant="secondary">Scheduled</Badge>;
      case "Quality Check":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Quality Check</Badge>;
      case "Released":
        return <Badge variant="outline">Released</Badge>;
      default:
        return <Badge variant="destructive">Unknown</Badge>;
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

  const getCompletionColor = (completion: number) => {
    if (completion >= 90) return "text-green-600";
    if (completion >= 60) return "text-blue-600";
    if (completion >= 30) return "text-yellow-600";
    return "text-gray-600";
  };

  const getQualityBadge = (status: string) => {
    switch (status) {
      case "Passed":
        return <Badge variant="default" className="bg-green-500">Passed</Badge>;
      case "In Review":
        return <Badge variant="secondary">In Review</Badge>;
      case "Pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const getMaterialsBadge = (status: string) => {
    switch (status) {
      case "Available":
        return <Badge variant="default" className="bg-green-500">Available</Badge>;
      case "Complete":
        return <Badge variant="default" className="bg-green-600">Complete</Badge>;
      case "Partial":
        return <Badge variant="secondary">Partial</Badge>;
      default:
        return <Badge variant="destructive">Missing</Badge>;
    }
  };

  const downloadCsv = () => {
    const rows = [
      ["Order ID", "Product", "Product Code", "Quantity", "Status", "Priority", "Work Center", "Completion %", "Start Date", "End Date", "Responsible"],
      ...filteredOrders.map((o) => [
        o.id,
        o.product,
        o.productCode,
        String(o.quantity),
        o.status,
        o.priority,
        o.workCenter,
        String(o.completion),
        o.startDate,
        o.endDate,
        o.responsible
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manufacturing-orders-${new Date().toISOString().slice(0,10)}.csv`;
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
            title="Go to Production Planning"
            onClick={() => router.push('/ierp/production')}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Production Planning</span>
          </Button>
          <h1 className="text-3xl font-bold">Manufacturing Orders</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); resetToFirstPage(); }} 
            placeholder="Search orders, products, or customers" 
            className="w-[250px]" 
          />
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); resetToFirstPage(); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Quality Check">Quality Check</SelectItem>
              <SelectItem value="Released">Released</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); resetToFirstPage(); }}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={workCenterFilter} onValueChange={(v) => { setWorkCenterFilter(v); resetToFirstPage(); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Work Center" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Work Centers</SelectItem>
              {workCenters.map((center) => (
                <SelectItem key={center} value={center}>{center}</SelectItem>
              ))}
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
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <CheckSquare className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{manufacturingData.overview.activeOrders}</div>
            <p className="text-xs text-blue-600">
              {manufacturingData.overview.totalOrders} total orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{manufacturingData.overview.onTimeDelivery}</div>
            <p className="text-xs text-green-600">
              {manufacturingData.overview.completedThisMonth} completed this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Capacity Utilization</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{manufacturingData.overview.capacityUtilization}</div>
            <p className="text-xs text-purple-600">
              Production efficiency
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quality Rate</CardTitle>
            <Target className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{manufacturingData.overview.qualityRate}</div>
            <p className="text-xs text-orange-600">
              {manufacturingData.overview.averageLeadTime} avg lead time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Production Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Production Performance</CardTitle>
          <CardDescription>Weekly planned vs actual production with efficiency tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ 
            planned: { label: "Planned" }, 
            actual: { label: "Actual" },
            efficiency: { label: "Efficiency" }
          }}>
            <BarChart data={chartData} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <YAxis width={40} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="planned" fill="#4B6587" name="Planned" />
              <Bar dataKey="actual" fill="#6B8A7A" name="Actual" />
              <Bar dataKey="efficiency" fill="#A8DADC" name="Efficiency %" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Manufacturing Orders Cards Grid */}
      <div>
        <div className="mb-3">
          <h2 className="text-xl font-semibold">Manufacturing Orders</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Click an order to view detailed production information</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pagedOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openOrder(order)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{order.product}</div>
                    <div className="text-xs text-gray-500">{order.id} • {order.productCode}</div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Quantity:</span>
                    <span className="font-medium">{order.quantity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Work Center:</span>
                    <span className="text-xs">{order.workCenter}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Progress:</span>
                    <div className={`font-medium ${getCompletionColor(order.completion)}`}>
                      {order.completion}%
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Priority:</span>
                    {getPriorityBadge(order.priority)}
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-xs text-gray-500">
                      {order.responsible} • Due: {order.endDate}
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
              <CardTitle>Manufacturing Orders Summary</CardTitle>
              <CardDescription>Complete overview of all manufacturing orders and production status</CardDescription>
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
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Work Center</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Responsible</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {manufacturingData.orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{order.product}</div>
                      <div className="text-xs text-gray-500">{order.productCode}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.workCenter}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                  <TableCell>
                    <div className={`font-medium ${getCompletionColor(order.completion)}`}>
                      {order.completion}%
                    </div>
                  </TableCell>
                  <TableCell>{order.responsible}</TableCell>
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedOrder?.product} ({selectedOrder?.id})</DialogTitle>
            <DialogDescription>
              <div className="mt-3 grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">Product Code</div>
                    <div className="text-sm text-gray-600">{selectedOrder?.productCode}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Customer</div>
                    <div className="text-sm text-gray-600">{selectedOrder?.customer}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Responsible</div>
                    <div className="text-sm text-gray-600">{selectedOrder?.responsible}</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    {selectedOrder && getStatusBadge(selectedOrder.status)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">Priority</div>
                    {selectedOrder && getPriorityBadge(selectedOrder.priority)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">Quality Status</div>
                    {selectedOrder && getQualityBadge(selectedOrder.qualityStatus)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">Materials</div>
                    {selectedOrder && getMaterialsBadge(selectedOrder.materials)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Quantity</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {selectedOrder?.quantity} units
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Work Center</div>
                    <div className="text-sm text-gray-600">{selectedOrder?.workCenter}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">Progress</div>
                    <div className={`text-lg font-semibold ${selectedOrder && getCompletionColor(selectedOrder.completion)}`}>
                      {selectedOrder?.completion}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Planned Hours</div>
                    <div className="text-sm text-gray-600">{selectedOrder?.plannedHours}h</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Actual Hours</div>
                    <div className="text-sm text-gray-600">{selectedOrder?.actualHours}h</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Start Date</div>
                    <div className="text-sm text-gray-600">{selectedOrder?.startDate}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">End Date</div>
                    <div className="text-sm text-gray-600">{selectedOrder?.endDate}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">BOM Version</div>
                  <div className="text-sm text-gray-600">{selectedOrder?.bomVersion}</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Description</div>
                  <div className="text-sm text-gray-600">{selectedOrder?.description}</div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Start Production
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Order
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Wrench className="h-4 w-4 mr-2" />
                    View BOM
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