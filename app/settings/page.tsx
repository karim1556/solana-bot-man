"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Bot settings
  const [discordToken, setDiscordToken] = useState("")
  const [discordClientId, setDiscordClientId] = useState("")
  const [telegramToken, setTelegramToken] = useState("")
  const [botsEnabled, setBotsEnabled] = useState(false)

  // API settings
  const [togetherKey, setTogetherKey] = useState("")
  const [solanaRpcUrl, setSolanaRpcUrl] = useState("https://api.mainnet-beta.solana.com")

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [priceAlerts, setPriceAlerts] = useState(true)

  const saveBotSettings = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Bot Settings Saved",
        description: "Your bot configuration has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error Saving Settings",
        description: "There was an error saving your bot settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveApiSettings = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "API Settings Saved",
        description: "Your API configuration has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error Saving Settings",
        description: "There was an error saving your API settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveNotificationSettings = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Notification Settings Saved",
        description: "Your notification preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error Saving Settings",
        description: "There was an error saving your notification settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const initializeBots = async () => {
    setIsLoading(true)

    try {
      // Call the API route to initialize bots
      const response = await fetch("/api/init-bots")
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Bots Initialized",
          description: data.message,
        })
      } else {
        toast({
          title: "Bot Initialization Failed",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error Initializing Bots",
        description: "There was an error initializing the bots.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your application settings and preferences." />

      <Tabs defaultValue="bots" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bots">Bot Settings</TabsTrigger>
          <TabsTrigger value="api">API Configuration</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="bots" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bot Configuration</CardTitle>
              <CardDescription>Configure your Discord and Telegram bots.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="bots-enabled">Enable Bots</Label>
                  <p className="text-sm text-muted-foreground">Turn on/off all bot functionality</p>
                </div>
                <Switch id="bots-enabled" checked={botsEnabled} onCheckedChange={setBotsEnabled} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discord-token">Discord Bot Token</Label>
                <Input
                  id="discord-token"
                  placeholder="Enter your Discord bot token"
                  value={discordToken}
                  onChange={(e) => setDiscordToken(e.target.value)}
                  type="password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discord-client-id">Discord Client ID</Label>
                <Input
                  id="discord-client-id"
                  placeholder="Enter your Discord client ID"
                  value={discordClientId}
                  onChange={(e) => setDiscordClientId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram-token">Telegram Bot Token</Label>
                <Input
                  id="telegram-token"
                  placeholder="Enter your Telegram bot token"
                  value={telegramToken}
                  onChange={(e) => setTelegramToken(e.target.value)}
                  type="password"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={initializeBots} disabled={isLoading}>
                Initialize Bots
              </Button>
              <Button onClick={saveBotSettings} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Configure API keys and endpoints for external services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="together-key">Together AI API Key</Label>
                <Input
                  id="together-key"
                  placeholder="Enter your Together AI API key"
                  value={togetherKey}
                  onChange={(e) => setTogetherKey(e.target.value)}
                  type="password"
                />
                <p className="text-xs text-muted-foreground">Used for AI-powered insights and analysis</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="solana-rpc">Solana RPC URL</Label>
                <Input
                  id="solana-rpc"
                  placeholder="Enter Solana RPC URL"
                  value={solanaRpcUrl}
                  onChange={(e) => setSolanaRpcUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Default: https://api.mainnet-beta.solana.com</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveApiSettings} className="ml-auto" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                </div>
                <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                </div>
                <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="price-alerts">Price Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about significant price changes</p>
                </div>
                <Switch id="price-alerts" checked={priceAlerts} onCheckedChange={setPriceAlerts} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveNotificationSettings} className="ml-auto" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

