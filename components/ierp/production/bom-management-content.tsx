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
  Package, 
  Settings,
  List,
  Plus,
  Eye,
  Edit,
  Download,
  Copy,
  GitBranch,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Archive
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function BOMManagementContent() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBOM, setSelectedBOM] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const bomData = {
    overview: {
      totalBOMs: 156,
      activeBOMs: 134,
      pendingApproval: 8,
      draftBOMs: 14,
      averageComponents: 12.3,
      latestVersion: "2024.1.25"
    },
    boms: [
      {
        id: "BOM-001",
        productCode: "SFA-2024-STD",
        productName: "Steel Frame Assembly",
        version: "V2.1",
        status: "Active",
        type: "Production",
        effectiveDate: "2024-01-15",
        lastModified: "2024-01-20",
        components: 15,
        totalCost: 2450.00,
        createdBy: "John Smith",
        approvedBy: "Sarah Wilson",
        description: "Complete BOM for heavy-duty steel frame assembly"
      },
      {
        id: "BOM-002",
        productCode: "ECS-2024-ADV",
        productName: "Engine Component Set",
        version: "V1.5",
        status: "Pending",
        type: "Engineering",
        effectiveDate: "2024-02-01",
        lastModified: "2024-01-22",
        components: 8,
        totalCost: 1850.00,
        createdBy: "Mike Johnson",
        approvedBy: null,
        description: "Engineering BOM for precision engine components"
      },
      {
        id: "BOM-003",
        productCode: "ECU-2024-PRO",
        productName: "Electronic Control Unit",
        version: "V3.0",
        status: "Active",
        type: "Production",
        effectiveDate: "2024-01-08",
        lastModified: "2024-01-18",
        components: 22,
        totalCost: 890.00,
        createdBy: "David Kumar",
        approvedBy: "Emily Davis",
        description: "Production BOM for advanced electronic control units"
      },
      {
        id: "BOM-004",
        productCode: "HP-2024-HD",
        productName: "Hydraulic Pump",
        version: "V2.3",
        status: "Draft",
        type: "Development",
        effectiveDate: null,
        lastModified: "2024-01-23",
        components: 18,
        totalCost: 3200.00,
        createdBy: "Lisa Chen",
        approvedBy: null,
        description: "Development BOM for high-pressure hydraulic pump"
      },
      {
        id: "BOM-005",
        productCode: "GBA-2024-STD",
        productName: "Gear Box Assembly",
        version: "V1.8",
        status: "Active",
        type: "Production",
        effectiveDate: "2024-01-12",
        lastModified: "2024-01-19",
        components: 25,
        totalCost: 1650.00,
        createdBy: "Robert Taylor",
        approvedBy: "John Smith",
        description: "Multi-speed gear box assembly BOM"
      }
    ],
    componentDistribution: [
      { category: "Raw Materials", count: 45, color: "#4B6587" },
      { category: "Sub-assemblies", count: 28, color: "#6B8A7A" },
      { category: "Electronics", count: 18, color: "#A8DADC" },
      { category: "Fasteners", count: 35, color: "#F1FAEE" },
      { category: "Packaging", count: 12, color: "#E63946" }
    ],
    costAnalysis: [
      { month: "Jul", materials: 125000, labor: 45000, overhead: 28000 },
      { month: "Aug", materials: 132000, labor: 48000, overhead: 29500 },
      { month: "Sep", materials: 128000, labor: 46500, overhead: 28800 },
      { month: "Oct", materials: 135000, labor: 49200, overhead: 30100 },
      { month: "Nov", materials: 142000, labor: 51000, overhead: 31500 },
      { month: "Dec", materials: 138000, labor: 49800, overhead: 30800 }
    ]
  };

  const openBOM = (bom: any) => {
    setSelectedBOM(bom);
    setDialogOpen(true);
  };

  const filteredBOMs = useMemo(() => {
    let data = bomData.boms;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      data = data.filter(b =>
        b.productName.toLowerCase().includes(q) ||
        b.productCode.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "ALL") {
      data = data.filter(b => b.status === statusFilter);
    }
    if (typeFilter !== "ALL") {
      data = data.filter(b => b.type === typeFilter);
    }
    return data;
  }, [bomData.boms, searchTerm, statusFilter, typeFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case "Pending":
        return <Badge variant="secondary">Pending Approval</Badge>;
      case "Draft":
        return <Badge variant="outline">Draft</Badge>;
      case "Archived":
        return <Badge variant="secondary" className="bg-gray-500">Archived</Badge>;
      default:
        return <Badge variant="destructive">Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Production":
        return <Badge variant="default" className="bg-blue-500">Production</Badge>;
      case "Engineering":
        return <Badge variant="outline" className="border-purple-500 text-purple-600">Engineering</Badge>;
      case "Development":
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Development</Badge>;
      default:
        return <Badge variant="outline">Standard</Badge>;
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
            onClick={() => router.push('/ierp/production')}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Production Planning</span>
          </Button>
          <h1 className="text-3xl font-bold">Bill of Materials (BOM)</h1>
        </div>
        <div className="flex items-center gap-3">
          <Input 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Search BOMs, products" 
            className="w-[250px]" 
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="Production">Production</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Development">Development</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total BOMs</CardTitle>
            <List className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bomData.overview.totalBOMs}</div>
            <p className="text-xs text-blue-600">{bomData.overview.activeBOMs} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bomData.overview.pendingApproval}</div>
            <p className="text-xs text-yellow-600">{bomData.overview.draftBOMs} drafts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Components</CardTitle>
            <Package className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bomData.overview.averageComponents}</div>
            <p className="text-xs text-green-600">Per BOM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Latest Version</CardTitle>
            <GitBranch className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bomData.overview.latestVersion}</div>
            <p className="text-xs text-purple-600">System version</p>
          </CardContent>
        </Card>
      </div>

      {/* Component Distribution and Cost Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Component Distribution</CardTitle>
            <CardDescription>Breakdown of component categories across all BOMs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bomData.componentDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ category, count }) => `${category}: ${count}`}
                  >
                    {bomData.componentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>BOM Cost Analysis</CardTitle>
            <CardDescription>Monthly cost breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ 
              materials: { label: "Materials" }, 
              labor: { label: "Labor" },
              overhead: { label: "Overhead" }
            }}>
              <BarChart data={bomData.costAnalysis} margin={{ left: 12, right: 12, top: 6, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis width={60} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="materials" stackId="a" fill="#4B6587" name="Materials" />
                <Bar dataKey="labor" stackId="a" fill="#6B8A7A" name="Labor" />
                <Bar dataKey="overhead" stackId="a" fill="#A8DADC" name="Overhead" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* BOM Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bill of Materials</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New BOM
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>BOM ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Components</TableHead>
                <TableHead className="text-right">Total Cost</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBOMs.map((bom) => (
                <TableRow key={bom.id}>
                  <TableCell className="font-medium">{bom.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{bom.productName}</div>
                      <div className="text-xs text-gray-500">{bom.productCode}</div>
                    </div>
                  </TableCell>
                  <TableCell>{bom.version}</TableCell>
                  <TableCell>{getTypeBadge(bom.type)}</TableCell>
                  <TableCell>{getStatusBadge(bom.status)}</TableCell>
                  <TableCell>{bom.components}</TableCell>
                  <TableCell className="text-right">{formatCurrency(bom.totalCost)}</TableCell>
                  <TableCell>{bom.lastModified}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openBOM(bom)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* BOM Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedBOM?.productName} ({selectedBOM?.id})</DialogTitle>
            <DialogDescription>
              <div className="mt-3 grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">Product Code</div>
                    <div className="text-sm text-gray-600">{selectedBOM?.productCode}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Version</div>
                    <div className="text-sm text-gray-600">{selectedBOM?.version}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Type</div>
                    {selectedBOM && getTypeBadge(selectedBOM.type)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    {selectedBOM && getStatusBadge(selectedBOM.status)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">Components Count</div>
                    <div className="text-lg font-semibold text-blue-600">{selectedBOM?.components}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Total Cost</div>
                    <div className="text-lg font-semibold text-green-600">
                      {selectedBOM && formatCurrency(selectedBOM.totalCost)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Effective Date</div>
                    <div className="text-sm text-gray-600">{selectedBOM?.effectiveDate || "Not Set"}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Created By</div>
                    <div className="text-sm text-gray-600">{selectedBOM?.createdBy}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Approved By</div>
                    <div className="text-sm text-gray-600">{selectedBOM?.approvedBy || "Pending"}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Description</div>
                  <div className="text-sm text-gray-600">{selectedBOM?.description}</div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit BOM
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Clone BOM
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export BOM
                  </Button>
                  <Button variant="outline" size="sm">
                    <GitBranch className="h-4 w-4 mr-2" />
                    Version History
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