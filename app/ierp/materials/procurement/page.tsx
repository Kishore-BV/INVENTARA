import type { Metadata } from "next"
import { ProcurementWorkflowsContent } from "@/components/ierp/materials/procurement-workflows-content"

export const metadata: Metadata = {
  title: "Procurement Workflows - Materials Management",
  description: "End-to-end procurement process management with requisitions, approvals, and purchase orders",
}

export default function ProcurementWorkflowsPage() {
  return <ProcurementWorkflowsContent />
}