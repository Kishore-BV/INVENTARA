import type { Metadata } from "next"
import { CRMContent } from "@/components/crm/crm-content"

export const metadata: Metadata = {
  title: "CRM - Inventara",
  description: "Customer Relationship Management dashboard and tools",
}

export default function CRMPage() {
  return <CRMContent />
}
