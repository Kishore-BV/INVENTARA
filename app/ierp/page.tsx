import type { Metadata } from "next"
import { IERPDashboardContent } from "@/components/ierp/ierp-dashboard-content"

export const metadata: Metadata = {
  title: "iERP - Inventara ERP",
  description: "Comprehensive Enterprise Resource Planning system with Finance, Materials Management, Sales & Distribution modules",
}

export default function IERPPage() {
  return <IERPDashboardContent />
}