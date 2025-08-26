import type { Metadata } from "next"
import Layout from "@/components/cmsfullform/layout"
import { ThemeCustomizer } from "@/components/theme-customizer"

export const metadata: Metadata = {
  title: "Settings | Iventara",
  description: "Customize the Iventara dashboard theme and layout",
}

export default function SettingsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <ThemeCustomizer embed />
      </div>
    </Layout>
  )
}
