import type { Metadata } from "next"
import { PayrollContent } from "@/components/ierp/hcm/payroll-content"

export const metadata: Metadata = {
  title: "Payroll Management - HCM",
  description: "Payroll processing, salary calculation, tax management, and compensation analytics",
}

export default function PayrollPage() {
  return <PayrollContent />
}