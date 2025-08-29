import type { Metadata } from "next"
import { SalesDistributionContent } from "@/components/ierp/sales/sales-distribution-content"

export const metadata: Metadata = {
  title: "Sales & Distribution (SD) - iERP",
  description: "Sales and Distribution module with Customer Order Management, Pricing, Invoicing, Delivery Tracking, and Sales Reporting",
}

export default function SalesDistributionPage() {
  return <SalesDistributionContent />
}