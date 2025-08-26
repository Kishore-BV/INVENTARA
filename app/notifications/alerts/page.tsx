import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "System Alerts - Inventara",
  description: "View and manage system alerts and notifications",
}

const alerts = [
  {
    id: 1,
    type: "Low Stock",
    message: "Product ABC123 is below minimum threshold",
    severity: "High",
    status: "Active",
    created: "2024-01-15 10:30 AM",
    acknowledged: false,
  },
  {
    id: 2,
    type: "System",
    message: "Database backup completed successfully",
    severity: "Info",
    status: "Resolved",
    created: "2024-01-15 09:00 AM",
    acknowledged: true,
  },
  {
    id: 3,
    type: "User",
    message: "Failed login attempt detected",
    severity: "Medium",
    status: "Active",
    created: "2024-01-15 08:45 AM",
    acknowledged: false,
  },
  {
    id: 4,
    type: "Inventory",
    message: "Stock adjustment requires approval",
    severity: "Medium",
    status: "Pending",
    created: "2024-01-15 08:15 AM",
    acknowledged: true,
  },
  {
    id: 5,
    type: "Purchase",
    message: "Purchase order PO-2024-001 overdue",
    severity: "High",
    status: "Active",
    created: "2024-01-15 07:30 AM",
    acknowledged: false,
  },
]

export default function SystemAlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">System Alerts</h1>
          <p className="text-[#666666]">Monitor and manage system alerts and notifications</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">Mark All Read</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#F4A261]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">3</div>
            <p className="text-xs text-[#666666]">Requiring attention</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">High Priority</CardTitle>
            <XCircle className="h-4 w-4 text-[#E7B10A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">2</div>
            <p className="text-xs text-[#666666]">Critical issues</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-[#6B8A7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">1</div>
            <p className="text-xs text-[#666666]">Today</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Pending</CardTitle>
            <Clock className="h-4 w-4 text-[#4B6587]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">1</div>
            <p className="text-xs text-[#666666]">Awaiting action</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#D9D9D9]">
        <CardHeader>
          <CardTitle className="text-[#333333]">Alert Management</CardTitle>
          <CardDescription className="text-[#666666]">View and manage all system alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666] h-4 w-4" />
              <Input placeholder="Search alerts..." className="pl-10 border-[#D9D9D9] focus:border-[#4B6587]" />
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
                  <TableHead className="text-[#333333]">Type</TableHead>
                  <TableHead className="text-[#333333]">Message</TableHead>
                  <TableHead className="text-[#333333]">Severity</TableHead>
                  <TableHead className="text-[#333333]">Status</TableHead>
                  <TableHead className="text-[#333333]">Created</TableHead>
                  <TableHead className="text-[#333333]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id} className="hover:bg-[#F8F9FA]">
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          alert.type === "Low Stock"
                            ? "bg-[#E7B10A] text-white"
                            : alert.type === "System"
                              ? "bg-[#4B6587] text-white"
                              : alert.type === "User"
                                ? "bg-[#F4A261] text-white"
                                : alert.type === "Inventory"
                                  ? "bg-[#6B8A7A] text-white"
                                  : "bg-[#D9D9D9] text-[#333333]"
                        }
                      >
                        {alert.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#333333]">{alert.message}</TableCell>
                    <TableCell>
                      <Badge
                        variant={alert.severity === "High" ? "destructive" : "secondary"}
                        className={
                          alert.severity === "High"
                            ? "bg-red-500 text-white"
                            : alert.severity === "Medium"
                              ? "bg-[#E7B10A] text-white"
                              : "bg-[#6B8A7A] text-white"
                        }
                      >
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          alert.status === "Active"
                            ? "bg-[#F4A261] text-white"
                            : alert.status === "Resolved"
                              ? "bg-[#6B8A7A] text-white"
                              : "bg-[#E7B10A] text-white"
                        }
                      >
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666]">{alert.created}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {!alert.acknowledged && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent"
                          >
                            Acknowledge
                          </Button>
                        )}
                        {alert.status === "Active" && (
                          <Button size="sm" className="bg-[#6B8A7A] hover:bg-[#5a7a6a] text-white">
                            Resolve
                          </Button>
                        )}
                      </div>
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
