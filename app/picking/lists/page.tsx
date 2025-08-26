import type { Metadata } from "next"
import { PickListsContent } from "@/components/picking/pick-lists-content"

export const metadata: Metadata = {
  title: "Pick Lists - Inventara",
  description: "Manage and track order pick lists",
}

export default function PickListsPage() {
  return <PickListsContent />
}
