import type { Metadata } from "next"
import { TurnoverAnalysisContent } from "@/components/analytics/turnover-analysis-content"

export const metadata: Metadata = {
  title: "Turnover Analysis - Inventara",
  description: "Analyze inventory turnover rates and optimize stock levels",
}

export default function TurnoverAnalysisPage() {
  return <TurnoverAnalysisContent />
}
