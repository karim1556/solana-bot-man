// Discord bot implementation using discord.js
import { 
  Client, 
  GatewayIntentBits, 
  Events, 
  REST, 
  Routes, 
  SlashCommandBuilder,
  CommandInteraction
} from "discord.js"
import { commands, handleCommand } from "./commands"
import { type CommandContext } from "./types"

export async function setupDiscordBot(token: string, clientId: string) {
  // Create a new Discord client with only the required intents
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages
    ],
  })

  // Register slash commands
  const rest = new REST({ version: "10" }).setToken(token)

  const slashCommands = Object.values(commands).map((cmd) => {
    const builder = new SlashCommandBuilder()
      .setName(cmd.name)
      .setDescription(cmd.description);
    
    // Add string option for chat command
    if (cmd.name === "chat") {
      builder.addStringOption(option =>
        option
          .setName("message")
          .setDescription("Your message to the Solana assistant")
          .setRequired(false)
      );
    }
    
    // Add options for create command
    if (cmd.name === "create") {
      builder
        .addStringOption(option =>
          option
            .setName("name")
            .setDescription("Token name")
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName("symbol")
            .setDescription("Token symbol")
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName("supply")
            .setDescription("Initial token supply")
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option
            .setName("decimals")
            .setDescription("Number of decimal places (0-9)")
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(9)
        );
    }
    
    return builder.toJSON();
  });

  try {
    console.log("Started refreshing Discord application (/) commands.")

    await rest.put(Routes.applicationCommands(clientId), { body: slashCommands })

    console.log("Successfully reloaded Discord application (/) commands.")
  } catch (error) {
    console.error("Error refreshing Discord commands:", error)
  }

  // Handle slash command interactions
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return

    const { commandName } = interaction

    // Create context object
    const context: CommandContext = {
      platform: "discord",
      userId: interaction.user.id,
      username: interaction.user.username,
      channelId: interaction.channelId,
      guildId: interaction.guildId || undefined,
    }

    try {
      // Get command arguments
      let args: string[] = [];
      
      if (commandName === "chat" && interaction instanceof CommandInteraction) {
        const message = interaction.options.get("message")?.value as string;
        if (message) {
          args = [message];
        }
      } else if (commandName === "create" && interaction instanceof CommandInteraction) {
        const name = interaction.options.get("name")?.value as string;
        const symbol = interaction.options.get("symbol")?.value as string;
        const supply = interaction.options.get("supply")?.value as string;
        const decimals = interaction.options.get("decimals")?.value as number;
        
        if (name && symbol && supply && decimals !== undefined) {
          args = [name, symbol, supply, decimals.toString()];
        }
      }

      // Defer reply with ephemeral flag
      await interaction.deferReply({ ephemeral: true });

      const response = await handleCommand(commandName, args, context)

      // Send the response
      await interaction.editReply({
        content: response.text,
        embeds: response.embeds,
        components: response.components,
      })
    } catch (error) {
      console.error(`Error handling Discord command ${commandName}:`, error)
      try {
        await interaction.editReply("An error occurred while processing your command.")
      } catch (e) {
        console.error("Failed to send error message:", e)
      }
    }
  })

  // Login to Discord
  await client.login(token)

  console.log("Discord bot is ready!")

  return client
}

