"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Wallet, ArrowUpDown, Copy, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function WalletPage() {
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const walletProviders = [
    {
      name: "Phantom",
      icon: "PH",
      description: "Connect to Phantom Wallet",
    },
    {
      name: "Solflare",
      icon: "SF",
      description: "Connect to Solflare Wallet",
    },
    {
      name: "Backpack",
      icon: "BP",
      description: "Connect to Backpack Wallet",
    },
  ]

  const tokens = [
    {
      name: "Solana",
      symbol: "SOL",
      balance: "2.45",
      value: "$387.91",
      icon: "SOL",
    },
    {
      name: "USDC",
      symbol: "USDC",
      balance: "150.00",
      value: "$150.00",
      icon: "USDC",
    },
    {
      name: "Bonk",
      symbol: "BONK",
      balance: "1,250,000",
      value: "$26.75",
      icon: "BONK",
    },
  ]

  const connectWallet = async (provider: string) => {
    setIsConnecting(true)

    try {
      // Simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful connection
      setIsConnected(true)
      setWalletAddress("8xyt4ew7XM5rnCCpx9eFXJKRRzYJQBx4ULdiS9gREKP2")

      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${provider} wallet.`,
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress("")

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)

    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard.",
    })
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Wallet" text="Connect your Solana wallet and manage your tokens." />

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>Connect your Solana wallet to create and manage tokens.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {walletProviders.map((provider) => (
              <Button
                key={provider.name}
                variant="outline"
                className="w-full justify-start"
                onClick={() => connectWallet(provider.name)}
                disabled={isConnecting}
              >
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={`/placeholder.svg?height=24&width=24`} alt={provider.name} />
                  <AvatarFallback>{provider.icon}</AvatarFallback>
                </Avatar>
                {isConnecting ? "Connecting..." : provider.description}
              </Button>
            ))}
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Wallet Connected</CardTitle>
                  <CardDescription>Manage your connected wallet and tokens.</CardDescription>
                </div>
                <Button variant="outline" onClick={disconnectWallet}>
                  Disconnect
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  <div className="font-mono text-sm">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={copyAddress}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy address</span>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={`https://explorer.solana.com/address/${walletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View on explorer</span>
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="tokens" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="tokens" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Tokens</CardTitle>
                  <CardDescription>Manage your Solana tokens and balances.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tokens.map((token) => (
                      <div key={token.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={token.name} />
                            <AvatarFallback>{token.icon}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{token.name}</div>
                            <div className="text-sm text-muted-foreground">{token.symbol}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="font-medium">{token.balance}</div>
                          <div className="text-sm text-muted-foreground">{token.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Transfer Tokens
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent wallet transactions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-9 w-9 rounded-full flex items-center justify-center ${i % 2 === 0 ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"} dark:bg-opacity-20`}
                          >
                            {i % 2 === 0 ? <ArrowUpDown className="h-5 w-5" /> : <Wallet className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="font-medium">{i % 2 === 0 ? "Token Transfer" : "Wallet Connected"}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(Date.now() - i * 3600000).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <a href="#" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">View transaction</span>
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </DashboardShell>
  )
}

