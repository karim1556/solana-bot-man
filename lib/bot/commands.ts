import { Command, CommandContext, CommandResponse } from "./types";
import { RealSolanaAgentKit } from "../solana-agent-kit";
import { HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import { DynamicTool } from "@langchain/core/tools";
import * as dotenv from "dotenv";
import { Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";

dotenv.config();

async function initializeAgent() {
  // Check for required environment variables
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set in environment variables");
  }
  if (!process.env.RPC_URL) {
    throw new Error("RPC_URL is not set in environment variables");
  }
  if (!process.env.SOLANA_PRIVATE_KEY) {
    throw new Error("SOLANA_PRIVATE_KEY is not set in environment variables");
  }

  const llm = new ChatOpenAI({
    modelName: "gpt-4-turbo-preview",
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const memory = new MemorySaver();

  // Initialize Solana connection and wallet
  const connection = new Connection(process.env.RPC_URL);
  
  // Handle private key in base58 format
  let privateKeyUint8: Uint8Array;
  try {
    // First try to parse as base58 string
    privateKeyUint8 = bs58.decode(process.env.SOLANA_PRIVATE_KEY);
  } catch (error) {
    try {
      // If base58 fails, try parsing as JSON array
      const privateKeyArray = JSON.parse(process.env.SOLANA_PRIVATE_KEY);
      privateKeyUint8 = new Uint8Array(privateKeyArray);
    } catch (jsonError) {
      throw new Error("Invalid SOLANA_PRIVATE_KEY format. Must be either base58 string or JSON array.");
    }
  }
  
  const wallet = Keypair.fromSecretKey(privateKeyUint8);

  // Create Solana tools for the agent
  const solanaKit = new RealSolanaAgentKit(process.env.RPC_URL);
  const tools = [
    new DynamicTool({
      name: "GET_ASSET",
      description: "Retrieve information about a Solana asset/token. Input should be a JSON string with tokenAddress.",
      func: async (input: string) => {
        const { tokenAddress } = JSON.parse(input);
        const tokenInfo = await solanaKit.getTokenInfo(tokenAddress);
        return JSON.stringify(tokenInfo);
      }
    }),
    new DynamicTool({
      name: "DEPLOY_TOKEN",
      description: "Deploy a new token on Solana. Input should be a JSON string with name, symbol, supply, and decimals.",
      func: async (input: string) => {
        const { name, symbol, supply, decimals } = JSON.parse(input);
        const result = await solanaKit.createToken(name, symbol, supply, decimals);
        return JSON.stringify(result);
      }
    }),
    new DynamicTool({
      name: "GET_PRICE",
      description: "Fetch price information for tokens. Input should be a JSON string with tokenAddress.",
      func: async (input: string) => {
        const { tokenAddress } = JSON.parse(input);
        const stats = await solanaKit.getMarketStats();
        return JSON.stringify({
          tokenAddress,
          ...stats
        });
      }
    }),
    new DynamicTool({
      name: "WALLET_ADDRESS",
      description: "Get the wallet address",
      func: async () => {
        return JSON.stringify({
          address: wallet.publicKey.toString(),
        });
      }
    }),
    new DynamicTool({
      name: "BALANCE",
      description: "Check wallet balance",
      func: async () => {
        try {
          // Create a new connection specifically for devnet
          const devnetConnection = new Connection("https://api.devnet.solana.com", {
            commitment: "confirmed"
          });
          
          const balance = await devnetConnection.getBalance(wallet.publicKey);
          return JSON.stringify({
            address: wallet.publicKey.toString(),
            balance: balance / 1e9, // Convert lamports to SOL
            network: "devnet"
          });
        } catch (error: any) {
          console.error("Balance check error:", error);
          return JSON.stringify({
            error: "Failed to check balance",
            details: error.message
          });
        }
      }
    }),
    new DynamicTool({
      name: "TRANSFER",
      description: "Transfer tokens between wallets. Input should be a JSON string with recipient, amount, and tokenAddress.",
      func: async (input: string) => {
        const { recipient, amount, tokenAddress } = JSON.parse(input);
        const result = await solanaKit.transferTokens(tokenAddress, amount, recipient);
        return JSON.stringify(result);
      }
    }),
    new DynamicTool({
      name: "MINT_NFT",
      description: "Create and mint new NFTs. Input should be a JSON string with name, symbol, and uri.",
      func: async (input: string) => {
        try {
          const { name, symbol, uri } = JSON.parse(input);
          
          // Create a new connection specifically for devnet
          const devnetConnection = new Connection("https://api.devnet.solana.com", {
            commitment: "confirmed"
          });
          
          // Initialize Metaplex with keypairIdentity and devnet connection
          const metaplex = new Metaplex(devnetConnection).use(keypairIdentity(wallet));
          
          // Create NFT
          const { nft } = await metaplex
            .nfts()
            .create({
              uri: uri,
              name: name,
              symbol: symbol,
              sellerFeeBasisPoints: 500, // 5% royalty
              isMutable: true,
            });

          return JSON.stringify({
            success: true,
            message: `NFT created successfully on devnet!`,
            nft: {
              address: nft.address.toString(),
              name: nft.name,
              symbol: nft.symbol,
              uri: nft.uri,
              network: "devnet"
            }
          });
        } catch (error: any) {
          console.error("NFT minting error:", error);
          return JSON.stringify({
            error: "Failed to mint NFT",
            details: error.message,
            suggestion: "Make sure you have enough SOL in your wallet for the transaction fees. You can check your balance using the BALANCE command."
          });
        }
      }
    }),
    new DynamicTool({
      name: "TRADE",
      description: "Execute token trades. Input should be a JSON string with tokenAddress, amount, and type (buy/sell).",
      func: async (input: string) => {
        const { tokenAddress, amount, type } = JSON.parse(input);
        // Implement trading logic here
        return JSON.stringify({
          success: true,
          message: `${type.toUpperCase()} order for ${amount} tokens at address ${tokenAddress} to be implemented`,
        });
      }
    }),
    new DynamicTool({
      name: "REQUEST_FUNDS",
      description: "Request funds (useful for testing/development)",
      func: async () => {
        try {
          // Create a new connection specifically for devnet
          const devnetConnection = new Connection("https://api.devnet.solana.com", {
            commitment: "confirmed",
            confirmTransactionInitialTimeout: 60000 // 60 seconds timeout
          });
          
          // Request 1 SOL airdrop (reduced amount for better success rate)
          const signature = await devnetConnection.requestAirdrop(
            wallet.publicKey,
            1 * 1e9 // 1 SOL in lamports
          );
          
          // Wait for confirmation with retries
          let retries = 3;
          let confirmation;
          
          while (retries > 0) {
            try {
              confirmation = await devnetConnection.confirmTransaction({
                signature,
                blockhash: (await devnetConnection.getLatestBlockhash()).blockhash,
                lastValidBlockHeight: (await devnetConnection.getLatestBlockhash()).lastValidBlockHeight
              });
              break;
            } catch (error) {
              retries--;
              if (retries === 0) throw error;
              // Wait 2 seconds before retrying
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
          
          if (confirmation?.value.err) {
            throw new Error(`Transaction failed: ${confirmation.value.err}`);
          }
          
          return JSON.stringify({
            success: true,
            message: `Successfully requested 1 SOL on devnet! Transaction: ${signature}`,
            signature
          });
        } catch (error: any) {
          console.error("Airdrop error:", error);
          return JSON.stringify({
            success: false,
            error: "Failed to request funds",
            details: error.message,
            suggestion: "The transaction might still be processing. You can check the status using the Solana Explorer with the transaction signature."
          });
        }
      }
    }),
    new DynamicTool({
      name: "RESOLVE_DOMAIN",
      description: "Resolve Solana domain names. Input should be a JSON string with domain.",
      func: async (input: string) => {
        const { domain } = JSON.parse(input);
        // Implement domain resolution logic here
        return JSON.stringify({
          success: true,
          message: `Domain resolution for ${domain} to be implemented`,
        });
      }
    }),
    new DynamicTool({
      name: "GET_TPS",
      description: "Get current transactions per second on Solana",
      func: async () => {
        const tps = await connection.getRecentPerformanceSamples(1);
        return JSON.stringify({
          tps: tps[0]?.numTransactions || 0,
        });
      }
    })
  ];

  return createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
  });
}

// Command implementations for both Discord and Telegram.
export const commands: Record<string, Command> = {
  create: {
    name: "create",
    description: "Initiates a Solana token project",
    execute: async (args: string[], _context: CommandContext): Promise<CommandResponse> => {
      console.log("Create command received with args:", args); // Debug log
      
      // Remove the command itself from args if present
      const cleanArgs = args.filter(arg => arg !== "create");
      
      if (cleanArgs.length < 4) {
        return {
          text: `👋 Hi ${_context.username}! To create a new Solana token, please provide the following details:

1. **Token Name** (e.g., "My Token")
2. **Token Symbol** (e.g., "MTK")
3. **Initial Supply** (e.g., "1000000")
4. **Decimals** (0-9, typically 9 for most tokens)

_Example: \`/create MyToken MTK 1000000 9\`_`,
        };
      }

      try {
        // Create a new connection specifically for devnet
        const devnetConnection = new Connection("https://api.devnet.solana.com", {
          commitment: "confirmed"
        });

        const solanaKit = new RealSolanaAgentKit(devnetConnection.rpcEndpoint);

        // Create the token using the provided details
        const result = await solanaKit.createToken(
          cleanArgs[0], // token name
          cleanArgs[1], // token symbol
          cleanArgs[2], // initial supply
          parseInt(cleanArgs[3]) // decimals
        );

        if (!result.success) {
          return { 
            text: `❌ Failed to create token. Make sure you have enough SOL in your wallet for the transaction fees.` 
          };
        }

        // Log the result for debugging
        console.log("Token creation result:", result);

        return {
          text: `✅ Token created successfully on devnet!\n\n**Token Details:**\n• Name: \`${cleanArgs[0]}\`\n• Symbol: \`${cleanArgs[1]}\`\n• Supply: \`${cleanArgs[2]}\`\n• Decimals: \`${cleanArgs[3]}\`\n\n**Token Address:** \`${result.tokenAddress}\`\n**Transaction ID:** \`${result.txId}\`\n\nYou can view your token on the Solana Explorer (devnet) by visiting:\nhttps://explorer.solana.com/address/${result.tokenAddress}?cluster=devnet`,
        };
      } catch (error: any) {
        console.error("Error executing /create command:", error);
        return { 
          text: `❌ An error occurred while creating your token:\n\`${error.message}\`\n\nMake sure you have enough SOL in your wallet for the transaction fees.` 
        };
      }
    },
  },

  stats: {
    name: "stats",
    description: "Retrieves real-time Solana market insights",
    execute: async (_args: string[], _context: CommandContext): Promise<CommandResponse> => {
      try {
        const solanaKit = new RealSolanaAgentKit(process.env.RPC_URL!);
        const stats = await solanaKit.getMarketStats();
        return {
          text: `📊 **Solana Market Stats**

• SOL Price: $${stats.solPrice.toFixed(2)}
• Market Cap: $${(stats.marketCap / 1e9).toFixed(2)}B
• 24h Volume: $${(stats.volume24h / 1e9).toFixed(2)}B
• TVL in DeFi: $${(stats.tvl / 1e9).toFixed(2)}B

_Data refreshed at ${new Date().toLocaleTimeString()}_`,
        };
      } catch (error) {
        console.error("Error fetching stats:", error);
        return { text: "❌ Error fetching Solana market stats. Please try again later." };
      }
    },
  },

  help: {
    name: "help",
    description: "Provides assistance and usage guidance",
    execute: async (_args: string[], _context: CommandContext): Promise<CommandResponse> => {
      return {
        text: `🤖 **Solana DeFi Token Assistant Help**

Available commands:
• \`/create\` - Create a new Solana token (provide token details after the command)
• \`/stats\` - Get real-time Solana market insights
• \`/chat\` - Chat with the Solana Agent for interactive assistance
• \`/help\` - Show this help message

For more detailed information, visit our documentation at https://docs.solanatokenassistant.com`,
      };
    },
  },

  chat: {
    name: "chat",
    description: "Interact with the Solana Agent via chat",
    execute: async (args: string[], _context: CommandContext): Promise<CommandResponse> => {
      const userInput = args.join(" ") || "Hello! How can I help you today?";
      try {
        const agent = await initializeAgent();
        const config = { configurable: { thread_id: "Solana Agent Kit!" } };

        // Create a chat message from the user with more context
        const messages = [
          new HumanMessage(`You are a helpful Solana DeFi assistant with access to a wallet. You can:

1. GET_ASSET - Retrieve information about a Solana asset/token
2. DEPLOY_TOKEN - Deploy a new token on Solana
3. GET_PRICE - Fetch price information for tokens
4. WALLET_ADDRESS - Get the wallet address
5. BALANCE - Check wallet balance
6. TRANSFER - Transfer tokens between wallets
7. MINT_NFT - Create and mint new NFTs
8. TRADE - Execute token trades
9. REQUEST_FUNDS - Request funds (useful for testing/development)
10. RESOLVE_DOMAIN - Resolve Solana domain names
11. GET_TPS - Get current transactions per second on Solana

The user's message is: ${userInput}`)
        ];

        let fullResponse = "";
        const stream = await agent.stream(
          {
            messages,
          },
          config,
        );

        for await (const chunk of stream) {
          if ("agent" in chunk) {
            fullResponse += chunk.agent.messages[0].content;
          } else if ("tools" in chunk) {
            fullResponse += chunk.tools.messages[0].content;
          }
        }

        // If no response was generated, provide a default helpful response
        if (!fullResponse) {
          fullResponse = `I'm your Solana DeFi assistant! I can help you with:

1. GET_ASSET - Retrieve information about a Solana asset/token
2. DEPLOY_TOKEN - Deploy a new token on Solana
3. GET_PRICE - Fetch price information for tokens
4. WALLET_ADDRESS - Get the wallet address
5. BALANCE - Check wallet balance
6. TRANSFER - Transfer tokens between wallets
7. MINT_NFT - Create and mint new NFTs
8. TRADE - Execute token trades
9. REQUEST_FUNDS - Request funds (useful for testing/development)
10. RESOLVE_DOMAIN - Resolve Solana domain names
11. GET_TPS - Get current transactions per second on Solana

What would you like to know about?`;
        }

        return { text: fullResponse };
      } catch (error) {
        console.error("Error executing /chat command:", error);
        return { text: "❌ An error occurred while processing your chat message. Please try again later." };
      }
    },
  },
};

// Unified function to handle commands from any platform.
export async function handleCommand(
  commandName: string,
  args: string[],
  context: CommandContext,
): Promise<CommandResponse> {
  const command = commands[commandName];
  if (!command) {
    return {
      text: `❌ Unknown command: ${commandName}. Type \`/help\` to see available commands.`,
    };
  }
  try {
    return await command.execute(args, context);
  } catch (error) {
    console.error(`Error executing command ${commandName}:`, error);
    return { text: "❌ An error occurred while processing your command. Please try again later." };
  }
}
