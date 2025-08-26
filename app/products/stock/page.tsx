import type { Metadata } from "next"
import { StockTrackingContent } from "@/components/products/stock-tracking-content"

export const metadata: Metadata = {
  title: "Stock Tracking - Inventara",
  description: "Real-time stock level tracking and monitoring",
}

export default function StockTrackingPage() {
  return <StockTrackingContent />
}
