import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Chatbot } from "@/components/chatbot"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Inventara - Inventory Management System",
  description: "Modern inventory management system built with Next.js and Tailwind CSS. Track stock, manage suppliers, and streamline your inventory operations.",
  generator: 'v0.app'
}

import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const showChatbot = pathname !== "/auth/login" && pathname !== "/auth/forgot";
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            {children}
            {showChatbot && <Chatbot />}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
