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
  Users2, 
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building2,
  Star,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Download,
  Award,
  Clock
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export function EmployeeRecordsContent() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const employeeData = {
    overview: {
      totalEmployees: 247,
      activeEmployees: 238,
      maleEmployees: 142,
      femaleEmployees: 105
    },
    employees: [
      {
        id: "EMP-001",
        employeeId: "INV2024001",
        name: "Rajesh Kumar",
        email: "rajesh.kumar@inventara.com",
        phone: "+91 98765 43210",
        position: "Senior Software Engineer",
        department: "Technology",
        location: "Bangalore",
        manager: "Amit Sharma",
        joinDate: "2021-03-15",
        status: "Active",
        salary: 1200000,
        performanceRating: 4.5,
        attendance: 98
      },
      {
        id: "EMP-002",
        employeeId: "INV2024002",
        name: "Priya Sharma",
        email: "priya.sharma@inventara.com",
        phone: "+91 98123 45678",
        position: "Marketing Manager",
        department: "Marketing",
        location: "Mumbai",
        manager: "Vikram Singh",
        joinDate: "2022-01-10",
        status: "Active",
        salary: 950000,
        performanceRating: 4.2,
        attendance: 95
      },
      {
        id: "EMP-003",
        employeeId: "INV2024003",
        name: "Amit Patel",
        email: "amit.patel@inventara.com",
        phone: "+91 98456 78901",
        position: "Financial Analyst",
        department: "Finance",
        location: "Pune",
        manager: "Neha Gupta",
        joinDate: "2023-06-20",
        status: "Active",
        salary: 750000,
        performanceRating: 4.0,
        attendance: 97
      }
    ],
    chart: [
      { department: "Technology", count: 78 },
      { department: "Marketing", count: 32 },
      { department: "Finance", count: 24 },
      { department: "HR", count: 18 },
      { department: "Production", count: 65 }
    ]
  };

  const openEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const departments = useMemo(() => {
    return Array.from(new Set(employeeData.employees.map(e => e.department)))
  }, []);

  const filteredEmployees = useMemo(() => {
    let data = employeeData.employees;
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
    return data;
  }, [employeeData.employees, searchTerm, departmentFilter, statusFilter]);

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
      case "Active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case "On Leave":
        return <Badge variant="secondary">On Leave</Badge>;
      default:
        return <Badge variant="outline">Inactive</Badge>;
    }
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-blue-600";
    return "text-yellow-600";
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
          <h1 className="text-3xl font-bold">Employee Records</h1>
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
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users2 className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeData.overview.totalEmployees}</div>
            <p className="text-xs text-blue-600">{employeeData.overview.activeEmployees} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gender Distribution</CardTitle>
            <User className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeData.overview.maleEmployees}M / {employeeData.overview.femaleEmployees}F</div>
            <p className="text-xs text-green-600">Male / Female ratio</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Distribution by Department</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ count: { label: "Employees" } }}>
            <BarChart data={employeeData.chart} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" tickLine={false} axisLine={false} />
              <YAxis width={40} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#4B6587" name="Employees" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Employee Records</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.employeeId}</TableCell>
                  <TableCell>
                    <div>
                      <div>{employee.name}</div>
                      <div className="text-xs text-gray-500">{employee.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <div className={`font-medium ${getPerformanceColor(employee.performanceRating)}`}>
                      {employee.performanceRating}/5.0
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(employee.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEmployee(employee)}>
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

      {/* Employee Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedEmployee?.name}</DialogTitle>
            <DialogDescription>
              <div className="mt-3 grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-gray-600">{selectedEmployee?.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Phone</div>
                    <div className="text-sm text-gray-600">{selectedEmployee?.phone}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Position</div>
                    <div className="text-sm text-gray-600">{selectedEmployee?.position}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Department</div>
                    <div className="text-sm text-gray-600">{selectedEmployee?.department}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">Salary</div>
                    <div className="text-lg font-semibold text-green-600">
                      {selectedEmployee && formatCurrency(selectedEmployee.salary)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Performance</div>
                    <div className={`text-lg font-semibold ${selectedEmployee && getPerformanceColor(selectedEmployee.performanceRating)}`}>
                      {selectedEmployee?.performanceRating}/5.0
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Attendance</div>
                    <div className="text-lg font-semibold text-green-600">
                      {selectedEmployee?.attendance}%
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Award className="h-4 w-4 mr-2" />
                    Performance Review
                  </Button>
                  <Button variant="outline" size="sm">
                    <Clock className="h-4 w-4 mr-2" />
                    View Attendance
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