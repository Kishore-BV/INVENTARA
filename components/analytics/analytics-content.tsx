"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Target, PieChart, ArrowRight } from "lucide-react"
import Link from "next/link"

export function AnalyticsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Comprehensive inventory analytics and insights for data-driven decisions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-[#4B6587]" />
              <CardTitle>Inventory Analytics</CardTitle>
            </div>
            <CardDescription>Detailed analysis of inventory performance and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Track product performance, stock levels, and identify optimization opportunities.
            </p>
            <Link href="/analytics/inventory">
              <Button className="w-full bg-[#4B6587] hover:bg-[#3A5068]">
                View Analytics <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-[#6B8A7A]" />
              <CardTitle>Turnover Analysis</CardTitle>
            </div>
            <CardDescription>Analyze inventory turnover rates and efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Optimize stock levels by understanding how quickly products move.
            </p>
            <Link href="/analytics/turnover">
              <Button className="w-full bg-[#6B8A7A] hover:bg-[#5A7369]">
                View Analysis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-[#F4A261]" />
              <CardTitle>Demand Forecasting</CardTitle>
            </div>
            <CardDescription>Predict future demand and plan inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Use historical data to forecast demand and prevent stockouts.
            </p>
            <Link href="/analytics/forecasting">
              <Button className="w-full bg-[#F4A261] hover:bg-[#E7934E]">
                View Forecasting <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Turnover Rate</span>
                <span className="text-lg font-bold text-[#4B6587]">4.2x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Forecast Accuracy</span>
                <span className="text-lg font-bold text-[#6B8A7A]">87%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Stock Optimization</span>
                <span className="text-lg font-bold text-[#F4A261]">92%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Analysis</CardTitle>
            <CardDescription>Latest analytical insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-4 w-4 text-[#4B6587]" />
                <span className="text-sm">Monthly inventory report generated</span>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-4 w-4 text-[#6B8A7A]" />
                <span className="text-sm">Turnover analysis updated</span>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="h-4 w-4 text-[#F4A261]" />
                <span className="text-sm">Demand forecast refreshed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
