'use client'

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowDownToLine, ArrowUpFromLine, Calendar, Package, Hash, Download, FileDown, Printer, Home } from "lucide-react"
import Link from "next/link"

type Movement = {
  id: string
  productId: string
  productName: string
  direction: "INWARD" | "OUTWARD"
  quantity: number
  unit: string
  date: string // ISO or simple date string for demo
  reference: string
  source?: string
  destination?: string
}

const demoMovements: Movement[] = [
  { id: "MV-1008", productId: "PROD006", productName: "Desk Chair", direction: "OUTWARD", quantity: 3, unit: "pcs", date: "2023-10-17 15:40", reference: "SO-23017", destination: "Sales Order #23017" },
  { id: "MV-1007", productId: "PROD003", productName: "Keyboard", direction: "INWARD", quantity: 20, unit: "pcs", date: "2023-10-17 12:20", reference: "PO-44102", source: "Purchase #44102" },
  { id: "MV-1006", productId: "PROD002", productName: "Mouse", direction: "OUTWARD", quantity: 15, unit: "pcs", date: "2023-10-16 17:00", reference: "SO-23016", destination: "Sales Order #23016" },
  { id: "MV-1005", productId: "PROD004", productName: "Monitor", direction: "INWARD", quantity: 10, unit: "pcs", date: "2023-10-16 09:30", reference: "PO-44101", source: "Purchase #44101" },
  { id: "MV-1004", productId: "PROD005", productName: "Webcam", direction: "OUTWARD", quantity: 5, unit: "pcs", date: "2023-10-15 18:10", reference: "RET-7782", destination: "Customer Return #7782" },
  { id: "MV-1003", productId: "PROD001", productName: "Laptop", direction: "INWARD", quantity: 8, unit: "pcs", date: "2023-10-15 11:05", reference: "PO-44100", source: "Purchase #44100" },
  { id: "MV-1002", productId: "PROD002", productName: "Mouse", direction: "INWARD", quantity: 100, unit: "pcs", date: "2023-10-14 10:15", reference: "PO-44099", source: "Purchase #44099" },
  { id: "MV-1001", productId: "PROD003", productName: "Keyboard", direction: "OUTWARD", quantity: 2, unit: "pcs", date: "2023-10-14 09:45", reference: "SO-23015", destination: "Sales Order #23015" },
]

export function MovementReportsContent() {
  const [timeframe, setTimeframe] = useState("30-days")
  const [directionFilter, setDirectionFilter] = useState<"ALL" | "INWARD" | "OUTWARD">("ALL")
  const [productFilter, setProductFilter] = useState<string>("ALL")
  const [searchTerm, setSearchTerm] = useState("")
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(1)

  const filtered = useMemo(() => {
    let data = demoMovements
    if (directionFilter !== "ALL") {
      data = data.filter((m) => m.direction === directionFilter)
    }
    if (productFilter !== "ALL") {
      data = data.filter((m) => m.productId === productFilter)
    }
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase()
      data = data.filter((m) =>
        m.productName.toLowerCase().includes(q) ||
        m.productId.toLowerCase().includes(q) ||
        m.reference.toLowerCase().includes(q)
      )
    }
    // In a real app, timeframe would filter by date range
    const sorted = [...data].sort((a, b) => (a.date > b.date ? -1 : 1))
    return sorted
  }, [directionFilter, timeframe, productFilter, searchTerm])

  const totals = useMemo(() => {
    const inward = demoMovements.filter((m) => m.direction === "INWARD").reduce((sum, m) => sum + m.quantity, 0)
    const outward = demoMovements.filter((m) => m.direction === "OUTWARD").reduce((sum, m) => sum + m.quantity, 0)
    return { inward, outward, net: inward - outward, count: demoMovements.length }
  }, [])

  const uniqueProducts = useMemo(() => {
    const map = new Map<string, string>()
    for (const m of demoMovements) {
      if (!map.has(m.productId)) map.set(m.productId, m.productName)
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  const pageEnd = pageStart + pageSize
  const paged = filtered.slice(pageStart, pageEnd)

  const resetToFirstPage = () => setPage(1)

  const downloadCsv = () => {
    const rows = [
      ["ID", "Product ID", "Product Name", "Direction", "Quantity", "Unit", "Date", "Reference", "Source", "Destination"],
      ...filtered.map((m) => [m.id, m.productId, m.productName, m.direction, String(m.quantity), m.unit, m.date, m.reference, m.source || "", m.destination || ""]) ,
    ]
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inventara-movements-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const printAsPdf = () => {
    const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Inventara Movements</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding: 24px; }
    h1 { margin: 0 0 12px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { font-size: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; padding: 8px; }
    th { background: #f9fafb; }
  </style>
  </head>
  <body>
    <h1>Inventara - Movement Reports</h1>
    <table>
      <thead>
        <tr>
          <th>ID</th><th>Product ID</th><th>Product Name</th><th>Direction</th><th>Qty</th><th>Unit</th><th>Date</th><th>Reference</th><th>Source</th><th>Destination</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.map(m => `<tr>
          <td>${m.id}</td>
          <td>${m.productId}</td>
          <td>${m.productName}</td>
          <td>${m.direction}</td>
          <td>${m.quantity}</td>
          <td>${m.unit}</td>
          <td>${m.date}</td>
          <td>${m.reference}</td>
          <td>${m.source || ''}</td>
          <td>${m.destination || ''}</td>
        </tr>`).join('')}
      </tbody>
    </table>
    <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 300); };</script>
  </body>
</html>`
    const w = window.open('', '_blank', 'width=1200,height=800')
    if (!w) return
    w.document.open()
    w.document.write(html)
    w.document.close()
  }

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
          <h1 className="text-3xl font-bold">Movement Reports</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); resetToFirstPage() }} placeholder="Search product, ID, or reference" className="w-[240px]" />
          <Select value={productFilter} onValueChange={(v) => { setProductFilter(v); resetToFirstPage() }}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Product" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Products</SelectItem>
              {uniqueProducts.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name} ({p.id})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={directionFilter} onValueChange={(v) => { setDirectionFilter(v as any); resetToFirstPage() }}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Direction" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="INWARD">Inward</SelectItem>
              <SelectItem value="OUTWARD">Outward</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeframe} onValueChange={(v) => { setTimeframe(v); resetToFirstPage() }}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Timeframe" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7-days">Last 7 Days</SelectItem>
              <SelectItem value="30-days">Last 30 Days</SelectItem>
              <SelectItem value="90-days">Last 90 Days</SelectItem>
              <SelectItem value="1-year">Last 1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); resetToFirstPage() }}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Page size" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="20">20 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={downloadCsv} title="Export CSV"><Download className="h-4 w-4 mr-2" /> CSV</Button>
          <Button onClick={printAsPdf} title="Export PDF"><Printer className="h-4 w-4 mr-2" /> PDF</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Movements</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-between"><div className="text-2xl font-bold">{totals.count}</div><Hash className="w-5 h-5 text-muted-foreground" /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Inward</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-between"><div className="text-2xl font-bold">{totals.inward}</div><ArrowDownToLine className="w-5 h-5 text-emerald-500" /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Outward</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-between"><div className="text-2xl font-bold">{totals.outward}</div><ArrowUpFromLine className="w-5 h-5 text-rose-500" /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Net Movement</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-between"><div className="text-2xl font-bold">{totals.net}</div><Package className="w-5 h-5 text-muted-foreground" /></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>Inward and outward events merged into a single stack</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[520px] pr-2">
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-border/60" />
              <div className="space-y-4">
                {paged.map((m) => (
                  <div key={m.id} className="relative pl-10">
                    <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full border bg-background ring-2 ring-offset-2 ring-offset-background"
                      style={{
                        borderColor: m.direction === 'INWARD' ? 'rgb(16 185 129)' : 'rgb(244 63 94)',
                        boxShadow: `0 0 0 3px ${m.direction === 'INWARD' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)'} inset`
                      }}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={m.direction === 'INWARD' ? 'secondary' : 'destructive'}>
                        {m.direction === 'INWARD' ? 'Inward' : 'Outward'}
                      </Badge>
                      <div className="font-medium">{m.productName}</div>
                      <div className="text-sm text-muted-foreground">• {m.quantity} {m.unit}</div>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" /> {m.date}</span>
                      <span className="inline-flex items-center gap-1"><Hash className="h-4 w-4" /> {m.reference}</span>
                      {m.source ? <span>From: {m.source}</span> : null}
                      {m.destination ? <span>To: {m.destination}</span> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Showing {filtered.length === 0 ? 0 : pageStart + 1}-{Math.min(pageEnd, filtered.length)} of {filtered.length}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
              <div>Page {currentPage} / {totalPages}</div>
              <Button variant="outline" disabled={currentPage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


