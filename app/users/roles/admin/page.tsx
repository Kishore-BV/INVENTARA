import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Settings, Database, BarChart3, UserCog } from "lucide-react"

export const metadata: Metadata = {
  title: "Administrator Role - Inventara",
  description: "Administrator role permissions and settings",
}

export default function AdminRolePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Administrator Role</h1>
          <p className="text-[#666666]">Full system access and management capabilities</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">Edit Role</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-[#F4A261]" />
              <div>
                <CardTitle className="text-[#333333]">Role Overview</CardTitle>
                <CardDescription className="text-[#666666]">Administrator role details and statistics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Total Users</span>
              <Badge className="bg-[#F4A261] text-white">3</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Permission Level</span>
              <Badge className="bg-[#6B8A7A] text-white">Full Access</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Created</span>
              <span className="text-[#333333]">System Default</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Last Modified</span>
              <span className="text-[#333333]">Never</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <CardTitle className="text-[#333333]">Assigned Users</CardTitle>
            <CardDescription className="text-[#666666]">Users currently assigned to this role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#4B6587] rounded-full flex items-center justify-center text-white text-sm">
                JS
              </div>
              <div>
                <p className="font-medium text-[#333333]">John Smith</p>
                <p className="text-sm text-[#666666]">john.smith@company.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#6B8A7A] rounded-full flex items-center justify-center text-white text-sm">
                AD
              </div>
              <div>
                <p className="font-medium text-[#333333]">Alice Davis</p>
                <p className="text-sm text-[#666666]">alice.davis@company.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#F4A261] rounded-full flex items-center justify-center text-white text-sm">
                MT
              </div>
              <div>
                <p className="font-medium text-[#333333]">Mark Thompson</p>
                <p className="text-sm text-[#666666]">mark.thompson@company.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#D9D9D9]">
        <CardHeader>
          <CardTitle className="text-[#333333]">Permissions</CardTitle>
          <CardDescription className="text-[#666666]">Detailed permissions for the Administrator role</CardDescription>
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
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Delete products</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Manage categories</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <UserCog className="h-5 w-5 text-[#F4A261]" />
                <h4 className="font-medium text-[#333333]">User Management</h4>
              </div>
              <div className="space-y-2 ml-7">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Create users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Edit user details</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Assign roles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Deactivate users</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-[#E7B10A]" />
                <h4 className="font-medium text-[#333333]">Reports & Analytics</h4>
              </div>
              <div className="space-y-2 ml-7">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">View all reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Export data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Analytics dashboard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Custom reports</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-[#4B6587]" />
                <h4 className="font-medium text-[#333333]">System Settings</h4>
              </div>
              <div className="space-y-2 ml-7">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">System configuration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Integration settings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Backup & restore</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Security settings</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
