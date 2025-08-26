import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, Mail, Settings } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Notifications - Inventara",
  description: "Manage system notifications and alerts",
}

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Notifications</h1>
          <p className="text-[#666666]">Manage system notifications and communication settings</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">
          <Settings className="mr-2 h-4 w-4" />
          Configure
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-[#F4A261]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">12</div>
            <p className="text-xs text-[#666666]">Requiring attention</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#E7B10A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">8</div>
            <p className="text-xs text-[#666666]">Products below threshold</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Email Templates</CardTitle>
            <Mail className="h-4 w-4 text-[#6B8A7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">15</div>
            <p className="text-xs text-[#666666]">Active templates</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Sent Today</CardTitle>
            <Badge variant="secondary" className="bg-[#6B8A7A] text-white">
              Today
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">47</div>
            <p className="text-xs text-[#666666]">Notifications sent</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <CardTitle className="text-[#333333]">Quick Actions</CardTitle>
            <CardDescription className="text-[#666666]">Common notification management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/notifications/alerts">
              <Button
                variant="outline"
                className="w-full justify-start border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                System Alerts
              </Button>
            </Link>
            <Link href="/notifications/templates">
              <Button
                variant="outline"
                className="w-full justify-start border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email Templates
              </Button>
            </Link>
            <Link href="/notifications/settings">
              <Button
                variant="outline"
                className="w-full justify-start border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent"
              >
                <Settings className="mr-2 h-4 w-4" />
                Notification Settings
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <CardTitle className="text-[#333333]">Recent Notifications</CardTitle>
            <CardDescription className="text-[#666666]">Latest system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-[#E7B10A] rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-[#333333]">Low stock alert: Product ABC123</p>
                <p className="text-xs text-[#666666]">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-[#333333]">Purchase order PO-2024-001 approved</p>
                <p className="text-xs text-[#666666]">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-[#F4A261] rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-[#333333]">New user registration: Sarah Johnson</p>
                <p className="text-xs text-[#666666]">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-[#4B6587] rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-[#333333]">System backup completed successfully</p>
                <p className="text-xs text-[#666666]">3 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
