import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp";
import { Telegraf } from "telegraf";
import { z } from "zod";

export const sendTelegramNoticeArgs = {
  message: z.string().describe("The message to send to telegram"),
};

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

export const sendTelegramNotice: ToolCallback<
  typeof sendTelegramNoticeArgs
> = async (args) => {
  if (!botToken || !chatId) {
    return {
      content: [
        { type: "text", text: "Telegram bot token or chat id is not set" },
      ],
    };
  }
  const bot = new Telegraf(botToken?.toString() ?? "");

  bot.telegram.sendMessage(chatId?.toString(), args.message.toString());

  return {
    content: [{ type: "text", text: `Telegram notice sent: ${args.message}` }],
  };
};
