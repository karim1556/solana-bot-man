import { Command, CommandContext, CommandResponse } from "./types";
import { RealSolanaAgentKit } from "../solana-agent-kit";
import { HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import { DynamicTool } from "@langchain/core/tools";
import * as dotenv from "dotenv";

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

  // Create Solana tools for the agent
  const solanaKit = new RealSolanaAgentKit(process.env.RPC_URL);
  const tools = [
    new DynamicTool({
      name: "createToken",
      description: "Create a new Solana token. Input should be a JSON string with name, symbol, supply, and decimals.",
      func: async (input: string) => {
        const { name, symbol, supply, decimals } = JSON.parse(input);
        return await solanaKit.createToken(name, symbol, supply, decimals);
      }
    }),
    new DynamicTool({
      name: "getMarketStats",
      description: "Get current Solana market statistics",
      func: async () => {
        const stats = await solanaKit.getMarketStats();
        return JSON.stringify(stats);
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
      if (args.length < 4) {
        return {
          text: `👋 Hi ${_context.username}! To create a new Solana token, please provide the following details:

1. **Token Name**
2. **Token Symbol**
3. **Initial Supply**
4. **Decimals (0-9)**

_Example: \`MyToken MTK 1000000 9\`_`,
        };
      }

      try {
        const solanaKit = new RealSolanaAgentKit(process.env.RPC_URL!);

        // Create the token using the provided details.
        const result = await solanaKit.createToken(
          args[0], // token name
          args[1], // token symbol
          args[2], // initial supply
          parseInt(args[3]) // decimals
        );

        if (!result.success) {
          return { text: "❌ Failed to create token. Please try again later." };
        }

        return {
          text: `✅ Token created successfully!\n\nToken Address: \`${result.tokenAddress}\`\nTransaction ID: \`${result.txId}\``,
        };
      } catch (error) {
        console.error("Error executing /create command:", error);
        return { text: "❌ An error occurred while processing your token creation request. Please try again later." };
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
          new HumanMessage(`You are a helpful Solana DeFi assistant. The user's message is: ${userInput}`)
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
• Creating new Solana tokens
• Checking market stats
• Explaining DeFi concepts
• Providing technical guidance

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
