import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TokenOverview } from "@/components/dashboard/token-overview"
import { MarketInsights } from "@/components/dashboard/market-insights"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Manage your Solana tokens and view market insights." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TokenOverview className="lg:col-span-2" />
        <MarketInsights />
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mt-4">
        <QuickActions className="md:col-span-1" />
        <RecentActivity className="md:col-span-2 lg:col-span-3" />
      </div>
    </DashboardShell>
  )
}

