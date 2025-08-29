import type { Metadata } from "next"
import { ResourcesContent } from "@/components/projects/resources-content"

export const metadata: Metadata = {
  title: "Project Resources - Inventara",
  description: "Manage resource allocation and team capacity planning",
}

export default function ResourcesPage() {
  return <ResourcesContent />
}





