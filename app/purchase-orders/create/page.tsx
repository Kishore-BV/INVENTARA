import type { Metadata } from "next"
import { CreatePurchaseOrderContent } from "@/components/purchase-orders/create-purchase-order-content"

export const metadata: Metadata = {
  title: "Create Purchase Order - Inventara",
  description: "Create new purchase orders for suppliers",
}

export default function CreatePurchaseOrderPage() {
  return <CreatePurchaseOrderContent />
}
