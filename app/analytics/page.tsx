import type { Metadata } from "next"
import { AnalyticsContent } from "@/components/analytics/analytics-content"

export const metadata: Metadata = {
  title: "Analytics - Inventara",
  description: "Comprehensive inventory analytics and insights for your business",
}

export default function AnalyticsPage() {
  return <AnalyticsContent />
}
