import type { Metadata } from "next"
import { AttendanceTrackingContent } from "@/components/ierp/hcm/attendance-tracking-content"

export const metadata: Metadata = {
  title: "Attendance Tracking - HCM",
  description: "Employee attendance management, time tracking, leave monitoring, and workforce analytics",
}

export default function AttendanceTrackingPage() {
  return <AttendanceTrackingContent />
}