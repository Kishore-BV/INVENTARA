import type { Metadata } from "next"
import { SupplierContractsContent } from "@/components/suppliers/supplier-contracts-content"

export const metadata: Metadata = {
  title: "Supplier Contracts - Inventara",
  description: "Manage supplier contracts and agreements",
}

export default function SupplierContractsPage() {
  return <SupplierContractsContent />
}
