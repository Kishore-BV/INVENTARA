"use client"

import type React from "react"
import { useState } from "react"
import Spline from "@splinetool/react-spline"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  })
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await login(formData.username, formData.password)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Spline background */}
      <div className="absolute inset-0 -z-10">
        {/* Use your Spline scene link here */}
        <iframe src="https://my.spline.design/genkubgreetingrobot-RbwSkoEF7bvgjcB11aWgjFaw/" frameBorder="0" width="100%" height="100%" style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:-1}} allowFullScreen />
        {/* Readability overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/35 to-slate-950/70" />
        {/* Hide Spline logo (bottom right) */}
        <div className="absolute right-2 bottom-2 w-40 h-12 bg-white/95 rounded-lg shadow-lg z-10 flex items-center justify-center" style={{backdropFilter:'blur(8px)'}}>
          <span className="text-xs text-gray-600 font-medium">Inventara</span>
        </div>
      </div>

      {/* Centered floating card */}
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-black/10">
          {/* Header */}
          <div className="px-6 pt-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-slate-600">
              Sign in to continue managing your inventory
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-6">
            <div>
              <Label htmlFor="username" className="text-slate-900">Email</Label>
              <div className="relative mt-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-200/70" />
                <Input
                  id="username"
                  type="email"
                  required
                  className="pl-10 bg-white placeholder:text-slate-400 text-slate-900 border-slate-300 focus-visible:ring-slate-900"
                  placeholder="Enter your email"
                  value={formData.username}
                  onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-900">Password</Label>
              <div className="relative mt-1">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-200/70" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="pl-10 pr-10 bg-white placeholder:text-slate-400 text-slate-900 border-slate-300 focus-visible:ring-slate-900"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-200/80 hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData((p) => ({ ...p, rememberMe: checked as boolean }))
                  }
                />
                <Label htmlFor="remember" className="text-sm text-slate-900">
                  Remember me
                </Label>
              </div>
              <Link href="/auth/forgot" className="text-sm font-medium text-blue-700 hover:text-blue-900">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-900 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            {error && (
              <p className="text-sm text-red-600 text-center" role="alert">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
