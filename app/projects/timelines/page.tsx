import type { Metadata } from "next"
import { TimelinesContent } from "@/components/projects/timelines-content"

export const metadata: Metadata = {
  title: "Project Timelines - Inventara",
  description: "View project timelines, milestones, and track progress",
}

export default function TimelinesPage() {
  return <TimelinesContent />
}





