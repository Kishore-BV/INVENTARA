import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Clock, HardDrive, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Automated Backups - Inventara",
  description: "Configure automated backup settings",
}

export default function AutomatedBackupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Automated Backups</h1>
          <p className="text-[#666666]">Configure automatic backup schedules and settings</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">Save Settings</Button>
      </div>

      <div className="grid gap-6">
        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-[#6B8A7A]" />
              <div>
                <CardTitle className="text-[#333333]">Backup Schedule</CardTitle>
                <CardDescription className="text-[#666666]">
                  Configure when automated backups should run
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[#333333] font-medium">Enable Automated Backups</Label>
                <p className="text-sm text-[#666666]">Automatically create backups on schedule</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="frequency" className="text-[#333333]">
                  Backup Frequency
                </Label>
                <Select>
                  <SelectTrigger className="border-[#D9D9D9]">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#D9D9D9]">
                    <SelectItem value="hourly">Every Hour</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-[#333333]">
                  Backup Time
                </Label>
                <Select>
                  <SelectTrigger className="border-[#D9D9D9]">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#D9D9D9]">
                    <SelectItem value="00:00">12:00 AM</SelectItem>
                    <SelectItem value="02:00">2:00 AM</SelectItem>
                    <SelectItem value="04:00">4:00 AM</SelectItem>
                    <SelectItem value="06:00">6:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <HardDrive className="h-6 w-6 text-[#F4A261]" />
              <div>
                <CardTitle className="text-[#333333]">Backup Content</CardTitle>
                <CardDescription className="text-[#666666]">Choose what data to include in backups</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#333333] font-medium">Inventory Data</Label>
                  <p className="text-sm text-[#666666]">Products, categories, stock levels</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#333333] font-medium">User Accounts</Label>
                  <p className="text-sm text-[#666666]">User profiles, roles, permissions</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#333333] font-medium">Transaction History</Label>
                  <p className="text-sm text-[#666666]">Purchase orders, stock movements</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#333333] font-medium">System Configuration</Label>
                  <p className="text-sm text-[#666666]">Settings, integrations, preferences</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#333333] font-medium">Reports & Analytics</Label>
                  <p className="text-sm text-[#666666]">Generated reports and analytics data</p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-[#E7B10A]" />
              <div>
                <CardTitle className="text-[#333333]">Security & Storage</CardTitle>
                <CardDescription className="text-[#666666]">
                  Configure backup security and storage options
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="encryption" className="text-[#333333]">
                  Encryption Level
                </Label>
                <Select>
                  <SelectTrigger className="border-[#D9D9D9]">
                    <SelectValue placeholder="Select encryption" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#D9D9D9]">
                    <SelectItem value="aes128">AES-128</SelectItem>
                    <SelectItem value="aes256">AES-256</SelectItem>
                    <SelectItem value="none">No Encryption</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storage" className="text-[#333333]">
                  Storage Location
                </Label>
                <Select>
                  <SelectTrigger className="border-[#D9D9D9]">
                    <SelectValue placeholder="Select storage" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#D9D9D9]">
                    <SelectItem value="cloud">Cloud Storage</SelectItem>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="retention" className="text-[#333333]">
                  Retention Period
                </Label>
                <Select>
                  <SelectTrigger className="border-[#D9D9D9]">
                    <SelectValue placeholder="Select retention" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#D9D9D9]">
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="compression" className="text-[#333333]">
                  Compression Level
                </Label>
                <Select>
                  <SelectTrigger className="border-[#D9D9D9]">
                    <SelectValue placeholder="Select compression" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#D9D9D9]">
                    <SelectItem value="none">No Compression</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#333333] font-medium">Email Notifications</Label>
                  <p className="text-sm text-[#666666]">Notify when backups complete or fail</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#333333] font-medium">Verify Backup Integrity</Label>
                  <p className="text-sm text-[#666666]">Check backup files for corruption</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
