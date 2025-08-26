import type { Metadata } from "next"
import { ApprovedPurchaseOrdersContent } from "@/components/purchase-orders/approved-purchase-orders-content"

export const metadata: Metadata = {
  title: "Approved Purchase Orders - Inventara",
  description: "Track approved purchase orders and delivery status",
}

export default function ApprovedPurchaseOrdersPage() {
  return <ApprovedPurchaseOrdersContent />
}
