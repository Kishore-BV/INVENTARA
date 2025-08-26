import type { Metadata } from "next"
import { SuppliersContent } from "@/components/suppliers/suppliers-content"

export const metadata: Metadata = {
  title: "Suppliers - Inventara",
  description: "Manage your supplier relationships and performance",
}

export default function SuppliersPage() {
  return <SuppliersContent />
}
