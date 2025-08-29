'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Package, 
  TrendingUp, 
  Settings, 
  Users, 
  Home,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Building2,
  Database,
  ShoppingCart,
  Receipt,
  Target,
  Activity
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function IERPDashboardContent() {
  const router = useRouter();

  // Mock data for ERP modules status
  const moduleStatus = {
    "Finance & Controlling": {
      status: "active",
      progress: 100,
      lastUpdated: "2024-01-20",
      totalTransactions: 1245,
      pendingApprovals: 8
    },
    "Materials Management": {
      status: "active", 
      progress: 100,
      lastUpdated: "2024-01-20",
      totalTransactions: 892,
      pendingApprovals: 12
    },
    "Sales & Distribution": {
      status: "active",
      progress: 100, 
      lastUpdated: "2024-01-20",
      totalTransactions: 567,
      pendingApprovals: 5
    },
    "Production Planning": {
      status: "active",
      progress: 100,
      lastUpdated: "2024-01-20",
      totalTransactions: 89,
      pendingApprovals: 6
    },
    "Human Capital Management": {
      status: "active",
      progress: 100,
      lastUpdated: "2024-01-20", 
      totalTransactions: 247,
      pendingApprovals: 12
    }
  };

  // Mock chart data
  const performanceData = [
    { month: "Jan", finance: 85, materials: 78, sales: 92 },
    { month: "Feb", finance: 88, materials: 82, sales: 89 },
    { month: "Mar", finance: 92, materials: 85, sales: 94 },
    { month: "Apr", finance: 90, materials: 88, sales: 91 },
    { month: "May", finance: 94, materials: 90, sales: 96 },
    { month: "Jun", finance: 96, materials: 92, sales: 98 }
  ];

  const moduleDistribution = [
    { name: "Finance & Controlling", value: 35, color: "#4B6587" },
    { name: "Materials Management", value: 30, color: "#6B8A7A" },
    { name: "Sales & Distribution", value: 25, color: "#A8DADC" },
    { name: "Production Planning", value: 5, color: "#F1FAEE" },
    { name: "Human Capital Mgmt", value: 5, color: "#E63946" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "coming-soon":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case "coming-soon":
        return <Badge variant="secondary">Phase 2</Badge>;
      default:
        return <Badge variant="destructive">Inactive</Badge>;
    }
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
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">iERP - Inventara ERP</h1>
            <p className="text-gray-600 dark:text-gray-300">SaaS & GST Addendum (India) — Multi-Tenant Enterprise Resource Planning</p>
          </div>
        </div>
        <Badge variant="default" className="text-lg px-3 py-1 bg-green-600">
          SaaS Platform
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Modules</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Phase 1 & 2 Complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Activity className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,040</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Across all modules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Module Status Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">ERP Modules</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/ierp/finance')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">Finance & Controlling</CardTitle>
                    <CardDescription>FI/CO Module</CardDescription>
                  </div>
                </div>
                {getStatusIcon(moduleStatus["Finance & Controlling"].status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  {getStatusBadge(moduleStatus["Finance & Controlling"].status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Transactions:</span>
                  <span className="font-medium">{moduleStatus["Finance & Controlling"].totalTransactions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending:</span>
                  <Badge variant="outline">{moduleStatus["Finance & Controlling"].pendingApprovals}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/ierp/materials')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-green-600" />
                  <div>
                    <CardTitle className="text-lg">Materials Management</CardTitle>
                    <CardDescription>MM Module</CardDescription>
                  </div>
                </div>
                {getStatusIcon(moduleStatus["Materials Management"].status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  {getStatusBadge(moduleStatus["Materials Management"].status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Transactions:</span>
                  <span className="font-medium">{moduleStatus["Materials Management"].totalTransactions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending:</span>
                  <Badge variant="outline">{moduleStatus["Materials Management"].pendingApprovals}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/ierp/sales')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div>
                    <CardTitle className="text-lg">Sales & Distribution</CardTitle>
                    <CardDescription>SD Module</CardDescription>
                  </div>
                </div>
                {getStatusIcon(moduleStatus["Sales & Distribution"].status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  {getStatusBadge(moduleStatus["Sales & Distribution"].status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Transactions:</span>
                  <span className="font-medium">{moduleStatus["Sales & Distribution"].totalTransactions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending:</span>
                  <Badge variant="outline">{moduleStatus["Sales & Distribution"].pendingApprovals}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/ierp/production')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="h-8 w-8 text-orange-600" />
                  <div>
                    <CardTitle className="text-lg">Production Planning</CardTitle>
                    <CardDescription>PP Module - Phase 2 Active</CardDescription>
                  </div>
                </div>
                {getStatusIcon(moduleStatus["Production Planning"].status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  {getStatusBadge(moduleStatus["Production Planning"].status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Transactions:</span>
                  <span className="font-medium">{moduleStatus["Production Planning"].totalTransactions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending:</span>
                  <Badge variant="outline">{moduleStatus["Production Planning"].pendingApprovals}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/ierp/hcm')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-red-600" />
                  <div>
                    <CardTitle className="text-lg">Human Capital Mgmt</CardTitle>
                    <CardDescription>HCM Module - Phase 2 Active</CardDescription>
                  </div>
                </div>
                {getStatusIcon(moduleStatus["Human Capital Management"].status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  {getStatusBadge(moduleStatus["Human Capital Management"].status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Transactions:</span>
                  <span className="font-medium">{moduleStatus["Human Capital Management"].totalTransactions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending:</span>
                  <Badge variant="outline">{moduleStatus["Human Capital Management"].pendingApprovals}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Module Performance Trends</CardTitle>
            <CardDescription>Performance metrics across active ERP modules</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ 
              finance: { label: "Finance" }, 
              materials: { label: "Materials" }, 
              sales: { label: "Sales" } 
            }}>
              <LineChart data={performanceData} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis width={30} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="finance" stroke="#4B6587" strokeWidth={2} name="Finance" />
                <Line type="monotone" dataKey="materials" stroke="#6B8A7A" strokeWidth={2} name="Materials" />
                <Line type="monotone" dataKey="sales" stroke="#A8DADC" strokeWidth={2} name="Sales" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Module Usage Distribution</CardTitle>
            <CardDescription>Transaction volume by module</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moduleDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {moduleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used ERP functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => router.push('/ierp/finance/general-ledger')}
            >
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">General Ledger</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => router.push('/ierp/materials/procurement')}
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="text-sm">Procurement</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => router.push('/ierp/sales/orders')}
            >
              <Receipt className="h-6 w-6" />
              <span className="text-sm">Sales Orders</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => router.push('/ierp/finance/reporting')}
            >
              <Target className="h-6 w-6" />
              <span className="text-sm">Financial Reports</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => router.push('/ierp/production/orders')}
            >
              <Settings className="h-6 w-6" />
              <span className="text-sm">Manufacturing</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => router.push('/ierp/hcm/employees')}
            >
              <Users className="h-6 w-6" />
              <span className="text-sm">Employee Records</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}