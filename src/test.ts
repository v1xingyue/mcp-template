import dotenv from "dotenv";
dotenv.config();
import logger from "./utils";
import { Telegraf } from "telegraf";
import { HttpsProxyAgent } from "https-proxy-agent";

const main = async () => {
  const proxy = process.env.PROXY;
  if (!proxy) {
    throw new Error("PROXY is not set");
  }

  // 2. 创建 bot 实例
  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!, {
    telegram: {
      agent: new HttpsProxyAgent(proxy!),
    },
  });
  logger.info("Bot instance created");

  // 3. 尝试发送消息 - 不需要等待 launch
  try {
    logger.info("Attempting to send message...");
    const channelName = "@mcpdemo";
    logger.info("Using chat ID: %s ", channelName);

    const messageResult = await bot.telegram.sendMessage(
      channelName,
      "Hello, this is mcp demorld!"
    );
    logger.info("Message sent successfully!", messageResult);
  } catch (error) {
    logger.error("Failed to send message:", error);
  }
};

main().catch((error) => {
  logger.error("Failed to start bot:", error);
  process.exit(1);
});
