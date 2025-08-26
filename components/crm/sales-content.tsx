"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { 
  DollarSign, 
  Plus, 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Calendar, 
  TrendingUp, 
  Home,
  CheckCircle,
  AlertTriangle,
  Star,
  Activity,
  Target,
  Users,
  BarChart3,
  Clock
} from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

interface Sale {
  id: string
  customer: string
  product: string
  amount: number
  status: "pending" | "completed" | "cancelled"
  date: string
  salesperson: string
  commission: number
  paymentMethod: string
}

const sales: Sale[] = [
  {
    id: "sale1",
    customer: "Tech Solutions Inc",
    product: "Enterprise Inventory System",
    amount: 250000,
    status: "completed",
    date: "2024-01-15",
    salesperson: "Sarah Johnson",
    commission: 12500,
    paymentMethod: "Bank Transfer"
  },
  {
    id: "sale2",
    customer: "Global Manufacturing",
    product: "Manufacturing Automation",
    amount: 180000,
    status: "completed",
    date: "2024-01-14",
    salesperson: "Mike Wilson",
    commission: 9000,
    paymentMethod: "Credit Card"
  },
  {
    id: "sale3",
    customer: "Healthcare Systems",
    product: "Healthcare Inventory System",
    amount: 300000,
    status: "pending",
    date: "2024-01-13",
    salesperson: "Sarah Johnson",
    commission: 15000,
    paymentMethod: "Bank Transfer"
  },
  {
    id: "sale4",
    customer: "Retail Chain Ltd",
    product: "Retail Management Suite",
    amount: 120000,
    status: "completed",
    date: "2024-01-12",
    salesperson: "Emily Davis",
    commission: 6000,
    paymentMethod: "Credit Card"
  },
  {
    id: "sale5",
    customer: "Education First",
    product: "Education Platform",
    amount: 80000,
    status: "cancelled",
    date: "2024-01-11",
    salesperson: "Mike Wilson",
    commission: 0,
    paymentMethod: "N/A"
  }
]

const salesData = [
  { month: 'Jan', revenue: 450000, deals: 12, avgDeal: 37500 },
  { month: 'Feb', revenue: 520000, deals: 15, avgDeal: 34667 },
  { month: 'Mar', revenue: 480000, deals: 14, avgDeal: 34286 },
  { month: 'Apr', revenue: 610000, deals: 18, avgDeal: 33889 },
  { month: 'May', revenue: 550000, deals: 16, avgDeal: 34375 },
  { month: 'Jun', revenue: 680000, deals: 20, avgDeal: 34000 }
]

const salespersonPerformance = [
  { name: 'Sarah Johnson', sales: 550000, deals: 8, commission: 27500 },
  { name: 'Mike Wilson', sales: 260000, deals: 5, commission: 13000 },
  { name: 'Emily Davis', sales: 120000, deals: 3, commission: 6000 },
  { name: 'David Brown', sales: 80000, deals: 2, commission: 4000 }
]

const getStatusColor = (status: Sale["status"]) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getStatusIcon = (status: Sale["status"]) => {
  switch (status) {
    case "completed": return <CheckCircle className="h-4 w-4" />
    case "pending": return <AlertTriangle className="h-4 w-4" />
    case "cancelled": return <AlertTriangle className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

export function SalesContent() {
  const [selectedStatus, setSelectedStatus] = useState<Sale["status"] | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const filteredSales = sales.filter(sale => {
    if (selectedStatus !== "all" && sale.status !== selectedStatus) return false
    if (searchQuery && !sale.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !sale.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const totalSales = sales.length
  const completedSales = sales.filter(s => s.status === "completed").length
  const totalRevenue = sales.filter(s => s.status === "completed").reduce((sum, s) => sum + s.amount, 0)
  const totalCommission = sales.filter(s => s.status === "completed").reduce((sum, s) => sum + s.commission, 0)

  const exportToCSV = () => {
    const headers = ["Customer", "Product", "Amount", "Status", "Date", "Salesperson", "Commission", "Payment Method"]
    const csvContent = [
      headers.join(","),
      ...filteredSales.map(sale => [
        sale.customer,
        sale.product,
        sale.amount,
        sale.status,
        sale.date,
        sale.salesperson,
        sale.commission,
        sale.paymentMethod
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sales-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const viewSaleDetails = (sale: Sale) => {
    setSelectedSale(sale)
    setIsViewDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      {/* Header with Home Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2" title="Go to Dashboard">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Sales Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Sales pipeline and revenue tracking</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button className="bg-[#4B6587] hover:bg-[#3A5068]">
            <Plus className="mr-2 h-4 w-4" />
            Add Sale
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <Activity className="h-3 w-3" />
              All transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Sales</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedSales}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <CheckCircle className="h-3 w-3" />
              Successful deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
              <DollarSign className="h-3 w-3" />
              From completed sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <Star className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalCommission / 1000).toFixed(0)}K</div>
            <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
              <Users className="h-3 w-3" />
              Sales team earnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Performance</CardTitle>
            <CardDescription>Revenue, deals, and average deal size trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' ? `₹${(value as number).toLocaleString()}` : value,
                  name === 'revenue' ? 'Revenue' : name === 'deals' ? 'Deals' : 'Avg Deal'
                ]} />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="revenue" />
                <Line type="monotone" dataKey="deals" stroke="#82ca9d" strokeWidth={2} name="deals" />
                <Line type="monotone" dataKey="avgDeal" stroke="#ffc658" strokeWidth={2} name="avgDeal" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Salesperson Performance</CardTitle>
            <CardDescription>Revenue and commission by salesperson</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salespersonPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'sales' ? `₹${(value as number).toLocaleString()}` : 
                  name === 'commission' ? `₹${(value as number).toLocaleString()}` : value,
                  name === 'sales' ? 'Sales' : name === 'commission' ? 'Commission' : 'Deals'
                ]} />
                <Bar dataKey="sales" fill="#8884d8" name="sales" />
                <Bar dataKey="commission" fill="#82ca9d" name="commission" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 flex-wrap">
        <Select value={selectedStatus} onValueChange={(value: Sale["status"] | "all") => setSelectedStatus(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search sales..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Transactions</CardTitle>
          <CardDescription>Track all sales transactions and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Salesperson</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <div className="font-medium">{sale.customer}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{sale.product}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">₹{(sale.amount / 1000).toFixed(0)}K</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(sale.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(sale.status)}
                        {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(sale.date).toLocaleDateString('en-US')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{sale.salesperson}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">₹{(sale.commission / 1000).toFixed(0)}K</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewSaleDetails(sale)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
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

      {/* Sale Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Sale Details</DialogTitle>
            <DialogDescription>Comprehensive view of sale information and transaction details</DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p className="font-medium">{selectedSale.customer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Product</Label>
                  <p className="font-medium">{selectedSale.product}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="font-medium text-lg">₹{(selectedSale.amount / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedSale.status)}>
                    {selectedSale.status.charAt(0).toUpperCase() + selectedSale.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p>{new Date(selectedSale.date).toLocaleDateString('en-US')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Salesperson</Label>
                  <p>{selectedSale.salesperson}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Commission</Label>
                  <p className="font-medium">₹{(selectedSale.commission / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <p>{selectedSale.paymentMethod}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="flex-1">
                  Close
                </Button>
                <Button className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Sale
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
