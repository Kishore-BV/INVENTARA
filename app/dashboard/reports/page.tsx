import type { Metadata } from "next"
import { DashboardReportsContent } from "@/components/dashboard/dashboard-reports-content"

export const metadata: Metadata = {
  title: "Stock Reports - Inventara",
  description: "Comprehensive stock reporting and analysis",
}

export default function DashboardReportsPage() {
  return <DashboardReportsContent />
}
