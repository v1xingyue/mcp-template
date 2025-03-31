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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTelegramNotice = exports.sendTelegramNoticeArgs = void 0;
const https_proxy_agent_1 = require("https-proxy-agent");
const telegraf_1 = require("telegraf");
const zod_1 = require("zod");
exports.sendTelegramNoticeArgs = {
    message: zod_1.z.string().describe("The message to send to telegram"),
};
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const sendTelegramNotice = (args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
            agent: new https_proxy_agent_1.HttpsProxyAgent(proxy),
        },
    };
    const bot = new telegraf_1.Telegraf((_a = botToken === null || botToken === void 0 ? void 0 : botToken.toString()) !== null && _a !== void 0 ? _a : "", botConfig);
    bot.telegram.sendMessage(chatId === null || chatId === void 0 ? void 0 : chatId.toString(), args.message.toString());
    return {
        content: [{ type: "text", text: `Telegram notice sent: ${args.message}` }],
    };
});
exports.sendTelegramNotice = sendTelegramNotice;
