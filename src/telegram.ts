import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp";
import { HttpsProxyAgent } from "https-proxy-agent";
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

  const proxy = process.env.PROXY;
  if (!proxy) {
    return {
      content: [
        {
          type: "text",
          text: "PROXY is not set, you need to set it in the environment variables",
          isError: true,
        },
      ],
    };
  }

  const botConfig = {
    telegram: {
      agent: new HttpsProxyAgent(proxy!),
    },
  };

  const bot = new Telegraf(botToken?.toString() ?? "", botConfig);

  bot.telegram.sendMessage(chatId?.toString(), args.message.toString());

  return {
    content: [{ type: "text", text: `Telegram notice sent: ${args.message}` }],
  };
};
