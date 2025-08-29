import type { Metadata } from "next"
import { ProductionPlanningContent } from "@/components/ierp/production/production-planning-content"

export const metadata: Metadata = {
  title: "Production Planning (PP) - iERP",
  description: "Production Planning module with Manufacturing Orders, BOM Management, Work Centers, Capacity Planning, and Shop-floor Control",
}

export default function ProductionPlanningPage() {
  return <ProductionPlanningContent />
}