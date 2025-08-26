"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Target, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Plus, 
  ArrowRight, 
  Home,
  UserPlus,
  Activity,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

const salesData = [
  { month: 'Jan', sales: 45000, leads: 120, conversions: 15 },
  { month: 'Feb', sales: 52000, leads: 140, conversions: 18 },
  { month: 'Mar', sales: 48000, leads: 110, conversions: 14 },
  { month: 'Apr', sales: 61000, leads: 160, conversions: 22 },
  { month: 'May', sales: 55000, leads: 130, conversions: 19 },
  { month: 'Jun', sales: 68000, leads: 180, conversions: 25 }
]

const leadSourceData = [
  { name: 'Website', value: 40, color: '#8884d8' },
  { name: 'Referrals', value: 25, color: '#82ca9d' },
  { name: 'Social Media', value: 20, color: '#ffc658' },
  { name: 'Cold Calls', value: 15, color: '#ff7300' }
]

const recentCustomers = [
  {
    id: 1,
    name: "Tech Solutions Inc",
    email: "contact@techsolutions.com",
    phone: "+91 98765 43210",
    status: "active",
    value: 125000,
    lastContact: "2024-01-15"
  },
  {
    id: 2,
    name: "Global Manufacturing",
    email: "info@globalmfg.com",
    phone: "+91 87654 32109",
    status: "active",
    value: 89000,
    lastContact: "2024-01-14"
  },
  {
    id: 3,
    name: "Retail Chain Ltd",
    email: "sales@retailchain.com",
    phone: "+91 76543 21098",
    status: "prospect",
    value: 45000,
    lastContact: "2024-01-13"
  }
]

const recentLeads = [
  {
    id: 1,
    name: "Innovation Corp",
    email: "hello@innovationcorp.com",
    phone: "+91 65432 10987",
    source: "Website",
    status: "new",
    value: 75000
  },
  {
    id: 2,
    name: "Startup Ventures",
    email: "contact@startupventures.com",
    phone: "+91 54321 09876",
    source: "Referral",
    status: "contacted",
    value: 55000
  },
  {
    id: 3,
    name: "Enterprise Solutions",
    email: "info@enterprisesolutions.com",
    phone: "+91 43210 98765",
    source: "Social Media",
    status: "qualified",
    value: 120000
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "prospect": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "new": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "contacted": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
    case "qualified": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active": return <CheckCircle className="h-4 w-4" />
    case "prospect": return <Target className="h-4 w-4" />
    case "new": return <Clock className="h-4 w-4" />
    case "contacted": return <Phone className="h-4 w-4" />
    case "qualified": return <Star className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

export function CRMContent() {
  const totalCustomers = 156
  const activeLeads = 89
  const monthlyRevenue = 680000
  const conversionRate = 18.5

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
            <h1 className="text-3xl font-bold">Customer Relationship Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage customers, leads, and sales pipeline</p>
          </div>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3A5068]">
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12% this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <Target className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLeads}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <Activity className="h-3 w-3" />
              In pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(monthlyRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +8.5% vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
              <Target className="h-3 w-3" />
              Lead to customer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>Monthly sales, leads, and conversion trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'sales' ? `₹${(value as number).toLocaleString()}` : value,
                  name === 'sales' ? 'Revenue' : name === 'leads' ? 'Leads' : 'Conversions'
                ]} />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} name="sales" />
                <Line type="monotone" dataKey="leads" stroke="#82ca9d" strokeWidth={2} name="leads" />
                <Line type="monotone" dataKey="conversions" stroke="#ffc658" strokeWidth={2} name="conversions" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>Distribution of leads by source</CardDescription>
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

      {/* CRM Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-[#4B6587]" />
              <CardTitle>Customers</CardTitle>
            </div>
            <CardDescription>Manage customer relationships and data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              View and manage customer profiles, contact information, and interaction history.
            </p>
            <Link href="/crm/customers">
              <Button className="w-full bg-[#4B6587] hover:bg-[#3A5068]">
                Manage Customers <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-[#F4A261]" />
              <CardTitle>Leads</CardTitle>
            </div>
            <CardDescription>Track and manage potential customers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Capture, qualify, and nurture leads through the sales pipeline.
            </p>
            <Link href="/crm/leads">
              <Button className="w-full bg-[#F4A261] hover:bg-[#E7934E]">
                View Leads <Badge className="ml-2 bg-white text-[#F4A261]">{activeLeads}</Badge>
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-[#6B8A7A]" />
              <CardTitle>Opportunities</CardTitle>
            </div>
            <CardDescription>Track sales opportunities and deals</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Monitor sales opportunities, track deal progress, and forecast revenue.
            </p>
            <Link href="/crm/opportunities">
              <Button className="w-full bg-[#6B8A7A] hover:bg-[#5A7A69]">
                View Opportunities <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-[#E7B10A]" />
              <CardTitle>Sales</CardTitle>
            </div>
            <CardDescription>Sales pipeline and revenue tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Manage sales pipeline, track revenue, and analyze sales performance.
            </p>
            <Link href="/crm/sales">
              <Button className="w-full bg-[#E7B10A] hover:bg-[#D6A009]">
                View Sales <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
            <CardDescription>Latest customer additions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(customer.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(customer.status)}
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </div>
                    </Badge>
                    <p className="text-sm font-medium mt-1">₹{(customer.value / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>Latest lead captures and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.source}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(lead.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(lead.status)}
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </div>
                    </Badge>
                    <p className="text-sm font-medium mt-1">₹{(lead.value / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
