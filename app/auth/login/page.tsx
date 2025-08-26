import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: 'Login - Inventara Dashboard',
  description: "Sign in to your Inventara account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left half: Spline iframe only */}
      <div className="w-1/2 h-screen flex items-center justify-center bg-gray-50 relative">
        <iframe
          src="https://my.spline.design/genkubgreetingrobot-RbwSkoEF7bvgjcB11aWgjFaw/"
          frameBorder="0"
          width="100%"
          height="100%"
          style={{ border: 'none', minHeight: '500px', minWidth: '300px' }}
          title="Spline Greeting Robot"
        />
        {/* Hide Spline logo (bottom right) */}
        <div className="absolute right-2 bottom-2 w-40 h-12 bg-white/95 rounded-lg shadow-lg z-10 flex items-center justify-center" style={{backdropFilter:'blur(8px)'}}>
          <span className="text-xs text-gray-600 font-medium">Inventara</span>
        </div>
      </div>
      {/* Right half: Login form only */}
      <div className="w-1/2 h-screen flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  )
}
