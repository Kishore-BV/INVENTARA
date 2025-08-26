import type { Metadata } from "next"
import { TransfersContent } from "@/components/transactions/transfers-content"

export const metadata: Metadata = {
  title: "Transfers - Inventara",
  description: "Manage inventory transfers between locations",
}

export default function TransfersPage() {
  return <TransfersContent />
}
