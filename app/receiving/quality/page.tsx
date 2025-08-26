import type { Metadata } from "next"
import { QualityControlContent } from "@/components/receiving/quality-control-content"

export const metadata: Metadata = {
  title: "Quality Control - Inventara",
  description: "Manage quality control processes and inspections",
}

export default function QualityControlPage() {
  return <QualityControlContent />
}
