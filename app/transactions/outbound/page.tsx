import type { Metadata } from "next"
import { OutboundTransactionsContent } from "@/components/transactions/outbound-transactions-content"

export const metadata: Metadata = {
  title: "Outbound Transactions - Inventara",
  description: "Manage outgoing inventory transactions and shipments",
}

export default function OutboundTransactionsPage() {
  return <OutboundTransactionsContent />
}
