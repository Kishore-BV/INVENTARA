import type { Metadata } from "next"
import { ManufacturingOrdersContent } from "@/components/ierp/production/manufacturing-orders-content"

export const metadata: Metadata = {
  title: "Manufacturing Orders - Production Planning",
  description: "Manufacturing order management with production scheduling, work center assignment, and progress tracking",
}

export default function ManufacturingOrdersPage() {
  return <ManufacturingOrdersContent />
}