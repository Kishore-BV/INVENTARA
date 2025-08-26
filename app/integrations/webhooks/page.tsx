import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Webhook, Plus, MoreHorizontal, Play, Pause } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export const metadata: Metadata = {
  title: "Webhooks - Inventara",
  description: "Manage webhook endpoints and event notifications",
}

const webhooks = [
  {
    id: 1,
    name: "Inventory Update Webhook",
    url: "https://api.example.com/webhooks/inventory",
    events: ["product.created", "product.updated", "stock.changed"],
    status: "Active",
    lastTriggered: "5 minutes ago",
    successRate: 98.5,
  },
  {
    id: 2,
    name: "Order Notification",
    url: "https://notifications.mystore.com/orders",
    events: ["order.created", "order.shipped"],
    status: "Active",
    lastTriggered: "1 hour ago",
    successRate: 100,
  },
  {
    id: 3,
    name: "Low Stock Alert",
    url: "https://alerts.company.com/stock",
    events: ["stock.low", "stock.critical"],
    status: "Paused",
    lastTriggered: "2 days ago",
    successRate: 95.2,
  },
  {
    id: 4,
    name: "User Activity Webhook",
    url: "https://analytics.myapp.com/users",
    events: ["user.login", "user.created"],
    status: "Error",
    lastTriggered: "3 hours ago",
    successRate: 87.3,
  },
]

export default function WebhooksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Webhooks</h1>
          <p className="text-[#666666]">Manage webhook endpoints and event notifications</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Create Webhook
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Total Webhooks</CardTitle>
            <Webhook className="h-4 w-4 text-[#6B8A7A]" />
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
            <p className="text-xs text-[#666666]">Currently active</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Events Today</CardTitle>
            <Play className="h-4 w-4 text-[#F4A261]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">247</div>
            <p className="text-xs text-[#666666]">Events triggered</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Success Rate</CardTitle>
            <Badge variant="secondary" className="bg-[#6B8A7A] text-white">
              96.8%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">96.8%</div>
            <p className="text-xs text-[#666666]">Average success</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#D9D9D9]">
        <CardHeader>
          <CardTitle className="text-[#333333]">Webhook Management</CardTitle>
          <CardDescription className="text-[#666666]">Configure and monitor webhook endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666] h-4 w-4" />
              <Input placeholder="Search webhooks..." className="pl-10 border-[#D9D9D9] focus:border-[#4B6587]" />
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
                  <TableHead className="text-[#333333]">Webhook Name</TableHead>
                  <TableHead className="text-[#333333]">URL</TableHead>
                  <TableHead className="text-[#333333]">Events</TableHead>
                  <TableHead className="text-[#333333]">Status</TableHead>
                  <TableHead className="text-[#333333]">Success Rate</TableHead>
                  <TableHead className="text-[#333333]">Last Triggered</TableHead>
                  <TableHead className="text-[#333333]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id} className="hover:bg-[#F8F9FA]">
                    <TableCell className="font-medium text-[#333333]">{webhook.name}</TableCell>
                    <TableCell className="text-[#666666] font-mono text-sm max-w-xs truncate">{webhook.url}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.slice(0, 2).map((event) => (
                          <Badge key={event} variant="secondary" className="bg-[#E7B10A] text-white text-xs">
                            {event}
                          </Badge>
                        ))}
                        {webhook.events.length > 2 && (
                          <Badge variant="secondary" className="bg-[#D9D9D9] text-[#333333] text-xs">
                            +{webhook.events.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          webhook.status === "Active"
                            ? "bg-[#6B8A7A] text-white"
                            : webhook.status === "Error"
                              ? "bg-red-500 text-white"
                              : "bg-[#E7B10A] text-white"
                        }
                      >
                        {webhook.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666]">{webhook.successRate}%</TableCell>
                    <TableCell className="text-[#666666]">{webhook.lastTriggered}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border-[#D9D9D9]">
                          <DropdownMenuItem className="hover:bg-[#F8F9FA]">
                            <Play className="mr-2 h-4 w-4" />
                            Test Webhook
                          </DropdownMenuItem>
                          {webhook.status === "Active" ? (
                            <DropdownMenuItem className="hover:bg-[#F8F9FA]">
                              <Pause className="mr-2 h-4 w-4" />
                              Pause
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="hover:bg-[#F8F9FA]">
                              <Play className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                          )}
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
