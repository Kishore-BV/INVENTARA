"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Search, Filter, Plus, Eye, Package } from "lucide-react"

export function InboundTransactionsContent() {
  const transactions = [
    {
      id: "IN-2024-001",
      date: "2024-01-15",
      supplier: "Steel Corp Industries",
      products: 3,
      quantity: 245,
      value: "$30,625.00",
      status: "Completed",
      reference: "PO-2024-001",
    },
    {
      id: "IN-2024-002",
      date: "2024-01-14",
      supplier: "Office Furniture Plus",
      products: 1,
      quantity: 25,
      value: "$7,499.75",
      status: "Pending",
      reference: "PO-2024-002",
    },
    {
      id: "IN-2024-003",
      date: "2024-01-13",
      supplier: "Electronics Wholesale",
      products: 5,
      quantity: 156,
      value: "$14,038.44",
      status: "Completed",
      reference: "PO-2024-003",
    },
    {
      id: "IN-2024-004",
      date: "2024-01-12",
      supplier: "Safety Equipment Co",
      products: 2,
      quantity: 50,
      value: "$9,999.50",
      status: "In Transit",
      reference: "PO-2024-004",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inbound Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage incoming inventory transactions and receipts</p>
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
              <Download className="h-5 w-5 text-[#4B6587]" />
              <span className="text-sm font-medium">Total Inbound</span>
            </div>
            <p className="text-2xl font-bold mt-2">476</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-[#6B8A7A]" />
              <span className="text-sm font-medium">This Month</span>
            </div>
            <p className="text-2xl font-bold mt-2">89</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-[#F4A261]" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold mt-2">12</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-[#E7B10A]" />
              <span className="text-sm font-medium">Total Value</span>
            </div>
            <p className="text-2xl font-bold mt-2">$62.2K</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Inbound Transactions</CardTitle>
              <CardDescription>Track incoming inventory and receipts</CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search transactions..." className="pl-10 w-64" />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{transaction.id}</p>
                      <p className="text-sm text-gray-500">{transaction.reference}</p>
                    </div>
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.supplier}</TableCell>
                  <TableCell>{transaction.products}</TableCell>
                  <TableCell className="font-medium">{transaction.quantity}</TableCell>
                  <TableCell className="font-medium">{transaction.value}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status === "Completed"
                          ? "default"
                          : transaction.status === "Pending"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        transaction.status === "Completed"
                          ? "bg-[#6B8A7A]"
                          : transaction.status === "Pending"
                            ? "bg-[#F4A261]"
                            : "bg-[#4B6587]"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
