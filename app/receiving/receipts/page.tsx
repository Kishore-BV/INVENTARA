import type { Metadata } from "next"
import { ReceiptsContent } from "@/components/receiving/receipts-content"

export const metadata: Metadata = {
  title: "Receipts - Inventara",
  description: "Track and manage goods receipts and documentation",
}

export default function ReceiptsPage() {
  return <ReceiptsContent />
}
