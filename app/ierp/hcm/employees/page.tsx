import type { Metadata } from "next"
import { EmployeeRecordsContent } from "@/components/ierp/hcm/employee-records-content"

export const metadata: Metadata = {
  title: "Employee Records - Human Capital Management",
  description: "Comprehensive employee information management with personal details, job information, and performance tracking",
}

export default function EmployeeRecordsPage() {
  return <EmployeeRecordsContent />
}