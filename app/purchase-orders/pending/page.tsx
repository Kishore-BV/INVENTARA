import type { Metadata } from "next"
import { PendingPurchaseOrdersContent } from "@/components/purchase-orders/pending-purchase-orders-content"

export const metadata: Metadata = {
  title: "Pending Purchase Orders - Inventara",
  description: "Manage pending purchase orders awaiting approval",
}

export default function PendingPurchaseOrdersPage() {
  return <PendingPurchaseOrdersContent />
}
