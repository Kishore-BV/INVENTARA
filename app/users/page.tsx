import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, Shield, Settings } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Users - Inventara",
  description: "Manage users and team members in your inventory system",
}

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Users</h1>
          <p className="text-[#666666]">Manage your team members and user accounts</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Total Users</CardTitle>
            <Users className="h-4 w-4 text-[#6B8A7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">24</div>
            <p className="text-xs text-[#666666]">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Active Users</CardTitle>
            <Badge variant="secondary" className="bg-[#6B8A7A] text-white">
              Active
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">22</div>
            <p className="text-xs text-[#666666]">91.7% active rate</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Admins</CardTitle>
            <Shield className="h-4 w-4 text-[#F4A261]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">3</div>
            <p className="text-xs text-[#666666]">System administrators</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Pending</CardTitle>
            <Settings className="h-4 w-4 text-[#E7B10A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">2</div>
            <p className="text-xs text-[#666666]">Awaiting activation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <CardTitle className="text-[#333333]">Quick Actions</CardTitle>
            <CardDescription className="text-[#666666]">Common user management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/users/all">
              <Button
                variant="outline"
                className="w-full justify-start border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent"
              >
                <Users className="mr-2 h-4 w-4" />
                View All Users
              </Button>
            </Link>
            <Link href="/users/roles">
              <Button
                variant="outline"
                className="w-full justify-start border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent"
              >
                <Shield className="mr-2 h-4 w-4" />
                Manage Roles & Permissions
              </Button>
            </Link>
            <Link href="/users/permissions">
              <Button
                variant="outline"
                className="w-full justify-start border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent"
              >
                <Settings className="mr-2 h-4 w-4" />
                Permission Settings
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <CardTitle className="text-[#333333]">Recent Activity</CardTitle>
            <CardDescription className="text-[#666666]">Latest user management activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-[#333333]">New user Sarah Johnson added</p>
                <p className="text-xs text-[#666666]">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-[#F4A261] rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-[#333333]">Role updated for Mike Chen</p>
                <p className="text-xs text-[#666666]">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-[#E7B10A] rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-[#333333]">Permission granted to warehouse team</p>
                <p className="text-xs text-[#666666]">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
