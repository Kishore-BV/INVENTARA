import type { Metadata } from "next"
import { ReportsContent } from "@/components/crm/reports-content"

export const metadata: Metadata = {
  title: "Reports - CRM - Inventara",
  description: "CRM analytics and reporting",
}

export default function ReportsPage() {
  return <ReportsContent />
}
