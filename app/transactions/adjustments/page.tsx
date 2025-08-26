import type { Metadata } from "next"
import { AdjustmentsContent } from "@/components/transactions/adjustments-content"

export const metadata: Metadata = {
  title: "Stock Adjustments - Inventara",
  description: "Manage inventory adjustments and corrections",
}

export default function AdjustmentsPage() {
  return <AdjustmentsContent />
}
