import type { Metadata } from "next"
import { ReturnsContent } from "@/components/receiving/returns-content"

export const metadata: Metadata = {
  title: "Returns - Inventara",
  description: "Manage supplier returns and defective goods",
}

export default function ReturnsPage() {
  return <ReturnsContent />
}
