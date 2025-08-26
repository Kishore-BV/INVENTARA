"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, FileText, Layers, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

export function PickingContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Picking & Packing</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage order picking and packing operations</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3A5068]">
          <Plus className="mr-2 h-4 w-4" />
          Create Pick List
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-[#4B6587]" />
              <span className="text-sm font-medium">Active Pick Lists</span>
            </div>
            <p className="text-2xl font-bold mt-2">18</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Layers className="h-5 w-5 text-[#6B8A7A]" />
              <span className="text-sm font-medium">Pick Waves</span>
            </div>
            <p className="text-2xl font-bold mt-2">5</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-[#F4A261]" />
              <span className="text-sm font-medium">Ready to Pack</span>
            </div>
            <p className="text-2xl font-bold mt-2">34</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-[#E7B10A]" />
              <span className="text-sm font-medium">Packed Today</span>
            </div>
            <p className="text-2xl font-bold mt-2">67</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-[#4B6587]" />
              <CardTitle>Pick Lists</CardTitle>
            </div>
            <CardDescription>Manage and track order pick lists</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Create, assign, and track pick lists for efficient order fulfillment.
            </p>
            <Link href="/picking/lists">
              <Button className="w-full bg-[#4B6587] hover:bg-[#3A5068]">
                View Pick Lists <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Layers className="h-5 w-5 text-[#6B8A7A]" />
              <CardTitle>Pick Waves</CardTitle>
            </div>
            <CardDescription>Optimize picking with wave planning</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Group orders into waves for efficient batch picking and resource optimization.
            </p>
            <Link href="/picking/waves">
              <Button className="w-full bg-[#6B8A7A] hover:bg-[#5A7369]">
                Manage Waves <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-[#F4A261]" />
              <CardTitle>Packing</CardTitle>
            </div>
            <CardDescription>Manage packing and shipping preparation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Pack orders efficiently and prepare them for shipping with proper documentation.
            </p>
            <Link href="/picking/packing">
              <Button className="w-full bg-[#F4A261] hover:bg-[#E7934E]">
                Packing Station <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Operations</CardTitle>
            <CardDescription>Current picking and packing activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "PL-2024-089", type: "Pick List", items: 12, status: "In Progress", assignee: "John D." },
                { id: "PW-2024-015", type: "Pick Wave", items: 45, status: "Planning", assignee: "Sarah M." },
                { id: "PL-2024-088", type: "Pick List", items: 8, status: "Completed", assignee: "Mike R." },
                { id: "PK-2024-156", type: "Packing", items: 23, status: "Packing", assignee: "Lisa K." },
              ].map((operation, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{operation.id}</p>
                    <p className="text-sm text-gray-500">
                      {operation.type} • {operation.assignee}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{operation.items} items</p>
                    <Badge
                      variant={
                        operation.status === "Completed"
                          ? "default"
                          : operation.status === "In Progress"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        operation.status === "Completed"
                          ? "bg-[#6B8A7A]"
                          : operation.status === "In Progress"
                            ? "bg-[#4B6587]"
                            : operation.status === "Packing"
                              ? "bg-[#F4A261]"
                              : "bg-[#E7B10A]"
                      }
                    >
                      {operation.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Picking and packing efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pick Accuracy</span>
                <span className="text-lg font-bold text-[#6B8A7A]">98.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Avg Pick Time</span>
                <span className="text-lg font-bold text-[#4B6587]">3.2 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Orders Packed Today</span>
                <span className="text-lg font-bold text-[#F4A261]">67</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Packing Efficiency</span>
                <span className="text-lg font-bold text-[#E7B10A]">92%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
