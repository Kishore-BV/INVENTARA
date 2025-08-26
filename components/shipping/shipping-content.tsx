"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, Users2, Eye, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

export function ShippingContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shipping</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage shipments and delivery operations</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3A5068]">
          <Plus className="mr-2 h-4 w-4" />
          Create Shipment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-[#4B6587]" />
              <span className="text-sm font-medium">Active Shipments</span>
            </div>
            <p className="text-2xl font-bold mt-2">24</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users2 className="h-5 w-5 text-[#6B8A7A]" />
              <span className="text-sm font-medium">Carriers</span>
            </div>
            <p className="text-2xl font-bold mt-2">8</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-[#F4A261]" />
              <span className="text-sm font-medium">In Transit</span>
            </div>
            <p className="text-2xl font-bold mt-2">156</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-[#E7B10A]" />
              <span className="text-sm font-medium">Delivered Today</span>
            </div>
            <p className="text-2xl font-bold mt-2">43</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-[#4B6587]" />
              <CardTitle>Shipments</CardTitle>
            </div>
            <CardDescription>Track and manage all shipments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Create, track, and manage shipments from dispatch to delivery.
            </p>
            <Link href="/shipping/shipments">
              <Button className="w-full bg-[#4B6587] hover:bg-[#3A5068]">
                View Shipments <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users2 className="h-5 w-5 text-[#6B8A7A]" />
              <CardTitle>Carriers</CardTitle>
            </div>
            <CardDescription>Manage shipping carriers and partners</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Manage relationships with shipping carriers and logistics partners.
            </p>
            <Link href="/shipping/carriers">
              <Button className="w-full bg-[#6B8A7A] hover:bg-[#5A7369]">
                Manage Carriers <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-[#F4A261]" />
              <CardTitle>Tracking</CardTitle>
            </div>
            <CardDescription>Real-time shipment tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Monitor shipment progress and delivery status in real-time.
            </p>
            <Link href="/shipping/tracking">
              <Button className="w-full bg-[#F4A261] hover:bg-[#E7934E]">
                Track Shipments <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Shipments</CardTitle>
            <CardDescription>Latest shipping activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "SH-2024-156", carrier: "FedEx", destination: "New York, NY", status: "In Transit" },
                { id: "SH-2024-155", carrier: "UPS", destination: "Los Angeles, CA", status: "Delivered" },
                { id: "SH-2024-154", carrier: "DHL", destination: "Chicago, IL", status: "Processing" },
                { id: "SH-2024-153", carrier: "USPS", destination: "Houston, TX", status: "In Transit" },
              ].map((shipment, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{shipment.id}</p>
                    <p className="text-sm text-gray-500">
                      {shipment.carrier} • {shipment.destination}
                    </p>
                  </div>
                  <Badge
                    variant={
                      shipment.status === "Delivered"
                        ? "default"
                        : shipment.status === "In Transit"
                          ? "secondary"
                          : "outline"
                    }
                    className={
                      shipment.status === "Delivered"
                        ? "bg-[#6B8A7A]"
                        : shipment.status === "In Transit"
                          ? "bg-[#4B6587]"
                          : "bg-[#F4A261]"
                    }
                  >
                    {shipment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Performance</CardTitle>
            <CardDescription>Delivery metrics and carrier performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">On-Time Delivery</span>
                <span className="text-lg font-bold text-[#6B8A7A]">96.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Avg Delivery Time</span>
                <span className="text-lg font-bold text-[#4B6587]">2.1 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Shipments This Month</span>
                <span className="text-lg font-bold text-[#F4A261]">342</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Customer Satisfaction</span>
                <span className="text-lg font-bold text-[#E7B10A]">4.8/5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
