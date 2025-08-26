"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users2, TrendingUp, FileText, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

export function SuppliersContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Suppliers</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your supplier relationships and performance</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3A5068]">
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users2 className="h-5 w-5 text-[#4B6587]" />
              <span className="text-sm font-medium">Total Suppliers</span>
            </div>
            <p className="text-2xl font-bold mt-2">47</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users2 className="h-5 w-5 text-[#6B8A7A]" />
              <span className="text-sm font-medium">Active Suppliers</span>
            </div>
            <p className="text-2xl font-bold mt-2">42</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-[#F4A261]" />
              <span className="text-sm font-medium">Avg Performance</span>
            </div>
            <p className="text-2xl font-bold mt-2">87%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-[#E7B10A]" />
              <span className="text-sm font-medium">Active Contracts</span>
            </div>
            <p className="text-2xl font-bold mt-2">28</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users2 className="h-5 w-5 text-[#4B6587]" />
              <CardTitle>All Suppliers</CardTitle>
            </div>
            <CardDescription>Complete supplier directory and management</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              View and manage all your suppliers, contact information, and basic details.
            </p>
            <Link href="/suppliers/all">
              <Button className="w-full bg-[#4B6587] hover:bg-[#3A5068]">
                View All Suppliers <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-[#6B8A7A]" />
              <CardTitle>Performance</CardTitle>
            </div>
            <CardDescription>Track and analyze supplier performance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Monitor delivery times, quality metrics, and overall supplier performance.
            </p>
            <Link href="/suppliers/performance">
              <Button className="w-full bg-[#6B8A7A] hover:bg-[#5A7369]">
                View Performance <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-[#F4A261]" />
              <CardTitle>Contracts</CardTitle>
            </div>
            <CardDescription>Manage supplier contracts and agreements</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Track contract terms, renewal dates, and agreement details.
            </p>
            <Link href="/suppliers/contracts">
              <Button className="w-full bg-[#F4A261] hover:bg-[#E7934E]">
                View Contracts <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Suppliers</CardTitle>
            <CardDescription>Suppliers with highest performance ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Steel Corp Industries", rating: 95, orders: 24 },
                { name: "Electronics Wholesale", rating: 92, orders: 18 },
                { name: "Office Furniture Plus", rating: 89, orders: 15 },
                { name: "Safety Equipment Co", rating: 87, orders: 12 },
              ].map((supplier, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{supplier.name}</p>
                    <p className="text-sm text-gray-500">{supplier.orders} orders</p>
                  </div>
                  <Badge className="bg-[#6B8A7A]">{supplier.rating}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest supplier-related activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Users2 className="h-4 w-4 text-[#4B6587]" />
                <span className="text-sm">New supplier "Tech Components Ltd" added</span>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-[#F4A261]" />
                <span className="text-sm">Contract renewed with Steel Corp Industries</span>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-4 w-4 text-[#6B8A7A]" />
                <span className="text-sm">Performance review completed for 5 suppliers</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
