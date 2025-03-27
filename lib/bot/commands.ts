// // Unified command structure for both Discord and Telegram bots

// export interface CommandContext {
//   platform: "discord" | "telegram"
//   userId: string
//   username: string
//   channelId?: string
//   guildId?: string // Discord only
//   chatId?: number // Telegram only
// }

// export interface CommandResponse {
//   text: string
//   embeds?: any[] // For Discord rich embeds
//   components?: any[] // For Discord buttons/selects
// }

// export interface Command {
//   name: string
//   description: string
//   execute: (args: string[], context: CommandContext) => Promise<CommandResponse>
// }

// // // Import the Solana Agent Kit
// // import { createSolanaAgentKit } from "../solana-agent-kit"

// // // Create command handlers
// // export const commands: Record<string, Command> = {
// //   create: {
// //     name: "create",
// //     description: "Initiates a Solana token project",
// //     execute: async (_args: string[], context: CommandContext) => {
// //       // This would typically start an interactive flow
// //       return {
// //         text: `👋 Hi ${context.username}! Let's create a new Solana token. Please provide the following information:

// // 1. Token Name
// // 2. Token Symbol
// // 3. Initial Supply
// // 4. Decimals (0-9)

// // Example: \`MyToken MTK 1000000 9\``,
// //       }
// //     },
// //   },

// //   stats: {
// //     name: "stats",
// //     description: "Retrieves real-time Solana market insights",
// //     execute: async (_args: string[], _context: CommandContext) => {
// //       try {
// //         const solanaKit = createSolanaAgentKit()
// //         const stats = await solanaKit.getMarketStats()

// //         return {
// //           text: `📊 **Solana Market Stats**

// // • SOL Price: $${stats.solPrice.toFixed(2)}
// // • Market Cap: $${(stats.marketCap / 1e9).toFixed(2)}B
// // • 24h Volume: $${(stats.volume24h / 1e9).toFixed(2)}B
// // • TVL in DeFi: $${(stats.tvl / 1e9).toFixed(2)}B

// // _Data refreshed at ${new Date().toLocaleTimeString()}_`,
// //         }
// //       } catch (error) {
// //         console.error("Error fetching stats:", error)
// //         return {
// //           text: "❌ Error fetching Solana market stats. Please try again later.",
// //         }
// //       }
// //     },
// //   },

// //   help: {
// //     name: "help",
// //     description: "Provides assistance and usage guidance",
// //     execute: async (_args: string[], _context: CommandContext) => {
// //       return {
// //         text: `🤖 **Solana DeFi Token Assistant Help**

// // Available commands:

// // • \`/create\` - Create a new Solana token
// // • \`/stats\` - Get real-time Solana market insights
// // • \`/help\` - Show this help message

// // For more detailed information, visit our documentation at https://docs.solanatokenassistant.com`,
// //       }
// //     },
// //   },
// // }

// // // Function to handle commands from any platform
// // export async function handleCommand(
// //   commandName: string,
// //   args: string[],
// //   context: CommandContext,
// // ): Promise<CommandResponse> {
// //   const command = commands[commandName]

// //   if (!command) {
// //     return {
// //       text: `❌ Unknown command: ${commandName}. Type \`/help\` to see available commands.`,
// //     }
// //   }

// //   try {
// //     return await command.execute(args, context)
// //   } catch (error) {
// //     console.error(`Error executing command ${commandName}:`, error)
// //     return {
// //       text: "❌ An error occurred while processing your command. Please try again later.",
// //     }
// //   }
// // }

// // commands.ts – Unified command structure for both Discord and Telegram bots

// import { RealSolanaAgentKit } from "../solana-agent-kit";

// // Command implementations
// export const commands: Record<string, Command> = {
//   create: {
//     name: "create",
//     description: "Initiates a Solana token project",
//     execute: async (args: string[], context: CommandContext): Promise<CommandResponse> => {
//       // If no arguments provided, prompt the user for the token details
//       if (args.length < 4) {
//         return {
//           text: `👋 Hi ${context.username}! To create a new Solana token, please provide the following details:

// 1. **Token Name**
// 2. **Token Symbol**
// 3. **Initial Supply**
// 4. **Decimals (0-9)**

// _Example: \`MyToken MTK 1000000 9\`_`,
//         };
//       }

//       try {
//         const solanaAgent = new RealSolanaAgentKit(
//           process.env.SOLANA_RPC_URL!
//         );

//         // Create the token using solanaAgent
//         const result = await solanaAgent.createToken(
//           args[0], // name
//           args[1], // symbol
//           args[2], // initialSupply
//           parseInt(args[3]) // decimals
//         );

//         if (!result.success) {
//           return {
//             text: `❌ Failed to create token. Please try again later.`,
//           };
//         }

//         return {
//           text: `✅ Token created successfully!\n\nToken Address: \`${result.tokenAddress}\`\nTransaction ID: \`${result.txId}\``,
//         };
//       } catch (error) {
//         console.error("Error executing /create command:", error);
//         return {
//           text: "❌ An error occurred while processing your token creation request. Please try again later.",
//         };
//       }
//     },
//   },

//   stats: {
//     name: "stats",
//     description: "Retrieves real-time Solana market insights",
//     execute: async (_args: string[], _context: CommandContext): Promise<CommandResponse> => {
//       try {
//         // Create a real instance of SolanaAgentKit to fetch live data
//         const solanaKit = new RealSolanaAgentKit(
//           process.env.SOLANA_RPC_URL!
//         );
//         const stats = await solanaKit.getMarketStats();

//         return {
//           text: `📊 **Solana Market Stats**

// • SOL Price: $${stats.solPrice.toFixed(2)}
// • Market Cap: $${(stats.marketCap / 1e9).toFixed(2)}B
// • 24h Volume: $${(stats.volume24h / 1e9).toFixed(2)}B
// • TVL in DeFi: $${(stats.tvl / 1e9).toFixed(2)}B

// _Data refreshed at ${new Date().toLocaleTimeString()}_`,
//         };
//       } catch (error) {
//         console.error("Error fetching stats:", error);
//         return {
//           text: "❌ Error fetching Solana market stats. Please try again later.",
//         };
//       }
//     },
//   },

//   help: {
//     name: "help",
//     description: "Provides assistance and usage guidance",
//     execute: async (_args: string[], _context: CommandContext): Promise<CommandResponse> => {
//       return {
//         text: `🤖 **Solana DeFi Token Assistant Help**

// Available commands:

// • \`/create\` - Create a new Solana token (provide token details after the command)
// • \`/stats\` - Get real-time Solana market insights
// • \`/help\` - Show this help message

// For more detailed information, visit our documentation at https://docs.solanatokenassistant.com`,
//       };
//     },
//   },
// };

// // Function to handle commands from any platform
// export async function handleCommand(
//   commandName: string,
//   args: string[],
//   context: CommandContext,
// ): Promise<CommandResponse> {
//   const command = commands[commandName];

//   if (!command) {
//     return {
//       text: `❌ Unknown command: ${commandName}. Type \`/help\` to see available commands.`,
//     };
//   }

//   try {
//     return await command.execute(args, context);
//   } catch (error) {
//     console.error(`Error executing command ${commandName}:`, error);
//     return {
//       text: "❌ An error occurred while processing your command. Please try again later.",
//     };
//   }
// }

// commands.ts – Unified command structure for both Discord and Telegram bots

// lib/bot/commands.ts – Unified command structure for both Discord and Telegram bots

// import { Command, CommandContext, CommandResponse } from "./types";
// import { RealSolanaAgentKit } from "../solana-agent-kit";
// import { ChatOpenAI } from "@langchain/openai";
// import { createReactAgent } from "@langchain/langgraph/prebuilt";
// import { MemorySaver } from "@langchain/langgraph";
// import { HumanMessage } from "@langchain/core/messages";
// import * as dotenv from "dotenv";

// dotenv.config();

// // Helper function for /chat command: initializes the reactive agent using Solana Agent Kit and LangChain.
// async function initializeAgent() {
//   // Initialize the language model.
//   const llm = new ChatOpenAI({
//     modelName: "gpt-4-turbo-preview",
//     temperature: 0.7,
//   });

//   // Create the reactive agent with the LLM and memory
//   return createReactAgent({
//     llm,
//     tools: [],
//     checkpointSaver: new MemorySaver(),
//   });
// }

// // Command implementations
// export const commands: Record<string, Command> = {
//   create: {
//     name: "create",
//     description: "Initiates a Solana token project",
//     execute: async (args: string[], _context: CommandContext): Promise<CommandResponse> => {
//       if (args.length < 4) {
//         return {
//           text: `👋 Hi ${_context.username}! To create a new Solana token, please provide the following details:

// 1. **Token Name**
// 2. **Token Symbol**
// 3. **Initial Supply**
// 4. **Decimals (0-9)**

// _Example: \`MyToken MTK 1000000 9\`_`,
//         };
//       }

//       try {
//         // Create a Solana agent using the RPC URL.
//         const solanaAgent = new RealSolanaAgentKit(
//           process.env.SOLANA_RPC_URL!
//         );

//         // Create the token using the provided details.
//         const result = await solanaAgent.createToken(
//           args[0], // token name
//           args[1], // token symbol
//           args[2], // initial supply
//           parseInt(args[3]) // decimals
//         );

//         if (!result.success) {
//           return {
//             text: `❌ Failed to create token. Please try again later.`,
//           };
//         }

//         return {
//           text: `✅ Token created successfully!\n\nToken Address: \`${result.tokenAddress}\`\nTransaction ID: \`${result.txId}\``,
//         };
//       } catch (error) {
//         console.error("Error executing /create command:", error);
//         return {
//           text: "❌ An error occurred while processing your token creation request. Please try again later.",
//         };
//       }
//     },
//   },

//   stats: {
//     name: "stats",
//     description: "Retrieves real-time Solana market insights",
//     execute: async (_args: string[], _context: CommandContext): Promise<CommandResponse> => {
//       try {
//         // Create an instance of RealSolanaAgentKit to fetch live data.
//         const solanaKit = new RealSolanaAgentKit(
//           process.env.SOLANA_RPC_URL!
//         );
//         const stats = await solanaKit.getMarketStats();

//         return {
//           text: `📊 **Solana Market Stats**

// • SOL Price: $${stats.solPrice.toFixed(2)}
// • Market Cap: $${(stats.marketCap / 1e9).toFixed(2)}B
// • 24h Volume: $${(stats.volume24h / 1e9).toFixed(2)}B
// • TVL in DeFi: $${(stats.tvl / 1e9).toFixed(2)}B

// _Data refreshed at ${new Date().toLocaleTimeString()}_`,
//         };
//       } catch (error) {
//         console.error("Error fetching stats:", error);
//         return {
//           text: "❌ Error fetching Solana market stats. Please try again later.",
//         };
//       }
//     },
//   },

//   help: {
//     name: "help",
//     description: "Provides assistance and usage guidance",
//     execute: async (_args: string[], _context: CommandContext): Promise<CommandResponse> => {
//       return {
//         text: `🤖 **Solana DeFi Token Assistant Help**

// Available commands:

// • \`/create\` - Create a new Solana token (provide token details after the command)
// • \`/stats\` - Get real-time Solana market insights
// • \`/chat\` - Chat with the Solana Agent for interactive assistance
// • \`/help\` - Show this help message

// For more detailed information, visit our documentation at https://docs.solanatokenassistant.com`,
//       };
//     },
//   },

//   chat: {
//     name: "chat",
//     description: "Interact with the Solana Agent via chat",
//     execute: async (args: string[], _context: CommandContext): Promise<CommandResponse> => {
//       // Combine the chat input into a single message.
//       const userInput = args.join(" ") || "Hello, agent!";
//       try {
//         // Initialize the reactive agent.
//         const agent = await initializeAgent();
//         const config = { configurable: { thread_id: "Solana Agent Kit!" } };

//         // Create a chat message from the user.
//         const messages = [new HumanMessage(userInput)];

//         // Stream the agent's reply and accumulate the response.
//         let fullResponse = "";
//         const stream = await agent.stream({ messages }, config);

//         for await (const chunk of stream) {
//           if ("agent" in chunk) {
//             fullResponse += chunk.agent.messages[0].content;
//           } else if ("tools" in chunk) {
//             fullResponse += chunk.tools.messages[0].content;
//           }
//         }

//         return {
//           text: fullResponse || "No response received from the agent.",
//         };
//       } catch (error) {
//         console.error("Error executing /chat command:", error);
//         return {
//           text: "❌ An error occurred while processing your chat message. Please try again later.",
//         };
//       }
//     },
//   },
// };

// // Function to handle commands from any platform.
// export async function handleCommand(
//   commandName: string,
//   args: string[],
//   context: CommandContext,
// ): Promise<CommandResponse> {
//   const command = commands[commandName];

//   if (!command) {
//     return {
//       text: `❌ Unknown command: ${commandName}. Type \`/help\` to see available commands.`,
//     };
//   }

//   try {
//     return await command.execute(args, context);
//   } catch (error) {
//     console.error(`Error executing command ${commandName}:`, error);
//     return {
//       text: "❌ An error occurred while processing your command. Please try again later.",
//     };
//   }
// }


// lib/bot/commands.ts – Unified command structure for both Discord and Telegram bots

import { Command, CommandContext, CommandResponse } from "./types";
import { RealSolanaAgentKit } from "../solana-agent-kit";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";

dotenv.config();

// Global conversation history for the /chat command (keyed by userId).
const chatHistories = new Map<string, HumanMessage[]>();

// Helper function for /chat command: initializes the reactive agent using LangChain.
// For chat, we're assuming that RealSolanaAgentKit now requires only the RPC URL.
async function initializeAgent() {
  // Initialize the language model.
  const llm = new ChatOpenAI({
    modelName: "gpt-4-turbo-preview",
    temperature: 0.7,
  });

  // (Optional) If you need private key decoding for onchain interactions in other commands,
  // uncomment the following lines. For /chat, we only use the RPC URL.
  // const privateKeyArray = JSON.parse(process.env.SOLANA_PRIVATE_KEY!);
  // const privateKeyUint8 = new Uint8Array(privateKeyArray);
  // const privateKeyBase58 = bs58.encode(privateKeyUint8);

  // Instantiate RealSolanaAgentKit with only the RPC URL.
  const memory = new MemorySaver();

  // Return the reactive agent (with no onchain tools for chat).
  return createReactAgent({
    llm,
    tools: [],
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
        // Instantiate RealSolanaAgentKit with the RPC URL.
        const solanaAgent = new RealSolanaAgentKit(process.env.SOLANA_RPC_URL!);

        // Create the token using the provided details.
        const result = await solanaAgent.createToken(
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
        const solanaKit = new RealSolanaAgentKit(process.env.SOLANA_RPC_URL!);
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
      // Combine chat input into one string.
      const userInput = args.join(" ") || "Hello, agent!";
      try {
        // Retrieve or initialize conversation history for this user.
        const userId = _context.userId;
        if (!chatHistories.has(userId)) {
          chatHistories.set(userId, []);
        }
        const history = chatHistories.get(userId)!;
        // Add the new user message to conversation history.
        history.push(new HumanMessage(userInput));

        // Initialize the reactive agent.
        const agent = await initializeAgent();
        const config = { configurable: { thread_id: "Solana Agent Kit!" } };

        // Stream the agent's reply using the entire conversation history.
        let fullResponse = "";
        const stream = await agent.stream({ messages: history }, config);
        for await (const chunk of stream) {
          if ("agent" in chunk) {
            fullResponse += chunk.agent.messages[0].content;
            // Append the agent's response to history for context.
            history.push(new HumanMessage(chunk.agent.messages[0].content));
          } else if ("tools" in chunk) {
            fullResponse += chunk.tools.messages[0].content;
            history.push(new HumanMessage(chunk.tools.messages[0].content));
          }
        }

        return { text: fullResponse || "No response received from the agent." };
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
