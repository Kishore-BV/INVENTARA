"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Receipt, Plus, Clock, Check, Download, ArrowRight } from "lucide-react"
import Link from "next/link"

export function PurchaseOrdersContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Purchase Orders</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage purchase orders and procurement workflow</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3A5068]">
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Receipt className="h-5 w-5 text-[#4B6587]" />
              <span className="text-sm font-medium">Total Orders</span>
            </div>
            <p className="text-2xl font-bold mt-2">156</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-[#F4A261]" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold mt-2">8</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-[#6B8A7A]" />
              <span className="text-sm font-medium">Approved</span>
            </div>
            <p className="text-2xl font-bold mt-2">12</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-[#E7B10A]" />
              <span className="text-sm font-medium">Received</span>
            </div>
            <p className="text-2xl font-bold mt-2">136</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-[#4B6587]" />
              <CardTitle>Create Order</CardTitle>
            </div>
            <CardDescription>Create new purchase orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Create new purchase orders for suppliers and manage procurement.
            </p>
            <Link href="/purchase-orders/create">
              <Button className="w-full bg-[#4B6587] hover:bg-[#3A5068]">
                Create Order <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-[#F4A261]" />
              <CardTitle>Pending Orders</CardTitle>
            </div>
            <CardDescription>Orders awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Review and approve pending purchase orders from your team.
            </p>
            <Link href="/purchase-orders/pending">
              <Button className="w-full bg-[#F4A261] hover:bg-[#E7934E]">
                View Pending <Badge className="ml-2 bg-white text-[#F4A261]">8</Badge>
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-[#6B8A7A]" />
              <CardTitle>Approved Orders</CardTitle>
            </div>
            <CardDescription>Track approved orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Monitor approved orders and their delivery status.
            </p>
            <Link href="/purchase-orders/approved">
              <Button className="w-full bg-[#6B8A7A] hover:bg-[#5A7369]">
                View Approved <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-[#E7B10A]" />
              <CardTitle>Received Orders</CardTitle>
            </div>
            <CardDescription>Completed deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              View received orders and update inventory accordingly.
            </p>
            <Link href="/purchase-orders/received">
              <Button className="w-full bg-[#E7B10A] hover:bg-[#D19E09]">
                View Received <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
            <CardDescription>Latest purchase order activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "PO-2024-008", supplier: "Steel Corp Industries", amount: "$15,250", status: "Approved" },
                { id: "PO-2024-007", supplier: "Electronics Wholesale", amount: "$8,900", status: "Pending" },
                { id: "PO-2024-006", supplier: "Office Furniture Plus", amount: "$12,400", status: "Received" },
                { id: "PO-2024-005", supplier: "Safety Equipment Co", amount: "$6,750", status: "Approved" },
              ].map((order, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.supplier}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <Badge
                      variant={
                        order.status === "Approved" ? "default" : order.status === "Pending" ? "secondary" : "outline"
                      }
                      className={
                        order.status === "Approved"
                          ? "bg-[#6B8A7A]"
                          : order.status === "Pending"
                            ? "bg-[#F4A261]"
                            : "bg-[#E7B10A]"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
            <CardDescription>Purchase order statistics for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Orders Created</span>
                <span className="text-lg font-bold text-[#4B6587]">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Value</span>
                <span className="text-lg font-bold text-[#6B8A7A]">$89.2K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Avg Processing Time</span>
                <span className="text-lg font-bold text-[#F4A261]">2.3 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">On-Time Delivery</span>
                <span className="text-lg font-bold text-[#E7B10A]">94%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
