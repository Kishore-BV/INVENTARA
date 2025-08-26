import type { Metadata } from "next"
import { PurchaseOrdersContent } from "@/components/purchase-orders/purchase-orders-content"

export const metadata: Metadata = {
  title: "Purchase Orders - Inventara",
  description: "Manage purchase orders and procurement workflow",
}

export default function PurchaseOrdersPage() {
  return <PurchaseOrdersContent />
}
