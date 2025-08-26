import type { Metadata } from "next"
import { CycleCountingContent } from "@/components/cycle-counting/cycle-counting-content"

export const metadata: Metadata = {
  title: "Cycle Counting - Inventara",
  description: "Manage inventory cycle counting and stock verification",
}

export default function CycleCountingPage() {
  return <CycleCountingContent />
}
