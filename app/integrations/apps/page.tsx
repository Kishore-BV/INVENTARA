import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Plug, Download, Settings } from "lucide-react"

export const metadata: Metadata = {
  title: "Third-party Apps - Inventara",
  description: "Manage third-party application integrations",
}

const apps = [
  {
    id: 1,
    name: "QuickBooks Online",
    description: "Sync inventory data with QuickBooks for accounting",
    category: "Accounting",
    status: "Connected",
    version: "2.1.0",
    icon: "QB",
  },
  {
    id: 2,
    name: "Shopify",
    description: "E-commerce platform integration for online sales",
    category: "E-commerce",
    status: "Connected",
    version: "1.8.3",
    icon: "SH",
  },
  {
    id: 3,
    name: "Salesforce",
    description: "CRM integration for customer management",
    category: "CRM",
    status: "Available",
    version: "3.2.1",
    icon: "SF",
  },
  {
    id: 4,
    name: "Slack",
    description: "Team communication and notifications",
    category: "Communication",
    status: "Connected",
    version: "1.5.2",
    icon: "SL",
  },
  {
    id: 5,
    name: "WooCommerce",
    description: "WordPress e-commerce plugin integration",
    category: "E-commerce",
    status: "Available",
    version: "2.0.4",
    icon: "WC",
  },
  {
    id: 6,
    name: "Zapier",
    description: "Automation platform for connecting apps",
    category: "Automation",
    status: "Connected",
    version: "1.3.0",
    icon: "ZP",
  },
]

export default function ThirdPartyAppsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Third-party Apps</h1>
          <p className="text-[#666666]">Connect with external applications and services</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">
          <Download className="mr-2 h-4 w-4" />
          Browse App Store
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Installed Apps</CardTitle>
            <Plug className="h-4 w-4 text-[#6B8A7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">15</div>
            <p className="text-xs text-[#666666]">Total installed</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Connected</CardTitle>
            <Badge variant="secondary" className="bg-[#6B8A7A] text-white">
              Active
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">8</div>
            <p className="text-xs text-[#666666]">Currently active</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Available</CardTitle>
            <Download className="h-4 w-4 text-[#F4A261]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">47</div>
            <p className="text-xs text-[#666666]">In app store</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Updates</CardTitle>
            <Badge variant="secondary" className="bg-[#E7B10A] text-white">
              3
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">3</div>
            <p className="text-xs text-[#666666]">Updates available</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#D9D9D9]">
        <CardHeader>
          <CardTitle className="text-[#333333]">Application Management</CardTitle>
          <CardDescription className="text-[#666666]">Manage your third-party application integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666] h-4 w-4" />
              <Input placeholder="Search applications..." className="pl-10 border-[#D9D9D9] focus:border-[#4B6587]" />
            </div>
            <Button variant="outline" className="border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <Card key={app.id} className="border-[#D9D9D9] hover:border-[#4B6587] transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#4B6587] rounded-lg flex items-center justify-center text-white font-bold">
                        {app.icon}
                      </div>
                      <div>
                        <CardTitle className="text-[#333333] text-lg">{app.name}</CardTitle>
                        <Badge
                          variant="secondary"
                          className={
                            app.category === "Accounting"
                              ? "bg-[#6B8A7A] text-white"
                              : app.category === "E-commerce"
                                ? "bg-[#F4A261] text-white"
                                : app.category === "CRM"
                                  ? "bg-[#E7B10A] text-white"
                                  : "bg-[#4B6587] text-white"
                          }
                        >
                          {app.category}
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={app.status === "Connected" ? "bg-[#6B8A7A] text-white" : "bg-[#D9D9D9] text-[#333333]"}
                    >
                      {app.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[#666666] text-sm mb-4">{app.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#666666]">Version {app.version}</span>
                    <div className="flex space-x-2">
                      {app.status === "Connected" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent"
                        >
                          <Settings className="mr-1 h-3 w-3" />
                          Configure
                        </Button>
                      ) : (
                        <Button size="sm" className="bg-[#4B6587] hover:bg-[#3a5068] text-white">
                          <Plug className="mr-1 h-3 w-3" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
