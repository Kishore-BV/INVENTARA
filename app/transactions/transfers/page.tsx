import type { Metadata } from "next"
import { TransfersContent } from "@/components/transactions/transfers-content"

export const metadata: Metadata = {
  title: "Stock Transfers - Inventara",
  description: "Manage stock transfers between locations",
}

export default function TransfersPage() {
  return <TransfersContent />
}
