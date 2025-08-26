import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, UserPlus, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export const metadata: Metadata = {
  title: "All Users - Inventara",
  description: "View and manage all users in your inventory system",
}

const users = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Manager",
    status: "Active",
    lastLogin: "1 day ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike.chen@company.com",
    role: "Staff",
    status: "Active",
    lastLogin: "3 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@company.com",
    role: "Staff",
    status: "Inactive",
    lastLogin: "1 week ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 5,
    name: "Robert Wilson",
    email: "robert.wilson@company.com",
    role: "Manager",
    status: "Pending",
    lastLogin: "Never",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export default function AllUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">All Users</h1>
          <p className="text-[#666666]">Manage all user accounts and their details</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card className="border-[#D9D9D9]">
        <CardHeader>
          <CardTitle className="text-[#333333]">User Management</CardTitle>
          <CardDescription className="text-[#666666]">View and manage all users in your system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666] h-4 w-4" />
              <Input placeholder="Search users..." className="pl-10 border-[#D9D9D9] focus:border-[#4B6587]" />
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
                  <TableHead className="text-[#333333]">User</TableHead>
                  <TableHead className="text-[#333333]">Role</TableHead>
                  <TableHead className="text-[#333333]">Status</TableHead>
                  <TableHead className="text-[#333333]">Last Login</TableHead>
                  <TableHead className="text-[#333333]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-[#F8F9FA]">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback className="bg-[#6B8A7A] text-white">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-[#333333]">{user.name}</p>
                          <p className="text-sm text-[#666666]">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === "Admin" ? "default" : "secondary"}
                        className={
                          user.role === "Admin"
                            ? "bg-[#F4A261] text-white"
                            : user.role === "Manager"
                              ? "bg-[#6B8A7A] text-white"
                              : "bg-[#D9D9D9] text-[#333333]"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "Active" ? "default" : "secondary"}
                        className={
                          user.status === "Active"
                            ? "bg-[#6B8A7A] text-white"
                            : user.status === "Pending"
                              ? "bg-[#E7B10A] text-white"
                              : "bg-[#D9D9D9] text-[#333333]"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666]">{user.lastLogin}</TableCell>
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
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-[#F8F9FA] text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
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
