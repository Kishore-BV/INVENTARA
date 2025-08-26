import type { Metadata } from "next";
import Content from "@/components/cmsfullform/content";
import Layout from "@/components/cmsfullform/layout";
import { Suspense } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';

export const metadata: Metadata = {
  title: "Inventara Dashboard",
  description: "Inventory management dashboard for tracking stock, products, and suppliers",
};

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    }>
      <Layout>
        <Content />
      </Layout>
    </Suspense>
  );
}
