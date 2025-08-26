import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Link, Plus, Key, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export const metadata: Metadata = {
  title: "API Connections - Inventara",
  description: "Manage API connections and endpoints",
}

const apiConnections = [
  {
    id: 1,
    name: "QuickBooks API",
    endpoint: "https://api.quickbooks.com/v3",
    status: "Active",
    lastSync: "2 minutes ago",
    requests: 1247,
  },
  {
    id: 2,
    name: "Shopify API",
    endpoint: "https://mystore.myshopify.com/admin/api",
    status: "Active",
    lastSync: "5 minutes ago",
    requests: 892,
  },
  {
    id: 3,
    name: "WooCommerce API",
    endpoint: "https://mystore.com/wp-json/wc/v3",
    status: "Inactive",
    lastSync: "2 days ago",
    requests: 234,
  },
  {
    id: 4,
    name: "Salesforce API",
    endpoint: "https://mycompany.salesforce.com/services",
    status: "Error",
    lastSync: "1 hour ago",
    requests: 567,
  },
]

export default function APIConnectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">API Connections</h1>
          <p className="text-[#666666]">Manage API endpoints and authentication</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add API Connection
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Total APIs</CardTitle>
            <Link className="h-4 w-4 text-[#6B8A7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">12</div>
            <p className="text-xs text-[#666666]">Configured endpoints</p>
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
            <div className="text-2xl font-bold text-[#333333]">8</div>
            <p className="text-xs text-[#666666]">Currently running</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Requests Today</CardTitle>
            <Key className="h-4 w-4 text-[#F4A261]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">2,940</div>
            <p className="text-xs text-[#666666]">API calls made</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Success Rate</CardTitle>
            <Badge variant="secondary" className="bg-[#6B8A7A] text-white">
              99.2%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">99.2%</div>
            <p className="text-xs text-[#666666]">Success rate</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#D9D9D9]">
        <CardHeader>
          <CardTitle className="text-[#333333]">API Connection Management</CardTitle>
          <CardDescription className="text-[#666666]">Configure and monitor API connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666] h-4 w-4" />
              <Input
                placeholder="Search API connections..."
                className="pl-10 border-[#D9D9D9] focus:border-[#4B6587]"
              />
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
                  <TableHead className="text-[#333333]">API Name</TableHead>
                  <TableHead className="text-[#333333]">Endpoint</TableHead>
                  <TableHead className="text-[#333333]">Status</TableHead>
                  <TableHead className="text-[#333333]">Last Sync</TableHead>
                  <TableHead className="text-[#333333]">Requests</TableHead>
                  <TableHead className="text-[#333333]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiConnections.map((api) => (
                  <TableRow key={api.id} className="hover:bg-[#F8F9FA]">
                    <TableCell className="font-medium text-[#333333]">{api.name}</TableCell>
                    <TableCell className="text-[#666666] font-mono text-sm">{api.endpoint}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          api.status === "Active"
                            ? "bg-[#6B8A7A] text-white"
                            : api.status === "Error"
                              ? "bg-red-500 text-white"
                              : "bg-[#D9D9D9] text-[#333333]"
                        }
                      >
                        {api.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666]">{api.lastSync}</TableCell>
                    <TableCell className="text-[#666666]">{api.requests.toLocaleString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border-[#D9D9D9]">
                          <DropdownMenuItem className="hover:bg-[#F8F9FA]">
                            <Key className="mr-2 h-4 w-4" />
                            Manage Keys
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-[#F8F9FA]">
                            <Link className="mr-2 h-4 w-4" />
                            Test Connection
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
