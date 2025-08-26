import type { Metadata } from "next"
import { PackingContent } from "@/components/picking/packing-content"

export const metadata: Metadata = {
  title: "Packing - Inventara",
  description: "Manage order packing and preparation for shipping",
}

export default function PackingPage() {
  return <PackingContent />
}
