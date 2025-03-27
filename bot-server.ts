require('dotenv').config();
const { setupDiscordBot } = require("./lib/bot/discord-bot")
const { setupTelegramBot } = require("./lib/bot/telegram-bot")

async function startBots() {
  try {
    // Initialize Discord bot
    if (process.env.DISCORD_TOKEN && process.env.DISCORD_CLIENT_ID) {
      await setupDiscordBot(process.env.DISCORD_TOKEN, process.env.DISCORD_CLIENT_ID)
      console.log("Discord bot started successfully")
    }

    // Initialize Telegram bot
    if (process.env.TELEGRAM_TOKEN) {
      await setupTelegramBot(process.env.TELEGRAM_TOKEN)
      console.log("Telegram bot started successfully")
    }

    console.log("All bots initialized successfully")
  } catch (error) {
    console.error("Error starting bots:", error)
    process.exit(1)
  }
}

startBots() 