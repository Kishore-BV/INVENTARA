import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Mail, Smartphone, AlertTriangle } from "lucide-react"

export const metadata: Metadata = {
  title: "Notification Settings - Inventara",
  description: "Configure notification preferences and settings",
}

export default function NotificationSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Notification Settings</h1>
          <p className="text-[#666666]">Configure how and when you receive notifications</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">Save Settings</Button>
      </div>

      <div className="grid gap-6">
        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Bell className="h-6 w-6 text-[#6B8A7A]" />
              <div>
                <CardTitle className="text-[#333333]">General Notifications</CardTitle>
                <CardDescription className="text-[#666666]">Configure general notification preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[#333333] font-medium">Enable Notifications</Label>
                <p className="text-sm text-[#666666]">Receive all system notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[#333333] font-medium">Sound Notifications</Label>
                <p className="text-sm text-[#666666]">Play sound for important alerts</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[#333333] font-medium">Desktop Notifications</Label>
                <p className="text-sm text-[#666666]">Show desktop notifications</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Mail className="h-6 w-6 text-[#F4A261]" />
              <div>
                <CardTitle className="text-[#333333]">Email Notifications</CardTitle>
                <CardDescription className="text-[#666666]">Configure email notification settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#333333]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  className="border-[#D9D9D9] focus:border-[#4B6587]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency" className="text-[#333333]">
                  Email Frequency
                </Label>
                <Select>
                  <SelectTrigger className="border-[#D9D9D9]">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#D9D9D9]">
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#333333] font-medium">Low Stock Alerts</Label>
                  <p className="text-sm text-[#666666]">Email when products are low in stock</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#333333] font-medium">Purchase Order Updates</Label>
                  <p className="text-sm text-[#666666]">Email for purchase order status changes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#333333] font-medium">User Activity</Label>
                  <p className="text-sm text-[#666666]">Email for new user registrations</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#333333] font-medium">System Maintenance</Label>
                  <p className="text-sm text-[#666666]">Email for system updates and maintenance</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-[#E7B10A]" />
              <div>
                <CardTitle className="text-[#333333]">Alert Thresholds</CardTitle>
                <CardDescription className="text-[#666666]">Configure when alerts are triggered</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lowStock" className="text-[#333333]">
                  Low Stock Threshold
                </Label>
                <Input
                  id="lowStock"
                  type="number"
                  placeholder="10"
                  className="border-[#D9D9D9] focus:border-[#4B6587]"
                />
                <p className="text-xs text-[#666666]">Alert when stock falls below this number</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="criticalStock" className="text-[#333333]">
                  Critical Stock Threshold
                </Label>
                <Input
                  id="criticalStock"
                  type="number"
                  placeholder="5"
                  className="border-[#D9D9D9] focus:border-[#4B6587]"
                />
                <p className="text-xs text-[#666666]">Critical alert threshold</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="overdueOrders" className="text-[#333333]">
                  Overdue Orders (Days)
                </Label>
                <Input
                  id="overdueOrders"
                  type="number"
                  placeholder="7"
                  className="border-[#D9D9D9] focus:border-[#4B6587]"
                />
                <p className="text-xs text-[#666666]">Alert for overdue purchase orders</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inactiveUsers" className="text-[#333333]">
                  Inactive Users (Days)
                </Label>
                <Input
                  id="inactiveUsers"
                  type="number"
                  placeholder="30"
                  className="border-[#D9D9D9] focus:border-[#4B6587]"
                />
                <p className="text-xs text-[#666666]">Alert for inactive user accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Smartphone className="h-6 w-6 text-[#4B6587]" />
              <div>
                <CardTitle className="text-[#333333]">Mobile Notifications</CardTitle>
                <CardDescription className="text-[#666666]">Configure mobile app notification settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[#333333] font-medium">Push Notifications</Label>
                <p className="text-sm text-[#666666]">Receive push notifications on mobile</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[#333333] font-medium">Critical Alerts Only</Label>
                <p className="text-sm text-[#666666]">Only receive high-priority alerts</p>
              </div>
              <Switch />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quietHours" className="text-[#333333]">
                Quiet Hours
              </Label>
              <div className="grid gap-2 md:grid-cols-2">
                <Input type="time" defaultValue="22:00" className="border-[#D9D9D9] focus:border-[#4B6587]" />
                <Input type="time" defaultValue="08:00" className="border-[#D9D9D9] focus:border-[#4B6587]" />
              </div>
              <p className="text-xs text-[#666666]">No notifications during these hours</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
