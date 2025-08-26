import type { Metadata } from "next"
import { ZonesContent } from "@/components/locations/zones-content"

export const metadata: Metadata = {
  title: "Storage Zones - Inventara",
  description: "Manage warehouse zones and storage areas",
}

export default function ZonesPage() {
  return <ZonesContent />
}
