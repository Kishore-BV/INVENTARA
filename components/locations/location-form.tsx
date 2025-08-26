"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  Plus,
  MapPin,
  Building,
  QrCode,
  Scan,
  Save,
  X,
  TreePine,
  Folder,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  RefreshCcw,
  Copy,
  FileText,
  Settings,
  Archive,
  Target,
  Package
} from "lucide-react"
import { Location, Warehouse } from "@/lib/inventory-types"

interface LocationFormProps {
  location?: Location | null
  parentLocationId?: string
  warehouseId?: string
  onSave: (locationData: LocationFormData) => void
  onCancel: () => void
  isOpen: boolean
  mode: "create" | "edit"
}

const locationSchema = z.object({
  name: z.string().min(1, "Location name is required").max(50, "Name must be 50 characters or less"),
  warehouse: z.string().min(1, "Warehouse is required"),
  parentLocation: z.string().optional(),
  locationType: z.enum(["vendor", "view", "internal", "customer", "inventory", "procurement", "production", "transit"]),
  isScrapLocation: z.boolean().default(false),
  isReturnLocation: z.boolean().default(false),
  barcode: z.string().optional(),
  additionalInfo: z.string().optional(),
  isActive: z.boolean().default(true),
  // Extended properties
  allowNegativeStock: z.boolean().default(false),
  trackLots: z.boolean().default(false),
  trackPackages: z.boolean().default(false),
  removalStrategy: z.enum(["fifo", "lifo", "fefo"]).default("fifo"),
  maxCapacity: z.number().optional(),
  unitOfCapacity: z.string().optional(),
  putawayStrategy: z.enum(["fixed", "dynamic", "chaotic"]).default("fixed"),
  cycleCountFrequency: z.enum(["never", "daily", "weekly", "monthly", "quarterly"]).default("never"),
  notes: z.string().optional()
})

export type LocationFormData = z.infer<typeof locationSchema>

export function LocationForm({ 
  location, 
  parentLocationId, 
  warehouseId, 
  onSave, 
  onCancel, 
  isOpen, 
  mode 
}: LocationFormProps) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [isGeneratingBarcode, setIsGeneratingBarcode] = useState(false)
  const [showBarcodePreview, setShowBarcodePreview] = useState(false)
  const [selectedTab, setSelectedTab] = useState("basic")

  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      warehouse: warehouseId || "",
      parentLocation: parentLocationId || "",
      locationType: "internal",
      isScrapLocation: false,
      isReturnLocation: false,
      barcode: "",
      additionalInfo: "",
      isActive: true,
      allowNegativeStock: false,
      trackLots: false,
      trackPackages: false,
      removalStrategy: "fifo",
      putawayStrategy: "fixed",
      cycleCountFrequency: "never",
      notes: ""
    }
  })

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
    }
  ]

  useEffect(() => {
    setWarehouses(mockWarehouses)
    setLocations(mockLocations)
  }, [])

  useEffect(() => {
    if (location && mode === "edit") {
      form.reset({
        name: location.name,
        warehouse: location.warehouse,
        parentLocation: location.parentLocation || "",
        locationType: location.locationType,
        isScrapLocation: location.isScrapLocation,
        isReturnLocation: location.isReturnLocation,
        barcode: location.barcode || "",
        additionalInfo: location.additionalInfo || "",
        isActive: true,
        allowNegativeStock: false,
        trackLots: false,
        trackPackages: false,
        removalStrategy: "fifo",
        putawayStrategy: "fixed",
        cycleCountFrequency: "never",
        notes: ""
      })
    } else if (mode === "create") {
      form.reset({
        name: "",
        warehouse: warehouseId || "",
        parentLocation: parentLocationId || "",
        locationType: "internal",
        isScrapLocation: false,
        isReturnLocation: false,
        barcode: "",
        additionalInfo: "",
        isActive: true,
        allowNegativeStock: false,
        trackLots: false,
        trackPackages: false,
        removalStrategy: "fifo",
        putawayStrategy: "fixed",
        cycleCountFrequency: "never",
        notes: ""
      })
    }
  }, [location, mode, warehouseId, parentLocationId, form])

  const onSubmit = (data: LocationFormData) => {
    onSave(data)
    form.reset()
  }

  const generateBarcode = async () => {
    setIsGeneratingBarcode(true)
    // Simulate barcode generation
    setTimeout(() => {
      const timestamp = Date.now().toString().slice(-6)
      const warehouseCode = warehouses.find(w => w.id === form.getValues('warehouse'))?.code || 'WH'
      const generatedBarcode = `${warehouseCode}-LOC-${timestamp}`
      form.setValue('barcode', generatedBarcode)
      setIsGeneratingBarcode(false)
    }, 1000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const generateLocationName = () => {
    const warehouse = warehouses.find(w => w.id === form.getValues('warehouse'))
    const parent = locations.find(l => l.id === form.getValues('parentLocation'))
    
    if (warehouse) {
      let basePath = warehouse.code
      if (parent) {
        basePath += `/${parent.name}`
      }
      return basePath
    }
    return ""
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

  const filteredParentLocations = locations.filter(loc => {
    const selectedWarehouse = form.watch('warehouse')
    return loc.warehouse === selectedWarehouse && (!location || loc.id !== location.id)
  })

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            {mode === "create" ? "Create New Location" : "Edit Location"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Add a new storage location to your warehouse hierarchy" 
              : "Update location information and settings"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                <TabsTrigger value="tracking">Tracking</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Receiving Area, Aisle A, Shelf B1..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter a descriptive name for this location
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="warehouse"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Warehouse *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select warehouse" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {warehouses.map((warehouse) => (
                                <SelectItem key={warehouse.id} value={warehouse.id}>
                                  <div className="flex items-center space-x-2">
                                    <Building className="h-4 w-4" />
                                    <span>{warehouse.name}</span>
                                    <Badge variant="outline">{warehouse.code}</Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parentLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Location</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="None (Root level)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">None (Root level)</SelectItem>
                              {filteredParentLocations.map((location) => (
                                <SelectItem key={location.id} value={location.id}>
                                  <div className="flex items-center space-x-2">
                                    <TreePine className="h-4 w-4" />
                                    <span>{location.completeName}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Optional: Select a parent location to create a hierarchy
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="locationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="internal">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className={getLocationTypeColor("internal")}>
                                    Internal Location
                                  </Badge>
                                </div>
                              </SelectItem>
                              <SelectItem value="view">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className={getLocationTypeColor("view")}>
                                    View Location
                                  </Badge>
                                </div>
                              </SelectItem>
                              <SelectItem value="vendor">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className={getLocationTypeColor("vendor")}>
                                    Vendor Location
                                  </Badge>
                                </div>
                              </SelectItem>
                              <SelectItem value="customer">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className={getLocationTypeColor("customer")}>
                                    Customer Location
                                  </Badge>
                                </div>
                              </SelectItem>
                              <SelectItem value="inventory">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className={getLocationTypeColor("inventory")}>
                                    Inventory Location
                                  </Badge>
                                </div>
                              </SelectItem>
                              <SelectItem value="production">Production Location</SelectItem>
                              <SelectItem value="transit">Transit Location</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Complete Location Path</Label>
                      <div className="p-3 bg-muted rounded-md">
                        <p className="font-mono text-sm">
                          {generateLocationName()}/{form.watch('name') || '[Location Name]'}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This is how the location will appear in the system
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Barcode</FormLabel>
                          <div className="flex space-x-2">
                            <FormControl>
                              <Input placeholder="Scan or enter barcode" {...field} />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={generateBarcode}
                              disabled={isGeneratingBarcode}
                            >
                              {isGeneratingBarcode ? (
                                <RefreshCcw className="h-4 w-4 animate-spin" />
                              ) : (
                                <QrCode className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => setShowBarcodePreview(!showBarcodePreview)}
                            >
                              {showBarcodePreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          <FormDescription>
                            Generate or scan a barcode for this location
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {showBarcodePreview && form.watch('barcode') && (
                      <div className="p-3 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm">Barcode Preview</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(form.watch('barcode'))}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <div className="font-mono text-lg text-center py-4 bg-white border rounded">
                          {form.watch('barcode')}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label>Location Flags</Label>
                      
                      <FormField
                        control={form.control}
                        name="isScrapLocation"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Scrap Location
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isReturnLocation"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Return Location
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Active Location
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional details about this location..."
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional description or notes about this location
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Stock Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="allowNegativeStock"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div>
                              <FormLabel>Allow Negative Stock</FormLabel>
                              <FormDescription className="text-sm">
                                Allow stock levels to go below zero
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="removalStrategy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Removal Strategy</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="fifo">FIFO (First In, First Out)</SelectItem>
                                <SelectItem value="lifo">LIFO (Last In, First Out)</SelectItem>
                                <SelectItem value="fefo">FEFO (First Expired, First Out)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How products should be removed from this location
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="putawayStrategy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Putaway Strategy</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="fixed">Fixed Location</SelectItem>
                                <SelectItem value="dynamic">Dynamic Location</SelectItem>
                                <SelectItem value="chaotic">Chaotic Storage</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How products should be put away in this location
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Capacity & Limits</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="maxCapacity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Capacity</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="1000" 
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="unitOfCapacity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select unit" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="pieces">Pieces</SelectItem>
                                  <SelectItem value="kg">Kilograms</SelectItem>
                                  <SelectItem value="m3">Cubic Meters</SelectItem>
                                  <SelectItem value="pallets">Pallets</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="cycleCountFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cycle Count Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="never">Never</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How often this location should be cycle counted
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Advanced Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Advanced Configuration</h3>
                      <p className="text-muted-foreground">
                        Advanced location settings like routing rules, cost centers, and 
                        integration parameters will be available here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tracking" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tracking Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="trackLots"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Track Lot Numbers</FormLabel>
                            <FormDescription>
                              Enable lot number tracking for products in this location
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="trackPackages"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Track Packages</FormLabel>
                            <FormDescription>
                              Enable package tracking for products in this location
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Internal Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Internal notes for warehouse staff..."
                              {...field}
                              rows={4}
                            />
                          </FormControl>
                          <FormDescription>
                            These notes are only visible to warehouse staff
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {mode === "create" ? "Create Location" : "Update Location"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
