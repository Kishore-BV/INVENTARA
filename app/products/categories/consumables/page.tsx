import type { Metadata } from "next"
import { ConsumablesContent } from "@/components/products/consumables-content"

export const metadata: Metadata = {
  title: "Consumables - Inventara",
  description: "Manage consumable items and supplies",
}

export default function ConsumablesPage() {
  return <ConsumablesContent />
}
