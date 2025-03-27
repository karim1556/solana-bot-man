export interface CommandContext {
  platform: "discord" | "telegram"
  userId: string
  username: string
  channelId?: string
  guildId?: string // Discord only
  chatId?: number // Telegram only
}

export interface CommandResponse {
  text: string
  embeds?: any[] // For Discord rich embeds
  components?: any[] // For Discord buttons/selects
}

export interface Command {
  name: string
  description: string
  execute: (args: string[], context: CommandContext) => Promise<CommandResponse>
} 