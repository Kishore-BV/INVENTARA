import type { Metadata } from "next"
import { PickingContent } from "@/components/picking/picking-content"

export const metadata: Metadata = {
  title: "Picking & Packing - Inventara",
  description: "Manage order picking and packing operations",
}

export default function PickingPage() {
  return <PickingContent />
}
