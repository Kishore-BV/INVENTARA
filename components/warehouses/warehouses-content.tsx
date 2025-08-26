"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Package, Users, Plus, Settings, BarChart3 } from "lucide-react"

export function WarehousesContent() {
  const warehouses = [
    {
      id: 1,
      name: "Main Warehouse",
      location: "123 Industrial Ave, City Center",
      status: "Active",
      capacity: "85%",
      products: 847,
      staff: 12,
      zones: 8,
    },
    {
      id: 2,
      name: "Distribution Center North",
      location: "456 Logistics Blvd, North District",
      status: "Active",
      capacity: "62%",
      products: 523,
      staff: 8,
      zones: 6,
    },
    {
      id: 3,
      name: "Storage Facility East",
      location: "789 Storage St, East Side",
      status: "Maintenance",
      capacity: "45%",
      products: 234,
      staff: 4,
      zones: 4,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Warehouses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your warehouse locations and configurations</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3A5068]">
          <Plus className="mr-2 h-4 w-4" />
          Add Warehouse
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-[#4B6587]" />
              <span className="text-sm font-medium">Total Warehouses</span>
            </div>
            <p className="text-2xl font-bold mt-2">3</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-[#6B8A7A]" />
              <span className="text-sm font-medium">Total Products</span>
            </div>
            <p className="text-2xl font-bold mt-2">1,604</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-[#F4A261]" />
              <span className="text-sm font-medium">Total Staff</span>
            </div>
            <p className="text-2xl font-bold mt-2">24</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-[#E7B10A]" />
              <span className="text-sm font-medium">Avg Capacity</span>
            </div>
            <p className="text-2xl font-bold mt-2">64%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {warehouses.map((warehouse) => (
          <Card key={warehouse.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>{warehouse.name}</span>
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-1 mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>{warehouse.location}</span>
                  </CardDescription>
                </div>
                <Badge
                  variant={warehouse.status === "Active" ? "default" : "secondary"}
                  className={warehouse.status === "Active" ? "bg-[#6B8A7A]" : ""}
                >
                  {warehouse.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Capacity</p>
                  <p className="text-lg font-semibold">{warehouse.capacity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Products</p>
                  <p className="text-lg font-semibold">{warehouse.products.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Staff</p>
                  <p className="text-lg font-semibold">{warehouse.staff}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Zones</p>
                  <p className="text-lg font-semibold">{warehouse.zones}</p>
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
