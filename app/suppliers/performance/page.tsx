import type { Metadata } from "next"
import { SupplierPerformanceContent } from "@/components/suppliers/supplier-performance-content"

export const metadata: Metadata = {
  title: "Supplier Performance - Inventara",
  description: "Track and analyze supplier performance metrics",
}

export default function SupplierPerformancePage() {
  return <SupplierPerformanceContent />
}
