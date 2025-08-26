"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Receipt, Shield, Minus, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

export function ReceivingContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Receiving</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage goods receiving and quality control processes</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3A5068]">
          <Plus className="mr-2 h-4 w-4" />
          Record Receipt
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Receipt className="h-5 w-5 text-[#4B6587]" />
              <span className="text-sm font-medium">Total Receipts</span>
            </div>
            <p className="text-2xl font-bold mt-2">342</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-[#6B8A7A]" />
              <span className="text-sm font-medium">Quality Checks</span>
            </div>
            <p className="text-2xl font-bold mt-2">89</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Minus className="h-5 w-5 text-[#F4A261]" />
              <span className="text-sm font-medium">Returns</span>
            </div>
            <p className="text-2xl font-bold mt-2">7</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-[#E7B10A]" />
              <span className="text-sm font-medium">This Month</span>
            </div>
            <p className="text-2xl font-bold mt-2">45</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Receipt className="h-5 w-5 text-[#4B6587]" />
              <CardTitle>Receipts</CardTitle>
            </div>
            <CardDescription>Track and manage goods receipts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Record incoming goods, verify quantities, and update inventory levels.
            </p>
            <Link href="/receiving/receipts">
              <Button className="w-full bg-[#4B6587] hover:bg-[#3A5068]">
                View Receipts <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-[#6B8A7A]" />
              <CardTitle>Quality Control</CardTitle>
            </div>
            <CardDescription>Manage quality inspections</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Perform quality checks, document issues, and ensure product standards.
            </p>
            <Link href="/receiving/quality">
              <Button className="w-full bg-[#6B8A7A] hover:bg-[#5A7369]">
                Quality Control <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Minus className="h-5 w-5 text-[#F4A261]" />
              <CardTitle>Returns</CardTitle>
            </div>
            <CardDescription>Handle supplier returns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Process returns to suppliers for defective or incorrect items.
            </p>
            <Link href="/receiving/returns">
              <Button className="w-full bg-[#F4A261] hover:bg-[#E7934E]">
                Manage Returns <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Receipts</CardTitle>
            <CardDescription>Latest goods received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "RCP-2024-045", supplier: "Steel Corp Industries", items: 3, status: "Completed" },
                { id: "RCP-2024-044", supplier: "Electronics Wholesale", items: 5, status: "Quality Check" },
                { id: "RCP-2024-043", supplier: "Office Furniture Plus", items: 1, status: "Completed" },
                { id: "RCP-2024-042", supplier: "Safety Equipment Co", items: 2, status: "Processing" },
              ].map((receipt, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{receipt.id}</p>
                    <p className="text-sm text-gray-500">{receipt.supplier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{receipt.items} items</p>
                    <Badge
                      variant={
                        receipt.status === "Completed"
                          ? "default"
                          : receipt.status === "Quality Check"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        receipt.status === "Completed"
                          ? "bg-[#6B8A7A]"
                          : receipt.status === "Quality Check"
                            ? "bg-[#F4A261]"
                            : "bg-[#4B6587]"
                      }
                    >
                      {receipt.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Metrics</CardTitle>
            <CardDescription>Quality control performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pass Rate</span>
                <span className="text-lg font-bold text-[#6B8A7A]">96.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Inspections This Month</span>
                <span className="text-lg font-bold text-[#4B6587]">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Return Rate</span>
                <span className="text-lg font-bold text-[#F4A261]">2.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Avg Processing Time</span>
                <span className="text-lg font-bold text-[#E7B10A]">1.8 hrs</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
