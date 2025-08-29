import type { Metadata } from "next"
import { HumanCapitalManagementContent } from "@/components/ierp/hcm/human-capital-management-content"

export const metadata: Metadata = {
  title: "Human Capital Management (HCM) - iERP",
  description: "Human Capital Management module with Employee Records, Payroll, Recruitment, Attendance, Leave Management, and Performance Tracking",
}

export default function HumanCapitalManagementPage() {
  return <HumanCapitalManagementContent />
}