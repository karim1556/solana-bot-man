"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip } from "recharts"
import { getHistoricalPriceData, PriceDataPoint } from "@/lib/market-data-service"
import { Skeleton } from "@/components/ui/skeleton"

interface CurrentStats {
  currentPrice: number;
  change24h: number;
  change7d: number;
}

export function MarketOverview() {
  const [loading, setLoading] = useState(true)
  const [priceData, setPriceData] = useState<{
    daily: PriceDataPoint[],
    weekly: PriceDataPoint[],
    monthly: PriceDataPoint[]
  }>({
    daily: [],
    weekly: [],
    monthly: []
  })
  const [currentStats, setCurrentStats] = useState<CurrentStats | null>(null)

  // Fetch historical price data for the chart
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const data = await getHistoricalPriceData()
        setPriceData(data)
      } catch (error) {
        console.error("Failed to fetch historical price data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Fetch current market stats from CoinGecko
  useEffect(() => {
    async function fetchCurrentStats() {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/solana")
        if (!response.ok) {
          throw new Error("Failed to fetch current stats from CoinGecko")
        }
        const data = await response.json()
        const marketData = data.market_data
        const stats: CurrentStats = {
          currentPrice: marketData.current_price.usd,
          change24h: marketData.price_change_percentage_24h,
          change7d: marketData.price_change_percentage_7d,
        }
        setCurrentStats(stats)
      } catch (error) {
        console.error("Error fetching current stats:", error)
      }
    }
    fetchCurrentStats()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solana Market Overview</CardTitle>
        <CardDescription>SOL price performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <Skeleton className="h-[280px] w-full" />
          </div>
        ) : (
          <Tabs defaultValue="daily">
            <TabsList className="mb-4">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="h-[300px]">
              <AreaChart
                data={priceData.daily}
                xAxisKey="date"
                series={[
                  {
                    key: "value",
                    label: "SOL Price",
                    color: "hsl(var(--primary))",
                    area: true,
                  },
                ]}
                tooltip={
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, "SOL Price"]}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return `${date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}`;
                    }}
                  />
                }
              />
            </TabsContent>

            <TabsContent value="weekly" className="h-[300px]">
              <AreaChart
                data={priceData.weekly}
                xAxisKey="date"
                series={[
                  {
                    key: "value",
                    label: "SOL Price",
                    color: "hsl(var(--primary))",
                    area: true,
                  },
                ]}
                tooltip={
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, "SOL Price"]}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return `${date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}`;
                    }}
                  />
                }
              />
            </TabsContent>

            <TabsContent value="monthly" className="h-[300px]">
              <AreaChart
                data={priceData.monthly}
                xAxisKey="date"
                series={[
                  {
                    key: "value",
                    label: "SOL Price",
                    color: "hsl(var(--primary))",
                    area: true,
                  },
                ]}
                tooltip={
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, "SOL Price"]}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return `${date.toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}`;
                    }}
                  />
                }
              />
            </TabsContent>
          </Tabs>
        )}

        {/* Dynamic Current Market Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Current Price</div>
            <div className="text-2xl font-bold">
              {currentStats ? `$${currentStats.currentPrice.toFixed(2)}` : "Loading..."}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">24h Change</div>
            <div className={`text-2xl font-bold ${currentStats && currentStats.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
              {currentStats ? `${currentStats.change24h.toFixed(2)}%` : "Loading..."}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">7d Change</div>
            <div className={`text-2xl font-bold ${currentStats && currentStats.change7d >= 0 ? "text-green-500" : "text-red-500"}`}>
              {currentStats ? `${currentStats.change7d.toFixed(2)}%` : "Loading..."}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
