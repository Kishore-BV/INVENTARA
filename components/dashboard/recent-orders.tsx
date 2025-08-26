"use client"

import { Badge } from "@/components/ui/badge"
import { Package, ArrowUp, ArrowDown, RotateCcw } from "lucide-react"

interface StockTransaction {
  id: string
  product: string
  quantity: number
  type: "inbound" | "outbound" | "adjustment" | "transfer"
  reference: string
  location: string
  date: string
}

const stockTransactions: StockTransaction[] = [
  {
    id: "ST-001",
    product: "Industrial Drill Bits - Set of 20",
    quantity: 150,
    type: "inbound",
    reference: "PO-2024-0156",
    location: "Warehouse A - Zone 1",
    date: "2 hours ago",
  },
  {
    id: "ST-002",
    product: "Safety Helmets - Yellow",
    quantity: 45,
    type: "outbound",
    reference: "SO-2024-0287",
    location: "Warehouse B - Zone 3",
    date: "4 hours ago",
  },
  {
    id: "ST-003",
    product: "Hydraulic Oil - 55 Gallon",
    quantity: 8,
    type: "transfer",
    reference: "TR-2024-0093",
    location: "Warehouse A → B",
    date: "6 hours ago",
  },
  {
    id: "ST-004",
    product: "Steel Rods - 2m Length",
    quantity: 25,
    type: "adjustment",
    reference: "ADJ-2024-0034",
    location: "Warehouse C - Zone 2",
    date: "8 hours ago",
  },
  {
    id: "ST-005",
    product: "Work Gloves - Size L",
    quantity: 200,
    type: "inbound",
    reference: "PO-2024-0157",
    location: "Warehouse A - Zone 4",
    date: "1 day ago",
  },
]

const typeColors = {
  inbound: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  outbound: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  transfer: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  adjustment: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
}

const getTypeIcon = (type: StockTransaction['type']) => {
  switch (type) {
    case 'inbound':
      return <ArrowDown className="h-4 w-4" />
    case 'outbound':
      return <ArrowUp className="h-4 w-4" />
    case 'transfer':
      return <RotateCcw className="h-4 w-4" />
    case 'adjustment':
      return <Package className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

export default function RecentStockTransactions() {
  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Stock Transactions</h3>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View all</button>
      </div>
      <div className="space-y-4">
        {stockTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${typeColors[transaction.type]}`}>
                {getTypeIcon(transaction.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{transaction.product}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">{transaction.id}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{transaction.location}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.reference}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0">
              <Badge className={`${typeColors[transaction.type]} border-0 capitalize`}>{transaction.type}</Badge>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {transaction.type === 'outbound' ? '-' : '+'}{transaction.quantity}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
