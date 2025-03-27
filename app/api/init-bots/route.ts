import { NextResponse } from "next/server"
import { initializeBots } from "@/lib/bot"

// This route handler initializes the bots when called
// It's designed to be called once when the app starts
// or manually triggered for development
export async function GET() {
  try {
    // Only initialize bots if we have the required environment variables
    const hasDiscordCreds = process.env.DISCORD_TOKEN && process.env.DISCORD_CLIENT_ID
    const hasTelegramToken = process.env.TELEGRAM_TOKEN

    if (hasDiscordCreds || hasTelegramToken) {
      await initializeBots()
      return NextResponse.json({
        success: true,
        message: "Bots initialized successfully",
        discord: hasDiscordCreds ? "enabled" : "disabled",
        telegram: hasTelegramToken ? "enabled" : "disabled",
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "No bot credentials found. Add environment variables to enable bots.",
        requiredVars: {
          discord: ["DISCORD_TOKEN", "DISCORD_CLIENT_ID"],
          telegram: ["TELEGRAM_TOKEN"],
        },
      })
    }
  } catch (error) {
    console.error("Error initializing bots:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to initialize bots",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

