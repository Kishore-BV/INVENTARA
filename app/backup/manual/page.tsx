import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Database, Users, FileText, Settings, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Manual Backup - Inventara",
  description: "Create manual backups of your data",
}

export default function ManualBackupPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Manual Backup</h1>
          <p className="text-[#666666]">Create an immediate backup of your selected data</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">
          <Download className="mr-2 h-4 w-4" />
          Start Backup
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <CardTitle className="text-[#333333]">Select Data to Backup</CardTitle>
            <CardDescription className="text-[#666666]">Choose which data categories to include</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox id="inventory" defaultChecked />
                <div className="flex items-center space-x-3 flex-1">
                  <Database className="h-5 w-5 text-[#6B8A7A]" />
                  <div>
                    <label htmlFor="inventory" className="text-[#333333] font-medium cursor-pointer">
                      Inventory Data
                    </label>
                    <p className="text-sm text-[#666666]">Products, categories, stock levels (2.1 GB)</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="users" defaultChecked />
                <div className="flex items-center space-x-3 flex-1">
                  <Users className="h-5 w-5 text-[#F4A261]" />
                  <div>
                    <label htmlFor="users" className="text-[#333333] font-medium cursor-pointer">
                      User Accounts
                    </label>
                    <p className="text-sm text-[#666666]">User profiles, roles, permissions (45 MB)</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="transactions" defaultChecked />
                <div className="flex items-center space-x-3 flex-1">
                  <FileText className="h-5 w-5 text-[#E7B10A]" />
                  <div>
                    <label htmlFor="transactions" className="text-[#333333] font-medium cursor-pointer">
                      Transaction History
                    </label>
                    <p className="text-sm text-[#666666]">Purchase orders, stock movements (890 MB)</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="settings" defaultChecked />
                <div className="flex items-center space-x-3 flex-1">
                  <Settings className="h-5 w-5 text-[#4B6587]" />
                  <div>
                    <label htmlFor="settings" className="text-[#333333] font-medium cursor-pointer">
                      System Configuration
                    </label>
                    <p className="text-sm text-[#666666]">Settings, integrations, preferences (12 MB)</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="reports" />
                <div className="flex items-center space-x-3 flex-1">
                  <FileText className="h-5 w-5 text-[#666666]" />
                  <div>
                    <label htmlFor="reports" className="text-[#333333] font-medium cursor-pointer">
                      Reports & Analytics
                    </label>
                    <p className="text-sm text-[#666666]">Generated reports and analytics data (234 MB)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-[#D9D9D9]">
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Estimated backup size:</span>
                <span className="font-medium text-[#333333]">3.1 GB</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[#666666]">Estimated time:</span>
                <span className="font-medium text-[#333333]">8-12 minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <CardTitle className="text-[#333333]">Backup Options</CardTitle>
            <CardDescription className="text-[#666666]">Configure backup settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-[#333333] font-medium">Backup Format</label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="zip" name="format" value="zip" defaultChecked className="text-[#4B6587]" />
                    <label htmlFor="zip" className="text-[#666666] cursor-pointer">
                      ZIP Archive (Compressed)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="tar" name="format" value="tar" className="text-[#4B6587]" />
                    <label htmlFor="tar" className="text-[#666666] cursor-pointer">
                      TAR Archive (Uncompressed)
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[#333333] font-medium">Encryption</label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="aes256"
                      name="encryption"
                      value="aes256"
                      defaultChecked
                      className="text-[#4B6587]"
                    />
                    <label htmlFor="aes256" className="text-[#666666] cursor-pointer">
                      AES-256 Encryption
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="none" name="encryption" value="none" className="text-[#4B6587]" />
                    <label htmlFor="none" className="text-[#666666] cursor-pointer">
                      No Encryption
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[#333333] font-medium">Download Location</label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="download"
                      name="location"
                      value="download"
                      defaultChecked
                      className="text-[#4B6587]"
                    />
                    <label htmlFor="download" className="text-[#666666] cursor-pointer">
                      Download to Device
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="cloud" name="location" value="cloud" className="text-[#4B6587]" />
                    <label htmlFor="cloud" className="text-[#666666] cursor-pointer">
                      Save to Cloud Storage
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#D9D9D9]">
        <CardHeader>
          <CardTitle className="text-[#333333]">Recent Manual Backups</CardTitle>
          <CardDescription className="text-[#666666]">History of manually created backups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-[#D9D9D9] rounded-lg">
              <div className="flex items-center space-x-4">
                <CheckCircle className="h-5 w-5 text-[#6B8A7A]" />
                <div>
                  <p className="font-medium text-[#333333]">Full System Backup</p>
                  <p className="text-sm text-[#666666]">Created on Jan 15, 2024 at 3:45 PM • 2.8 GB</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent">
                <Download className="mr-1 h-3 w-3" />
                Download
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-[#D9D9D9] rounded-lg">
              <div className="flex items-center space-x-4">
                <CheckCircle className="h-5 w-5 text-[#6B8A7A]" />
                <div>
                  <p className="font-medium text-[#333333]">Inventory Data Only</p>
                  <p className="text-sm text-[#666666]">Created on Jan 12, 2024 at 10:30 AM • 2.1 GB</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent">
                <Download className="mr-1 h-3 w-3" />
                Download
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-[#D9D9D9] rounded-lg">
              <div className="flex items-center space-x-4">
                <CheckCircle className="h-5 w-5 text-[#6B8A7A]" />
                <div>
                  <p className="font-medium text-[#333333]">Configuration Backup</p>
                  <p className="text-sm text-[#666666]">Created on Jan 10, 2024 at 2:15 PM • 45 MB</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent">
                <Download className="mr-1 h-3 w-3" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
