"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Sparkles } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { generateMarketInsights, AIInsight } from "@/lib/ai-service"

export function AIInsights() {
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [error, setError] = useState<string | null>(null)

  const refreshInsights = async () => {
    try {
      setLoading(true)
      setError(null)
      const newInsights = await generateMarketInsights("sentiment", ["Solana price is up", "DeFi growth on Solana"])
      setInsights(newInsights)
    } catch (err) {
      console.error("Error refreshing insights:", err)
      setError("Failed to generate insights. Please try again later.")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    refreshInsights()
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI-Powered Insights</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={refreshInsights} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>Market analysis powered by Together AI</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}
        <div className="space-y-4">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              {insights.map((insight, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{insight.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{insight.content}</p>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-muted-foreground">{insight.timestamp}</p>
                  </CardFooter>
                </Card>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

