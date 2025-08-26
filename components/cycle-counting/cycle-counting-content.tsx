"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, FileText, AlertTriangle, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

export function CycleCountingContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cycle Counting</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage inventory cycle counting and stock verification
          </p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3A5068]">
          <Plus className="mr-2 h-4 w-4" />
          New Count
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-[#4B6587]" />
              <span className="text-sm font-medium">Active Counts</span>
            </div>
            <p className="text-2xl font-bold mt-2">12</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-[#6B8A7A]" />
              <span className="text-sm font-medium">Scheduled</span>
            </div>
            <p className="text-2xl font-bold mt-2">8</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-[#F4A261]" />
              <span className="text-sm font-medium">Discrepancies</span>
            </div>
            <p className="text-2xl font-bold mt-2">3</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-[#E7B10A]" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold mt-2">156</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-[#4B6587]" />
              <CardTitle>Count Schedules</CardTitle>
            </div>
            <CardDescription>Plan and schedule cycle counting activities</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Create and manage counting schedules for different product categories and locations.
            </p>
            <Link href="/cycle-counting/schedules">
              <Button className="w-full bg-[#4B6587] hover:bg-[#3A5068]">
                View Schedules <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-[#6B8A7A]" />
              <CardTitle>Count Sheets</CardTitle>
            </div>
            <CardDescription>Manage counting sheets and data collection</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Generate, distribute, and collect cycle counting sheets for inventory verification.
            </p>
            <Link href="/cycle-counting/sheets">
              <Button className="w-full bg-[#6B8A7A] hover:bg-[#5A7369]">
                View Sheets <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-[#F4A261]" />
              <CardTitle>Discrepancies</CardTitle>
            </div>
            <CardDescription>Review and resolve count discrepancies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Investigate and resolve differences between expected and actual counts.
            </p>
            <Link href="/cycle-counting/discrepancies">
              <Button className="w-full bg-[#F4A261] hover:bg-[#E7934E]">
                View Issues <Badge className="ml-2 bg-white text-[#F4A261]">3</Badge>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Count Activities</CardTitle>
            <CardDescription>Latest cycle counting operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "CC-2024-012", location: "Zone A - Raw Materials", status: "In Progress", items: 45 },
                { id: "CC-2024-011", location: "Zone B - Finished Goods", status: "Completed", items: 78 },
                { id: "CC-2024-010", location: "Zone C - Electronics", status: "Discrepancy", items: 23 },
                { id: "CC-2024-009", location: "Zone D - Consumables", status: "Scheduled", items: 56 },
              ].map((count, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{count.id}</p>
                    <p className="text-sm text-gray-500">{count.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{count.items} items</p>
                    <Badge
                      variant={
                        count.status === "Completed"
                          ? "default"
                          : count.status === "In Progress"
                            ? "secondary"
                            : count.status === "Discrepancy"
                              ? "destructive"
                              : "outline"
                      }
                      className={
                        count.status === "Completed"
                          ? "bg-[#6B8A7A]"
                          : count.status === "In Progress"
                            ? "bg-[#4B6587]"
                            : count.status === "Discrepancy"
                              ? ""
                              : "bg-[#E7B10A]"
                      }
                    >
                      {count.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Counting Performance</CardTitle>
            <CardDescription>Cycle counting metrics and accuracy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Accuracy Rate</span>
                <span className="text-lg font-bold text-[#6B8A7A]">94.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Counts This Month</span>
                <span className="text-lg font-bold text-[#4B6587]">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Avg Count Time</span>
                <span className="text-lg font-bold text-[#F4A261]">2.4 hrs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Items Counted</span>
                <span className="text-lg font-bold text-[#E7B10A]">1,247</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
