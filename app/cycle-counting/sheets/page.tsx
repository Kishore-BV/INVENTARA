import type { Metadata } from "next"
import { CountSheetsContent } from "@/components/cycle-counting/count-sheets-content"

export const metadata: Metadata = {
  title: "Count Sheets - Inventara",
  description: "Manage cycle counting sheets and data collection",
}

export default function CountSheetsPage() {
  return <CountSheetsContent />
}
