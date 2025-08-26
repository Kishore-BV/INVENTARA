'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Home, TrendingUp, TrendingDown, Package, AlertTriangle, Clock, DollarSign, BarChart3, PieChart, Activity, Download, Calendar, Filter, Search } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from "recharts"

// Sample data for charts
const stockLevelsData = [
  { month: 'Jan', current: 1200, previous: 1100, target: 1000 },
  { month: 'Feb', current: 1350, previous: 1200, target: 1000 },
  { month: 'Mar', current: 1100, previous: 1350, target: 1000 },
  { month: 'Apr', current: 1250, previous: 1100, target: 1000 },
  { month: 'May', current: 1400, previous: 1250, target: 1000 },
  { month: 'Jun', current: 1300, previous: 1400, target: 1000 },
]

const categoryDistribution = [
  { name: 'Raw Materials', value: 35, color: '#8884d8' },
  { name: 'Finished Goods', value: 25, color: '#82ca9d' },
  { name: 'Packaging', value: 20, color: '#ffc658' },
  { name: 'Spare Parts', value: 15, color: '#ff7300' },
  { name: 'Others', value: 5, color: '#8dd1e1' },
]

const topProducts = [
  { name: 'Laptop Computers', stock: 150, value: 45000, trend: 'up' },
  { name: 'Steel Sheets', stock: 500, value: 25000, trend: 'down' },
  { name: 'Packaging Boxes', stock: 1000, value: 5000, trend: 'stable' },
  { name: 'Electronics', stock: 75, value: 15000, trend: 'up' },
  { name: 'Office Supplies', stock: 200, value: 3000, trend: 'stable' },
]

const lowStockAlerts = [
  { product: 'Laptop Chargers', current: 5, min: 10, daysLeft: 2 },
  { product: 'USB Cables', current: 8, min: 15, daysLeft: 3 },
  { product: 'Mouse Pads', current: 12, min: 20, daysLeft: 5 },
  { product: 'Keyboard Wrist Rests', current: 3, min: 8, daysLeft: 1 },
]

export function InventoryAnalyticsContent() {
  const [timeframe, setTimeframe] = useState("6m")
  const [category, setCategory] = useState("all")

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      {/* Header with Home Button and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2" title="Go to Dashboard">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Inventory Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive insights into your inventory performance</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹78,50,000</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stock Turnover</CardTitle>
            <BarChart3 className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2x</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +0.3x from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" />
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Stock Level</CardTitle>
            <Package className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
              <Activity className="h-3 w-3" />
              Optimal range
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Stock Levels Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Levels Over Time</CardTitle>
            <CardDescription>Current vs Previous vs Target stock levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stockLevelsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="current" stroke="#8884d8" strokeWidth={2} name="Current" />
                <Line type="monotone" dataKey="previous" stroke="#82ca9d" strokeWidth={2} name="Previous" />
                <Line type="monotone" dataKey="target" stroke="#ffc658" strokeWidth={2} name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Stock value by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Low Stock Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Products by Value */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products by Value</CardTitle>
            <CardDescription>Highest value inventory items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Stock: {product.stock} | Value: ${product.value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ${getTrendColor(product.trend)}`}>
                    {getTrendIcon(product.trend)}
                    <span className="text-sm capitalize">{product.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div>
                    <p className="font-medium text-orange-800 dark:text-orange-200">{alert.product}</p>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      Current: {alert.current} | Min: {alert.min}
                    </p>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {alert.daysLeft} day{alert.daysLeft !== 1 ? 's' : ''} left
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Detailed inventory performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>Previous</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Stock Accuracy</TableCell>
                <TableCell>98.5%</TableCell>
                <TableCell>97.2%</TableCell>
                <TableCell className="text-green-600">+1.3%</TableCell>
                <TableCell><Badge variant="default">Excellent</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Order Fill Rate</TableCell>
                <TableCell>96.8%</TableCell>
                <TableCell>95.1%</TableCell>
                <TableCell className="text-green-600">+1.7%</TableCell>
                <TableCell><Badge variant="default">Good</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Carrying Cost</TableCell>
                <TableCell>18.2%</TableCell>
                <TableCell>19.5%</TableCell>
                <TableCell className="text-green-600">-1.3%</TableCell>
                <TableCell><Badge variant="secondary">Improving</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Stockout Rate</TableCell>
                <TableCell>2.1%</TableCell>
                <TableCell>3.2%</TableCell>
                <TableCell className="text-green-600">-1.1%</TableCell>
                <TableCell><Badge variant="default">Good</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
