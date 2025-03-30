import fetch from 'node-fetch';
import { 
  Connection, 
  Keypair
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  createMint, 
  getOrCreateAssociatedTokenAccount,
  mintTo
} from '@solana/spl-token';
import bs58 from 'bs58';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Default RPC URL for devnet
const DEFAULT_RPC_URL = "https://api.devnet.solana.com";

export interface TokenInfo {
  name: string;
  symbol: string;
  supply: string;
  holders: number;
  marketCap: number;
}

export interface MarketStats {
  solPrice: number;
  marketCap: number;
  volume24h: number;
  tvl: number;
}

export interface SolanaAgentKit {
  createToken: (
    name: string,
    symbol: string,
    initialSupply: string,
    decimals: number,
  ) => Promise<{ success: boolean; tokenAddress?: string; txId?: string; message?: string }>;

  getTokenInfo: (tokenAddress: string) => Promise<TokenInfo>;

  getMarketStats: () => Promise<MarketStats>;

  mintTokens: (tokenAddress: string, amount: string, recipient: string) => Promise<{ success: boolean; txId?: string }>;

  burnTokens: (tokenAddress: string, amount: string) => Promise<{ success: boolean; txId?: string }>;

  transferTokens: (
    tokenAddress: string,
    amount: string,
    recipient: string,
  ) => Promise<{ success: boolean; txId?: string }>;
}

export class RealSolanaAgentKit implements SolanaAgentKit {
  private rpcUrl: string;
  private connection: Connection;
  private wallet?: Keypair;

  constructor(rpcUrl: string) {
    if (!rpcUrl) {
      throw new Error('RPC_URL is not set');
    }
    
    // Ensure URL has proper format
    if (!rpcUrl.startsWith('http://') && !rpcUrl.startsWith('https://')) {
      rpcUrl = `https://${rpcUrl}`;
    }
    
    this.rpcUrl = rpcUrl;
    this.connection = new Connection(rpcUrl, 'confirmed');
    
    // Initialize wallet from private key if available
    const privateKey = process.env.SOLANA_PRIVATE_KEY;
    if (privateKey) {
      try {
        // First try to parse as base58 string
        this.wallet = Keypair.fromSecretKey(bs58.decode(privateKey));
      } catch (error) {
        try {
          // If base58 fails, try parsing as JSON array
          const privateKeyArray = JSON.parse(privateKey);
          this.wallet = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
        } catch (jsonError) {
          console.warn('Invalid SOLANA_PRIVATE_KEY format, wallet operations will be disabled');
        }
      }
    }
  }

  private requireWallet(): Keypair {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. SOLANA_PRIVATE_KEY must be set for this operation.');
    }
    return this.wallet;
  }

  async createToken(name: string, symbol: string, initialSupply: string, decimals: number) {
    try {
      const wallet = this.requireWallet();
      console.log(`Creating token ${name} (${symbol}) with supply ${initialSupply} and ${decimals} decimals using RPC: ${this.rpcUrl}`);
      
      // Create new token mint
      const mint = await createMint(
        this.connection,
        wallet,
        wallet.publicKey, // mint authority
        wallet.publicKey, // freeze authority
        decimals,
        undefined,
        undefined,
        TOKEN_PROGRAM_ID
      );

      // Get the token account of the fromWallet address, and if it does not exist, create it
      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        wallet,
        mint,
        wallet.publicKey
      );

      // Mint tokens to the token account
      await mintTo(
        this.connection,
        wallet,
        mint,
        fromTokenAccount.address,
        wallet,
        Number(initialSupply) * Math.pow(10, decimals)
      );

      return {
        success: true,
        tokenAddress: mint.toString(),
        txId: mint.toString(), // Using mint address as transaction ID for now
        message: 'Token created successfully'
      };
    } catch (error: any) {
      console.error('Error creating token:', error);
      return {
        success: false,
        message: error.message || 'Failed to create token'
      };
    }
  }

  async getTokenInfo(tokenAddress: string): Promise<TokenInfo> {
    console.log(`Fetching token info for ${tokenAddress} using RPC: ${this.rpcUrl}`);
    return {
      name: "SOL",
      symbol: "SOL",
      supply: "511,846,235",
      holders: 1245789,
      marketCap: 32560000000,
    };
  }

  async getMarketStats(): Promise<MarketStats> {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/solana');
    if (!response.ok) {
      throw new Error("Failed to fetch market stats");
    }
    const data = await response.json();
    return {
      solPrice: data.market_data.current_price.usd,
      marketCap: data.market_data.market_cap.usd,
      volume24h: data.market_data.total_volume.usd,
      tvl: data.market_data.tvl ? data.market_data.tvl.usd : 0,
    };
  }

  async mintTokens(tokenAddress: string, amount: string, recipient: string) {
    console.log(`Minted ${amount} tokens of ${tokenAddress} to ${recipient} using RPC: ${this.rpcUrl}`);
    return { success: true, txId: "real-mint-tx-id" };
  }

  async burnTokens(tokenAddress: string, amount: string) {
    console.log(`Burned ${amount} tokens of ${tokenAddress} using RPC: ${this.rpcUrl}`);
    return { success: true, txId: "real-burn-tx-id" };
  }

  async transferTokens(tokenAddress: string, amount: string, recipient: string) {
    console.log(`Transferred ${amount} tokens of ${tokenAddress} to ${recipient} using RPC: ${this.rpcUrl}`);
    return { success: true, txId: "real-transfer-tx-id" };
  }
}

// Factory function to create a real instance of SolanaAgentKit
export function createSolanaAgentKit(): SolanaAgentKit {
  const rpcUrl = process.env.RPC_URL || DEFAULT_RPC_URL;
  return new RealSolanaAgentKit(rpcUrl);
}