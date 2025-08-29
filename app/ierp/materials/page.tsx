import type { Metadata } from "next"
import { MaterialsManagementContent } from "@/components/ierp/materials/materials-management-content"

export const metadata: Metadata = {
  title: "Materials Management (MM) - iERP",
  description: "Materials Management module with Procurement Workflows, Purchase Orders, Inventory Management, and Supplier Database",
}

export default function MaterialsManagementPage() {
  return <MaterialsManagementContent />
}