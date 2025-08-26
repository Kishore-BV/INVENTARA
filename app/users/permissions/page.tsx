import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Database, Users, Settings, BarChart3, Package } from "lucide-react"

export const metadata: Metadata = {
  title: "Permissions - Inventara",
  description: "Manage system permissions and access controls",
}

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Permissions</h1>
          <p className="text-[#666666]">Configure system permissions and access controls</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">Save Changes</Button>
      </div>

      <div className="grid gap-6">
        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Database className="h-6 w-6 text-[#6B8A7A]" />
              <div>
                <CardTitle className="text-[#333333]">Inventory Management</CardTitle>
                <CardDescription className="text-[#666666]">
                  Control access to inventory operations and data
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">View Products</p>
                    <p className="text-sm text-[#666666]">Access to product listings</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Create Products</p>
                    <p className="text-sm text-[#666666]">Add new products to inventory</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Edit Products</p>
                    <p className="text-sm text-[#666666]">Modify existing product details</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Delete Products</p>
                    <p className="text-sm text-[#666666]">Remove products from system</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Stock Adjustments</p>
                    <p className="text-sm text-[#666666]">Modify stock levels</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Category Management</p>
                    <p className="text-sm text-[#666666]">Create and edit categories</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Bulk Operations</p>
                    <p className="text-sm text-[#666666]">Mass update products</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Import/Export</p>
                    <p className="text-sm text-[#666666]">Data import and export</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Package className="h-6 w-6 text-[#F4A261]" />
              <div>
                <CardTitle className="text-[#333333]">Purchase & Procurement</CardTitle>
                <CardDescription className="text-[#666666]">
                  Manage purchase orders and supplier relationships
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Create Purchase Orders</p>
                    <p className="text-sm text-[#666666]">Generate new purchase orders</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Approve Orders</p>
                    <p className="text-sm text-[#666666]">Approve purchase orders</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Manage Suppliers</p>
                    <p className="text-sm text-[#666666]">Add and edit supplier details</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Receive Goods</p>
                    <p className="text-sm text-[#666666]">Process incoming shipments</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Quality Control</p>
                    <p className="text-sm text-[#666666]">Perform quality checks</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Return Management</p>
                    <p className="text-sm text-[#666666]">Handle returns to suppliers</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-[#E7B10A]" />
              <div>
                <CardTitle className="text-[#333333]">User Management</CardTitle>
                <CardDescription className="text-[#666666]">Control user accounts and team management</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">View Users</p>
                    <p className="text-sm text-[#666666]">Access user listings</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Create Users</p>
                    <p className="text-sm text-[#666666]">Add new user accounts</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Edit Users</p>
                    <p className="text-sm text-[#666666]">Modify user details</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Assign Roles</p>
                    <p className="text-sm text-[#666666]">Change user roles</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Deactivate Users</p>
                    <p className="text-sm text-[#666666]">Disable user accounts</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Attendance Management</p>
                    <p className="text-sm text-[#666666]">Manage team attendance</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-6 w-6 text-[#4B6587]" />
              <div>
                <CardTitle className="text-[#333333]">Reports & Analytics</CardTitle>
                <CardDescription className="text-[#666666]">
                  Access to reports and business intelligence
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">View Reports</p>
                    <p className="text-sm text-[#666666]">Access standard reports</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Export Data</p>
                    <p className="text-sm text-[#666666]">Download report data</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Analytics Dashboard</p>
                    <p className="text-sm text-[#666666]">Advanced analytics view</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Custom Reports</p>
                    <p className="text-sm text-[#666666]">Create custom reports</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Financial Reports</p>
                    <p className="text-sm text-[#666666]">Access financial data</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Audit Logs</p>
                    <p className="text-sm text-[#666666]">View system audit trails</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Settings className="h-6 w-6 text-[#666666]" />
              <div>
                <CardTitle className="text-[#333333]">System Administration</CardTitle>
                <CardDescription className="text-[#666666]">System configuration and maintenance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">System Settings</p>
                    <p className="text-sm text-[#666666]">Configure system parameters</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Integration Management</p>
                    <p className="text-sm text-[#666666]">Manage third-party integrations</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Backup & Restore</p>
                    <p className="text-sm text-[#666666]">System backup operations</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">Security Settings</p>
                    <p className="text-sm text-[#666666]">Configure security policies</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
