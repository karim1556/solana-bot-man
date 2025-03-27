// Discord bot implementation using discord.js
import { Client, GatewayIntentBits, Events, REST, Routes, SlashCommandBuilder } from "discord.js"
import { commands, handleCommand } from "./commands"
import { type CommandContext } from "./types"

export async function setupDiscordBot(token: string, clientId: string) {
  // Create a new Discord client
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  })

  // Register slash commands
  const rest = new REST({ version: "10" }).setToken(token)

  const slashCommands = Object.values(commands).map((cmd) => {
    return new SlashCommandBuilder().setName(cmd.name).setDescription(cmd.description).toJSON()
  })

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

    // Defer reply to give us time to process
    await interaction.deferReply()

    try {
      const response = await handleCommand(commandName, [], context)

      // Send the response
      await interaction.editReply({
        content: response.text,
        embeds: response.embeds,
        components: response.components,
      })
    } catch (error) {
      console.error(`Error handling Discord command ${commandName}:`, error)
      await interaction.editReply("An error occurred while processing your command.")
    }
  })

  // Login to Discord
  client.login(token)

  console.log("Discord bot is ready!")

  return client
}

