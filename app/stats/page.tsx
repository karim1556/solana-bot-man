"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketOverview } from "@/components/stats/market-overview"
import { TokenPerformance } from "@/components/stats/token-performance"
import { TrendingTokens } from "@/components/stats/trending-tokens"
import { AIInsights } from "@/components/stats/ai-insights"

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <DashboardShell>
      <DashboardHeader heading="Market Stats" text="Real-time Solana market insights and analytics." />

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="performance">Token Performance</TabsTrigger>
          <TabsTrigger value="trending">Trending Tokens</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <div className="mt-4 space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <MarketOverview />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <TokenPerformance />
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            <TrendingTokens />
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-4">
            <AIInsights />
          </TabsContent>
        </div>
      </Tabs>
    </DashboardShell>
  )
}

