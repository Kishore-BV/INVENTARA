import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plug, Webhook, Plus } from "lucide-react"
import NextLink from "next/link"

export const metadata: Metadata = {
  title: "Integrations - Inventara",
  description: "Manage system integrations and third-party connections",
}

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Integrations</h1>
          <p className="text-[#666666]">Connect Inventara with external systems and services</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Integration
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Active Integrations</CardTitle>
            <Plug className="h-4 w-4 text-[#6B8A7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">8</div>
            <p className="text-xs text-[#666666]">Currently connected</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">API Connections</CardTitle>
            <Webhook className="h-4 w-4 text-[#F4A261]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">12</div>
            <p className="text-xs text-[#666666]">API endpoints</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Webhooks</CardTitle>
            <Webhook className="h-4 w-4 text-[#E7B10A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">5</div>
            <p className="text-xs text-[#666666]">Active webhooks</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Data Sync</CardTitle>
            <Badge variant="secondary" className="bg-[#6B8A7A] text-white">
              Live
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">99.9%</div>
            <p className="text-xs text-[#666666]">Uptime</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <CardTitle className="text-[#333333]">Integration Categories</CardTitle>
            <CardDescription className="text-[#666666]">Manage different types of integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <NextLink href="/integrations/api">
              <Button
                variant="outline"
                className="w-full justify-start border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent"
              >
                <Webhook className="mr-2 h-4 w-4" />
                API Connections
              </Button>
            </NextLink>
            <NextLink href="/integrations/apps">
              <Button
                variant="outline"
                className="w-full justify-start border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent"
              >
                <Plug className="mr-2 h-4 w-4" />
                Third-party Apps
              </Button>
            </NextLink>
            <NextLink href="/integrations/webhooks">
              <Button
                variant="outline"
                className="w-full justify-start border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent"
              >
                <Webhook className="mr-2 h-4 w-4" />
                Webhooks
              </Button>
            </NextLink>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <CardTitle className="text-[#333333]">Popular Integrations</CardTitle>
            <CardDescription className="text-[#666666]">Commonly used integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#4B6587] rounded flex items-center justify-center text-white text-sm">
                  QB
                </div>
                <div>
                  <p className="font-medium text-[#333333]">QuickBooks</p>
                  <p className="text-sm text-[#666666]">Accounting integration</p>
                </div>
              </div>
              <Badge className="bg-[#6B8A7A] text-white">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#F4A261] rounded flex items-center justify-center text-white text-sm">
                  SF
                </div>
                <div>
                  <p className="font-medium text-[#333333]">Salesforce</p>
                  <p className="text-sm text-[#666666]">CRM integration</p>
                </div>
              </div>
              <Badge className="bg-[#D9D9D9] text-[#333333]">Available</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#6B8A7A] rounded flex items-center justify-center text-white text-sm">
                  SH
                </div>
                <div>
                  <p className="font-medium text-[#333333]">Shopify</p>
                  <p className="text-sm text-[#666666]">E-commerce platform</p>
                </div>
              </div>
              <Badge className="bg-[#6B8A7A] text-white">Connected</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
