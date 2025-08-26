import type { Metadata } from "next"
import { InventoryDashboard } from "@/components/inventory/inventory-dashboard"
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: "Inventory Management - Inventara",
  description: "Complete inventory management system with stock tracking, warehouse management, and analytics",
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="container mx-auto py-6">
        <InventoryDashboard />
      </div>
    </Suspense>
  )
}
