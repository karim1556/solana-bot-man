"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react"

interface TrendingToken {
  name: string
  symbol: string
  price: string
  change: string
  isPositive: boolean
}

export function TrendingTokens() {
  const [loading, setLoading] = useState(true)
  const [tokens, setTokens] = useState<TrendingToken[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTrendingTokens() {
      try {
        setLoading(true)
        setError(null)
        
        // Define a list of known Solana token IDs on CoinGecko.
        // These IDs must match CoinGecko's identifiers.
        const solanaTokenIds = [
          "solana",      // SOL
          "bonk",        // BONK
          "jupiter",     // JUP (if available)
          "msol",        // Marinade Staked SOL
          "raydium",     // RAYDIUM (Raydium)
          "orca",        // ORCA
          "samo"         // SAMO
        ]
        const idsParam = solanaTokenIds.join(',')

        // Fetch market data for these tokens from CoinGecko markets endpoint
        const marketResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${idsParam}&order=market_cap_desc&per_page=7&page=1&sparkline=false&price_change_percentage=24h`
        )
        if (!marketResponse.ok) {
          throw new Error("Failed to fetch market data for Solana tokens")
        }
        const marketData = await marketResponse.json()

        // Sort tokens by descending absolute 24h change percentage to pick the most volatile (trending) tokens.
        marketData.sort((a: any, b: any) => 
          Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h)
        )

        // Pick top 5 tokens after sorting
        const topTokens = marketData.slice(0, 5)

        const generatedTokens: TrendingToken[] = topTokens.map((coin: any) => ({
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          price: `$${coin.current_price.toFixed(2)}`,
          change: `${coin.price_change_percentage_24h.toFixed(2)}%`,
          isPositive: coin.price_change_percentage_24h >= 0,
        }))

        setTokens(generatedTokens)
      } catch (err) {
        console.error("Error fetching trending tokens:", err)
        setError("Failed to fetch trending tokens. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingTokens()
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle>Trending Tokens</CardTitle>
        </div>
        <CardDescription>Top Solana tokens by 24h activity</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-14" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-12 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {tokens.map((token, index) => (
              <div key={index} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {token.symbol.substring(0, 2)}
                  </div>
                  <div>
                    <div className="font-medium">{token.name}</div>
                    <div className="text-xs text-muted-foreground">{token.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{token.price}</div>
                  <div className="flex items-center gap-1 justify-end">
                    {token.isPositive ? (
                      <ArrowUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={token.isPositive ? "text-xs text-green-500" : "text-xs text-red-500"}>
                      {token.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
