import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const MORALIS_API_KEY = process.env.MORALIS_API_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjZiYjZlNDM2LTA2ZTItNDEzYi1hMzU2LThlYzU1YTdhNGI3YyIsIm9yZ0lkIjoiNDM4NTQyIiwidXNlcklkIjoiNDUxMTY3IiwidHlwZUlkIjoiYWQ2MDIyYmItZjYyOS00OTJmLThkZWEtNjJlZDZiMzU2MjAwIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDMxODA0NDksImV4cCI6NDg5ODk0MDQ0OX0.FOiHao-Rji5XwpyoZnjB4IjGiNNRDfm6yMhSKURiZ2Q";
const BASE_URL = "https://solana-gateway.moralis.io";

export interface PumpFunToken {
  name: string;
  address: string;
  priceUsd: number;
  priceChangePercentage1h: number;
  volume24h: number;
  marketCap: number;
  timestamp: number;
}

export async function getPumpFunTokens(): Promise<PumpFunToken[]> {
  try {
    console.log("🤖 Fetching Pump.fun tokens...");

    if (!MORALIS_API_KEY) {
      throw new Error("MORALIS_API_KEY is not set in environment variables");
    }

    const response = await fetch(`${BASE_URL}/token/mainnet/exchange/pumpfun/new?limit=100`, {
      headers: {
        "X-API-Key": MORALIS_API_KEY,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch Pump.fun tokens: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data || !data.result || !Array.isArray(data.result)) {
      throw new Error("Invalid response format from Pump.fun API");
    }

    return data.result.map((token: any) => ({
      name: token.name || "Unknown Token",
      address: token.address,
      priceUsd: parseFloat(token.priceUsd || 0),
      priceChangePercentage1h: parseFloat(token.priceChangePercentage1h || 0),
      volume24h: parseFloat(token.volume24h || 0),
      marketCap: parseFloat(token.marketCap || 0),
      timestamp: parseInt(token.timestamp || Date.now().toString()),
    }));
  } catch (error) {
    console.error("❌ Error fetching Pump.fun tokens:", error);
    throw error;
  }
}

export async function getTokenPriceHistory(
  address: string,
  resolution: number = 60,
  limit: number = 60
): Promise<{ timestamp: number; price: number }[]> {
  try {
    console.log(`🤖 Fetching price history for token: ${address}`);

    if (!address) {
      throw new Error("Token address is required");
    }

    const formattedAddress = address.trim();
    console.log("Formatted token address:", formattedAddress);

    const response = await fetch(
      `${BASE_URL}/token/mainnet/${formattedAddress}/price?resolution=${resolution}&limit=${limit}`,
      {
        headers: {
          "X-API-Key": MORALIS_API_KEY,
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch price history: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    let prices: any[];
    // If the API returns an array wrapped in a "result" property
    if (data && data.result && Array.isArray(data.result)) {
      prices = data.result;
    }
    // If the API returns a single object (as in your sample), wrap it in an array
    else if (data && typeof data === "object" && data.tokenAddress) {
      prices = [data];
    } else {
      throw new Error("Invalid response format from price history API");
    }

    return prices.map((price: any) => ({
      // Use the provided timestamp if available; otherwise, fallback to current time
      timestamp: price.timestamp ? parseInt(price.timestamp) : Date.now(),
      // Use the 'close' price if available, otherwise use 'usdPrice'
      price: price.close ? parseFloat(price.close) : parseFloat(price.usdPrice),
    }));
  } catch (error) {
    console.error(`❌ Error fetching price history for token ${address}:`, error);
    throw error;
  }
}



export async function getTokenMetadata(address: string): Promise<any> {
  try {
    console.log(`🤖 Fetching metadata for token: ${address}`);

    const response = await fetch(`${BASE_URL}/token/mainnet/${address}/metadata`, {
      headers: {
        "X-API-Key": MORALIS_API_KEY,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch token metadata: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error fetching metadata for token ${address}:`, error);
    throw error;
  }
} 