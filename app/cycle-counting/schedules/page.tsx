import type { Metadata } from "next"
import { CountSchedulesContent } from "@/components/cycle-counting/count-schedules-content"

export const metadata: Metadata = {
  title: "Count Schedules - Inventara",
  description: "Manage cycle counting schedules and planning",
}

export default function CountSchedulesPage() {
  return <CountSchedulesContent />
}
