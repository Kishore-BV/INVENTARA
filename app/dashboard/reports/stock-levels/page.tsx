import type { Metadata } from "next"
import { StockLevelsReportContent } from "@/components/dashboard/stock-levels-report-content"

export const metadata: Metadata = {
  title: "Stock Levels Report - Inventara",
  description: "Current stock levels across all products and locations",
}

export default function StockLevelsReportPage() {
  return <StockLevelsReportContent />
}
