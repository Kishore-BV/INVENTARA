import type { Metadata } from "next"
import { FinishedGoodsContent } from "@/components/products/finished-goods-content"

export const metadata: Metadata = {
  title: "Finished Goods - Inventara",
  description: "Manage finished goods inventory and distribution",
}

export default function FinishedGoodsPage() {
  return <FinishedGoodsContent />
}
