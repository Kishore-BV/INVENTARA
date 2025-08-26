"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Layers, MapPin, Package, Plus, Settings, BarChart3 } from "lucide-react"

export function ZonesContent() {
  const zones = [
    {
      id: "ZONE-A1",
      name: "Receiving Zone A",
      warehouse: "Main Warehouse",
      capacity: "85%",
      bins: 24,
      products: 156,
      status: "Active",
      type: "Receiving",
    },
    {
      id: "ZONE-B2",
      name: "Storage Zone B",
      warehouse: "Main Warehouse",
      capacity: "67%",
      bins: 36,
      products: 289,
      status: "Active",
      type: "Storage",
    },
    {
      id: "ZONE-C3",
      name: "Picking Zone C",
      warehouse: "Distribution Center North",
      capacity: "92%",
      bins: 18,
      products: 124,
      status: "Active",
      type: "Picking",
    },
    {
      id: "ZONE-D4",
      name: "Shipping Zone D",
      warehouse: "Distribution Center North",
      capacity: "45%",
      bins: 12,
      products: 67,
      status: "Active",
      type: "Shipping",
    },
    {
      id: "ZONE-E5",
      name: "Quarantine Zone E",
      warehouse: "Storage Facility East",
      capacity: "23%",
      bins: 8,
      products: 15,
      status: "Maintenance",
      type: "Quarantine",
    },
  ]

  const getZoneTypeColor = (type: string) => {
    switch (type) {
      case "Receiving":
        return "bg-[#4B6587]"
      case "Storage":
        return "bg-[#6B8A7A]"
      case "Picking":
        return "bg-[#F4A261]"
      case "Shipping":
        return "bg-[#E7B10A]"
      case "Quarantine":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Storage Zones</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage warehouse zones and storage areas</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3A5068]">
          <Plus className="mr-2 h-4 w-4" />
          Add Zone
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Layers className="h-5 w-5 text-[#4B6587]" />
              <span className="text-sm font-medium">Total Zones</span>
            </div>
            <p className="text-2xl font-bold mt-2">18</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-[#6B8A7A]" />
              <span className="text-sm font-medium">Total Bins</span>
            </div>
            <p className="text-2xl font-bold mt-2">98</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-[#F4A261]" />
              <span className="text-sm font-medium">Products Stored</span>
            </div>
            <p className="text-2xl font-bold mt-2">651</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-[#E7B10A]" />
              <span className="text-sm font-medium">Avg Capacity</span>
            </div>
            <p className="text-2xl font-bold mt-2">62%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <Card key={zone.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Layers className="h-5 w-5" />
                    <span>{zone.name}</span>
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-1 mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>{zone.warehouse}</span>
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge
                    variant={zone.status === "Active" ? "default" : "secondary"}
                    className={zone.status === "Active" ? "bg-[#6B8A7A]" : ""}
                  >
                    {zone.status}
                  </Badge>
                  <Badge variant="outline" className={getZoneTypeColor(zone.type)}>
                    {zone.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Capacity</p>
                  <p className="text-lg font-semibold">{zone.capacity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bins</p>
                  <p className="text-lg font-semibold">{zone.bins}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Products</p>
                  <p className="text-lg font-semibold">{zone.products}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
