import type { Metadata } from "next"
import { ValuationReportsContent } from "@/components/dashboard/valuation-reports-content"

export const metadata: Metadata = {
  title: "Valuation Reports - Inventara",
  description: "Inventory valuation and financial reporting",
}

export default function ValuationReportsPage() {
  return <ValuationReportsContent />
}
