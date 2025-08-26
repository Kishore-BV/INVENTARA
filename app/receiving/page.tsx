import type { Metadata } from "next"
import { ReceivingContent } from "@/components/receiving/receiving-content"

export const metadata: Metadata = {
  title: "Receiving - Inventara",
  description: "Manage goods receiving and quality control processes",
}

export default function ReceivingPage() {
  return <ReceivingContent />
}
