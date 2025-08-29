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
  Factory, 
  Users,
  Clock,
  Settings,
  Plus,
  Eye,
  Edit,
  Download,
  Power,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Wrench,
  Calendar,
  Activity
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from "recharts";

export function WorkCentersContent() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWorkCenter, setSelectedWorkCenter] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");

  const workCenterData = {
    overview: {
      totalWorkCenters: 24,
      activeWorkCenters: 22,
      maintenanceRequired: 2,
      averageUtilization: "87%",
      totalCapacity: "2,400 hrs/month",
      availableCapacity: "312 hrs/month"
    },
    workCenters: [
      {
        id: "WC-001",
        name: "Assembly Line 1",
        department: "Assembly",
        type: "Manufacturing Line",
        status: "Active",
        capacity: 168, // hours per week
        utilization: 92,
        currentLoad: 154,
        availableHours: 14,
        operator: "John Smith",
        shift: "2-Shift",
        location: "Building A, Floor 1",
        equipment: "Automated Assembly Station",
        description: "Primary assembly line for steel frame products"
      },
      {
        id: "WC-002", 
        name: "Machining Center",
        department: "Machining",
        type: "CNC Center",
        status: "Active",
        capacity: 168,
        utilization: 78,
        currentLoad: 131,
        availableHours: 37,
        operator: "Mike Johnson",
        shift: "3-Shift",
        location: "Building B, Floor 2",
        equipment: "5-Axis CNC Machine",
        description: "Precision machining for engine components"
      },
      {
        id: "WC-003",
        name: "Electronics Assembly",
        department: "Electronics",
        type: "Clean Room",
        status: "Active",
        capacity: 120, // 5-day operation
        utilization: 95,
        currentLoad: 114,
        availableHours: 6,
        operator: "Sarah Wilson",
        shift: "2-Shift",
        location: "Building C, Floor 3",
        equipment: "SMT Line + Manual Stations",
        description: "Electronic control unit assembly and testing"
      },
      {
        id: "WC-004",
        name: "Testing Station",
        department: "Quality",
        type: "Test Laboratory",
        status: "Maintenance",
        capacity: 80,
        utilization: 0,
        currentLoad: 0,
        availableHours: 0,
        operator: "David Kumar",
        shift: "1-Shift",
        location: "Building A, Floor 2",
        equipment: "Hydraulic Test Bench",
        description: "Hydraulic pump testing and quality validation"
      },
      {
        id: "WC-005",
        name: "Assembly Line 2",
        department: "Assembly",
        type: "Manufacturing Line",
        status: "Active",
        capacity: 168,
        utilization: 84,
        currentLoad: 141,
        availableHours: 27,
        operator: "Emily Davis",
        shift: "2-Shift",
        location: "Building A, Floor 1",
        equipment: "Manual Assembly Stations",
        description: "Secondary assembly line for gear box products"
      }
    ],
    utilizationTrends: [
      { week: "Week 1", utilization: 82, planned: 85, actual: 78 },
      { week: "Week 2", utilization: 87, planned: 88, actual: 85 },
      { week: "Week 3", utilization: 91, planned: 90, actual: 89 },
      { week: "Week 4", utilization: 89, planned: 92, actual: 87 }
    ],
    capacityByDepartment: [
      { department: "Assembly", capacity: 336, utilized: 295, available: 41 },
      { department: "Machining", capacity: 168, utilized: 131, available: 37 },
      { department: "Electronics", capacity: 120, utilized: 114, available: 6 },
      { department: "Quality", capacity: 80, utilized: 0, available: 80 },
      { department: "Packaging", capacity: 96, utilized: 72, available: 24 }
    ]
  };

  const openWorkCenter = (workCenter: any) => {
    setSelectedWorkCenter(workCenter);
    setDialogOpen(true);
  };

  const departments = useMemo(() => {
    return Array.from(new Set(workCenterData.workCenters.map(w => w.department)))
  }, []);

  const filteredWorkCenters = useMemo(() => {
    let data = workCenterData.workCenters;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      data = data.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.id.toLowerCase().includes(q) ||
        w.operator.toLowerCase().includes(q) ||
        w.department.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "ALL") {
      data = data.filter(w => w.status === statusFilter);
    }
    if (departmentFilter !== "ALL") {
      data = data.filter(w => w.department === departmentFilter);
    }
    return data;
  }, [workCenterData.workCenters, searchTerm, statusFilter, departmentFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case "Maintenance":
        return <Badge variant="secondary" className="bg-yellow-500">Maintenance</Badge>;
      case "Inactive":
        return <Badge variant="outline">Inactive</Badge>;
      case "Setup":
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Setup</Badge>;
      default:
        return <Badge variant="destructive">Unknown</Badge>;
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-red-600";
    if (utilization >= 80) return "text-yellow-600";
    if (utilization >= 60) return "text-green-600";
    return "text-gray-600";
  };

  const getUtilizationBadge = (utilization: number) => {
    if (utilization >= 95) return <Badge variant="destructive">Overloaded</Badge>;
    if (utilization >= 90) return <Badge variant="secondary" className="bg-yellow-500">High Load</Badge>;
    if (utilization >= 80) return <Badge variant="default" className="bg-green-500">Optimal</Badge>;
    if (utilization > 0) return <Badge variant="outline">Under-utilized</Badge>;
    return <Badge variant="outline" className="bg-gray-500">Offline</Badge>;
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2" 
            onClick={() => router.push('/ierp/production')}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Production Planning</span>
          </Button>
          <h1 className="text-3xl font-bold">Work Centers</h1>
        </div>
        <div className="flex items-center gap-3">
          <Input 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Search work centers" 
            className="w-[250px]" 
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Setup">Setup</SelectItem>
            </SelectContent>
          </Select>
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
            <CardTitle className="text-sm font-medium">Work Centers</CardTitle>
            <Factory className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workCenterData.overview.totalWorkCenters}</div>
            <p className="text-xs text-blue-600">{workCenterData.overview.activeWorkCenters} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workCenterData.overview.averageUtilization}</div>
            <p className="text-xs text-green-600">Across all centers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Capacity</CardTitle>
            <Clock className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workCenterData.overview.availableCapacity}</div>
            <p className="text-xs text-purple-600">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workCenterData.overview.maintenanceRequired}</div>
            <p className="text-xs text-orange-600">Centers need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Utilization Trends</CardTitle>
            <CardDescription>Weekly utilization vs planned capacity</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ 
              utilization: { label: "Utilization %" }, 
              planned: { label: "Planned %" },
              actual: { label: "Actual %" }
            }}>
              <LineChart data={workCenterData.utilizationTrends} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis width={40} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="utilization" stroke="#4B6587" strokeWidth={2} name="Current %" />
                <Line type="monotone" dataKey="planned" stroke="#6B8A7A" strokeWidth={2} name="Planned %" />
                <Line type="monotone" dataKey="actual" stroke="#A8DADC" strokeWidth={2} name="Actual %" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capacity by Department</CardTitle>
            <CardDescription>Total, utilized, and available capacity hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ 
              capacity: { label: "Total Capacity" }, 
              utilized: { label: "Utilized" },
              available: { label: "Available" }
            }}>
              <BarChart data={workCenterData.capacityByDepartment} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" tickLine={false} axisLine={false} />
                <YAxis width={40} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="capacity" fill="#4B6587" name="Total Capacity" />
                <Bar dataKey="utilized" fill="#6B8A7A" name="Utilized" />
                <Bar dataKey="available" fill="#A8DADC" name="Available" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Work Centers Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkCenters.map((workCenter) => (
          <Card key={workCenter.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openWorkCenter(workCenter)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-medium">{workCenter.name}</div>
                  <div className="text-xs text-gray-500">{workCenter.id} • {workCenter.department}</div>
                </div>
                {getStatusBadge(workCenter.status)}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Utilization:</span>
                  <div className={`font-medium ${getUtilizationColor(workCenter.utilization)}`}>
                    {workCenter.utilization}%
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Load:</span>
                  <span className="text-xs">{workCenter.currentLoad}h / {workCenter.capacity}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Available:</span>
                  <span className="font-medium text-green-600">{workCenter.availableHours}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Operator:</span>
                  <span className="text-xs">{workCenter.operator}</span>
                </div>
                <div className="pt-1">
                  {getUtilizationBadge(workCenter.utilization)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Work Centers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Work Centers Summary</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Work Center
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Work Center</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Available Hours</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workCenterData.workCenters.map((workCenter) => (
                <TableRow key={workCenter.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{workCenter.name}</div>
                      <div className="text-xs text-gray-500">{workCenter.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>{workCenter.department}</TableCell>
                  <TableCell>{workCenter.type}</TableCell>
                  <TableCell>{getStatusBadge(workCenter.status)}</TableCell>
                  <TableCell>
                    <div className={`font-medium ${getUtilizationColor(workCenter.utilization)}`}>
                      {workCenter.utilization}%
                    </div>
                  </TableCell>
                  <TableCell>{workCenter.availableHours}h</TableCell>
                  <TableCell>{workCenter.operator}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openWorkCenter(workCenter)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Wrench className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Work Center Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedWorkCenter?.name} ({selectedWorkCenter?.id})</DialogTitle>
            <DialogDescription>
              <div className="mt-3 grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">Department</div>
                    <div className="text-sm text-gray-600">{selectedWorkCenter?.department}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Type</div>
                    <div className="text-sm text-gray-600">{selectedWorkCenter?.type}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    {selectedWorkCenter && getStatusBadge(selectedWorkCenter.status)}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-medium">Capacity</div>
                    <div className="text-lg font-semibold text-blue-600">{selectedWorkCenter?.capacity}h</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Utilization</div>
                    <div className={`text-lg font-semibold ${selectedWorkCenter && getUtilizationColor(selectedWorkCenter.utilization)}`}>
                      {selectedWorkCenter?.utilization}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Current Load</div>
                    <div className="text-lg font-semibold text-yellow-600">{selectedWorkCenter?.currentLoad}h</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Available</div>
                    <div className="text-lg font-semibold text-green-600">{selectedWorkCenter?.availableHours}h</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Operator</div>
                    <div className="text-sm text-gray-600">{selectedWorkCenter?.operator}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Shift Pattern</div>
                    <div className="text-sm text-gray-600">{selectedWorkCenter?.shift}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Location</div>
                    <div className="text-sm text-gray-600">{selectedWorkCenter?.location}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Equipment</div>
                    <div className="text-sm text-gray-600">{selectedWorkCenter?.equipment}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Description</div>
                  <div className="text-sm text-gray-600">{selectedWorkCenter?.description}</div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Schedule
                  </Button>
                  <Button variant="outline" size="sm">
                    <Activity className="h-4 w-4 mr-2" />
                    Performance Metrics
                  </Button>
                  <Button variant="outline" size="sm">
                    <Wrench className="h-4 w-4 mr-2" />
                    Maintenance
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