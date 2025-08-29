import type { Metadata } from "next"
import { CustomerOrderManagementContent } from "@/components/ierp/sales/customer-order-management-content"

export const metadata: Metadata = {
  title: "Customer Order Management - Sales & Distribution",
  description: "Comprehensive customer order processing, tracking, and fulfillment management",
}

export default function CustomerOrderManagementPage() {
  return <CustomerOrderManagementContent />
}