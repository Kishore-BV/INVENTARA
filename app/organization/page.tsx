import type { Metadata } from "next"
import { OrganizationContent } from "@/components/organization/organization-content"

export const metadata: Metadata = {
  title: "Organization - Inventara",
  description: "Manage your organization structure and settings",
}

export default function OrganizationPage() {
  return <OrganizationContent />
}
