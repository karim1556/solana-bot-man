// Telegram bot implementation using telegraf
import { Telegraf } from "telegraf"
import { commands, handleCommand } from "./commands"
import { type CommandContext } from "./types"

export async function setupTelegramBot(token: string) {
  // Create a new Telegraf instance
  const bot = new Telegraf(token)

  // Set bot commands for the menu
  await bot.telegram.setMyCommands(
    Object.values(commands).map((cmd) => ({
      command: cmd.name,
      description: cmd.description,
    })),
  )

  // Register command handlers
  Object.keys(commands).forEach((cmdName) => {
    bot.command(cmdName, async (ctx) => {
      const text = ctx.message.text
      const args = text.split(" ").slice(1) // Remove the command itself

      // Create context object
      const context: CommandContext = {
        platform: "telegram",
        userId: ctx.from.id.toString(),
        username: ctx.from.username || `${ctx.from.first_name} ${ctx.from.last_name}`,
        chatId: ctx.chat.id,
      }

      try {
        const response = await handleCommand(cmdName, args, context)

        // Send the response
        await ctx.reply(response.text, { parse_mode: "Markdown" })
      } catch (error) {
        console.error(`Error handling Telegram command ${cmdName}:`, error)
        await ctx.reply("An error occurred while processing your command.")
      }
    })
  })

  // Start the bot
  bot.launch()

  console.log("Telegram bot is ready!")

  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"))
  process.once("SIGTERM", () => bot.stop("SIGTERM"))

  return bot
}

