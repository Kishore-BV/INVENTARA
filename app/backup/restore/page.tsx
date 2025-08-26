import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, AlertTriangle, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Restore Data - Inventara",
  description: "Restore data from backup files",
}

const backups = [
  {
    id: 1,
    name: "Full System Backup",
    date: "2024-01-15 15:45",
    size: "2.8 GB",
    type: "Automated",
    status: "Verified",
    contains: ["Inventory", "Users", "Transactions", "Settings"],
  },
  {
    id: 2,
    name: "Manual Inventory Backup",
    date: "2024-01-12 10:30",
    size: "2.1 GB",
    type: "Manual",
    status: "Verified",
    contains: ["Inventory", "Products", "Categories"],
  },
  {
    id: 3,
    name: "Configuration Backup",
    date: "2024-01-10 14:15",
    size: "45 MB",
    type: "Manual",
    status: "Verified",
    contains: ["Settings", "Integrations", "Permissions"],
  },
  {
    id: 4,
    name: "Weekly Automated Backup",
    date: "2024-01-08 02:00",
    size: "2.9 GB",
    type: "Automated",
    status: "Corrupted",
    contains: ["Inventory", "Users", "Transactions", "Settings"],
  },
]

export default function RestoreDataPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Restore Data</h1>
          <p className="text-[#666666]">Restore your system from backup files</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">
          <Upload className="mr-2 h-4 w-4" />
          Upload Backup File
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <CardTitle className="text-[#333333]">Upload Backup File</CardTitle>
            <CardDescription className="text-[#666666]">Upload a backup file to restore from</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backup-file" className="text-[#333333]">
                Select Backup File
              </Label>
              <Input
                id="backup-file"
                type="file"
                accept=".zip,.tar,.gz"
                className="border-[#D9D9D9] focus:border-[#4B6587]"
              />
              <p className="text-xs text-[#666666]">Supported formats: ZIP, TAR, GZ (Max size: 5GB)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="encryption-key" className="text-[#333333]">
                Encryption Key (if encrypted)
              </Label>
              <Input
                id="encryption-key"
                type="password"
                placeholder="Enter encryption key"
                className="border-[#D9D9D9] focus:border-[#4B6587]"
              />
            </div>
            <Button className="w-full bg-[#6B8A7A] hover:bg-[#5a7a6a] text-white">
              <Upload className="mr-2 h-4 w-4" />
              Upload and Verify
            </Button>
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <CardTitle className="text-[#333333]">Restore Options</CardTitle>
            <CardDescription className="text-[#666666]">Choose what to restore</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="restore-inventory" defaultChecked className="text-[#4B6587]" />
                <label htmlFor="restore-inventory" className="text-[#333333] cursor-pointer">
                  Inventory Data
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="restore-users" defaultChecked className="text-[#4B6587]" />
                <label htmlFor="restore-users" className="text-[#333333] cursor-pointer">
                  User Accounts
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="restore-transactions" className="text-[#4B6587]" />
                <label htmlFor="restore-transactions" className="text-[#333333] cursor-pointer">
                  Transaction History
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="restore-settings" defaultChecked className="text-[#4B6587]" />
                <label htmlFor="restore-settings" className="text-[#333333] cursor-pointer">
                  System Settings
                </label>
              </div>
            </div>
            <div className="pt-4 border-t border-[#D9D9D9]">
              <div className="flex items-center space-x-2 text-[#E7B10A] mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Warning</span>
              </div>
              <p className="text-sm text-[#666666]">
                Restoring will overwrite current data. Make sure to create a backup of your current system before
                proceeding.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#D9D9D9]">
        <CardHeader>
          <CardTitle className="text-[#333333]">Available Backups</CardTitle>
          <CardDescription className="text-[#666666]">Select from existing backup files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#D9D9D9]">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F8F9FA]">
                  <TableHead className="text-[#333333]">Backup Name</TableHead>
                  <TableHead className="text-[#333333]">Date Created</TableHead>
                  <TableHead className="text-[#333333]">Size</TableHead>
                  <TableHead className="text-[#333333]">Type</TableHead>
                  <TableHead className="text-[#333333]">Status</TableHead>
                  <TableHead className="text-[#333333]">Contains</TableHead>
                  <TableHead className="text-[#333333]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id} className="hover:bg-[#F8F9FA]">
                    <TableCell className="font-medium text-[#333333]">{backup.name}</TableCell>
                    <TableCell className="text-[#666666]">{backup.date}</TableCell>
                    <TableCell className="text-[#666666]">{backup.size}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={backup.type === "Automated" ? "bg-[#6B8A7A] text-white" : "bg-[#F4A261] text-white"}
                      >
                        {backup.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={backup.status === "Verified" ? "bg-[#6B8A7A] text-white" : "bg-red-500 text-white"}
                      >
                        {backup.status === "Verified" ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <AlertTriangle className="mr-1 h-3 w-3" />
                        )}
                        {backup.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {backup.contains.slice(0, 2).map((item) => (
                          <Badge key={item} variant="secondary" className="bg-[#E7B10A] text-white text-xs">
                            {item}
                          </Badge>
                        ))}
                        {backup.contains.length > 2 && (
                          <Badge variant="secondary" className="bg-[#D9D9D9] text-[#333333] text-xs">
                            +{backup.contains.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {backup.status === "Verified" ? (
                        <Button size="sm" className="bg-[#4B6587] hover:bg-[#3a5068] text-white">
                          <Upload className="mr-1 h-3 w-3" />
                          Restore
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled className="border-[#D9D9D9] bg-transparent">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Corrupted
                        </Button>
                      )}
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
