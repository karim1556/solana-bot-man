// Main bot entry point that sets up both Discord and Telegram bots
import { setupDiscordBot } from "./discord-bot"
import { setupTelegramBot } from "./telegram-bot"

export async function initializeBots() {
  // Load environment variables
  const DISCORD_TOKEN = process.env.DISCORD_TOKEN
  const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN

  // Check if we're in development mode without tokens
  const isDevelopment = process.env.NODE_ENV === "development"

  // Initialize Discord bot if credentials are provided
  if (DISCORD_TOKEN && DISCORD_CLIENT_ID) {
    try {
      await setupDiscordBot(DISCORD_TOKEN, DISCORD_CLIENT_ID)
      console.log("Discord bot initialized successfully")
    } catch (error) {
      console.error("Failed to initialize Discord bot:", error)
    }
  } else {
    console.warn(
      "Discord bot credentials not provided. " +
        (isDevelopment ? "Running in development mode without Discord bot." : "Discord bot will not be initialized."),
    )
  }

  // Initialize Telegram bot if token is provided
  if (TELEGRAM_TOKEN) {
    try {
      await setupTelegramBot(TELEGRAM_TOKEN)
      console.log("Telegram bot initialized successfully")
    } catch (error) {
      console.error("Failed to initialize Telegram bot:", error)
    }
  } else {
    console.warn(
      "Telegram token not provided. " +
        (isDevelopment ? "Running in development mode without Telegram bot." : "Telegram bot will not be initialized."),
    )
  }

  // If no bots are initialized but we're in development, log a helpful message
  if ((!DISCORD_TOKEN || !DISCORD_CLIENT_ID) && !TELEGRAM_TOKEN && isDevelopment) {
    console.log("Running without bots in development mode. The web dashboard is fully functional.")
    console.log("To enable bots, add the following environment variables:")
    console.log("- DISCORD_TOKEN and DISCORD_CLIENT_ID for Discord bot")
    console.log("- TELEGRAM_TOKEN for Telegram bot")
  }
}

