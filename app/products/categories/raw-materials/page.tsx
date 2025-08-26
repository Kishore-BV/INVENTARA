import type { Metadata } from "next"
import { RawMaterialsContent } from "@/components/products/raw-materials-content"

export const metadata: Metadata = {
  title: "Raw Materials - Inventara",
  description: "Manage raw materials inventory and stock levels",
}

export default function RawMaterialsPage() {
  return <RawMaterialsContent />
}
