import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Mail, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export const metadata: Metadata = {
  title: "Email Templates - Inventara",
  description: "Manage email templates for notifications",
}

const templates = [
  {
    id: 1,
    name: "Low Stock Alert",
    subject: "Low Stock Alert: {{product_name}}",
    type: "System",
    status: "Active",
    lastUsed: "2024-01-15",
    usage: 45,
  },
  {
    id: 2,
    name: "Purchase Order Approval",
    subject: "Purchase Order {{po_number}} Requires Approval",
    type: "Procurement",
    status: "Active",
    lastUsed: "2024-01-14",
    usage: 23,
  },
  {
    id: 3,
    name: "Welcome New User",
    subject: "Welcome to Inventara - {{user_name}}",
    type: "User",
    status: "Active",
    lastUsed: "2024-01-13",
    usage: 8,
  },
  {
    id: 4,
    name: "Stock Adjustment Notice",
    subject: "Stock Adjustment Notification",
    type: "Inventory",
    status: "Draft",
    lastUsed: "Never",
    usage: 0,
  },
  {
    id: 5,
    name: "Supplier Payment Due",
    subject: "Payment Due: Invoice {{invoice_number}}",
    type: "Finance",
    status: "Active",
    lastUsed: "2024-01-12",
    usage: 12,
  },
]

export default function EmailTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Email Templates</h1>
          <p className="text-[#666666]">Create and manage email templates for notifications</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Total Templates</CardTitle>
            <Mail className="h-4 w-4 text-[#6B8A7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">15</div>
            <p className="text-xs text-[#666666]">All templates</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Active</CardTitle>
            <Badge variant="secondary" className="bg-[#6B8A7A] text-white">
              Live
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">12</div>
            <p className="text-xs text-[#666666]">Currently in use</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Draft</CardTitle>
            <Badge variant="secondary" className="bg-[#E7B10A] text-white">
              Draft
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">3</div>
            <p className="text-xs text-[#666666]">Being edited</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Sent Today</CardTitle>
            <Badge variant="secondary" className="bg-[#F4A261] text-white">
              Today
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">28</div>
            <p className="text-xs text-[#666666]">Emails sent</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#D9D9D9]">
        <CardHeader>
          <CardTitle className="text-[#333333]">Template Management</CardTitle>
          <CardDescription className="text-[#666666]">Create, edit, and manage email templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666] h-4 w-4" />
              <Input placeholder="Search templates..." className="pl-10 border-[#D9D9D9] focus:border-[#4B6587]" />
            </div>
            <Button variant="outline" className="border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="rounded-md border border-[#D9D9D9]">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F8F9FA]">
                  <TableHead className="text-[#333333]">Template Name</TableHead>
                  <TableHead className="text-[#333333]">Subject</TableHead>
                  <TableHead className="text-[#333333]">Type</TableHead>
                  <TableHead className="text-[#333333]">Status</TableHead>
                  <TableHead className="text-[#333333]">Usage</TableHead>
                  <TableHead className="text-[#333333]">Last Used</TableHead>
                  <TableHead className="text-[#333333]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id} className="hover:bg-[#F8F9FA]">
                    <TableCell className="font-medium text-[#333333]">{template.name}</TableCell>
                    <TableCell className="text-[#666666]">{template.subject}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          template.type === "System"
                            ? "bg-[#4B6587] text-white"
                            : template.type === "Procurement"
                              ? "bg-[#6B8A7A] text-white"
                              : template.type === "User"
                                ? "bg-[#F4A261] text-white"
                                : template.type === "Inventory"
                                  ? "bg-[#E7B10A] text-white"
                                  : "bg-[#D9D9D9] text-[#333333]"
                        }
                      >
                        {template.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={template.status === "Active" ? "bg-[#6B8A7A] text-white" : "bg-[#E7B10A] text-white"}
                      >
                        {template.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666]">{template.usage}</TableCell>
                    <TableCell className="text-[#666666]">{template.lastUsed}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border-[#D9D9D9]">
                          <DropdownMenuItem className="hover:bg-[#F8F9FA]">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Template
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-[#F8F9FA]">
                            <Mail className="mr-2 h-4 w-4" />
                            Send Test
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-[#F8F9FA] text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Template
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
