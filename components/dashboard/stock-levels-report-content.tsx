'use client'

import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, AlertTriangle, Clock, DollarSign, Home } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import Link from "next/link";

export function StockLevelsReportContent() {
  const [timeframe, setTimeframe] = useState("30-days");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(12);
  const [page, setPage] = useState<number>(1);

  const stockData = {
    overview: {
      totalProducts: 1200,
      outOfStock: 50,
      lowStock: 120,
              totalValue: "₹2,08,50,000",
    },
    products: [
      { id: "PROD001", name: "Laptop", category: "Electronics", stock: 150, status: "In Stock", value: 150000, imageUrl: "/placeholder.jpg", refillHistory: [{date: "2023-10-01", quantity: 50, price: 1000}], singleItemPrice: 1000 },
      { id: "PROD002", name: "Mouse", category: "Electronics", stock: 20, status: "Low Stock", value: 1000, imageUrl: "/placeholder.jpg", refillHistory: [{date: "2023-09-15", quantity: 100, price: 10}], singleItemPrice: 10 },
      { id: "PROD003", name: "Keyboard", category: "Electronics", stock: 5, status: "Out of Stock", value: 250, imageUrl: "/placeholder.jpg", refillHistory: [{date: "2023-08-20", quantity: 20, price: 50}], singleItemPrice: 50 },
      { id: "PROD004", name: "Monitor", category: "Electronics", stock: 80, status: "In Stock", value: 80000, imageUrl: "/placeholder.jpg", refillHistory: [{date: "2023-10-10", quantity: 30, price: 1000}], singleItemPrice: 1000 },
      { id: "PROD005", name: "Webcam", category: "Accessories", stock: 0, status: "Out of Stock", value: 0, imageUrl: "/placeholder.jpg", refillHistory: [{date: "2023-07-01", quantity: 10, price: 25}], singleItemPrice: 25 },
      { id: "PROD006", name: "Desk Chair", category: "Furniture", stock: 30, status: "In Stock", value: 9000, imageUrl: "/placeholder.jpg", refillHistory: [{date: "2023-09-01", quantity: 15, price: 300}], singleItemPrice: 300 },
    ],
    chart: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [65, 59, 80, 81, 56, 55],
    },
  };

  const chartData = stockData.chart.labels.map((label, idx) => ({ month: label, value: stockData.chart.data[idx] }))

  const openProduct = (p: any) => {
    setSelectedProduct(p);
    setDialogOpen(true);
  };

  const categories = useMemo(() => {
    return Array.from(new Set(stockData.products.map(p => p.category)))
  }, [])

  const getLastRefillDate = (p: any): string | null => {
    if (!p.refillHistory || p.refillHistory.length === 0) return null;
    const sorted = [...p.refillHistory].sort((a: any, b: any) => (a.date > b.date ? -1 : 1));
    return sorted[0]?.date || null;
  }

  const filteredProducts = useMemo(() => {
    let data = stockData.products;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      data = data.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "ALL") {
      data = data.filter(p => p.category === categoryFilter);
    }
    if (statusFilter !== "ALL") {
      data = data.filter(p => p.status === statusFilter);
    }
    if (dateFrom || dateTo) {
      const fromTs = dateFrom ? new Date(dateFrom).getTime() : -Infinity;
      const toTs = dateTo ? new Date(dateTo + "T23:59:59").getTime() : Infinity;
      data = data.filter(p => {
        const d = getLastRefillDate(p);
        if (!d) return false;
        const ts = new Date(d).getTime();
        return ts >= fromTs && ts <= toTs;
      })
    }
    return data;
  }, [stockData.products, searchTerm, categoryFilter, statusFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const pagedProducts = filteredProducts.slice(pageStart, pageEnd);

  const resetToFirstPage = () => setPage(1);

  const downloadCsv = () => {
    const rows = [
      ["Product ID", "Name", "Category", "Status", "Stock", "Unit Price", "Last Refill Date"],
      ...filteredProducts.map((p) => [
        p.id,
        p.name,
        p.category,
        p.status,
        String(p.stock),
        String(p.singleItemPrice),
        getLastRefillDate(p) || "",
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventara-stock-levels-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printAsPdf = () => {
    const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Inventara Stock Levels</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding: 24px; }
    h1 { margin: 0 0 12px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { font-size: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; padding: 8px; }
    th { background: #f9fafb; }
  </style>
  </head>
  <body>
    <h1>Inventara - Stock Levels</h1>
    <table>
      <thead>
        <tr>
          <th>Product ID</th><th>Name</th><th>Category</th><th>Status</th><th>Stock</th><th>Unit Price</th><th>Last Refill</th>
        </tr>
      </thead>
      <tbody>
        ${filteredProducts.map(p => `<tr>
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.category}</td>
          <td>${p.status}</td>
          <td>${p.stock}</td>
          <td>${p.singleItemPrice}</td>
          <td>${getLastRefillDate(p) || ''}</td>
        </tr>`).join('')}
      </tbody>
    </table>
    <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 300); };</script>
  </body>
</html>`;
    const w = window.open('', '_blank', 'width=1200,height=800');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2" title="Go to Dashboard">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Stock Levels</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); resetToFirstPage(); }} placeholder="Search product, ID, or category" className="w-[220px]" />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">From</label>
            <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); resetToFirstPage(); }} className="w-[150px]" />
            <label className="text-sm text-gray-600 dark:text-gray-300">To</label>
            <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); resetToFirstPage(); }} className="w-[150px]" />
          </div>
          <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); resetToFirstPage(); }}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); resetToFirstPage(); }}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="In Stock">In Stock</SelectItem>
              <SelectItem value="Low Stock">Low Stock</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); resetToFirstPage(); }}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Page size" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 / page</SelectItem>
              <SelectItem value="24">24 / page</SelectItem>
              <SelectItem value="48">48 / page</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={downloadCsv}>Export CSV</Button>
          <Button onClick={printAsPdf}>Export PDF</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockData.overview.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockData.overview.outOfStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockData.overview.lowStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
            <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockData.overview.totalValue}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Levels Over Time</CardTitle>
          <CardDescription>Visual representation of stock trends.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ value: { label: "Stock" } }}>
            <LineChart data={chartData} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis width={30} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Catalogue grid */}
      <div>
        <div className="mb-3">
          <h2 className="text-xl font-semibold">Catalogue</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Click a product to see refill history and unit price</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pagedProducts.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openProduct(p)}>
              <CardContent className="p-4">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 mb-3">
                  <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.category}</div>
                  </div>
                  <Badge variant={p.status === 'In Stock' ? 'default' : p.status === 'Low Stock' ? 'secondary' : 'destructive'}>
                    {p.status}
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Stock: <span className="font-semibold">{p.stock}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <div>
            Showing {filteredProducts.length === 0 ? 0 : pageStart + 1}-{Math.min(pageEnd, filteredProducts.length)} of {filteredProducts.length}
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
          <CardTitle>Detailed Stock Summary</CardTitle>
          <CardDescription>Overview of all products and their current stock levels.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockData.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.status === "In Stock" ? "default" : product.status === "Low Stock" ? "secondary" : "destructive"}
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${product.value.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product details dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name} ({selectedProduct?.id})</DialogTitle>
            <DialogDescription>
              <div className="mt-3 grid gap-3">
                <div className="text-sm text-gray-600 dark:text-gray-300">Category: {selectedProduct?.category}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Current Stock: {selectedProduct?.stock}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Single Item Price: ${selectedProduct?.singleItemPrice}</div>
                <div>
                  <div className="font-medium mb-2">Refill History</div>
                  <div className="rounded-md border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
                    {selectedProduct?.refillHistory?.map((r: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-2 text-sm">
                        <span>{r.date}</span>
                        <span>+{r.quantity}</span>
                        <span>${r.price}</span>
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
