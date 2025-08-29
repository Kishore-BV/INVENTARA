import type { Metadata } from "next"
import { WorkCentersContent } from "@/components/ierp/production/work-centers-content"

export const metadata: Metadata = {
  title: "Work Centers - Production Planning",
  description: "Work Center management with capacity planning, scheduling, and resource allocation",
}

export default function WorkCentersPage() {
  return <WorkCentersContent />
}