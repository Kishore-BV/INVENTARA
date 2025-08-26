import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Settings, Plus } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Roles & Permissions - Inventara",
  description: "Manage user roles and permissions in your inventory system",
}

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Roles & Permissions</h1>
          <p className="text-[#666666]">Manage user roles and access permissions</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/users/roles/admin">
          <Card className="border-[#D9D9D9] hover:border-[#4B6587] transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Shield className="h-8 w-8 text-[#F4A261]" />
                <Badge className="bg-[#F4A261] text-white">3 Users</Badge>
              </div>
              <CardTitle className="text-[#333333]">Administrator</CardTitle>
              <CardDescription className="text-[#666666]">
                Full system access and management capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-[#666666]">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full mr-2"></div>
                  Full inventory management
                </div>
                <div className="flex items-center text-sm text-[#666666]">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full mr-2"></div>
                  User management
                </div>
                <div className="flex items-center text-sm text-[#666666]">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full mr-2"></div>
                  System configuration
                </div>
                <div className="flex items-center text-sm text-[#666666]">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full mr-2"></div>
                  Reports and analytics
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/users/roles/manager">
          <Card className="border-[#D9D9D9] hover:border-[#4B6587] transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-[#6B8A7A]" />
                <Badge className="bg-[#6B8A7A] text-white">8 Users</Badge>
              </div>
              <CardTitle className="text-[#333333]">Manager</CardTitle>
              <CardDescription className="text-[#666666]">Inventory management and team supervision</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-[#666666]">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full mr-2"></div>
                  Inventory operations
                </div>
                <div className="flex items-center text-sm text-[#666666]">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full mr-2"></div>
                  Staff management
                </div>
                <div className="flex items-center text-sm text-[#666666]">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full mr-2"></div>
                  Purchase orders
                </div>
                <div className="flex items-center text-sm text-[#666666]">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full mr-2"></div>
                  Basic reports
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/users/roles/staff">
          <Card className="border-[#D9D9D9] hover:border-[#4B6587] transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Settings className="h-8 w-8 text-[#E7B10A]" />
                <Badge className="bg-[#E7B10A] text-white">13 Users</Badge>
              </div>
              <CardTitle className="text-[#333333]">Staff</CardTitle>
              <CardDescription className="text-[#666666]">Basic inventory operations and data entry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-[#666666]">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full mr-2"></div>
                  Product management
                </div>
                <div className="flex items-center text-sm text-[#666666]">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full mr-2"></div>
                  Stock transactions
                </div>
                <div className="flex items-center text-sm text-[#666666]">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full mr-2"></div>
                  Attendance tracking
                </div>
                <div className="flex items-center text-sm text-[#666666]">
                  <div className="w-2 h-2 bg-[#D9D9D9] rounded-full mr-2"></div>
                  Limited reports
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="border-[#D9D9D9]">
        <CardHeader>
          <CardTitle className="text-[#333333]">Permission Matrix</CardTitle>
          <CardDescription className="text-[#666666]">Overview of permissions across different roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D9D9D9]">
                  <th className="text-left py-2 text-[#333333]">Permission</th>
                  <th className="text-center py-2 text-[#333333]">Admin</th>
                  <th className="text-center py-2 text-[#333333]">Manager</th>
                  <th className="text-center py-2 text-[#333333]">Staff</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-[#EDEDED]">
                  <td className="py-3 text-[#666666]">View Inventory</td>
                  <td className="text-center">
                    <div className="w-4 h-4 bg-[#6B8A7A] rounded-full mx-auto"></div>
                  </td>
                  <td className="text-center">
                    <div className="w-4 h-4 bg-[#6B8A7A] rounded-full mx-auto"></div>
                  </td>
                  <td className="text-center">
                    <div className="w-4 h-4 bg-[#6B8A7A] rounded-full mx-auto"></div>
                  </td>
                </tr>
                <tr className="border-b border-[#EDEDED]">
                  <td className="py-3 text-[#666666]">Manage Products</td>
                  <td className="text-center">
                    <div className="w-4 h-4 bg-[#6B8A7A] rounded-full mx-auto"></div>
                  </td>
                  <td className="text-center">
                    <div className="w-4 h-4 bg-[#6B8A7A] rounded-full mx-auto"></div>
                  </td>
                  <td className="text-center">
                    <div className="w-4 h-4 bg-[#6B8A7A] rounded-full mx-auto"></div>
                  </td>
                </tr>
                <tr className="border-b border-[#EDEDED]">
                  <td className="py-3 text-[#666666]">Purchase Orders</td>
                  <td className="text-center">
                    <div className="w-4 h-4 bg-[#6B8A7A] rounded-full mx-auto"></div>
                  </td>
                  <td className="text-center">
                    <div className="w-4 h-4 bg-[#6B8A7A] rounded-full mx-auto"></div>
                  </td>
                  <td className="text-center">
                    <div className="w-4 h-4 bg-[#D9D9D9] rounded-full mx-auto"></div>
                  </td>
                </tr>
                <tr className="border-b border-[#EDEDED]">
                  <td className="py-3 text-[#666666]">User Management</td>
                  <td className="text-center">
                    <div className="w-4 h-4 bg-[#6B8A7A] rounded-full mx-auto"></div>
                  </td>
                  <td className="text-center">
                    <div className="w-4 h-4 bg-[#E7B10A] rounded-full mx-auto"></div>
                  </td>
                  <td className="text-center">
                    <div className="w-4 h-4 bg-[#D9D9D9] rounded-full mx-auto"></div>
                  </td>
                </tr>
                <tr className="border-b border-[#EDEDED]">
                  <td className="py-3 text-[#666666]">System Settings</td>
                  <td className="text-center">
                    <div className="w-4 h-4 bg-[#6B8A7A] rounded-full mx-auto"></div>
                  </td>
                  <td className="text-center">
                    <div className="w-4 h-4 bg-[#D9D9D9] rounded-full mx-auto"></div>
                  </td>
                  <td className="text-center">
                    <div className="w-4 h-4 bg-[#D9D9D9] rounded-full mx-auto"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center space-x-6 mt-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#6B8A7A] rounded-full mr-2"></div>
              <span className="text-[#666666]">Full Access</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#E7B10A] rounded-full mr-2"></div>
              <span className="text-[#666666]">Limited Access</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#D9D9D9] rounded-full mr-2"></div>
              <span className="text-[#666666]">No Access</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
