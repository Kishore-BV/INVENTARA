import type { Metadata } from "next"
import { BudgetsContent } from "@/components/projects/budgets-content"

export const metadata: Metadata = {
  title: "Project Budgets - Inventara",
  description: "Manage project budgets and resource allocation",
}

export default function BudgetsPage() {
  return <BudgetsContent />
}
