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
  Wallet,
  Calculator,
  TrendingUp,
  Users2,
  Calendar,
  Plus,
  Eye,
  Edit,
  Download,
  DollarSign,
  Receipt,
  PieChart,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from "recharts";

export function PayrollContent() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [monthFilter, setMonthFilter] = useState<string>("2024-01");

  const payrollData = {
    overview: {
      totalEmployees: 247,
      processedPayrolls: 247,
      totalPayroll: 20450000, // INR
      pendingApprovals: 8,
      averageSalary: 82834,
      taxDeductions: 4090000,
      bonusPayouts: 1235000
    },
    employees: [
      {
        id: "EMP-001",
        employeeId: "INV2024001",
        name: "Rajesh Kumar",
        department: "Technology",
        position: "Senior Software Engineer",
        basicSalary: 1000000,
        allowances: 200000,
        overtimePay: 25000,
        grossSalary: 1225000,
        taxDeduction: 147000,
        providentFund: 122500,
        esi: 0,
        otherDeductions: 15000,
        netSalary: 940500,
        payrollMonth: "2024-01",
        status: "Processed",
        processedDate: "2024-01-31"
      },
      {
        id: "EMP-002",
        employeeId: "INV2024002", 
        name: "Priya Sharma",
        department: "Marketing",
        position: "Marketing Manager",
        basicSalary: 800000,
        allowances: 150000,
        overtimePay: 0,
        grossSalary: 950000,
        taxDeduction: 95000,
        providentFund: 95000,
        esi: 0,
        otherDeductions: 12000,
        netSalary: 748000,
        payrollMonth: "2024-01",
        status: "Processed",
        processedDate: "2024-01-31"
      },
      {
        id: "EMP-003",
        employeeId: "INV2024003",
        name: "Amit Patel",
        department: "Finance",
        position: "Financial Analyst",
        basicSalary: 650000,
        allowances: 100000,
        overtimePay: 12000,
        grossSalary: 762000,
        taxDeduction: 76200,
        providentFund: 76200,
        esi: 0,
        otherDeductions: 8000,
        netSalary: 601600,
        payrollMonth: "2024-01",
        status: "Pending",
        processedDate: null
      },
      {
        id: "EMP-004",
        employeeId: "INV2024004",
        name: "Sneha Reddy",
        department: "Human Resources",
        position: "HR Specialist",
        basicSalary: 550000,
        allowances: 100000,
        overtimePay: 8000,
        grossSalary: 658000,
        taxDeduction: 52640,
        providentFund: 65800,
        esi: 0,
        otherDeductions: 6000,
        netSalary: 533560,
        payrollMonth: "2024-01",
        status: "Processed",
        processedDate: "2024-01-31"
      }
    ],
    departmentSummary: [
      { department: "Technology", employees: 78, totalPayroll: 9120000, avgSalary: 116923 },
      { department: "Marketing", employees: 32, totalPayroll: 3040000, avgSalary: 95000 },
      { department: "Finance", employees: 24, totalPayroll: 1872000, avgSalary: 78000 },
      { department: "Human Resources", employees: 18, totalPayroll: 1188000, avgSalary: 66000 },
      { department: "Production", employees: 65, totalPayroll: 4550000, avgSalary: 70000 },
      { department: "Sales", employees: 30, totalPayroll: 2550000, avgSalary: 85000 }
    ],
    monthlyTrends: [
      { month: "Jul", gross: 19800000, deductions: 3564000, net: 16236000 },
      { month: "Aug", gross: 20100000, deductions: 3618000, net: 16482000 },
      { month: "Sep", gross: 20350000, deductions: 3663000, net: 16687000 },
      { month: "Oct", gross: 20200000, deductions: 3636000, net: 16564000 },
      { month: "Nov", gross: 20450000, deductions: 3681000, net: 16769000 },
      { month: "Dec", gross: 21200000, deductions: 3816000, net: 17384000 } // Including bonus
    ]
  };

  const openPayroll = (payroll: any) => {
    setSelectedPayroll(payroll);
    setDialogOpen(true);
  };

  const departments = useMemo(() => {
    return Array.from(new Set(payrollData.employees.map(e => e.department)))
  }, []);

  const filteredEmployees = useMemo(() => {
    let data = payrollData.employees;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      data = data.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q)
      );
    }
    if (departmentFilter !== "ALL") {
      data = data.filter(e => e.department === departmentFilter);
    }
    if (statusFilter !== "ALL") {
      data = data.filter(e => e.status === statusFilter);
    }
    if (monthFilter !== "ALL") {
      data = data.filter(e => e.payrollMonth === monthFilter);
    }
    return data;
  }, [payrollData.employees, searchTerm, departmentFilter, statusFilter, monthFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Processed":
        return <Badge variant="default" className="bg-green-500">Processed</Badge>;
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "Under Review":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Under Review</Badge>;
      case "Approved":
        return <Badge variant="default" className="bg-blue-500">Approved</Badge>;
      default:
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const calculateTaxRate = (grossSalary: number, taxDeduction: number) => {
    return ((taxDeduction / grossSalary) * 100).toFixed(1);
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2" 
            onClick={() => router.push('/ierp/hcm')}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">HCM</span>
          </Button>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
        </div>
        <div className="flex items-center gap-3">
          <Input 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Search employees" 
            className="w-[200px]" 
          />
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Months</SelectItem>
              <SelectItem value="2024-01">January 2024</SelectItem>
              <SelectItem value="2023-12">December 2023</SelectItem>
              <SelectItem value="2023-11">November 2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <Wallet className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(payrollData.overview.totalPayroll)}</div>
            <p className="text-xs text-blue-600">
              {payrollData.overview.processedPayrolls} employees processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <Calculator className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(payrollData.overview.averageSalary)}</div>
            <p className="text-xs text-green-600">Per employee</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tax Deductions</CardTitle>
            <Receipt className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(payrollData.overview.taxDeductions)}</div>
            <p className="text-xs text-purple-600">Total tax collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollData.overview.pendingApprovals}</div>
            <p className="text-xs text-orange-600">Require review</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Payroll Trends</CardTitle>
            <CardDescription>Gross salary, deductions, and net payroll over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ 
              gross: { label: "Gross Salary" }, 
              deductions: { label: "Deductions" },
              net: { label: "Net Salary" }
            }}>
              <LineChart data={payrollData.monthlyTrends} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis width={80} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="gross" stroke="#4B6587" strokeWidth={2} name="Gross" />
                <Line type="monotone" dataKey="deductions" stroke="#E63946" strokeWidth={2} name="Deductions" />
                <Line type="monotone" dataKey="net" stroke="#6B8A7A" strokeWidth={2} name="Net" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Payroll Distribution</CardTitle>
            <CardDescription>Total payroll cost by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ 
              totalPayroll: { label: "Total Payroll" }, 
              avgSalary: { label: "Average Salary" }
            }}>
              <BarChart data={payrollData.departmentSummary} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" tickLine={false} axisLine={false} />
                <YAxis width={80} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="totalPayroll" fill="#4B6587" name="Total Payroll" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Department Payroll Summary</CardTitle>
          <CardDescription>Payroll breakdown by department for current month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payrollData.departmentSummary.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Users2 className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">{dept.department}</div>
                    <div className="text-sm text-gray-600">
                      {dept.employees} employees • Avg: {formatCurrency(dept.avgSalary)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-lg">{formatCurrency(dept.totalPayroll)}</div>
                  <div className="text-xs text-gray-600">Monthly payroll</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Employee Payroll Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Employee Payroll Details</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Payroll
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Process Payroll
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Gross Salary</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-xs text-gray-500">{employee.employeeId} • {employee.position}</div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell className="text-right">{formatCurrency(employee.grossSalary)}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(employee.taxDeduction + employee.providentFund + employee.otherDeductions)}
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(employee.netSalary)}</TableCell>
                  <TableCell>{getStatusBadge(employee.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openPayroll(employee)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payroll Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Payroll Details - {selectedPayroll?.name}</DialogTitle>
            <DialogDescription>
              <div className="mt-3 grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">Employee ID</div>
                    <div className="text-sm text-gray-600">{selectedPayroll?.employeeId}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Department</div>
                    <div className="text-sm text-gray-600">{selectedPayroll?.department}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Position</div>
                    <div className="text-sm text-gray-600">{selectedPayroll?.position}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Basic Salary</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {selectedPayroll && formatCurrency(selectedPayroll.basicSalary)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Allowances</div>
                    <div className="text-lg font-semibold text-green-600">
                      {selectedPayroll && formatCurrency(selectedPayroll.allowances)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Overtime Pay</div>
                    <div className="text-lg font-semibold text-purple-600">
                      {selectedPayroll && formatCurrency(selectedPayroll.overtimePay)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-medium">Tax Deduction</div>
                    <div className="text-sm text-red-600">
                      -{selectedPayroll && formatCurrency(selectedPayroll.taxDeduction)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedPayroll && calculateTaxRate(selectedPayroll.grossSalary, selectedPayroll.taxDeduction)}% rate
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">PF Deduction</div>
                    <div className="text-sm text-red-600">
                      -{selectedPayroll && formatCurrency(selectedPayroll.providentFund)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">ESI</div>
                    <div className="text-sm text-red-600">
                      -{selectedPayroll && formatCurrency(selectedPayroll.esi)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Other Deductions</div>
                    <div className="text-sm text-red-600">
                      -{selectedPayroll && formatCurrency(selectedPayroll.otherDeductions)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Gross Salary</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedPayroll && formatCurrency(selectedPayroll.grossSalary)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Net Salary</div>
                    <div className="text-2xl font-bold text-green-600">
                      {selectedPayroll && formatCurrency(selectedPayroll.netSalary)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Payroll Month</div>
                    <div className="text-sm text-gray-600">{selectedPayroll?.payrollMonth}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Processed Date</div>
                    <div className="text-sm text-gray-600">{selectedPayroll?.processedDate || "Not processed"}</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Payslip
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calculator className="h-4 w-4 mr-2" />
                    Recalculate
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
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