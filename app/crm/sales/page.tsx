import type { Metadata } from "next"
import { SalesContent } from "@/components/crm/sales-content"

export const metadata: Metadata = {
  title: "Sales - CRM - Inventara",
  description: "Sales pipeline and revenue tracking",
}

export default function SalesPage() {
  return <SalesContent />
}





