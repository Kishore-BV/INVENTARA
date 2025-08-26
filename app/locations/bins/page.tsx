import type { Metadata } from "next"
import { BinsContent } from "@/components/locations/bins-content"

export const metadata: Metadata = {
  title: "Storage Bins - Inventara",
  description: "Manage individual storage bins and locations",
}

export default function BinsPage() {
  return <BinsContent />
}
