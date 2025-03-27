"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip } from "recharts"
import { getTokenPerformanceData, TokenPerformanceData } from "@/lib/market-data-service"
import { Skeleton } from "@/components/ui/skeleton"

export function TokenPerformance() {
  const [timeframe, setTimeframe] = useState("7d")
  const [loading, setLoading] = useState(true)
  const [performanceData, setPerformanceData] = useState<{
    "7d": TokenPerformanceData[],
    "30d": TokenPerformanceData[],
    "90d": TokenPerformanceData[]
  }>({
    "7d": [],
    "30d": [],
    "90d": []
  })

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const data = await getTokenPerformanceData()
        setPerformanceData(data)
      } catch (error) {
        console.error("Failed to fetch token performance data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Token Performance</CardTitle>
          <CardDescription>Price performance by timeframe</CardDescription>
        </div>
        <Select
          value={timeframe}
          onValueChange={setTimeframe}
          disabled={loading}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
            <SelectItem value="90d">90 Days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <Skeleton className="h-[280px] w-full" />
          </div>
        ) : (
          <div className="h-[300px]">
            <BarChart
              data={performanceData[timeframe as keyof typeof performanceData]}
              xAxisKey="token"
              series={[
                {
                  key: "value",
                  label: "% Change",
                  valueFormatter: (value) => `${value.toFixed(1)}%`,
                  color: (data: any) => (data && data.value >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))"),
                },
              ]}
              tooltip={
                <Tooltip
                  formatter={(value) => [`${Number(value).toFixed(1)}%`, "Change"]}
                  cursor={{ fill: "hsl(var(--muted))" }}
                />
              }
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

