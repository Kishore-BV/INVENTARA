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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users2, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Home,
  TrendingUp,
  Star,
  Mail,
  Phone,
  Globe,
  MapPin,
  Building2
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

// Helper function to get initials
const getInitials = (name: string) => {
  return name.split(" ").map(part => part[0]).join("").toUpperCase().slice(0, 2);
};

export function SupplierDirectoryContent() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(12);
  const [page, setPage] = useState<number>(1);

  const supplierData = {
    overview: {
      totalSuppliers: 156,
      activeSuppliers: 142,
      inactiveSuppliers: 14,
      totalValue: "₹15,45,75,000",
    },
    suppliers: [
      { 
        id: "SUP-001", 
        name: "TechCorp Solutions", 
        displayName: "TechCorp Solutions Ltd.",
        country: "India", 
        status: "Active", 
        contractValue: 5000000, 
        imageUrl: "/placeholder.jpg",
        email: "orders@techcorp.com",
        phone: "+91-98765-43210",
        website: "https://techcorp.com",
        supplierRank: 5,
        lastOrderDate: "2024-01-20",
        orderHistory: [{date: "2024-01-20", amount: 250000, orders: 5}]
      },
      { 
        id: "SUP-002", 
        name: "Global Industrial", 
        displayName: "Global Industrial Supplies",
        country: "India", 
        status: "Active", 
        contractValue: 3200000, 
        imageUrl: "/placeholder.jpg",
        email: "sales@globalind.com",
        phone: "+91-98765-43211",
        website: "https://globalindustrial.com",
        supplierRank: 4,
        lastOrderDate: "2024-01-18",
        orderHistory: [{date: "2024-01-18", amount: 180000, orders: 3}]
      },
      { 
        id: "SUP-003", 
        name: "Quality Materials", 
        displayName: "Quality Materials Ltd",
        country: "India", 
        status: "Inactive", 
        contractValue: 1200000, 
        imageUrl: "/placeholder.jpg",
        email: "info@qualitymaterials.com",
        phone: "+91-98765-43212",
        website: "https://qualitymaterials.com",
        supplierRank: 3,
        lastOrderDate: "2023-12-15",
        orderHistory: [{date: "2023-12-15", amount: 120000, orders: 2}]
      }
    ],
    chart: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [45, 52, 48, 61, 58, 65],
    },
  };

  const chartData = supplierData.chart.labels.map((label, idx) => ({ 
    month: label, 
    value: supplierData.chart.data[idx] 
  }));

  const openSupplier = (supplier: any) => {
    setSelectedSupplier(supplier);
    setDialogOpen(true);
  };

  const countries = useMemo(() => {
    return Array.from(new Set(supplierData.suppliers.map(s => s.country)))
  }, []);

  const getLastOrderDate = (supplier: any): string | null => {
    if (!supplier.orderHistory || supplier.orderHistory.length === 0) return null;
    const sorted = [...supplier.orderHistory].sort((a: any, b: any) => (a.date > b.date ? -1 : 1));
    return sorted[0]?.date || null;
  };

  const filteredSuppliers = useMemo(() => {
    let data = supplierData.suppliers;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      data = data.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q)
      );
    }
    if (countryFilter !== "ALL") {
      data = data.filter(s => s.country === countryFilter);
    }
    if (statusFilter !== "ALL") {
      data = data.filter(s => s.status === statusFilter);
    }
    return data;
  }, [supplierData.suppliers, searchTerm, countryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredSuppliers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const pagedSuppliers = filteredSuppliers.slice(pageStart, pageEnd);

  const resetToFirstPage = () => setPage(1);

  const downloadCsv = () => {
    const rows = [
      ["Supplier ID", "Name", "Country", "Status", "Contract Value", "Rating", "Last Order"],
      ...filteredSuppliers.map((s) => [
        s.id,
        s.name,
        s.country,
        s.status,
        String(s.contractValue),
        String(s.supplierRank),
        getLastOrderDate(s) || "",
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventara-suppliers-${new Date().toISOString().slice(0,10)}.csv`;
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
            title="Go to Dashboard"
            onClick={() => router.push('/dashboard')}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>
          <h1 className="text-3xl font-bold">Supplier Directory</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/suppliers')}
            className="text-[#6B8A7A] border-[#6B8A7A] hover:bg-[#6B8A7A] hover:text-white"
          >
            <Users2 className="mr-2 h-4 w-4" />
            Management View
          </Button>
          <Input 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); resetToFirstPage(); }} 
            placeholder="Search supplier, ID, or country" 
            className="w-[220px]" 
          />
          <Select value={countryFilter} onValueChange={(v) => { setCountryFilter(v); resetToFirstPage(); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Countries</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); resetToFirstPage(); }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={downloadCsv}>Export CSV</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
            <Users2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supplierData.overview.totalSuppliers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supplierData.overview.activeSuppliers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inactive Suppliers</CardTitle>
            <AlertTriangle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supplierData.overview.inactiveSuppliers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Contract Value</CardTitle>
            <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supplierData.overview.totalValue}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier Performance Over Time</CardTitle>
          <CardDescription>Visual representation of supplier engagement trends.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ value: { label: "Suppliers" } }}>
            <LineChart data={chartData} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis width={30} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4B6587" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Supplier Cards */}
      <div>
        <div className="mb-3">
          <h2 className="text-xl font-semibold">Supplier Directory</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Click a supplier to see order history and contact details</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pagedSuppliers.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openSupplier(supplier)}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(supplier.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{supplier.name}</div>
                    <div className="text-xs text-gray-500">{supplier.id}</div>
                  </div>
                  <Badge variant={supplier.status === 'Active' ? 'default' : 'secondary'}>
                    {supplier.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="h-3 w-3 mr-1" />
                    {supplier.country}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <DollarSign className="h-3 w-3 mr-1" />
                    ₹{(supplier.contractValue / 100000).toFixed(1)}L
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{supplier.supplierRank}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <div>
            Showing {filteredSuppliers.length === 0 ? 0 : pageStart + 1}-{Math.min(pageEnd, filteredSuppliers.length)} of {filteredSuppliers.length}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled={currentPage <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
            <div>Page {currentPage} / {totalPages}</div>
            <Button variant="outline" disabled={currentPage >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
          </div>
        </div>
      </div>

      {/* Detailed table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Supplier Summary</CardTitle>
          <CardDescription>Overview of all suppliers and their current status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier ID</TableHead>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contract Value</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplierData.suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{getInitials(supplier.name)}</AvatarFallback>
                      </Avatar>
                      <span>{supplier.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{supplier.country}</TableCell>
                  <TableCell>
                    <Badge variant={supplier.status === "Active" ? "default" : "secondary"}>
                      {supplier.status}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{(supplier.contractValue / 100000).toFixed(1)}L</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{supplier.supplierRank}/5</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Supplier details dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSupplier?.name} ({selectedSupplier?.id})</DialogTitle>
            <DialogDescription>
              <div className="mt-3 grid gap-3">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <Mail className="h-3 w-3 mr-2" />
                    {selectedSupplier?.email}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <Phone className="h-3 w-3 mr-2" />
                    {selectedSupplier?.phone}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <Globe className="h-3 w-3 mr-2" />
                    <a href={selectedSupplier?.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {selectedSupplier?.website}
                    </a>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Contract Value: ₹{(selectedSupplier?.contractValue / 100000)?.toFixed(1)}L
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Rating: {selectedSupplier?.supplierRank}/5 stars
                </div>
                <div>
                  <div className="font-medium mb-2">Recent Order History</div>
                  <div className="rounded-md border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
                    {selectedSupplier?.orderHistory?.map((order: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-2 text-sm">
                        <span>{order.date}</span>
                        <span>{order.orders} orders</span>
                        <span>₹{(order.amount / 1000).toFixed(0)}K</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}