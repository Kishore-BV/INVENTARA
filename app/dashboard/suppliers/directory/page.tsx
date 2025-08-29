import type { Metadata } from "next"
import { SupplierDirectoryContent } from "@/components/suppliers/supplier-directory-content"

export const metadata: Metadata = {
  title: "Supplier Directory - Inventara",
  description: "Complete supplier directory with performance analytics and contact details",
}

export default function SupplierDirectoryPage() {
  return <SupplierDirectoryContent />
}