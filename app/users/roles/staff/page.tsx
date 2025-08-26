import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Database, Clock, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Staff Role - Inventara",
  description: "Staff role permissions and settings",
}

export default function StaffRolePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Staff Role</h1>
          <p className="text-[#666666]">Basic inventory operations and data entry</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">Edit Role</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8 text-[#E7B10A]" />
              <div>
                <CardTitle className="text-[#333333]">Role Overview</CardTitle>
                <CardDescription className="text-[#666666]">Staff role details and statistics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Total Users</span>
              <Badge className="bg-[#E7B10A] text-white">13</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Permission Level</span>
              <Badge className="bg-[#D9D9D9] text-[#333333]">Basic</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Created</span>
              <span className="text-[#333333]">System Default</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Last Modified</span>
              <span className="text-[#333333]">1 month ago</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <CardTitle className="text-[#333333]">Daily Tasks</CardTitle>
            <CardDescription className="text-[#666666]">Common tasks performed by staff members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
              <div>
                <p className="text-sm text-[#333333]">Product data entry and updates</p>
                <p className="text-xs text-[#666666]">Most common task</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#F4A261] rounded-full"></div>
              <div>
                <p className="text-sm text-[#333333]">Stock level monitoring</p>
                <p className="text-xs text-[#666666]">Daily responsibility</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#E7B10A] rounded-full"></div>
              <div>
                <p className="text-sm text-[#333333]">Attendance check-in/out</p>
                <p className="text-xs text-[#666666]">Required daily</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#D9D9D9]">
        <CardHeader>
          <CardTitle className="text-[#333333]">Permissions</CardTitle>
          <CardDescription className="text-[#666666]">Detailed permissions for the Staff role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-[#6B8A7A]" />
                <h4 className="font-medium text-[#333333]">Product Management</h4>
              </div>
              <div className="space-y-2 ml-7">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">View products</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Add new products</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Edit product details</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#D9D9D9] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Delete products</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-[#F4A261]" />
                <h4 className="font-medium text-[#333333]">Stock Transactions</h4>
              </div>
              <div className="space-y-2 ml-7">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Record inbound stock</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Record outbound stock</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#E7B10A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Limited adjustments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#D9D9D9] rounded-full"></div>
                  <span className="text-sm text-[#666666]">No bulk operations</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-[#E7B10A]" />
                <h4 className="font-medium text-[#333333]">Attendance</h4>
              </div>
              <div className="space-y-2 ml-7">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Check-in/Check-out</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">View own attendance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#E7B10A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Request time off</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#D9D9D9] rounded-full"></div>
                  <span className="text-sm text-[#666666]">No team attendance</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-[#4B6587]" />
                <h4 className="font-medium text-[#333333]">Reports</h4>
              </div>
              <div className="space-y-2 ml-7">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#E7B10A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Basic stock reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#E7B10A] rounded-full"></div>
                  <span className="text-sm text-[#666666]">Own activity log</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#D9D9D9] rounded-full"></div>
                  <span className="text-sm text-[#666666]">No analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#D9D9D9] rounded-full"></div>
                  <span className="text-sm text-[#666666]">No export access</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
