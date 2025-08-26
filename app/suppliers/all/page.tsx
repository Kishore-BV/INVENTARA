import type { Metadata } from "next"
import { AllSuppliersContent } from "@/components/suppliers/all-suppliers-content"

export const metadata: Metadata = {
  title: "All Suppliers - Inventara",
  description: "Complete supplier directory and management",
}

export default function AllSuppliersPage() {
  return <AllSuppliersContent />
}
