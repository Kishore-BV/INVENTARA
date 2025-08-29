import type { Metadata } from "next"
import { AccountsPayableContent } from "@/components/ierp/finance/accounts-payable-content"

export const metadata: Metadata = {
  title: "Accounts Payable - Finance & Controlling",
  description: "Vendor payment management, outstanding bills tracking, and payment processing",
}

export default function AccountsPayablePage() {
  return <AccountsPayableContent />
}