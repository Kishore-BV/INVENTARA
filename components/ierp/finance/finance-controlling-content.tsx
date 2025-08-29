'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  DollarSign, 
  Home,
  BarChart3,
  CreditCard,
  Receipt,
  Building2,
  FileText,
  PieChart,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Edit,
  Download
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from "recharts";

export function FinanceControllingContent() {
  const router = useRouter();

  // Mock financial data
  const financialOverview = {
    totalRevenue: "₹45,67,89,000",
    totalExpenses: "₹32,45,67,000", 
    netIncome: "₹13,22,22,000",
    cashFlow: "₹8,45,67,000",
    accountsReceivable: "₹12,34,56,000",
    accountsPayable: "₹8,76,54,000",
    totalAssets: "₹1,23,45,67,000"
  };

  const recentTransactions = [
    { id: "TXN-001", date: "2024-01-20", description: "Customer Payment - Invoice #INV-2024-001", account: "1200 - Accounts Receivable", debit: 0, credit: 150000, balance: 150000 },
    { id: "TXN-002", date: "2024-01-20", description: "Supplier Payment - TechCorp Solutions", account: "2100 - Accounts Payable", debit: 250000, credit: 0, balance: -250000 },
    { id: "TXN-003", date: "2024-01-19", description: "Office Rent - January 2024", account: "6200 - Rent Expense", debit: 45000, credit: 0, balance: -45000 },
    { id: "TXN-004", date: "2024-01-19", description: "Sales Revenue - Order #ORD-2024-045", account: "4100 - Sales Revenue", debit: 0, credit: 180000, balance: 180000 },
    { id: "TXN-005", date: "2024-01-18", description: "Equipment Purchase - Manufacturing Unit", account: "1500 - Fixed Assets", debit: 500000, credit: 0, balance: -500000 }
  ];

  const monthlyData = [
    { month: "Jul", revenue: 3500000, expenses: 2800000, profit: 700000 },
    { month: "Aug", revenue: 3800000, expenses: 2900000, profit: 900000 },
    { month: "Sep", revenue: 4200000, expenses: 3100000, profit: 1100000 },
    { month: "Oct", revenue: 4500000, expenses: 3200000, profit: 1300000 },
    { month: "Nov", revenue: 4800000, expenses: 3400000, profit: 1400000 },
    { month: "Dec", revenue: 5200000, expenses: 3600000, profit: 1600000 }
  ];

  const pendingApprovals = [
    { id: "APP-001", type: "Expense Report", amount: "₹25,000", requestor: "John Smith", department: "Marketing", date: "2024-01-18" },
    { id: "APP-002", type: "Purchase Requisition", amount: "₹1,50,000", requestor: "Sarah Wilson", department: "IT", date: "2024-01-17" },
    { id: "APP-003", type: "Invoice Approval", amount: "₹75,000", requestor: "Mike Johnson", department: "Operations", date: "2024-01-16" }
  ];

  const costCenters = [
    { id: "CC-001", name: "Administration", budget: 500000, spent: 125000, remaining: 375000, variance: 25 },
    { id: "CC-002", name: "Sales & Marketing", budget: 800000, spent: 220000, remaining: 580000, variance: 27.5 },
    { id: "CC-003", name: "Production", budget: 1200000, spent: 450000, remaining: 750000, variance: 37.5 },
    { id: "CC-004", name: "Research & Development", budget: 600000, spent: 180000, remaining: 420000, variance: 30 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2" 
            title="Go to iERP Dashboard"
            onClick={() => router.push('/ierp')}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">iERP</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Finance & Controlling (FI/CO)</h1>
            <p className="text-gray-600 dark:text-gray-300">General Ledger, Accounts Management & Financial Reporting</p>
          </div>
        </div>
        <Badge variant="default" className="text-lg px-3 py-1">
          Phase 1 Active
        </Badge>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialOverview.totalRevenue}</div>
            <p className="text-xs text-green-600">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialOverview.totalExpenses}</div>
            <p className="text-xs text-red-600">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialOverview.netIncome}</div>
            <p className="text-xs text-blue-600">
              +15.8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialOverview.cashFlow}</div>
            <p className="text-xs text-green-600">
              Positive cash flow
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Modules */}
      <div>
        <h2 className="text-xl font-semibold mb-4">FI/CO Modules</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/finance/general-ledger')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <BarChart3 className="h-10 w-10 text-blue-600" />
                <div>
                  <h3 className="font-semibold">General Ledger</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Chart of accounts & journal entries</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/finance/accounts-payable')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <CreditCard className="h-10 w-10 text-red-600" />
                <div>
                  <h3 className="font-semibold">Accounts Payable</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Vendor payments & outstanding bills</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/finance/accounts-receivable')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Receipt className="h-10 w-10 text-green-600" />
                <div>
                  <h3 className="font-semibold">Accounts Receivable</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Customer invoices & collections</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/finance/asset-management')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Building2 className="h-10 w-10 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Asset Management</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Fixed assets & depreciation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/finance/reporting')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <FileText className="h-10 w-10 text-orange-600" />
                <div>
                  <h3 className="font-semibold">Financial Reporting</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">P&L, Balance sheet & reports</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/ierp/finance/cost-center')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <PieChart className="h-10 w-10 text-indigo-600" />
                <div>
                  <h3 className="font-semibold">Cost Center Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Budget tracking & variance analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Financial Performance Chart */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Monthly financial performance trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ 
              revenue: { label: "Revenue" }, 
              expenses: { label: "Expenses" },
              profit: { label: "Profit" }
            }}>
              <LineChart data={monthlyData} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis width={60} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line type="monotone" dataKey="revenue" stroke="#4B6587" strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="expenses" stroke="#E63946" strokeWidth={2} name="Expenses" />
                <Line type="monotone" dataKey="profit" stroke="#6B8A7A" strokeWidth={2} name="Profit" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Center Budget Utilization</CardTitle>
            <CardDescription>Budget vs actual spending by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {costCenters.map((center) => (
                <div key={center.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{center.name}</span>
                    <span className="text-sm text-gray-600">{center.variance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${center.variance}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Spent: {formatCurrency(center.spent)}</span>
                    <span>Budget: {formatCurrency(center.budget)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest financial transactions across all accounts</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.account}</TableCell>
                  <TableCell className="text-right">
                    {transaction.debit > 0 ? formatCurrency(transaction.debit) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.credit > 0 ? formatCurrency(transaction.credit) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={transaction.balance > 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(Math.abs(transaction.balance))}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
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

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Financial items requiring approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApprovals.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="font-medium">{item.type}</div>
                    <div className="text-sm text-gray-600">
                      {item.requestor} • {item.department} • {item.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{item.amount}</span>
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}