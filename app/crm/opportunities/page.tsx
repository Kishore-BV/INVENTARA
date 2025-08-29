import type { Metadata } from "next"
import { OpportunitiesContent } from "@/components/crm/opportunities-content"

export const metadata: Metadata = {
  title: "Opportunities - CRM - Inventara",
  description: "Track sales opportunities and deals",
}

export default function OpportunitiesPage() {
  return <OpportunitiesContent />
}





