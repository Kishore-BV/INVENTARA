"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  MapPin,
  ChevronRight,
  ChevronDown,
  Move,
  Copy,
  Eye,
  Package,
  Building,
  TreePine,
  Folder,
  FolderOpen,
  Archive,
  BarChart3,
  Grid3x3,
  List,
  Filter,
  SortAsc,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react"
import { Location, Warehouse } from "@/lib/inventory-types"

interface LocationHierarchyProps {
  className?: string
}

interface LocationNode extends Location {
  children?: LocationNode[]
  level?: number
  isExpanded?: boolean
}

interface LocationStats {
  totalLocations: number
  internalLocations: number
  vendorLocations: number
  customerLocations: number
  scrapLocations: number
  returnLocations: number
}

export function LocationHierarchy({ className }: LocationHierarchyProps) {
  const [locations, setLocations] = useState<LocationNode[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [locationStats, setLocationStats] = useState<LocationStats | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"tree" | "list">("tree")
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  
  const [isCreateLocationOpen, setIsCreateLocationOpen] = useState(false)
  const [isEditLocationOpen, setIsEditLocationOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null)
  const [parentLocationForNew, setParentLocationForNew] = useState<string>("")

  // Mock data
  const mockWarehouses: Warehouse[] = [
    {
      id: "wh1",
      name: "Main Distribution Center",
      code: "MDC001",
      address: { city: "Atlanta", state: "GA", country: "USA" },
      isActive: true,
      company: "Inventara Inc",
      locations: [],
      routes: [],
      resupplyRoutes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "wh2",
      name: "West Coast Facility",
      code: "WCF001",
      address: { city: "Los Angeles", state: "CA", country: "USA" },
      isActive: true,
      company: "Inventara Inc",
      locations: [],
      routes: [],
      resupplyRoutes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const mockLocations: Location[] = [
    {
      id: "loc1",
      name: "Stock",
      completeName: "MDC001/Stock",
      warehouse: "wh1",
      locationType: "view",
      isScrapLocation: false,
      isReturnLocation: false,
      barcode: "LOC001",
      stockQuants: []
    },
    {
      id: "loc2",
      name: "Receiving Area",
      completeName: "MDC001/Stock/Receiving",
      warehouse: "wh1",
      parentLocation: "loc1",
      locationType: "internal",
      isScrapLocation: false,
      isReturnLocation: false,
      barcode: "LOC002",
      stockQuants: []
    },
    {
      id: "loc3",
      name: "Quality Control",
      completeName: "MDC001/Stock/QC",
      warehouse: "wh1",
      parentLocation: "loc1",
      locationType: "internal",
      isScrapLocation: false,
      isReturnLocation: false,
      barcode: "LOC003",
      stockQuants: []
    },
    {
      id: "loc4",
      name: "Aisle A",
      completeName: "MDC001/Stock/Aisle-A",
      warehouse: "wh1",
      parentLocation: "loc1",
      locationType: "internal",
      isScrapLocation: false,
      isReturnLocation: false,
      barcode: "LOC004",
      stockQuants: []
    },
    {
      id: "loc5",
      name: "Shelf A1",
      completeName: "MDC001/Stock/Aisle-A/Shelf-A1",
      warehouse: "wh1",
      parentLocation: "loc4",
      locationType: "internal",
      isScrapLocation: false,
      isReturnLocation: false,
      barcode: "LOC005",
      stockQuants: []
    },
    {
      id: "loc6",
      name: "Shelf A2",
      completeName: "MDC001/Stock/Aisle-A/Shelf-A2",
      warehouse: "wh1",
      parentLocation: "loc4",
      locationType: "internal",
      isScrapLocation: false,
      isReturnLocation: false,
      barcode: "LOC006",
      stockQuants: []
    },
    {
      id: "loc7",
      name: "Returns Processing",
      completeName: "MDC001/Stock/Returns",
      warehouse: "wh1",
      parentLocation: "loc1",
      locationType: "internal",
      isScrapLocation: false,
      isReturnLocation: true,
      barcode: "LOC007",
      stockQuants: []
    },
    {
      id: "loc8",
      name: "Damaged Goods",
      completeName: "MDC001/Stock/Returns/Damaged",
      warehouse: "wh1",
      parentLocation: "loc7",
      locationType: "internal",
      isScrapLocation: true,
      isReturnLocation: true,
      barcode: "LOC008",
      stockQuants: []
    },
    {
      id: "loc9",
      name: "Shipping Dock",
      completeName: "MDC001/Output",
      warehouse: "wh1",
      locationType: "internal",
      isScrapLocation: false,
      isReturnLocation: false,
      barcode: "LOC009",
      stockQuants: []
    },
    {
      id: "loc10",
      name: "Customer Returns",
      completeName: "MDC001/Input/Returns",
      warehouse: "wh1",
      locationType: "customer",
      isScrapLocation: false,
      isReturnLocation: true,
      barcode: "LOC010",
      stockQuants: []
    }
  ]

  const buildLocationTree = useCallback((locations: Location[]): LocationNode[] => {
    const locationMap = new Map<string, LocationNode>()
    
    // Convert locations to nodes
    locations.forEach(loc => {
      locationMap.set(loc.id, { 
        ...loc, 
        children: [],
        level: 0,
        isExpanded: expandedNodes.has(loc.id)
      })
    })
    
    const rootNodes: LocationNode[] = []
    
    // Build parent-child relationships
    locations.forEach(loc => {
      const node = locationMap.get(loc.id)!
      
      if (loc.parentLocation) {
        const parent = locationMap.get(loc.parentLocation)
        if (parent) {
          parent.children!.push(node)
          node.level = (parent.level || 0) + 1
        } else {
          // Parent not found, treat as root
          rootNodes.push(node)
        }
      } else {
        rootNodes.push(node)
      }
    })
    
    // Sort children by name
    const sortChildren = (nodes: LocationNode[]) => {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          node.children.sort((a, b) => a.name.localeCompare(b.name))
          sortChildren(node.children)
        }
      })
    }
    
    rootNodes.sort((a, b) => a.name.localeCompare(b.name))
    sortChildren(rootNodes)
    
    return rootNodes
  }, [expandedNodes])

  useEffect(() => {
    setTimeout(() => {
      setWarehouses(mockWarehouses)
      const locationTree = buildLocationTree(mockLocations)
      setLocations(locationTree)
      
      // Calculate stats
      const stats: LocationStats = {
        totalLocations: mockLocations.length,
        internalLocations: mockLocations.filter(l => l.locationType === 'internal').length,
        vendorLocations: mockLocations.filter(l => l.locationType === 'vendor').length,
        customerLocations: mockLocations.filter(l => l.locationType === 'customer').length,
        scrapLocations: mockLocations.filter(l => l.isScrapLocation).length,
        returnLocations: mockLocations.filter(l => l.isReturnLocation).length
      }
      setLocationStats(stats)
      
      // Expand root nodes by default
      const rootNodeIds = new Set<string>()
      mockLocations.forEach(loc => {
        if (!loc.parentLocation) {
          rootNodeIds.add(loc.id)
        }
      })
      setExpandedNodes(rootNodeIds)
      
      setLoading(false)
    }, 1000)
  }, [buildLocationTree])

  const toggleNodeExpansion = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (expandedNodes.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case "internal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "vendor":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "customer":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "inventory":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "view":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      case "transit":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getLocationIcon = (location: LocationNode) => {
    if (location.locationType === 'view') {
      return location.isExpanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />
    }
    return <MapPin className="h-4 w-4" />
  }

  const renderLocationNode = (node: LocationNode, isLast = false) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expandedNodes.has(node.id)
    const indentLevel = node.level || 0
    
    return (
      <div key={node.id} className="select-none">
        <div 
          className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md group cursor-pointer"
          style={{ paddingLeft: `${indentLevel * 20 + 8}px` }}
        >
          {/* Expansion Toggle */}
          <div className="w-4 h-4 flex items-center justify-center">
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                className="w-4 h-4 p-0 hover:bg-muted"
                onClick={() => toggleNodeExpansion(node.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            ) : (
              <div className="w-3 h-3" />
            )}
          </div>
          
          {/* Location Icon */}
          <div className="text-muted-foreground">
            {getLocationIcon(node)}
          </div>
          
          {/* Location Name */}
          <div className="flex-1 flex items-center space-x-2">
            <span className="font-medium">{node.name}</span>
            <Badge variant="outline" className={getLocationTypeColor(node.locationType)}>
              {node.locationType}
            </Badge>
            {node.isScrapLocation && (
              <Badge variant="destructive" className="text-xs">
                Scrap
              </Badge>
            )}
            {node.isReturnLocation && (
              <Badge variant="outline" className="text-xs">
                Return
              </Badge>
            )}
          </div>
          
          {/* Stock Info */}
          <div className="text-sm text-muted-foreground">
            {node.stockQuants.length} items
          </div>
          
          {/* Actions */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Location Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => openEditLocationDialog(node)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openCreateSubLocationDialog(node.id)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Sub-location
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View Inventory
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Move className="mr-2 h-4 w-4" />
                  Move Location
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => {
                    setLocationToDelete(node.id)
                    setIsDeleteAlertOpen(true)
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Children */}
        {hasChildren && isExpanded && node.children && (
          <div>
            {node.children.map((child, index) => 
              renderLocationNode(child, index === node.children!.length - 1)
            )}
          </div>
        )}
      </div>
    )
  }

  const openCreateSubLocationDialog = (parentId: string) => {
    setParentLocationForNew(parentId)
    setIsCreateLocationOpen(true)
  }

  const openEditLocationDialog = (location: Location) => {
    setSelectedLocation(location)
    setIsEditLocationOpen(true)
  }

  const filteredLocations = locations.filter(location => {
    if (selectedWarehouse !== "all" && location.warehouse !== selectedWarehouse) return false
    if (searchTerm && !location.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !location.completeName.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (typeFilter !== "all" && location.locationType !== typeFilter) return false
    return true
  })

  const expandAll = () => {
    const allIds = new Set<string>()
    const collectIds = (nodes: LocationNode[]) => {
      nodes.forEach(node => {
        allIds.add(node.id)
        if (node.children) collectIds(node.children)
      })
    }
    collectIds(locations)
    setExpandedNodes(allIds)
  }

  const collapseAll = () => {
    setExpandedNodes(new Set())
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Location Hierarchy</h1>
          <p className="text-muted-foreground">
            Manage storage locations and warehouse organization
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            <TreePine className="mr-2 h-4 w-4" />
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            <Archive className="mr-2 h-4 w-4" />
            Collapse All
          </Button>
          <Dialog open={isCreateLocationOpen} onOpenChange={setIsCreateLocationOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Create New Location</DialogTitle>
                <DialogDescription>
                  Add a new storage location to your warehouse hierarchy
                </DialogDescription>
              </DialogHeader>
              {/* This would contain the location form - we'll create this next */}
              <div className="py-4">
                <p className="text-muted-foreground">Location form will be implemented in the next component...</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateLocationOpen(false)}>
                  Cancel
                </Button>
                <Button>Create Location</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      {locationStats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{locationStats.totalLocations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Internal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{locationStats.internalLocations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vendor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{locationStats.vendorLocations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{locationStats.customerLocations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{locationStats.returnLocations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Scrap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{locationStats.scrapLocations}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Warehouses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warehouses</SelectItem>
            {warehouses.map((warehouse) => (
              <SelectItem key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="inventory">Inventory</SelectItem>
            <SelectItem value="view">View</SelectItem>
            <SelectItem value="transit">Transit</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "tree" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("tree")}
          >
            <TreePine className="mr-2 h-4 w-4" />
            Tree
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="mr-2 h-4 w-4" />
            List
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TreePine className="mr-2 h-5 w-5" />
            Location Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === "tree" ? (
            <div className="space-y-1">
              {filteredLocations.length > 0 ? (
                filteredLocations.map(node => renderLocationNode(node))
              ) : (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Locations Found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm || typeFilter !== "all" || selectedWarehouse !== "all"
                      ? "Try adjusting your filters to see more locations"
                      : "Create your first location to organize your inventory"}
                  </p>
                  <Button onClick={() => setIsCreateLocationOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Location
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Grid3x3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">List View</h3>
              <p className="text-muted-foreground">
                List view implementation coming soon...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Location</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this location? This action cannot be undone.
              All sub-locations and inventory data will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                // Handle deletion logic here
                setIsDeleteAlertOpen(false)
                setLocationToDelete(null)
              }}
            >
              Delete Location
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
