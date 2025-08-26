import type { Metadata } from "next"
import { CarriersContent } from "@/components/shipping/carriers-content"

export const metadata: Metadata = {
  title: "Carriers - Inventara",
  description: "Manage shipping carriers and logistics partners",
}

export default function CarriersPage() {
  return <CarriersContent />
}
