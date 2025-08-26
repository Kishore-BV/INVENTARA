import type { Metadata } from "next"
import { ForgotForm } from "@/components/auth/forgot-form"

export const metadata: Metadata = {
  title: 'Forgot Password - Inventara Dashboard - OpenSource CMS',
  description: "CmsFullForm dashboard build with Next.js and Tailwind CSS",
}

export default function ForgotPage() {
  return <ForgotForm />
}
