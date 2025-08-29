import type { Metadata } from "next"
import { TurnoverAnalysisContent } from "@/components/analytics/turnover-analysis-content"
import { ComingSoonPopup } from "@/components/analytics/coming-soon-popup"

export const metadata: Metadata = {
  title: "Turnover Analysis - Inventara",
  description: "Analyze inventory turnover rates and optimize stock levels",
}

export default function TurnoverAnalysisPage() {
  return (
    <>
      <ComingSoonPopup title="Turnover Analytics - Coming Soon" description="We are working on powerful turnover analytics. Stay tuned!" />
      <TurnoverAnalysisContent />
    </>
  )
}
