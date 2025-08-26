import type { Metadata } from "next"
import { DashboardInventoryContent } from "@/components/dashboard/dashboard-inventory-content"

export const metadata: Metadata = {
  title: "Inventory Overview - Inventara",
  description: "Real-time inventory overview and key metrics",
}

export default function DashboardInventoryPage() {
  return <DashboardInventoryContent />
}
