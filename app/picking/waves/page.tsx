import type { Metadata } from "next"
import { PickWavesContent } from "@/components/picking/pick-waves-content"

export const metadata: Metadata = {
  title: "Pick Waves - Inventara",
  description: "Manage pick wave planning and execution",
}

export default function PickWavesPage() {
  return <PickWavesContent />
}
