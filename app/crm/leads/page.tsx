import type { Metadata } from "next"
import { LeadsContent } from "@/components/crm/leads-content"

export const metadata: Metadata = {
  title: "Leads - CRM - Inventara",
  description: "Track and manage potential customers",
}

export default function LeadsPage() {
  return <LeadsContent />
}





