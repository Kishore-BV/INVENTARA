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
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Users2,
  Package,
  Plus,
  Eye,
  Edit,
  Download,
  Truck,
  BarChart3,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

export function ProcurementWorkflowsContent() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(12);
  const [page, setPage] = useState<number>(1);

  const procurementData = {
    overview: {
      totalWorkflows: 142,
      activeWorkflows: 89,
      completedThisMonth: 35,
      averageProcessingTime: "5.2 days",
      pendingApprovals: 18,
      totalValue: "₹12,45,67,000",
      efficiencyRate: "92%"
    },
    workflows: [
      {
        id: "PW-2024-001",
        title: "Office Equipment Procurement",
        department: "IT Department",
        requestor: "John Smith",
        items: "Laptops, Monitors, Keyboards",
        quantity: 25,
        estimatedValue: 1250000,
        status: "In Progress",
        stage: "Vendor Selection",
        priority: "Medium",
        dateInitiated: "2024-01-18",
        expectedCompletion: "2024-01-28",
        approver: "Sarah Wilson",
        supplier: "TechCorp Solutions",
        description: "Quarterly IT equipment refresh for development team"
      },
      {
        id: "PW-2024-002", 
        title: "Raw Materials Replenishment",
        department: "Production",
        requestor: "Mike Johnson",
        items: "Steel Sheets, Chemical Additives",
        quantity: 500,
        estimatedValue: 890000,
        status: "Pending Approval",
        stage: "Management Review",
        priority: "High",
        dateInitiated: "2024-01-19",
        expectedCompletion: "2024-01-25",
        approver: "Robert Brown",
        supplier: "Steel Works Ltd",
        description: "Critical raw materials for production line maintenance"
      },
      {
        id: "PW-2024-003",
        title: "Marketing Supplies Order",
        department: "Marketing",
        requestor: "Emily Davis",
        items: "Promotional Materials, Banners",
        quantity: 200,
        estimatedValue: 125000,
        status: "Completed",
        stage: "Delivered",
        priority: "Low",
        dateInitiated: "2024-01-10",
        expectedCompletion: "2024-01-20",
        approver: "Lisa Chen",
        supplier: "Print Solutions",
        description: "Marketing materials for upcoming trade show"
      },
      {
        id: "PW-2024-004",
        title: "Maintenance Spare Parts",
        department: "Maintenance",
        requestor: "David Kumar",
        items: "Motor Parts, Belts, Filters",
        quantity: 150,
        estimatedValue: 340000,
        status: "In Progress", 
        stage: "Purchase Order",
        priority: "Medium",
        dateInitiated: "2024-01-16",
        expectedCompletion: "2024-01-26",
        approver: "Mark Taylor",
        supplier: "Industrial Supplies Co",
        description: "Preventive maintenance spare parts inventory"
      },
      {
        id: "PW-2024-005",
        title: "Laboratory Equipment Upgrade",
        department: "Quality Control",
        requestor: "Dr. Priya Sharma",
        items: "Testing Equipment, Chemicals",
        quantity: 12,
        estimatedValue: 750000,
        status: "Under Review",
        stage: "Budget Approval",
        priority: "High",
        dateInitiated: "2024-01-20",
        expectedCompletion: "2024-02-05",
        approver: "CEO",
        supplier: "Lab Equipment Inc",
        description: "Quality control equipment modernization project"
      }
    ],
    chart: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      initiated: [12, 15, 18, 22],
      completed: [8, 11, 14, 18],
      pending: [4, 8, 12, 15]
    }
  };

  const chartData = procurementData.chart.labels.map((label, idx) => ({
    week: label,
    initiated: procurementData.chart.initiated[idx],
    completed: procurementData.chart.completed[idx],
    pending: procurementData.chart.pending[idx]
  }));

  const openWorkflow = (workflow: any) => {
    setSelectedWorkflow(workflow);
    setDialogOpen(true);
  };

  const departments = useMemo(() => {
    return Array.from(new Set(procurementData.workflows.map(w => w.department)))
  }, []);

  const filteredWorkflows = useMemo(() => {
    let data = procurementData.workflows;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      data = data.filter(w =>
        w.title.toLowerCase().includes(q) ||
        w.id.toLowerCase().includes(q) ||
        w.department.toLowerCase().includes(q) ||
        w.requestor.toLowerCase().includes(q) ||
        w.items.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "ALL") {
      data = data.filter(w => w.status === statusFilter);
    }
    if (departmentFilter !== "ALL") {
      data = data.filter(w => w.department === departmentFilter);
    }
    return data;
  }, [procurementData.workflows, searchTerm, statusFilter, departmentFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredWorkflows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const pagedWorkflows = filteredWorkflows.slice(pageStart, pageEnd);

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
      case "In Progress":
        return <Badge variant="default" className="bg-blue-500">In Progress</Badge>;
      case "Pending Approval":
        return <Badge variant="secondary">Pending Approval</Badge>;
      case "Completed":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case "Under Review":
        return <Badge variant="outline">Under Review</Badge>;
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

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "Budget Approval":
        return <FileText className="h-4 w-4 text-orange-500" />;
      case "Management Review":
        return <Users2 className="h-4 w-4 text-purple-500" />;
      case "Vendor Selection":
        return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case "Purchase Order":
        return <Package className="h-4 w-4 text-green-500" />;
      case "Delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const downloadCsv = () => {
    const rows = [
      ["Workflow ID", "Title", "Department", "Requestor", "Items", "Value", "Status", "Stage", "Priority", "Date Initiated"],
      ...filteredWorkflows.map((w) => [
        w.id,
        w.title,
        w.department,
        w.requestor,
        w.items,
        String(w.estimatedValue),
        w.status,
        w.stage,
        w.priority,
        w.dateInitiated
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `procurement-workflows-${new Date().toISOString().slice(0,10)}.csv`;
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
            title="Go to Materials Management"
            onClick={() => router.push('/ierp/materials')}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Materials Management</span>
          </Button>
          <h1 className="text-3xl font-bold">Procurement Workflows</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); resetToFirstPage(); }} 
            placeholder="Search workflow, ID, or department" 
            className="w-[220px]" 
          />
          <Select value={departmentFilter} onValueChange={(v) => { setDepartmentFilter(v); resetToFirstPage(); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); resetToFirstPage(); }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Pending Approval">Pending Approval</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
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
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <ShoppingCart className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{procurementData.overview.activeWorkflows}</div>
            <p className="text-xs text-blue-600">
              {procurementData.overview.totalWorkflows} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{procurementData.overview.completedThisMonth}</div>
            <p className="text-xs text-green-600">
              {procurementData.overview.efficiencyRate} efficiency
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{procurementData.overview.pendingApprovals}</div>
            <p className="text-xs text-yellow-600">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{procurementData.overview.totalValue}</div>
            <p className="text-xs text-purple-600">
              Avg: {procurementData.overview.averageProcessingTime}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Progress Tracking</CardTitle>
          <CardDescription>Weekly workflow initiation, completion, and pending trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ 
            initiated: { label: "Initiated" }, 
            completed: { label: "Completed" },
            pending: { label: "Pending" }
          }}>
            <BarChart data={chartData} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <YAxis width={40} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="initiated" fill="#4B6587" name="Initiated" />
              <Bar dataKey="completed" fill="#6B8A7A" name="Completed" />
              <Bar dataKey="pending" fill="#F1FAEE" name="Pending" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Workflow Cards Grid */}
      <div>
        <div className="mb-3">
          <h2 className="text-xl font-semibold">Active Procurement Workflows</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Click a workflow to view detailed progress and documentation</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pagedWorkflows.map((workflow) => (
            <Card key={workflow.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openWorkflow(workflow)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{workflow.title}</div>
                    <div className="text-xs text-gray-500">{workflow.id}</div>
                  </div>
                  {getStatusBadge(workflow.status)}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Department:</span>
                    <span className="text-xs">{workflow.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Value:</span>
                    <span className="font-medium">{formatCurrency(workflow.estimatedValue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Stage:</span>
                    <div className="flex items-center gap-1">
                      {getStageIcon(workflow.stage)}
                      <span className="text-xs">{workflow.stage}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Priority:</span>
                    {getPriorityBadge(workflow.priority)}
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-xs text-gray-500">
                      Requestor: {workflow.requestor} • Expected: {workflow.expectedCompletion}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <div>
            Showing {filteredWorkflows.length === 0 ? 0 : pageStart + 1}-{Math.min(pageEnd, filteredWorkflows.length)} of {filteredWorkflows.length}
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
              <CardTitle>Procurement Workflows Summary</CardTitle>
              <CardDescription>Complete overview of all procurement workflows and their current status</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Requestor</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {procurementData.workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-medium">{workflow.id}</TableCell>
                  <TableCell>{workflow.title}</TableCell>
                  <TableCell>{workflow.department}</TableCell>
                  <TableCell>{workflow.requestor}</TableCell>
                  <TableCell className="text-right">{formatCurrency(workflow.estimatedValue)}</TableCell>
                  <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStageIcon(workflow.stage)}
                      <span className="text-sm">{workflow.stage}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(workflow.priority)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openWorkflow(workflow)}>
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

      {/* Workflow Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedWorkflow?.title} ({selectedWorkflow?.id})</DialogTitle>
            <DialogDescription>
              <div className="mt-3 grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Department</div>
                    <div className="text-sm text-gray-600">{selectedWorkflow?.department}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Requestor</div>
                    <div className="text-sm text-gray-600">{selectedWorkflow?.requestor}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    {selectedWorkflow && getStatusBadge(selectedWorkflow.status)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">Current Stage</div>
                    <div className="flex items-center gap-2">
                      {selectedWorkflow && getStageIcon(selectedWorkflow.stage)}
                      <span className="text-sm">{selectedWorkflow?.stage}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Priority</div>
                    {selectedWorkflow && getPriorityBadge(selectedWorkflow.priority)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Items Requested</div>
                  <div className="text-sm text-gray-600">{selectedWorkflow?.items}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Quantity: {selectedWorkflow?.quantity} units
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Estimated Value</div>
                    <div className="text-lg font-semibold text-green-600">
                      {selectedWorkflow && formatCurrency(selectedWorkflow.estimatedValue)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Expected Completion</div>
                    <div className="text-sm text-gray-600">{selectedWorkflow?.expectedCompletion}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Approver</div>
                    <div className="text-sm text-gray-600">{selectedWorkflow?.approver}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Preferred Supplier</div>
                    <div className="text-sm text-gray-600">{selectedWorkflow?.supplier}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Description</div>
                  <div className="text-sm text-gray-600">{selectedWorkflow?.description}</div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Advance Stage
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Workflow
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Details
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