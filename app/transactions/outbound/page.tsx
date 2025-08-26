import type { Metadata } from "next"
import { OutboundTransactionsContent } from "@/components/transactions/outbound-transactions-content"

export const metadata: Metadata = {
  title: "Outbound Transactions - Inventara",
  description: "Manage outbound stock transactions and issues",
}

export default function OutboundTransactionsPage() {
  return <OutboundTransactionsContent />
}
