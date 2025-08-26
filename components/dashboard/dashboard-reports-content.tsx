import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, TrendingUp, Home } from "lucide-react";

export function DashboardReportsContent() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="flex items-center gap-2" title="Go to Dashboard">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Stock Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">Analyze stock levels and product movements</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/dashboard/reports/stock-levels" className="block">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Stock Levels</CardTitle>
                <CardDescription>View current stock by product in a catalogue</CardDescription>
              </div>
              <BarChart2 className="w-5 h-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">See quantities, status, and open a product to view refill history and unit price.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/reports/movements" className="block">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Movement Reports</CardTitle>
                <CardDescription>Inbound and outbound details per product</CardDescription>
              </div>
              <TrendingUp className="w-5 h-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track receipts, issues, and transfers over time.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
