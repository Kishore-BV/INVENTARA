import type { Metadata } from "next"
import { GeneralLedgerContent } from "@/components/ierp/finance/general-ledger-content"

export const metadata: Metadata = {
  title: "General Ledger - Finance & Controlling",
  description: "Complete general ledger management with chart of accounts, journal entries, and financial balances",
}

export default function GeneralLedgerPage() {
  return <GeneralLedgerContent />
}