import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Database, ShoppingCart, BarChart3, UserCog } from "lucide-react"

export const metadata: Metadata = {
  title: "Manager Role - Inventara",
  description: "Manager role permissions and settings",
}

export default function ManagerRolePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Manager Role</h1>
          <p className="text-[#666666]">Inventory management and team supervision</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">Edit Role</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-[#6B8A7A]" />
              <div>
                <CardTitle className="text-[#333333]">Role Overview</CardTitle>
                <CardDescription className="text-[#666666]">Manager role details and statistics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Total Users</span>
              <Badge className="bg-[#6B8A7A] text-white">8</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Permission Level</span>
              <Badge className="bg-[#E7B10A] text-white">Management</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Created</span>
              <span className="text-[#333333]">System Default</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Last Modified</span>
              <span className="text-[#333333]">2 weeks ago</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <CardTitle className="text-[#333333]">Recent Activity</CardTitle>
            <CardDescription className="text-[#666666]">Recent actions by managers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
              <div>
                <p className="text-sm text-[#333333]">Purchase order approved by Sarah Johnson</p>
                <p className="text-xs text-[#666666]">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#F4A261] rounded-full"></div>
              <div>
                <p className="text-sm text-[#333333]">Stock adjustment by Mike Chen</p>
                <p className="text-xs text-[#666666]">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#E7B10A] rounded-full"></div>
              <div>
                <p className="text-sm text-[#333333]">Team schedule updated by Lisa Wang</p>
                <p className="text-xs text-[#666666]">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#D9D9D9]">
        <CardHeader>
          <CardTitle className="text-[#333333]">Permissions</CardTitle>
          <CardDescription className="text-[#666666]">Detailed permissions for the Manager role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-[#6B8A7A]" />
                <h4 className="font-medium text-[#333333]">Inventory Management</h4>
              </div>
              <div className="space-y-2 ml-7">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">View all products</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Create/edit products</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#E7B10A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Limited delete access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Stock adjustments</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-[#F4A261]" />
                <h4 className="font-medium text-[#333333]">Purchase Orders</h4>
              </div>
              <div className="space-y-2 ml-7">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Create orders</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Approve orders</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Manage suppliers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Receiving goods</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <UserCog className="h-5 w-5 text-[#E7B10A]" />
                <h4 className="font-medium text-[#333333]">Team Management</h4>
              </div>
              <div className="space-y-2 ml-7">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">View team members</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#E7B10A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Limited user editing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Attendance tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Schedule management</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-[#4B6587]" />
                <h4 className="font-medium text-[#333333]">Reports</h4>
              </div>
              <div className="space-y-2 ml-7">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Inventory reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Team performance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#E7B10A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Limited analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#D9D9D9] rounded-full"></div>
                  <span className="text-sm text-[#666666]">No system reports</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
