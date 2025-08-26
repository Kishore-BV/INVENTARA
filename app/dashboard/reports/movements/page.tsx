import type { Metadata } from "next"
import { MovementReportsContent } from "@/components/dashboard/movement-reports-content"

export const metadata: Metadata = {
  title: "Movement Reports - Inventara",
  description: "Track inventory movements and transactions",
}

export default function MovementReportsPage() {
  return <MovementReportsContent />
}
