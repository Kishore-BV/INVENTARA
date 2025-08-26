import type { Metadata } from "next"
import { ReceivedPurchaseOrdersContent } from "@/components/purchase-orders/received-purchase-orders-content"

export const metadata: Metadata = {
  title: "Received Purchase Orders - Inventara",
  description: "Manage received purchase orders and inventory updates",
}

export default function ReceivedPurchaseOrdersPage() {
  return <ReceivedPurchaseOrdersContent />
}
