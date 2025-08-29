"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  Home,
  Activity,
  Star,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Filter
} from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

const monthlyData = [
  { month: 'Jan', leads: 120, conversions: 18, revenue: 450000, customers: 15 },
  { month: 'Feb', leads: 140, conversions: 22, revenue: 520000, customers: 18 },
  { month: 'Mar', leads: 110, conversions: 16, revenue: 480000, customers: 14 },
  { month: 'Apr', leads: 160, conversions: 25, revenue: 610000, customers: 20 },
  { month: 'May', leads: 130, conversions: 20, revenue: 550000, customers: 17 },
  { month: 'Jun', leads: 180, conversions: 28, revenue: 680000, customers: 22 }
]

const leadSourceData = [
  { name: 'Website', value: 40, color: '#8884d8' },
  { name: 'Referrals', value: 25, color: '#82ca9d' },
  { name: 'Social Media', value: 20, color: '#ffc658' },
  { name: 'Cold Calls', value: 15, color: '#ff7300' }
]

const salespersonData = [
  { name: 'Sarah Johnson', leads: 45, conversions: 12, revenue: 550000, commission: 27500 },
  { name: 'Mike Wilson', leads: 38, conversions: 8, revenue: 260000, commission: 13000 },
  { name: 'Emily Davis', leads: 32, conversions: 6, revenue: 120000, commission: 6000 },
  { name: 'David Brown', leads: 25, conversions: 4, revenue: 80000, commission: 4000 }
]

const topCustomers = [
  { name: "Tech Solutions Inc", revenue: 250000, deals: 3, lastPurchase: "2024-01-15" },
  { name: "Healthcare Systems", revenue: 200000, deals: 2, lastPurchase: "2024-01-12" },
  { name: "Global Manufacturing", revenue: 180000, deals: 2, lastPurchase: "2024-01-14" },
  { name: "Retail Chain Ltd", revenue: 120000, deals: 1, lastPurchase: "2024-01-12" },
  { name: "Education First", revenue: 80000, deals: 1, lastPurchase: "2024-01-11" }
]

export function ReportsContent() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")

  const totalLeads = monthlyData.reduce((sum, m) => sum + m.leads, 0)
  const totalConversions = monthlyData.reduce((sum, m) => sum + m.conversions, 0)
  const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0)
  const totalCustomers = monthlyData.reduce((sum, m) => sum + m.customers, 0)
  const conversionRate = (totalConversions / totalLeads * 100).toFixed(1)
  const avgRevenuePerCustomer = (totalRevenue / totalCustomers).toFixed(0)

  const exportToCSV = () => {
    const headers = ["Month", "Leads", "Conversions", "Revenue", "Customers"]
    const csvContent = [
      headers.join(","),
      ...monthlyData.map(data => [
        data.month,
        data.leads,
        data.conversions,
        data.revenue,
        data.customers
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `crm-reports-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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
            <h1 className="text-3xl font-bold">CRM Analytics & Reports</h1>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive insights and performance metrics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Target className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads.toLocaleString()}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12% vs previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +2.5% vs previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +8.5% vs previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Revenue/Customer</CardTitle>
            <Users className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(parseInt(avgRevenuePerCustomer) / 1000).toFixed(0)}K</div>
            <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +5.2% vs previous period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance Trends</CardTitle>
            <CardDescription>Leads, conversions, revenue, and customer acquisition</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' ? `₹${(value as number).toLocaleString()}` : value,
                  name === 'revenue' ? 'Revenue' : name === 'leads' ? 'Leads' : name === 'conversions' ? 'Conversions' : 'Customers'
                ]} />
                <Line type="monotone" dataKey="leads" stroke="#8884d8" strokeWidth={2} name="leads" />
                <Line type="monotone" dataKey="conversions" stroke="#82ca9d" strokeWidth={2} name="conversions" />
                <Line type="monotone" dataKey="revenue" stroke="#ffc658" strokeWidth={2} name="revenue" />
                <Line type="monotone" dataKey="customers" stroke="#ff7300" strokeWidth={2} name="customers" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Source Distribution</CardTitle>
            <CardDescription>Where your leads are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {leadSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Salesperson Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Salesperson Performance</CardTitle>
          <CardDescription>Individual performance metrics and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Salesperson</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salespersonData.map((person) => {
                const conversionRate = ((person.conversions / person.leads) * 100).toFixed(1)
                const performance = (person.conversions / person.leads) * 100
                return (
                  <TableRow key={person.name}>
                    <TableCell>
                      <div className="font-medium">{person.name}</div>
                    </TableCell>
                    <TableCell>{person.leads}</TableCell>
                    <TableCell>{person.conversions}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={performance} className="w-16 h-2" />
                        <span className="text-sm font-medium">{conversionRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">₹{(person.revenue / 1000).toFixed(0)}K</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">₹{(person.commission / 1000).toFixed(0)}K</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={performance > 25 ? "bg-green-100 text-green-800" : performance > 15 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                        {performance > 25 ? "Excellent" : performance > 15 ? "Good" : "Needs Improvement"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers by Revenue</CardTitle>
          <CardDescription>Your highest-value customers and their contribution</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Number of Deals</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead>Customer Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCustomers.map((customer, index) => (
                <TableRow key={customer.name}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div className="font-medium">{customer.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">₹{(customer.revenue / 1000).toFixed(0)}K</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{customer.deals} deals</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(customer.lastPurchase).toLocaleDateString('en-US')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={customer.revenue > 200000 ? "bg-green-100 text-green-800" : customer.revenue > 100000 ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}>
                      {customer.revenue > 200000 ? "Premium" : customer.revenue > 100000 ? "Gold" : "Silver"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Conversion Rate Trend</p>
              <p className="text-xs text-gray-600">Conversion rate has improved by 2.5% this period, indicating better lead quality and sales process.</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Revenue Growth</p>
              <p className="text-xs text-gray-600">Monthly revenue shows consistent growth with an average increase of 8.5% month-over-month.</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Lead Source Performance</p>
              <p className="text-xs text-gray-600">Website leads continue to be the highest converting source at 40% of total leads.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Cold Call Performance</p>
              <p className="text-xs text-gray-600">Cold calls have the lowest conversion rate. Consider improving scripts and targeting.</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Salesperson Training</p>
              <p className="text-xs text-gray-600">Some team members need additional training to improve conversion rates.</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Lead Response Time</p>
              <p className="text-xs text-gray-600">Average response time to leads is 4 hours. Aim for under 1 hour for better conversion.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-600" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Increase Website Optimization</p>
              <p className="text-xs text-gray-600">Focus on improving website conversion rates as it's your highest-performing channel.</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Referral Program</p>
              <p className="text-xs text-gray-600">Implement a referral program to increase the 25% of leads from referrals.</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Social Media Strategy</p>
              <p className="text-xs text-gray-600">Enhance social media presence to improve the 20% of leads from this channel.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}





