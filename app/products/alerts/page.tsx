import type { Metadata } from "next"
import { LowStockAlertsContent } from "@/components/products/low-stock-alerts-content"

export const metadata: Metadata = {
  title: "Low Stock Alerts - Inventara",
  description: "Monitor and manage low stock alerts and notifications",
}

export default function LowStockAlertsPage() {
  return <LowStockAlertsContent />
}
