import type { Metadata } from "next"
import { FinanceControllingContent } from "@/components/ierp/finance/finance-controlling-content"

export const metadata: Metadata = {
  title: "Finance & Controlling (FI/CO) - iERP",
  description: "Finance and Controlling module with General Ledger, Accounts Payable/Receivable, Asset Management, and Financial Reporting",
}

export default function FinanceControllingPage() {
  return <FinanceControllingContent />
}