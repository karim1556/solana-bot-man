# Solana Token Assistant

A comprehensive platform for managing Solana tokens and providing market insights through web and chat interfaces.

## Features

- **Token Management**: Create, mint, burn, and transfer Solana tokens
- **Market Insights**: Real-time price and performance data for Solana tokens
- **AI-Powered Analysis**: Market insights and token opportunities using Together AI
- **Multi-platform Access**: Web dashboard, Discord bot, and Telegram bot

## Tech Stack

- **Frontend**: Next.js 15 with React 19
- **UI**: Custom components using Radix UI and Tailwind CSS
- **AI**: Together AI with Mixtral model for market insights
- **Bots**: Discord.js and Telegraf for bot integrations
- **Blockchain**: Solana integration (currently mocked for development)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Set up environment variables by copying `.env.example` to `.env` and adding your API keys
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Run the bots in a separate terminal:
   ```bash
   npm run bot
   ```

## Environment Variables

- `TOGETHER_API_KEY`: Together AI API key for AI insights
- `DISCORD_TOKEN` and `DISCORD_CLIENT_ID`: Discord bot credentials
- `TELEGRAM_TOKEN`: Telegram bot token
- `SOLANA_RPC_URL`: Solana RPC endpoint

## Bot Commands

Both Discord and Telegram bots support these commands:

- `/create` - Start the token creation process
- `/stats` - Get real-time Solana market insights
- `/help` - Show available commands and usage guidance

## Architecture

The project is split into two main parts:

1. **Web Application**: A Next.js application with:
   - Dashboard for token overview and market insights
   - Stats page for detailed market analysis
   - Settings page for bot and API configuration

2. **Bot Server**: A separate Node.js process that:
   - Handles Discord and Telegram interactions
   - Shares market data services with the web app
   - Provides the same features through chat interfaces

## Development

- The bots run in a separate process to avoid native module issues with Next.js
- The AI insights and market data are generated based on real-time statistics
- All static mock data has been replaced with dynamic data services 