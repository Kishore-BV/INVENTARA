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
  CreditCard, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  DollarSign,
  Calendar,
  Plus,
  Eye,
  Edit,
  Download
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export function AccountsPayableContent() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [vendorFilter, setVendorFilter] = useState<string>("ALL");
  const [pageSize, setPageSize] = useState<number>(12);
  const [page, setPage] = useState<number>(1);

  const payableData = {
    overview: {
      totalPayables: "₹8,76,54,000",
      overduePayables: "₹1,23,45,000",
      dueThisWeek: "₹2,45,67,000",
      totalVendors: 89
    },
    payables: [
      {
        id: "AP-2024-001",
        invoiceNumber: "INV-TCS-2024-001",
        vendor: "TechCorp Solutions",
        description: "IT Equipment Supply",
        invoiceDate: "2024-01-15",
        dueDate: "2024-02-15",
        amount: 750000,
        outstandingAmount: 750000,
        status: "Outstanding",
        priority: "Medium"
      },
      {
        id: "AP-2024-002",
        invoiceNumber: "INV-GI-2024-002",
        vendor: "Global Industrial",
        description: "Raw Materials",
        invoiceDate: "2024-01-10",
        dueDate: "2024-01-25",
        amount: 890000,
        outstandingAmount: 890000,
        status: "Overdue",
        priority: "High"
      },
      {
        id: "AP-2024-003",
        invoiceNumber: "INV-QM-2024-003",
        vendor: "Quality Materials Ltd",
        description: "Office Supplies",
        invoiceDate: "2024-01-18",
        dueDate: "2024-02-18",
        amount: 125000,
        outstandingAmount: 0,
        status: "Paid",
        priority: "Low"
      }
    ],
    chart: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      outstanding: [8500000, 8200000, 7800000, 8765400],
      paid: [1200000, 1500000, 1800000, 1400000]
    }
  };

  const chartData = payableData.chart.labels.map((label, idx) => ({
    week: label,
    outstanding: payableData.chart.outstanding[idx],
    paid: payableData.chart.paid[idx]
  }));

  const openPayable = (payable: any) => {
    setSelectedPayable(payable);
    setDialogOpen(true);
  };

  const vendors = useMemo(() => {
    return Array.from(new Set(payableData.payables.map(p => p.vendor)))
  }, []);

  const filteredPayables = useMemo(() => {
    let data = payableData.payables;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      data = data.filter(p =>
        p.id.toLowerCase().includes(q) ||
        p.vendor.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "ALL") {
      data = data.filter(p => p.status === statusFilter);
    }
    if (vendorFilter !== "ALL") {
      data = data.filter(p => p.vendor === vendorFilter);
    }
    return data;
  }, [payableData.payables, searchTerm, statusFilter, vendorFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPayables.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const pagedPayables = filteredPayables.slice(pageStart, pageEnd);

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
      case "Outstanding":
        return <Badge variant="secondary">Outstanding</Badge>;
      case "Overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "Paid":
        return <Badge variant="default" className="bg-green-500">Paid</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const downloadCsv = () => {
    const rows = [
      ["AP ID", "Invoice Number", "Vendor", "Description", "Amount", "Outstanding", "Status", "Due Date"],
      ...filteredPayables.map((p) => [
        p.id, p.invoiceNumber, p.vendor, p.description,
        String(p.amount), String(p.outstandingAmount), p.status, p.dueDate
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accounts-payable-${new Date().toISOString().slice(0,10)}.csv`;
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
            onClick={() => router.push('/ierp/finance')}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Finance & Controlling</span>
          </Button>
          <h1 className="text-3xl font-bold">Accounts Payable</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); resetToFirstPage(); }} 
            placeholder="Search invoice, vendor, or description" 
            className="w-[220px]" 
          />
          <Select value={vendorFilter} onValueChange={(v) => { setVendorFilter(v); resetToFirstPage(); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Vendor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Vendors</SelectItem>
              {vendors.map((vendor) => (
                <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); resetToFirstPage(); }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="Outstanding">Outstanding</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
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
            <CardTitle className="text-sm font-medium">Total Payables</CardTitle>
            <CreditCard className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payableData.overview.totalPayables}</div>
            <p className="text-xs text-red-600">{payableData.overview.totalVendors} vendors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payables</CardTitle>
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payableData.overview.overduePayables}</div>
            <p className="text-xs text-orange-600">Immediate attention required</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
            <Clock className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payableData.overview.dueThisWeek}</div>
            <p className="text-xs text-yellow-600">Schedule payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Payment Health</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-green-600">Payment accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Payables Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Accounts Payable Trends</CardTitle>
          <CardDescription>Weekly outstanding and paid amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ 
            outstanding: { label: "Outstanding" }, 
            paid: { label: "Paid" }
          }}>
            <LineChart data={chartData} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <YAxis width={80} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value/1000000).toFixed(0)}M`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Line type="monotone" dataKey="outstanding" stroke="#E63946" strokeWidth={2} name="Outstanding" />
              <Line type="monotone" dataKey="paid" stroke="#6B8A7A" strokeWidth={2} name="Paid" />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Payable Cards Grid */}
      <div>
        <div className="mb-3">
          <h2 className="text-xl font-semibold">Outstanding Payables</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Click a payable to view detailed invoice information</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pagedPayables.map((payable) => (
            <Card key={payable.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openPayable(payable)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{payable.invoiceNumber}</div>
                    <div className="text-xs text-gray-500">{payable.id}</div>
                  </div>
                  {getStatusBadge(payable.status)}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Vendor:</span>
                    <span className="text-xs">{payable.vendor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Amount:</span>
                    <span className="font-medium">{formatCurrency(payable.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Outstanding:</span>
                    <span className="font-medium text-red-600">{formatCurrency(payable.outstandingAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Due Date:</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-xs">{payable.dueDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <div>
            Showing {filteredPayables.length === 0 ? 0 : pageStart + 1}-{Math.min(pageEnd, filteredPayables.length)} of {filteredPayables.length}
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
              <CardTitle>Accounts Payable Summary</CardTitle>
              <CardDescription>Complete overview of all vendor payables and payment status</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>AP ID</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payableData.payables.map((payable) => (
                <TableRow key={payable.id}>
                  <TableCell className="font-medium">{payable.id}</TableCell>
                  <TableCell>{payable.invoiceNumber}</TableCell>
                  <TableCell>{payable.vendor}</TableCell>
                  <TableCell>{payable.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(payable.amount)}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-red-600 font-medium">{formatCurrency(payable.outstandingAmount)}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(payable.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{payable.dueDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openPayable(payable)}>
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

      {/* Payable Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPayable?.invoiceNumber} - {selectedPayable?.vendor}</DialogTitle>
            <DialogDescription>
              <div className="mt-3 grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    {selectedPayable && getStatusBadge(selectedPayable.status)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">Description</div>
                    <div className="text-sm text-gray-600">{selectedPayable?.description}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">Invoice Amount</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {selectedPayable && formatCurrency(selectedPayable.amount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Outstanding Amount</div>
                    <div className="text-lg font-semibold text-red-600">
                      {selectedPayable && formatCurrency(selectedPayable.outstandingAmount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Due Date</div>
                    <div className="text-sm text-gray-600">{selectedPayable?.dueDate}</div>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Make Payment
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Payable
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