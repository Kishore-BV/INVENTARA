import type { Metadata } from "next"
import { WarehousesContent } from "@/components/warehouses/warehouses-content"

export const metadata: Metadata = {
  title: "Warehouses - Inventara",
  description: "Manage your warehouse locations and configurations",
}

export default function WarehousesPage() {
  return <WarehousesContent />
}
