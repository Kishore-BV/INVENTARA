import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "%s - iERP | Inventara",
    default: "iERP - Inventara ERP System",
  },
  description: "Comprehensive Enterprise Resource Planning system with integrated Finance, Materials Management, Sales & Distribution modules",
}

export default function IERPLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  )
}