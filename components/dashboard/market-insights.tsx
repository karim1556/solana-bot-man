"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getMarketInsights, MarketInsight } from "@/lib/market-data-service"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw } from "lucide-react"

export function MarketInsights() {
  const [insights, setInsights] = useState<MarketInsight[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchMarketInsights() {
    console.log("🔄 Fetching market insights...")
    try {
      setLoading(true)
      const data = await getMarketInsights()
      console.log("✅ Market insights fetched successfully:", data)
      setInsights(data)
    } catch (error) {
      console.error("❌ Failed to fetch market insights:", error)
    } finally {
      setLoading(false)
      console.log("🏁 Market insights fetch completed")
    }
  }

  useEffect(() => {
    console.log("🚀 MarketInsights component mounted")
    fetchMarketInsights()
    
    // Refresh every 60 seconds
    const interval = setInterval(() => {
      console.log("⏰ Refreshing market insights (60s interval)")
      fetchMarketInsights()
    }, 60000)

    return () => {
      console.log("👋 MarketInsights component unmounting")
      clearInterval(interval)
    }
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Market Insights</CardTitle>
          <CardDescription>Current Solana ecosystem metrics</CardDescription>
        </div>
        {!loading && (
          <RefreshCw
            className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors"
            onClick={() => {
              console.log("🔄 Manual refresh triggered")
              fetchMarketInsights()
            }}
          />
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.title} className="flex items-center justify-between">
                <div className="text-sm font-medium">{insight.title}</div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{insight.value}</span>
                  <Badge variant={insight.positive ? "default" : "destructive"} className="text-xs">
                    {insight.change}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

