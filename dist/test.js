"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const utils_1 = __importDefault(require("./utils"));
const telegraf_1 = require("telegraf");
const https_proxy_agent_1 = require("https-proxy-agent");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const proxy = process.env.PROXY;
    if (!proxy) {
        throw new Error("PROXY is not set");
    }
    // 2. 创建 bot 实例
    const bot = new telegraf_1.Telegraf(process.env.TELEGRAM_BOT_TOKEN, {
        telegram: {
            agent: new https_proxy_agent_1.HttpsProxyAgent(proxy),
        },
    });
    utils_1.default.info("Bot instance created");
    // 3. 尝试发送消息 - 不需要等待 launch
    try {
        utils_1.default.info("Attempting to send message...");
        const channelName = "@mcpdemo";
        utils_1.default.info("Using chat ID: %s ", channelName);
        const messageResult = yield bot.telegram.sendMessage(channelName, "Hello, this is mcp demorld!");
        utils_1.default.info("Message sent successfully!", messageResult);
    }
    catch (error) {
        utils_1.default.error("Failed to send message:", error);
    }
});
main().catch((error) => {
    utils_1.default.error("Failed to start bot:", error);
    process.exit(1);
});
