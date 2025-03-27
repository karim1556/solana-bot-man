"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/ui/chart"
import { Tooltip } from "recharts"
import { getHistoricalPriceData, PriceDataPoint } from "@/lib/market-data-service"
import { Skeleton } from "@/components/ui/skeleton"

// Define the shape of our dynamic cost analysis data
interface CostAnalysisData {
  freeTier: {
    credit: number       // e.g. $1 Credit
    queries: number      // e.g. covers ~10,000 queries
    costPerThousand: number // e.g. $0.0001 per 1,000 tokens
  }
  scaling: {
    cost: number         // e.g. $5
    users: number        // e.g. for 100,000 Solana users
  }
}

interface TokenOverviewProps {
  className?: string
}

// Simulated fetch function for cost analysis data
async function fetchCostAnalysisData(): Promise<CostAnalysisData> {
  // In a real implementation, replace with an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        freeTier: {
          credit: 1,
          queries: 10000,
          costPerThousand: 0.0001,
        },
        scaling: {
          cost: 5,
          users: 100000,
        },
      })
    }, 1000)
  })
}

export function TokenOverview({ className }: TokenOverviewProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<PriceDataPoint[]>([])
  const [costAnalysis, setCostAnalysis] = useState<CostAnalysisData | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const { monthly } = await getHistoricalPriceData()
        // Scale for portfolio value (10x SOL price for demonstration)
        setData(
          monthly.map((point) => ({
            ...point,
            value: point.value * 10 * (1 + Math.random() * 0.4),
          }))
        )
      } catch (error) {
        console.error("Failed to fetch portfolio data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    async function fetchCosts() {
      try {
        const costData = await fetchCostAnalysisData()
        setCostAnalysis(costData)
      } catch (error) {
        console.error("Failed to fetch cost analysis data:", error)
      }
    }
    fetchCosts()
  }, [])

  return (
    <div className={className}>
      {/* Token Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Token Overview</CardTitle>
          <CardDescription>Your token portfolio performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-[280px] w-full" />
            </div>
          ) : (
            <div className="h-[300px]">
              <LineChart
                data={data}
                xAxisKey="date"
                series={[
                  {
                    key: "value",
                    label: "Portfolio Value",
                    color: "hsl(var(--primary))",
                  },
                ]}
                tooltip={
                  <Tooltip
                    formatter={(value) => [
                      `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                      "Value",
                    ]}
                    labelFormatter={(label) => {
                      const date = new Date(label)
                      return `${date.toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}`
                    }}
                  />
                }
              />
            </div>
          )}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground">Total Value</div>
              <div className="text-2xl font-bold">$3,600</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground">Growth (YTD)</div>
              <div className="text-2xl font-bold text-green-500">+260%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bot Token Usage Cost Analysis Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Bot Token Usage Cost Analysis</CardTitle>
          <CardDescription>
            Estimate your usage costs based on current pricing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {costAnalysis ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Free Tier</div>
                <div className="text-2xl font-bold">${costAnalysis.freeTier.credit} Credit</div>
                <div className="text-sm text-muted-foreground">
                  Covers ~{costAnalysis.freeTier.queries.toLocaleString()} queries at ${costAnalysis.freeTier.costPerThousand.toFixed(4)} per 1,000 tokens
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Scaling</div>
                <div className="text-2xl font-bold">${costAnalysis.scaling.cost}</div>
                <div className="text-sm text-muted-foreground">
                  Supports {costAnalysis.scaling.users.toLocaleString()} Solana users
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Skeleton className="h-24 w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
