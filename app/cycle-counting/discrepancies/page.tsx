import type { Metadata } from "next"
import { DiscrepanciesContent } from "@/components/cycle-counting/discrepancies-content"

export const metadata: Metadata = {
  title: "Count Discrepancies - Inventara",
  description: "Review and resolve inventory count discrepancies",
}

export default function DiscrepanciesPage() {
  return <DiscrepanciesContent />
}
