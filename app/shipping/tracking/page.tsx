import type { Metadata } from "next"
import { TrackingContent } from "@/components/shipping/tracking-content"

export const metadata: Metadata = {
  title: "Shipment Tracking - Inventara",
  description: "Track shipment status and delivery progress",
}

export default function TrackingPage() {
  return <TrackingContent />
}
