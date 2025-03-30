import { createSolanaAgentKit } from "./solana-agent-kit";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables if needed

export interface PriceDataPoint {
  date: string;
  value: number;
}

export interface TokenPerformanceData {
  token: string;
  value: number;
}

export interface MarketInsight {
  title: string;
  value: string;
  change: string;
  positive: boolean;
}

// Use CoinGecko API to fetch real-time market insights for Solana
export async function getMarketInsights(): Promise<MarketInsight[]> {
  try {
    console.log("🤖 Fetching market insights from CoinGecko...");

    const response = await fetch("https://api.coingecko.com/api/v3/coins/solana");
    if (!response.ok) {
      throw new Error("Failed to fetch data from CoinGecko");
    }
    const data = await response.json();

    const currentPrice = data.market_data.current_price.usd;
    const priceChange24h = data.market_data.price_change_percentage_24h;
    const marketCap = data.market_data.market_cap.usd;
    const marketCapChange24h = data.market_data.market_cap_change_percentage_24h;
    const volume24h = data.market_data.total_volume.usd;
    // TVL may not be available for all coins; if not available, set as 0
    const tvl = data.market_data.tvl?.usd || 0;

    const insights: MarketInsight[] = [
      {
        title: "SOL Price",
        value: `$${currentPrice.toFixed(2)}`,
        change: `${priceChange24h.toFixed(2)}%`,
        positive: priceChange24h >= 0,
      },
      {
        title: "Market Cap",
        value: `$${(marketCap / 1e9).toFixed(1)}B`,
        change: `${marketCapChange24h.toFixed(2)}%`,
        positive: marketCapChange24h >= 0,
      },
      {
        title: "24h Volume",
        value: `$${(volume24h / 1e9).toFixed(1)}B`,
        change: "N/A",
        positive: true,
      },
      {
        title: "TVL in DeFi",
        value: tvl > 0 ? `$${(tvl / 1e9).toFixed(1)}B` : "N/A",
        change: "N/A",
        positive: true,
      },
    ];

    console.log("✅ Parsed market insights:", insights);
    return insights;
  } catch (error) {
    console.error("❌ Error fetching market insights:", error);
    throw error;
  }
}

export async function getHistoricalPriceData(): Promise<{
  daily: PriceDataPoint[];
  weekly: PriceDataPoint[];
  monthly: PriceDataPoint[];
}> {
  try {
    const solanaKit = createSolanaAgentKit();
    const { solPrice } = await solanaKit.getMarketStats();

    return {
      daily: generateHistoricalData(14, solPrice, "daily"),
      weekly: generateHistoricalData(11, solPrice, "weekly"),
      monthly: generateHistoricalData(12, solPrice, "monthly"),
    };
  } catch (error) {
    console.error("❌ Error generating historical price data:", error);
    throw error;
  }
}

export async function getTokenPerformanceData(): Promise<{
  "7d": TokenPerformanceData[];
  "30d": TokenPerformanceData[];
  "90d": TokenPerformanceData[];
}> {
  try {
    const tokens = ["SOL", "BONK", "JTO", "PYTH", "RAY", "ORCA", "MSOL", "SAMO"];

    const generate = (range: number) =>
      tokens.map((token) => ({
        token,
        value: Math.random() * range * 2 - range * 0.3,
      }));

    return {
      "7d": generate(25),
      "30d": generate(50),
      "90d": generate(100),
    };
  } catch (error) {
    console.error("❌ Error fetching token performance data:", error);
    throw error;
  }
}

// Helper function to generate realistic historical price data
function generateHistoricalData(
  count: number,
  currentPrice: number,
  timeframe: "daily" | "weekly" | "monthly"
): PriceDataPoint[] {
  const result: PriceDataPoint[] = [];
  const now = new Date();

  const volatility = timeframe === "daily" ? 0.03 : timeframe === "weekly" ? 0.08 : 0.15;
  const upwardTrend = -0.4;

  let price = currentPrice * (1 - Math.random() * 0.3 - count * volatility * upwardTrend);

  for (let i = 0; i < count; i++) {
    const date = new Date(now);

    if (timeframe === "daily") {
      date.setDate(date.getDate() - (count - i - 1));
    } else if (timeframe === "weekly") {
      date.setDate(date.getDate() - (count - i - 1) * 7);
    } else {
      date.setMonth(date.getMonth() - (count - i - 1));
    }

    result.push({
      date:
        timeframe === "monthly"
          ? date.toISOString().split("T")[0].substring(0, 7)
          : date.toISOString().split("T")[0],
      value: price,
    });

    const randomFactor = Math.random() * volatility * 2 - volatility;
    const trendFactor = (i / count) * volatility * upwardTrend;
    price = price * (1 + randomFactor + trendFactor);
  }

  if (result.length > 0) {
    result[result.length - 1].value = currentPrice * (0.98 + Math.random() * 0.04);
  }

  return result;
}