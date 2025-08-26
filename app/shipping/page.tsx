import type { Metadata } from "next"
import { ShippingContent } from "@/components/shipping/shipping-content"

export const metadata: Metadata = {
  title: "Shipping - Inventara",
  description: "Manage shipments and delivery operations",
}

export default function ShippingPage() {
  return <ShippingContent />
}
