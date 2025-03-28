import dotenv from "dotenv";
import fetch from "node-fetch";
import { getPumpFunTokens as getPumpFunTokensRaw, getTokenPriceHistory, PumpFunToken } from "./pumpfun-service";

dotenv.config(); // Load environment variables

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

// Fetch token data from Pump.fun using Moralis API
export async function getPumpFunTokens(): Promise<MarketInsight[]> {
  try {
    const tokens = await getPumpFunTokensRaw();
    
    return tokens.map((token: PumpFunToken) => ({
      title: token.name,
      value: `$${token.priceUsd.toFixed(6)}`,
      change: `${token.priceChangePercentage1h.toFixed(2)}%`,
      positive: token.priceChangePercentage1h >= 0,
    }));
  } catch (error) {
    console.error("❌ Error processing Pump.fun token data:", error);
    throw error;
  }
}

// Fetch historical price data for a specific token
export async function getHistoricalPriceData(tokenAddress: string = "So11111111111111111111111111111111111111112"): Promise<PriceDataPoint[]> {
  try {
    const priceHistory = await getTokenPriceHistory(tokenAddress);
    
    return priceHistory.map((point) => ({
      date: new Date(point.timestamp * 1000).toISOString(),
      value: point.price,
    }));
  } catch (error) {
    console.error(`❌ Error processing historical price data for token: ${tokenAddress}`, error);
    throw error;
  }
}

// Fetch token performance data based on 1-hour price change
export async function getTokenPerformanceData(): Promise<TokenPerformanceData[]> {
  try {
    const tokens = await getPumpFunTokensRaw();
    
    return tokens.map((token) => ({
      token: token.name,
      value: token.priceChangePercentage1h,
    }));
  } catch (error) {
    console.error("❌ Error processing token performance data:", error);
    throw error;
  }
}
