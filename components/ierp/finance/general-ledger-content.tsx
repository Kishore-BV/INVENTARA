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
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Eye,
  Edit,
  Download,
  Upload,
  Calculator,
  BookOpen,
  Receipt
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

export function GeneralLedgerContent() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(12);
  const [page, setPage] = useState<number>(1);

  const ledgerData = {
    overview: {
      totalAccounts: 245,
      activeAccounts: 228,
      totalDebit: "₹45,67,89,000",
      totalCredit: "₹45,67,89,000",
      balanceVariance: "₹0",
      lastReconciliation: "2024-01-20"
    },
    accounts: [
      {
        id: "1000",
        name: "Cash in Hand",
        type: "Asset",
        category: "Current Assets",
        debit: 250000,
        credit: 180000,
        balance: 70000,
        status: "Active",
        lastTransaction: "2024-01-20",
        description: "Petty cash and cash on hand",
        reconciled: true
      },
      {
        id: "1100",
        name: "Bank Account - SBI",
        type: "Asset", 
        category: "Current Assets",
        debit: 5500000,
        credit: 4200000,
        balance: 1300000,
        status: "Active",
        lastTransaction: "2024-01-20",
        description: "State Bank of India - Current Account",
        reconciled: true
      },
      {
        id: "1200",
        name: "Accounts Receivable",
        type: "Asset",
        category: "Current Assets", 
        debit: 3400000,
        credit: 2100000,
        balance: 1300000,
        status: "Active",
        lastTransaction: "2024-01-19",
        description: "Outstanding customer invoices",
        reconciled: false
      },
      {
        id: "1500",
        name: "Fixed Assets - Equipment",
        type: "Asset",
        category: "Fixed Assets",
        debit: 12500000,
        credit: 3200000,
        balance: 9300000,
        status: "Active",
        lastTransaction: "2024-01-18",
        description: "Manufacturing and office equipment",
        reconciled: true
      },
      {
        id: "2100",
        name: "Accounts Payable",
        type: "Liability",
        category: "Current Liabilities",
        debit: 1800000,
        credit: 2900000,
        balance: -1100000,
        status: "Active",
        lastTransaction: "2024-01-20",
        description: "Outstanding vendor bills",
        reconciled: false
      },
      {
        id: "3000",
        name: "Owner's Equity",
        type: "Equity",
        category: "Capital",
        debit: 500000,
        credit: 15000000,
        balance: -14500000,
        status: "Active",
        lastTransaction: "2024-01-15",
        description: "Owner's capital investment",
        reconciled: true
      },
      {
        id: "4100",
        name: "Sales Revenue",
        type: "Revenue",
        category: "Operating Revenue",
        debit: 200000,
        credit: 8500000,
        balance: -8300000,
        status: "Active",
        lastTransaction: "2024-01-20",
        description: "Product and service sales",
        reconciled: true
      },
      {
        id: "6100",
        name: "Cost of Goods Sold",
        type: "Expense",
        category: "Operating Expenses",
        debit: 4200000,
        credit: 100000,
        balance: 4100000,
        status: "Active",
        lastTransaction: "2024-01-19",
        description: "Direct costs of production",
        reconciled: true
      }
    ],
    chart: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      assets: [12500000, 13200000, 13800000, 14100000, 14500000, 15200000],
      liabilities: [6200000, 6500000, 6800000, 7100000, 7300000, 7600000],
      equity: [6300000, 6700000, 7000000, 7000000, 7200000, 7600000]
    }
  };

  const chartData = ledgerData.chart.labels.map((label, idx) => ({
    month: label,
    assets: ledgerData.chart.assets[idx],
    liabilities: ledgerData.chart.liabilities[idx],
    equity: ledgerData.chart.equity[idx]
  }));

  const openAccount = (account: any) => {
    setSelectedAccount(account);
    setDialogOpen(true);
  };

  const accountTypes = useMemo(() => {
    return Array.from(new Set(ledgerData.accounts.map(a => a.type)))
  }, []);

  const filteredAccounts = useMemo(() => {
    let data = ledgerData.accounts;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      data = data.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    }
    if (accountTypeFilter !== "ALL") {
      data = data.filter(a => a.type === accountTypeFilter);
    }
    if (statusFilter !== "ALL") {
      data = data.filter(a => a.status === statusFilter);
    }
    return data;
  }, [ledgerData.accounts, searchTerm, accountTypeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const pagedAccounts = filteredAccounts.slice(pageStart, pageEnd);

  const resetToFirstPage = () => setPage(1);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "Asset": return "bg-blue-500";
      case "Liability": return "bg-red-500";
      case "Equity": return "bg-green-500";
      case "Revenue": return "bg-purple-500";
      case "Expense": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const downloadCsv = () => {
    const rows = [
      ["Account ID", "Account Name", "Type", "Category", "Debit", "Credit", "Balance", "Status", "Last Transaction"],
      ...filteredAccounts.map((a) => [
        a.id,
        a.name,
        a.type,
        a.category,
        String(a.debit),
        String(a.credit),
        String(a.balance),
        a.status,
        a.lastTransaction
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `general-ledger-${new Date().toISOString().slice(0,10)}.csv`;
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
            title="Go to Finance & Controlling"
            onClick={() => router.push('/ierp/finance')}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Finance & Controlling</span>
          </Button>
          <h1 className="text-3xl font-bold">General Ledger</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); resetToFirstPage(); }} 
            placeholder="Search account, ID, or type" 
            className="w-[220px]" 
          />
          <Select value={accountTypeFilter} onValueChange={(v) => { setAccountTypeFilter(v); resetToFirstPage(); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Account Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              {accountTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
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
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ledgerData.overview.totalAccounts}</div>
            <p className="text-xs text-blue-600">
              {ledgerData.overview.activeAccounts} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Debits</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ledgerData.overview.totalDebit}</div>
            <p className="text-xs text-green-600">
              All debit entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ledgerData.overview.totalCredit}</div>
            <p className="text-xs text-red-600">
              All credit entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Balance Check</CardTitle>
            <Calculator className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ledgerData.overview.balanceVariance}</div>
            <p className="text-xs text-purple-600">
              Balanced ledger
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart of Accounts Balance Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Account Balance Trends</CardTitle>
          <CardDescription>Assets, Liabilities, and Equity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ 
            assets: { label: "Assets" }, 
            liabilities: { label: "Liabilities" },
            equity: { label: "Equity" }
          }}>
            <LineChart data={chartData} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis width={80} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value/1000000).toFixed(0)}M`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Line type="monotone" dataKey="assets" stroke="#4B6587" strokeWidth={2} name="Assets" />
              <Line type="monotone" dataKey="liabilities" stroke="#E63946" strokeWidth={2} name="Liabilities" />
              <Line type="monotone" dataKey="equity" stroke="#6B8A7A" strokeWidth={2} name="Equity" />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Account Cards Grid */}
      <div>
        <div className="mb-3">
          <h2 className="text-xl font-semibold">Chart of Accounts</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Click an account to view detailed transactions and balance history</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pagedAccounts.map((account) => (
            <Card key={account.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openAccount(account)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{account.name}</div>
                    <div className="text-xs text-gray-500">{account.id}</div>
                  </div>
                  <Badge className={getAccountTypeColor(account.type)}>
                    {account.type}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Balance:</span>
                    <span className={`font-medium ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {account.balance >= 0 ? '' : '-'}{formatCurrency(account.balance)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Category:</span>
                    <span className="text-xs">{account.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Status:</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={account.status === 'Active' ? 'default' : 'secondary'}>
                        {account.status}
                      </Badge>
                      {account.reconciled && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" title="Reconciled"></div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <div>
            Showing {filteredAccounts.length === 0 ? 0 : pageStart + 1}-{Math.min(pageEnd, filteredAccounts.length)} of {filteredAccounts.length}
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
              <CardTitle>Chart of Accounts Summary</CardTitle>
              <CardDescription>Complete overview of all ledger accounts and their balances</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account ID</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledgerData.accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.id}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>
                    <Badge className={getAccountTypeColor(account.type)}>
                      {account.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{account.category}</TableCell>
                  <TableCell className="text-right">{formatCurrency(account.debit)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(account.credit)}</TableCell>
                  <TableCell className="text-right">
                    <span className={account.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {account.balance >= 0 ? '' : '-'}{formatCurrency(account.balance)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={account.status === "Active" ? "default" : "secondary"}>
                        {account.status}
                      </Badge>
                      {account.reconciled && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" title="Reconciled"></div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openAccount(account)}>
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

      {/* Account Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedAccount?.name} ({selectedAccount?.id})</DialogTitle>
            <DialogDescription>
              <div className="mt-3 grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Account Type</div>
                    <Badge className={getAccountTypeColor(selectedAccount?.type)}>
                      {selectedAccount?.type}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Category</div>
                    <div className="text-sm text-gray-600">{selectedAccount?.category}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">Total Debit</div>
                    <div className="text-lg font-semibold text-green-600">
                      {selectedAccount && formatCurrency(selectedAccount.debit)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Total Credit</div>
                    <div className="text-lg font-semibold text-red-600">
                      {selectedAccount && formatCurrency(selectedAccount.credit)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Current Balance</div>
                    <div className={`text-lg font-semibold ${selectedAccount?.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedAccount && (selectedAccount.balance >= 0 ? '' : '-')}{selectedAccount && formatCurrency(selectedAccount.balance)}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Description</div>
                  <div className="text-sm text-gray-600">{selectedAccount?.description}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Last Transaction</div>
                    <div className="text-sm text-gray-600">{selectedAccount?.lastTransaction}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedAccount?.status === "Active" ? "default" : "secondary"}>
                      {selectedAccount?.status}
                    </Badge>
                    {selectedAccount?.reconciled && (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        Reconciled
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm">
                    <Receipt className="h-4 w-4 mr-2" />
                    View Transactions
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Account
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
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