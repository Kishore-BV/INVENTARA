import type { Metadata } from "next"
import { DemandForecastingContent } from "@/components/analytics/demand-forecasting-content"

export const metadata: Metadata = {
  title: "Demand Forecasting - Inventara",
  description: "Predict future demand and optimize inventory planning",
}

export default function DemandForecastingPage() {
  return <DemandForecastingContent />
}
