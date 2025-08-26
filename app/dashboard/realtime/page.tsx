import type { Metadata } from "next"
import { RealtimeTrackingContent } from "@/components/dashboard/realtime-tracking-content"

export const metadata: Metadata = {
  title: "Real-time Tracking - Inventara",
  description: "Live inventory tracking and monitoring",
}

export default function RealtimeTrackingPage() {
  return <RealtimeTrackingContent />
}
