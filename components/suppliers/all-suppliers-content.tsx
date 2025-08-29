"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Users2, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Star,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Home
} from "lucide-react"
import { toast } from "sonner"
import type { Supplier, SupplierFilter } from "@/lib/inventory-types"

// Helper function to get initials
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Mock data for suppliers
const mockSuppliers: Supplier[] = [
  {
    id: "SUP-001",
    name: "TechCorp Solutions",
    displayName: "TechCorp Solutions Ltd.",
    email: "orders@techcorp.com",
    phone: "+91-98765-43210",
    website: "https://techcorp.com",
    isCompany: true,
    isVendor: true,
    isCustomer: false,
    address: {
      street: "123 Tech Park",
      street2: "Building A, Floor 5",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400001",
      country: "India"
    },
    currency: "INR",
    paymentTerms: "Net 30",
    creditLimit: 500000,
    isActive: true,
    supplierRank: 5,
    customerRank: 0,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: "SUP-002",
    name: "Global Industrial Supplies",
    displayName: "Global Industrial Supplies Pvt Ltd",
    email: "sales@globalind.com",
    phone: "+91-98765-43211",
    website: "https://globalindustrial.com",
    isCompany: true,
    isVendor: true,
    isCustomer: false,
    address: {
      street: "456 Industrial Area",
      city: "Delhi",
      state: "NCR",
      zip: "110001",
      country: "India"
    },
    currency: "INR",
    paymentTerms: "Net 45",
    creditLimit: 750000,
    isActive: true,
    supplierRank: 4,
    customerRank: 0,
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2024-01-18")
  },
  {
    id: "SUP-003",
    name: "Quality Materials Ltd",
    displayName: "Quality Materials Limited",
    email: "info@qualitymaterials.com",
    phone: "+91-98765-43212",
    website: "https://qualitymaterials.com",
    isCompany: true,
    isVendor: true,
    isCustomer: false,
    address: {
      street: "789 Materials Road",
      city: "Bangalore",
      state: "Karnataka",
      zip: "560001",
      country: "India"
    },
    currency: "INR",
    paymentTerms: "Net 15",
    creditLimit: 300000,
    isActive: true,
    supplierRank: 5,
    customerRank: 0,
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "SUP-004",
    name: "Steel Corp Industries",
    displayName: "Steel Corp Industries Inc.",
    email: "procurement@steelcorp.com",
    phone: "+91-98765-43213",
    website: "https://steelcorp.com",
    isCompany: true,
    isVendor: true,
    isCustomer: false,
    address: {
      street: "321 Steel Avenue",
      city: "Chennai",
      state: "Tamil Nadu",
      zip: "600001",
      country: "India"
    },
    currency: "INR",
    paymentTerms: "Net 60",
    creditLimit: 1000000,
    isActive: true,
    supplierRank: 5,
    customerRank: 0,
    createdAt: new Date("2023-04-12"),
    updatedAt: new Date("2024-01-22")
  },
  {
    id: "SUP-005",
    name: "Electronics Wholesale",
    displayName: "Electronics Wholesale Distributors",
    email: "orders@electronics-wholesale.com",
    phone: "+91-98765-43214",
    website: "https://electronics-wholesale.com",
    isCompany: true,
    isVendor: true,
    isCustomer: false,
    address: {
      street: "654 Electronics Plaza",
      city: "Pune",
      state: "Maharashtra",
      zip: "411001",
      country: "India"
    },
    currency: "INR",
    paymentTerms: "Net 30",
    creditLimit: 400000,
    isActive: false,
    supplierRank: 3,
    customerRank: 0,
    createdAt: new Date("2023-05-20"),
    updatedAt: new Date("2024-01-10")
  }
]

export function AllSuppliersContent() {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>(mockSuppliers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<SupplierFilter>({})
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [loading, setLoading] = useState(false)

  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: "",
    displayName: "",
    email: "",
    phone: "",
    website: "",
    isCompany: true,
    isVendor: true,
    isCustomer: false,
    address: {
      street: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      country: "India"
    },
    currency: "INR",
    paymentTerms: "Net 30",
    creditLimit: 0,
    isActive: true,
    supplierRank: 1,
    customerRank: 0
  })

  // Filter suppliers based on search term and filters
  useEffect(() => {
    let filtered = suppliers

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.phone?.includes(searchTerm) ||
        supplier.address.city?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (filter.status) {
      filtered = filtered.filter(supplier => 
        filter.status === 'active' ? supplier.isActive : !supplier.isActive
      )
    }

    // Rating filter
    if (filter.ratingMin !== undefined) {
      filtered = filtered.filter(supplier => supplier.supplierRank >= filter.ratingMin!)
    }

    // Country filter
    if (filter.country && filter.country !== "all") {
      filtered = filtered.filter(supplier => 
        supplier.address.country?.toLowerCase() === filter.country?.toLowerCase()
      )
    }

    setFilteredSuppliers(filtered)
  }, [suppliers, searchTerm, filter])

  const handleCreateSupplier = () => {
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const supplier: Supplier = {
        ...newSupplier as Supplier,
        id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setSuppliers(prev => [...prev, supplier])
      setIsCreateDialogOpen(false)
      resetForm()
      toast.success("Supplier created successfully")
      setLoading(false)
    }, 1000)
  }

  const handleEditSupplier = () => {
    if (!selectedSupplier) return
    
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setSuppliers(prev => prev.map(s => 
        s.id === selectedSupplier.id 
          ? { ...selectedSupplier, updatedAt: new Date() }
          : s
      ))
      setIsEditDialogOpen(false)
      setSelectedSupplier(null)
      toast.success("Supplier updated successfully")
      setLoading(false)
    }, 1000)
  }

  const handleDeleteSupplier = (supplierId: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      setSuppliers(prev => prev.filter(s => s.id !== supplierId))
      toast.success("Supplier deleted successfully")
    }
  }

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedSuppliers.length === 0) {
      toast.error("Please select suppliers first")
      return
    }

    switch (action) {
      case 'activate':
        setSuppliers(prev => prev.map(s => 
          selectedSuppliers.includes(s.id) ? { ...s, isActive: true } : s
        ))
        toast.success(`${selectedSuppliers.length} suppliers activated`)
        break
      case 'deactivate':
        setSuppliers(prev => prev.map(s => 
          selectedSuppliers.includes(s.id) ? { ...s, isActive: false } : s
        ))
        toast.success(`${selectedSuppliers.length} suppliers deactivated`)
        break
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedSuppliers.length} suppliers?`)) {
          setSuppliers(prev => prev.filter(s => !selectedSuppliers.includes(s.id)))
          toast.success(`${selectedSuppliers.length} suppliers deleted`)
        }
        break
    }
    setSelectedSuppliers([])
  }

  const resetForm = () => {
    setNewSupplier({
      name: "",
      displayName: "",
      email: "",
      phone: "",
      website: "",
      isCompany: true,
      isVendor: true,
      isCustomer: false,
      address: {
        street: "",
        street2: "",
        city: "",
        state: "",
        zip: "",
        country: "India"
      },
      currency: "INR",
      paymentTerms: "Net 30",
      creditLimit: 0,
      isActive: true,
      supplierRank: 1,
      customerRank: 0
    })
  }

  const exportSuppliers = () => {
    // Simulate CSV export
    const csvContent = [
      ["ID", "Name", "Email", "Phone", "City", "Status", "Rating"],
      ...filteredSuppliers.map(s => [
        s.id,
        s.name,
        s.email || "",
        s.phone || "",
        s.address.city || "",
        s.isActive ? "Active" : "Inactive",
        s.supplierRank.toString()
      ])
    ].map(row => row.join(",")).join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "suppliers.csv"
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success("Suppliers exported successfully")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Suppliers</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your complete supplier directory and relationships
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
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/suppliers/directory')}
            className="text-[#6B8A7A] border-[#6B8A7A] hover:bg-[#6B8A7A] hover:text-white"
          >
            <Building2 className="mr-2 h-4 w-4" />
            Directory View
          </Button>
          <Button variant="outline" onClick={exportSuppliers}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#4B6587] hover:bg-[#3A5068]">
                <Plus className="mr-2 h-4 w-4" />
                Add Supplier
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
              <Users2 className="h-5 w-5 text-[#4B6587]" />
              <span className="text-sm font-medium">Total Suppliers</span>
            </div>
            <p className="text-2xl font-bold mt-2">{suppliers.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-[#6B8A7A]" />
              <span className="text-sm font-medium">Active Suppliers</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {suppliers.filter(s => s.isActive).length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-[#F4A261]" />
              <span className="text-sm font-medium">Avg Rating</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {(suppliers.reduce((acc, s) => acc + s.supplierRank, 0) / suppliers.length).toFixed(1)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-[#E76F51]" />
              <span className="text-sm font-medium">Inactive</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {suppliers.filter(s => !s.isActive).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers by name, email, phone, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select 
                value={filter.status || ""} 
                onValueChange={(value) => setFilter(prev => ({ 
                  ...prev, 
                  status: value as 'active' | 'inactive' | undefined 
                }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={filter.country || "all"} 
                onValueChange={(value) => setFilter(prev => ({ 
                  ...prev, 
                  country: value === "all" ? undefined : value 
                }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setFilter({})
                  setSearchTerm("")
                }}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedSuppliers.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {selectedSuppliers.length} supplier(s) selected
              </span>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('activate')}
                >
                  Activate
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('deactivate')}
                >
                  Deactivate
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleBulkAction('delete')}
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Suppliers Directory</CardTitle>
          <CardDescription>
            Complete list of suppliers with contact information and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedSuppliers.length === filteredSuppliers.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSuppliers(filteredSuppliers.map(s => s.id))
                      } else {
                        setSelectedSuppliers([])
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Payment Terms</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedSuppliers.includes(supplier.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSuppliers(prev => [...prev, supplier.id])
                        } else {
                          setSelectedSuppliers(prev => prev.filter(id => id !== supplier.id))
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {getInitials(supplier.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{supplier.name}</p>
                        <p className="text-sm text-muted-foreground">{supplier.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {supplier.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {supplier.email}
                        </div>
                      )}
                      {supplier.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {supplier.phone}
                        </div>
                      )}
                      {supplier.website && (
                        <div className="flex items-center text-sm">
                          <Globe className="h-3 w-3 mr-1" />
                          <a href={supplier.website} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline">
                            Website
                          </a>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>
                        {supplier.address.city}, {supplier.address.state}
                        <br />
                        {supplier.address.country}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{supplier.paymentTerms}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{supplier.supplierRank}/5</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={supplier.isActive ? "default" : "secondary"}>
                      {supplier.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedSupplier(supplier)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedSupplier(supplier)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteSupplier(supplier.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredSuppliers.length === 0 && (
            <div className="text-center py-8">
              <Users2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">
                No suppliers found
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || Object.keys(filter).length > 0 
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first supplier"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Supplier Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>
              Create a new supplier record with contact and business information
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={newSupplier.displayName}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="Enter display name"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={newSupplier.website}
                onChange={(e) => setNewSupplier(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>

            {/* Address */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Address</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={newSupplier.address?.street}
                    onChange={(e) => setNewSupplier(prev => ({
                      ...prev,
                      address: { ...prev.address!, street: e.target.value }
                    }))}
                    placeholder="Enter street address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street2">Street Address 2</Label>
                  <Input
                    id="street2"
                    value={newSupplier.address?.street2}
                    onChange={(e) => setNewSupplier(prev => ({
                      ...prev,
                      address: { ...prev.address!, street2: e.target.value }
                    }))}
                    placeholder="Apartment, suite, etc."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newSupplier.address?.city}
                    onChange={(e) => setNewSupplier(prev => ({
                      ...prev,
                      address: { ...prev.address!, city: e.target.value }
                    }))}
                    placeholder="Enter city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={newSupplier.address?.state}
                    onChange={(e) => setNewSupplier(prev => ({
                      ...prev,
                      address: { ...prev.address!, state: e.target.value }
                    }))}
                    placeholder="Enter state"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP/Postal Code</Label>
                  <Input
                    id="zip"
                    value={newSupplier.address?.zip}
                    onChange={(e) => setNewSupplier(prev => ({
                      ...prev,
                      address: { ...prev.address!, zip: e.target.value }
                    }))}
                    placeholder="Enter ZIP code"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select 
                  value={newSupplier.address?.country} 
                  onValueChange={(value) => setNewSupplier(prev => ({
                    ...prev,
                    address: { ...prev.address!, country: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Business Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={newSupplier.currency} 
                  onValueChange={(value) => setNewSupplier(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select 
                  value={newSupplier.paymentTerms} 
                  onValueChange={(value) => setNewSupplier(prev => ({ ...prev, paymentTerms: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 15">Net 15</SelectItem>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 45">Net 45</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                    <SelectItem value="COD">Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditLimit">Credit Limit</Label>
              <Input
                id="creditLimit"
                type="number"
                value={newSupplier.creditLimit}
                onChange={(e) => setNewSupplier(prev => ({ ...prev, creditLimit: Number(e.target.value) }))}
                placeholder="Enter credit limit"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isVendor"
                  checked={newSupplier.isVendor}
                  onCheckedChange={(checked) => setNewSupplier(prev => ({ ...prev, isVendor: Boolean(checked) }))}
                />
                <Label htmlFor="isVendor">Is Vendor (Can purchase from)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isCustomer"
                  checked={newSupplier.isCustomer}
                  onCheckedChange={(checked) => setNewSupplier(prev => ({ ...prev, isCustomer: Boolean(checked) }))}
                />
                <Label htmlFor="isCustomer">Is Customer (Can sell to)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={newSupplier.isActive}
                  onCheckedChange={(checked) => setNewSupplier(prev => ({ ...prev, isActive: Boolean(checked) }))}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreateDialogOpen(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSupplier}
              disabled={loading || !newSupplier.name}
              className="bg-[#4B6587] hover:bg-[#3A5068]"
            >
              {loading ? "Creating..." : "Create Supplier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>
              Update supplier information and business details
            </DialogDescription>
          </DialogHeader>
          
          {selectedSupplier && (
            <div className="grid gap-4 py-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editName">Company Name *</Label>
                  <Input
                    id="editName"
                    value={selectedSupplier.name}
                    onChange={(e) => setSelectedSupplier(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDisplayName">Display Name</Label>
                  <Input
                    id="editDisplayName"
                    value={selectedSupplier.displayName}
                    onChange={(e) => setSelectedSupplier(prev => prev ? ({ ...prev, displayName: e.target.value }) : null)}
                    placeholder="Enter display name"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={selectedSupplier.email || ""}
                    onChange={(e) => setSelectedSupplier(prev => prev ? ({ ...prev, email: e.target.value }) : null)}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPhone">Phone</Label>
                  <Input
                    id="editPhone"
                    value={selectedSupplier.phone || ""}
                    onChange={(e) => setSelectedSupplier(prev => prev ? ({ ...prev, phone: e.target.value }) : null)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editWebsite">Website</Label>
                <Input
                  id="editWebsite"
                  value={selectedSupplier.website || ""}
                  onChange={(e) => setSelectedSupplier(prev => prev ? ({ ...prev, website: e.target.value }) : null)}
                  placeholder="https://example.com"
                />
              </div>

              {/* Payment Terms */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editPaymentTerms">Payment Terms</Label>
                  <Select 
                    value={selectedSupplier.paymentTerms || ""} 
                    onValueChange={(value) => setSelectedSupplier(prev => prev ? ({ ...prev, paymentTerms: value }) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 45">Net 45</SelectItem>
                      <SelectItem value="Net 60">Net 60</SelectItem>
                      <SelectItem value="COD">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCreditLimit">Credit Limit</Label>
                  <Input
                    id="editCreditLimit"
                    type="number"
                    value={selectedSupplier.creditLimit || 0}
                    onChange={(e) => setSelectedSupplier(prev => prev ? ({ ...prev, creditLimit: Number(e.target.value) }) : null)}
                    placeholder="Enter credit limit"
                  />
                </div>
              </div>

              {/* Status Checkboxes */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="editIsVendor"
                    checked={selectedSupplier.isVendor}
                    onCheckedChange={(checked) => setSelectedSupplier(prev => prev ? ({ ...prev, isVendor: Boolean(checked) }) : null)}
                  />
                  <Label htmlFor="editIsVendor">Is Vendor (Can purchase from)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="editIsCustomer"
                    checked={selectedSupplier.isCustomer}
                    onCheckedChange={(checked) => setSelectedSupplier(prev => prev ? ({ ...prev, isCustomer: Boolean(checked) }) : null)}
                  />
                  <Label htmlFor="editIsCustomer">Is Customer (Can sell to)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="editIsActive"
                    checked={selectedSupplier.isActive}
                    onCheckedChange={(checked) => setSelectedSupplier(prev => prev ? ({ ...prev, isActive: Boolean(checked) }) : null)}
                  />
                  <Label htmlFor="editIsActive">Active</Label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditDialogOpen(false)
                setSelectedSupplier(null)
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditSupplier}
              disabled={loading || !selectedSupplier?.name}
              className="bg-[#4B6587] hover:bg-[#3A5068]"
            >
              {loading ? "Updating..." : "Update Supplier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Supplier Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Supplier Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedSupplier?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSupplier && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Company Name</Label>
                  <p className="text-sm">{selectedSupplier.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Supplier ID</Label>
                  <p className="text-sm">{selectedSupplier.id}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="font-medium">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-sm">{selectedSupplier.email || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                    <p className="text-sm">{selectedSupplier.phone || "Not provided"}</p>
                  </div>
                </div>
                {selectedSupplier.website && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Website</Label>
                    <p className="text-sm">
                      <a href={selectedSupplier.website} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:underline">
                        {selectedSupplier.website}
                      </a>
                    </p>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h4 className="font-medium">Address</h4>
                <div className="text-sm">
                  {selectedSupplier.address.street && <p>{selectedSupplier.address.street}</p>}
                  {selectedSupplier.address.street2 && <p>{selectedSupplier.address.street2}</p>}
                  <p>
                    {selectedSupplier.address.city}, {selectedSupplier.address.state} {selectedSupplier.address.zip}
                  </p>
                  <p>{selectedSupplier.address.country}</p>
                </div>
              </div>

              {/* Business Info */}
              <div className="space-y-4">
                <h4 className="font-medium">Business Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Payment Terms</Label>
                    <p className="text-sm">{selectedSupplier.paymentTerms}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Currency</Label>
                    <p className="text-sm">{selectedSupplier.currency}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Credit Limit</Label>
                    <p className="text-sm">{selectedSupplier.currency} {selectedSupplier.creditLimit?.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Rating</Label>
                    <p className="text-sm">{selectedSupplier.supplierRank}/5</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-4">
                <h4 className="font-medium">Status</h4>
                <div className="flex gap-2">
                  <Badge variant={selectedSupplier.isActive ? "default" : "secondary"}>
                    {selectedSupplier.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {selectedSupplier.isVendor && <Badge variant="outline">Vendor</Badge>}
                  {selectedSupplier.isCustomer && <Badge variant="outline">Customer</Badge>}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                setIsViewDialogOpen(false)
                setIsEditDialogOpen(true)
              }}
              className="bg-[#4B6587] hover:bg-[#3A5068]"
            >
              Edit Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}