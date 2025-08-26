import type { Metadata } from "next"
import { AllProductsContent } from "@/components/products/all-products-content"

export const metadata: Metadata = {
  title: "All Products - Inventara",
  description: "Complete product catalog and inventory management",
}

export default function AllProductsPage() {
  return <AllProductsContent />
}
