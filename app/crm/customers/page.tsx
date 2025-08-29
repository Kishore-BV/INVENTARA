import type { Metadata } from "next"
import { CustomersContent } from "@/components/crm/customers-content"

export const metadata: Metadata = {
  title: "Customers - CRM - Inventara",
  description: "Manage customer relationships and data",
}

export default function CustomersPage() {
  return <CustomersContent />
}





