"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPumpFunTokens, MarketInsight } from "@/lib/market-data-service"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const ITEMS_PER_PAGE = 15;

export function MarketInsights() {
  const [insights, setInsights] = useState<MarketInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(insights.length / ITEMS_PER_PAGE)

  async function fetchMarketInsights() {
    console.log("🔄 Fetching market insights...")
    try {
      setLoading(true)
      const data = await getPumpFunTokens()
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

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentInsights = insights.slice(startIndex, endIndex)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Market Insights</CardTitle>
          <CardDescription>Top {ITEMS_PER_PAGE} Solana ecosystem metrics</CardDescription>
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
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
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
          <>
            <div className="space-y-4">
              {currentInsights.map((insight, index) => (
                <div key={`${insight.title}-${startIndex + index}`} className="flex items-center justify-between">
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
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

