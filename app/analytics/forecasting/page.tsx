import type { Metadata } from "next"
import { DemandForecastingContent } from "@/components/analytics/demand-forecasting-content"
import { ComingSoonPopup } from "@/components/analytics/coming-soon-popup"

export const metadata: Metadata = {
  title: "Demand Forecasting - Inventara",
  description: "Predict future demand and optimize inventory planning",
}

export default function DemandForecastingPage() {
  return (
    <>
      <ComingSoonPopup title="Demand Forecasting - Coming Soon" description="Forecasting insights are on the way. Check back soon!" />
      <DemandForecastingContent />
    </>
  )
}
