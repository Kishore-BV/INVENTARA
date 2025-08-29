"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { 
  FileText, 
  Plus, 
  Search, 
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Home
} from "lucide-react"
import { toast } from "sonner"
import type { Supplier, SupplierContract } from "@/lib/inventory-types"

// Helper function to get initials
const getInitials = (name: string) => {
  return name.split(" ").map(part => part[0]).join("").toUpperCase().slice(0, 2)
}

// Mock data
const mockSuppliers: Supplier[] = [
  {
    id: "SUP-001", name: "TechCorp Solutions", displayName: "TechCorp Solutions Ltd.",
    isCompany: true, isVendor: true, isCustomer: false,
    address: { city: "Mumbai", state: "Maharashtra", country: "India" },
    currency: "INR", paymentTerms: "Net 30", isActive: true,
    supplierRank: 5, customerRank: 0,
    createdAt: new Date("2023-01-15"), updatedAt: new Date("2024-01-20")
  },
  {
    id: "SUP-002", name: "Global Industrial Supplies", displayName: "Global Industrial Supplies Pvt Ltd",
    isCompany: true, isVendor: true, isCustomer: false,
    address: { city: "Delhi", state: "NCR", country: "India" },
    currency: "INR", paymentTerms: "Net 45", isActive: true,
    supplierRank: 4, customerRank: 0,
    createdAt: new Date("2023-02-10"), updatedAt: new Date("2024-01-18")
  }
]

const mockContracts: SupplierContract[] = [
  {
    id: "CONT-001", supplierId: "SUP-001", supplier: mockSuppliers[0],
    contractNumber: "TC-2024-001", contractType: "purchase",
    startDate: new Date("2024-01-01"), endDate: new Date("2024-12-31"),
    value: 5000000, currency: "INR", status: "active",
    paymentTerms: "Net 30", deliveryTerms: "FOB Mumbai",
    documents: [], createdBy: "John Manager",
    createdAt: new Date("2023-12-15"), updatedAt: new Date("2024-01-01")
  },
  {
    id: "CONT-002", supplierId: "SUP-002", supplier: mockSuppliers[1],
    contractNumber: "GIS-2024-002", contractType: "service",
    startDate: new Date("2024-02-01"), endDate: new Date("2024-07-31"),
    value: 2500000, currency: "INR", status: "active",
    paymentTerms: "Net 45", deliveryTerms: "Ex-Works Delhi",
    documents: [], createdBy: "Jane Smith",
    createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-02-01")
  },
  {
    id: "CONT-003", supplierId: "SUP-001", supplier: mockSuppliers[0],
    contractNumber: "TC-2023-003", contractType: "maintenance",
    startDate: new Date("2023-06-01"), endDate: new Date("2024-05-31"),
    value: 1200000, currency: "INR", status: "expired",
    paymentTerms: "Net 30", deliveryTerms: "On-site Mumbai",
    documents: [], createdBy: "John Manager",
    createdAt: new Date("2023-05-15"), updatedAt: new Date("2024-05-31")
  }
]

export function SupplierContractsContent() {
  const router = useRouter()
  const [contracts, setContracts] = useState<SupplierContract[]>(mockContracts)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState<SupplierContract | null>(null)
  const [loading, setLoading] = useState(false)

  const [newContract, setNewContract] = useState<Partial<SupplierContract>>({
    contractNumber: "",
    contractType: "purchase",
    supplierId: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    value: 0,
    currency: "INR",
    status: "draft",
    paymentTerms: "Net 30",
    deliveryTerms: ""
  })

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default"
      case "expired": return "destructive"
      case "draft": return "secondary"
      case "terminated": return "destructive"
      default: return "secondary"
    }
  }

  const getDaysUntilExpiry = (endDate: Date) => {
    const today = new Date()
    const timeDiff = endDate.getTime() - today.getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  }

  const exportContracts = () => {
    toast.success("Contracts exported successfully")
  }

  const handleCreateContract = () => {
    setLoading(true)
    setTimeout(() => {
      const supplier = mockSuppliers.find(s => s.id === newContract.supplierId)
      if (supplier) {
        const contract: SupplierContract = {
          ...newContract as SupplierContract,
          id: `CONT-${String(contracts.length + 1).padStart(3, '0')}`,
          supplier,
          documents: [],
          createdBy: "Current User",
          createdAt: new Date(),
          updatedAt: new Date()
        }
        setContracts(prev => [...prev, contract])
        setIsCreateDialogOpen(false)
        toast.success("Contract created successfully")
      }
      setLoading(false)
    }, 1000)
  }

  const activeContracts = contracts.filter(c => c.status === "active").length
  const expiringContracts = contracts.filter(c => {
    const daysUntilExpiry = getDaysUntilExpiry(c.endDate)
    return c.status === "active" && daysUntilExpiry <= 30
  }).length
  const totalValue = contracts.filter(c => c.status === "active").reduce((acc, c) => acc + c.value, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Supplier Contracts</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage supplier contracts, agreements, and renewal schedules
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard')}
            className="text-[#4B6587] border-[#4B6587] hover:bg-[#4B6587] hover:text-white"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="outline" onClick={exportContracts}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#4B6587] hover:bg-[#3A5068]">
                <Plus className="mr-2 h-4 w-4" />
                New Contract
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-[#4B6587]" />
              <span className="text-sm font-medium">Active Contracts</span>
            </div>
            <p className="text-2xl font-bold mt-2">{activeContracts}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-[#F4A261]" />
              <span className="text-sm font-medium">Expiring Soon</span>
            </div>
            <p className="text-2xl font-bold mt-2">{expiringContracts}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-[#6B8A7A]" />
              <span className="text-sm font-medium">Total Value</span>
            </div>
            <p className="text-2xl font-bold mt-2">₹{(totalValue / 10000000).toFixed(1)}Cr</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-[#E76F51]" />
              <span className="text-sm font-medium">Total Contracts</span>
            </div>
            <p className="text-2xl font-bold mt-2">{contracts.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contracts by number or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contracts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contracts</CardTitle>
          <CardDescription>
            Complete list of supplier contracts and agreements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => {
                const daysUntilExpiry = getDaysUntilExpiry(contract.endDate)
                return (
                  <TableRow key={contract.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{contract.contractNumber}</p>
                        <p className="text-sm text-muted-foreground">{contract.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(contract.supplier.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{contract.supplier.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {contract.contractType.charAt(0).toUpperCase() + contract.contractType.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{(contract.value / 100000).toFixed(1)}L</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{contract.startDate.toLocaleDateString()}</p>
                        <p className="text-muted-foreground">to {contract.endDate.toLocaleDateString()}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(contract.status)}>
                        {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {daysUntilExpiry <= 30 && contract.status === "active" && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className={daysUntilExpiry <= 30 && contract.status === "active" ? "text-yellow-600" : ""}>
                          {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : "Expired"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedContract(contract)
                              setIsViewDialogOpen(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Contract Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Contract</DialogTitle>
            <DialogDescription>
              Create a new supplier contract with terms and conditions
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractNumber">Contract Number *</Label>
                <Input
                  id="contractNumber"
                  value={newContract.contractNumber}
                  onChange={(e) => setNewContract(prev => ({ ...prev, contractNumber: e.target.value }))}
                  placeholder="Enter contract number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractType">Contract Type</Label>
                <Select 
                  value={newContract.contractType} 
                  onValueChange={(value) => setNewContract(prev => ({ ...prev, contractType: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="framework">Framework</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Select 
                value={newContract.supplierId} 
                onValueChange={(value) => setNewContract(prev => ({ ...prev, supplierId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {mockSuppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Contract Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={newContract.value}
                  onChange={(e) => setNewContract(prev => ({ ...prev, value: Number(e.target.value) }))}
                  placeholder="Enter contract value"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={newContract.currency} 
                  onValueChange={(value) => setNewContract(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Input
                  id="paymentTerms"
                  value={newContract.paymentTerms}
                  onChange={(e) => setNewContract(prev => ({ ...prev, paymentTerms: e.target.value }))}
                  placeholder="e.g., Net 30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryTerms">Delivery Terms</Label>
                <Input
                  id="deliveryTerms"
                  value={newContract.deliveryTerms}
                  onChange={(e) => setNewContract(prev => ({ ...prev, deliveryTerms: e.target.value }))}
                  placeholder="e.g., FOB Mumbai"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateContract}
              disabled={loading || !newContract.contractNumber || !newContract.supplierId}
              className="bg-[#4B6587] hover:bg-[#3A5068]"
            >
              {loading ? "Creating..." : "Create Contract"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Contract Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedContract?.contractNumber}
            </DialogDescription>
          </DialogHeader>
          
          {selectedContract && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Contract Number</Label>
                  <p className="text-sm">{selectedContract.contractNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <p className="text-sm">{selectedContract.contractType}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Supplier</Label>
                  <p className="text-sm">{selectedContract.supplier.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Value</Label>
                  <p className="text-sm">{selectedContract.currency} {selectedContract.value.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Start Date</Label>
                  <p className="text-sm">{selectedContract.startDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">End Date</Label>
                  <p className="text-sm">{selectedContract.endDate.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Payment Terms</Label>
                  <p className="text-sm">{selectedContract.paymentTerms}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Delivery Terms</Label>
                  <p className="text-sm">{selectedContract.deliveryTerms}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <div className="mt-1">
                  <Badge variant={getStatusColor(selectedContract.status)}>
                    {selectedContract.status.charAt(0).toUpperCase() + selectedContract.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}