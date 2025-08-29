import type { Metadata } from "next"
import { BOMManagementContent } from "@/components/ierp/production/bom-management-content"

export const metadata: Metadata = {
  title: "Bill of Materials (BOM) - Production Planning",
  description: "Bill of Materials management with component lists, routing, and version control",
}

export default function BOMManagementPage() {
  return <BOMManagementContent />
}