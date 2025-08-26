import type { Metadata } from "next"
import { InboundTransactionsContent } from "@/components/transactions/inbound-transactions-content"

export const metadata: Metadata = {
  title: "Inbound Transactions - Inventara",
  description: "Manage incoming inventory transactions and receipts",
}

export default function InboundTransactionsPage() {
  return <InboundTransactionsContent />
}
