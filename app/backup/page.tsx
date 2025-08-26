import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HardDrive, Clock, Download, Upload } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Backup & Restore - Inventara",
  description: "Manage system backups and data restoration",
}

export default function BackupPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Backup & Restore</h1>
          <p className="text-[#666666]">Protect your data with automated backups and restore options</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">
          <Download className="mr-2 h-4 w-4" />
          Create Backup
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Total Backups</CardTitle>
            <HardDrive className="h-4 w-4 text-[#6B8A7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">47</div>
            <p className="text-xs text-[#666666]">All time backups</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Last Backup</CardTitle>
            <Clock className="h-4 w-4 text-[#F4A261]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">2h</div>
            <p className="text-xs text-[#666666]">2 hours ago</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Storage Used</CardTitle>
            <Badge variant="secondary" className="bg-[#E7B10A] text-white">
              68%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">2.4GB</div>
            <p className="text-xs text-[#666666]">of 3.5GB available</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Auto Backup</CardTitle>
            <Badge variant="secondary" className="bg-[#6B8A7A] text-white">
              Enabled
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#333333]">Daily</div>
            <p className="text-xs text-[#666666]">at 2:00 AM</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <CardTitle className="text-[#333333]">Backup Options</CardTitle>
            <CardDescription className="text-[#666666]">Choose your backup and restore options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/backup/automated">
              <Button
                variant="outline"
                className="w-full justify-start border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent"
              >
                <Clock className="mr-2 h-4 w-4" />
                Automated Backups
              </Button>
            </Link>
            <Link href="/backup/manual">
              <Button
                variant="outline"
                className="w-full justify-start border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent"
              >
                <Download className="mr-2 h-4 w-4" />
                Manual Backup
              </Button>
            </Link>
            <Link href="/backup/restore">
              <Button
                variant="outline"
                className="w-full justify-start border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent"
              >
                <Upload className="mr-2 h-4 w-4" />
                Restore Data
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <CardTitle className="text-[#333333]">Recent Backups</CardTitle>
            <CardDescription className="text-[#666666]">Latest backup activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-[#333333]">Full system backup completed</p>
                <p className="text-xs text-[#666666]">2 hours ago • 847MB</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-[#333333]">Inventory data backup</p>
                <p className="text-xs text-[#666666]">1 day ago • 234MB</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-[#6B8A7A] rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-[#333333]">User data backup</p>
                <p className="text-xs text-[#666666]">2 days ago • 45MB</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-[#F4A261] rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-[#333333]">Configuration backup</p>
                <p className="text-xs text-[#666666]">3 days ago • 12MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#D9D9D9]">
        <CardHeader>
          <CardTitle className="text-[#333333]">Backup Status</CardTitle>
          <CardDescription className="text-[#666666]">Current backup configuration and health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Automated Backups</span>
                <Badge className="bg-[#6B8A7A] text-white">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Backup Frequency</span>
                <span className="text-[#333333]">Daily</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Retention Period</span>
                <span className="text-[#333333]">30 days</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Storage Location</span>
                <span className="text-[#333333]">Cloud Storage</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Encryption</span>
                <Badge className="bg-[#6B8A7A] text-white">AES-256</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Compression</span>
                <Badge className="bg-[#E7B10A] text-white">Enabled</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Success Rate</span>
                <span className="text-[#333333]">99.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Average Size</span>
                <span className="text-[#333333]">523MB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Next Backup</span>
                <span className="text-[#333333]">Tonight 2:00 AM</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
