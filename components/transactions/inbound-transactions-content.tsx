'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Home, Plus, Package, Calendar, User, Building } from "lucide-react"
import Link from "next/link"

type InboundTransaction = {
  id: string
  name: string
  department: string
  date: string
  goodsDescription: string
  quantity: number
  status: "pending" | "completed" | "cancelled"
  reference: string
}

const departments = [
  "Warehouse",
  "Production",
  "Sales",
  "Marketing",
  "IT",
  "HR",
  "Finance",

  "Quality Control",
  "Maintenance"
]

const employees = [
  "John Smith",
  "Sarah Johnson",
  "Mike Wilson",
  "Emily Davis",
  "David Brown",
  "Lisa Anderson",
  "Robert Taylor",
  "Jennifer Martinez",
  "Christopher Garcia",
  "Amanda Rodriguez",
  "James Wilson",
  "Michelle Lee",
  "Daniel Thompson",
  "Jessica White",
  "Kevin Clark"
]

const goodsDescriptions = [
  "Raw Materials",
  "Finished Goods",
  "Packaging Materials",
  "Office Supplies",
  "Electronics",
  "Tools & Equipment",
  "Safety Equipment",
  "Others"
]

const sampleTransactions: InboundTransaction[] = [
  {
    id: "IN-001",
    name: "John Smith",
    department: "Warehouse",
    date: "2023-10-17",
    goodsDescription: "Raw Materials - Steel Sheets",
    quantity: 500,
    status: "completed",
    reference: "PO-44102"
  },
  {
    id: "IN-002",
    name: "Sarah Johnson",
    department: "Production",
    date: "2023-10-16",
    goodsDescription: "Electronics - Circuit Boards",
    quantity: 200,
    status: "pending",
    reference: "PO-44101"
  },
  {
    id: "IN-003",
    name: "Mike Wilson",
    department: "IT",
    date: "2023-10-15",
    goodsDescription: "Office Supplies - Paper and Ink",
    quantity: 50,
    status: "completed",
    reference: "PO-44100"
  }
]

export function InboundTransactionsContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    date: "",
    goodsDescription: "",
    customDescription: "",
    quantity: "",
    reference: ""
  })
  const [showCustomDescription, setShowCustomDescription] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the data to your backend
    console.log("Inbound transaction:", formData)
    setIsDialogOpen(false)
    // Reset form
    setFormData({
      name: "",
      department: "",
      date: "",
      goodsDescription: "",
      customDescription: "",
      quantity: "",
      reference: ""
    })
    setShowCustomDescription(false)
  }

  const handleGoodsDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, goodsDescription: value }))
    setShowCustomDescription(value === "Others")
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2" title="Go to Dashboard">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Inbound Transactions</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage incoming stock and receipts</p>
          </div>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          INWARD
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Inbound</CardTitle>
            <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleTransactions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sampleTransactions.filter(t => t.status === "pending").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Building className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sampleTransactions.filter(t => t.status === "completed").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sampleTransactions.reduce((sum, t) => sum + t.quantity, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Inbound Transactions</CardTitle>
          <CardDescription>List of all inbound transactions and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Goods Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.name}</TableCell>
                  <TableCell>{transaction.department}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.goodsDescription}</TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>{transaction.reference}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status === "completed" ? "default" :
                        transaction.status === "pending" ? "secondary" : "destructive"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Inward Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Inbound Transaction</DialogTitle>
            <DialogDescription>
              Enter the details for the incoming stock transaction
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Employee Name</Label>
              <Select value={formData.name} onValueChange={(value) => setFormData(prev => ({ ...prev, name: value }))} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee} value={employee}>{employee}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goodsDescription">Goods Description</Label>
              <Select value={formData.goodsDescription} onValueChange={handleGoodsDescriptionChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select goods description" />
                </SelectTrigger>
                <SelectContent>
                  {goodsDescriptions.map((desc) => (
                    <SelectItem key={desc} value={desc}>{desc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showCustomDescription && (
              <div className="space-y-2">
                <Label htmlFor="customDescription">Custom Description</Label>
                <Textarea
                  id="customDescription"
                  value={formData.customDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, customDescription: e.target.value }))}
                  placeholder="Please describe the goods in detail"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="Enter quantity"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Reference</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                placeholder="Enter reference number"
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
