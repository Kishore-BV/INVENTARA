import type { Metadata } from "next"
import { AttendanceManagementContent } from "@/components/users/attendance-management-content"

export const metadata: Metadata = {
  title: "Attendance Management - Inventara",
  description: "Manage employee attendance, time tracking, and work schedules",
}

export default function AttendanceManagementPage() {
  return <AttendanceManagementContent />
}





