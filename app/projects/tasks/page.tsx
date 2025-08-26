import type { Metadata } from "next"
import { TasksContent } from "@/components/projects/tasks-content"

export const metadata: Metadata = {
  title: "Tasks - Inventara",
  description: "Manage task assignments, dependencies, and progress tracking",
}

export default function TasksPage() {
  return <TasksContent />
}
