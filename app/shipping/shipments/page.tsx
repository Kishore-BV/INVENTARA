import type { Metadata } from "next"
import { ShipmentsContent } from "@/components/shipping/shipments-content"

export const metadata: Metadata = {
  title: "Shipments - Inventara",
  description: "Track and manage all shipments",
}

export default function ShipmentsPage() {
  return <ShipmentsContent />
}
