import type { Metadata } from "next"
import { ProjectsContent } from "@/components/projects/projects-content"

export const metadata: Metadata = {
  title: "Projects - Inventara",
  description: "Manage and track all projects, timelines, and milestones",
}

export default function ProjectsPage() {
  return <ProjectsContent />
}





