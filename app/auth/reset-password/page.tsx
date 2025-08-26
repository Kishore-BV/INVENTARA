import type { Metadata } from "next"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password - Inventara",
  description: "CmsFullForm dashboard build with Next.js and Tailwind CSS",
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
