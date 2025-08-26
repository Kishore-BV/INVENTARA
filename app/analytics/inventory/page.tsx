import type { Metadata } from "next"
import { InventoryAnalyticsContent } from "@/components/analytics/inventory-analytics-content"

export const metadata: Metadata = {
  title: "Inventory Analytics - Inventara",
  description: "Detailed inventory performance analytics and metrics",
}

export default function InventoryAnalyticsPage() {
  return <InventoryAnalyticsContent />
}
