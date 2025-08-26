import type { Metadata } from "next"
import Layout from "@/components/cmsfullform/layout"
import { SettingsContent } from "@/components/settings/settings-content"

export const metadata: Metadata = {
  title: "Settings | Inventara",
  description: "Manage your account, billing, security, and preferences",
}

export default function SettingsPage() {
  return (
    <Layout>
      <SettingsContent />
    </Layout>
  )
}
