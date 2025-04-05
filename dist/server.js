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
exports.createServer = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const utils_1 = __importDefault(require("./utils"));
const zod_1 = require("zod");
const sui_1 = require("./sui");
const build_info_1 = require("./build-info");
const pass_1 = require("./pass");
const telegram_1 = require("./telegram");
const token = process.env.COINGECKO_TOKEN;
const createServer = () => {
    const server = new mcp_js_1.McpServer({
        name: "mcp-coin-price",
        version: "1.0.0",
        description: "Get current coin price",
        context: {
            coinId: zod_1.z.string(),
            userPass: zod_1.z.string(),
        },
        connection: {
            auth: {
                type: "bearer",
                validate: (token) => {
                    utils_1.default.info(`validate token: ${token}`);
                    return token === "admin";
                },
            },
        },
    });
    server.resource("info", "/info", (uri) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("info resource called...", uri);
        return {
            contents: [
                {
                    uri: uri.href,
                    text: `build-time: ${build_info_1.BUILD_TIME}`,
                },
            ],
        };
    }));
    server.resource("greeting", new mcp_js_1.ResourceTemplate("greeting://{name}", { list: undefined }), (uri_1, _a) => __awaiter(void 0, [uri_1, _a], void 0, function* (uri, { name }) {
        return ({
            contents: [
                {
                    uri: uri.href,
                    text: `Hello, ${name}!`,
                },
            ],
        });
    }));
    server.tool("telegram-notice", "send notice to telegram", telegram_1.sendTelegramNoticeArgs, telegram_1.sendTelegramNotice);
    server.tool("open-the-door", "Open the door by the pass", pass_1.passArgs, pass_1.pass);
    server.tool("get-sui-address", "get sui address", sui_1.getSuiAddress);
    server.tool("get-sui-balance", "get sui balance", sui_1.getSuiBalance);
    server.tool("transfer-sui", "transfer sui to one address", sui_1.transferArgs, sui_1.transferSui);
    server.tool("get-coin-market", "get coin market in coingecko", () => __awaiter(void 0, void 0, void 0, function* () {
        const url = `https://api.coingecko.com/api/v3/coins/markets?per_page=100&page=1&vs_currency=usd&price_change_percentage=24h`;
        const response = yield fetch(url, {
            method: "GET",
            headers: {
                accept: "application/json",
                "x-cg-demo-api-key": token,
            },
        });
        const data = yield response.json();
        const coinMarket = data.map((item) => {
            return {
                name: item.name,
                symbol: item.symbol,
                price: item.current_price,
                coin_id: item.id,
                price_change_percentage: item.price_change_percentage_24h,
            };
        });
        return {
            content: [
                { type: "text", text: `Coin market: ${JSON.stringify(coinMarket)}` },
            ],
            isError: false,
        };
    }));
    server.tool("get-coin-price", "Get current coin price", {
        coinId: zod_1.z.string(),
    }, (_a, ctx_1) => __awaiter(void 0, [_a, ctx_1], void 0, function* ({ coinId }, ctx) {
        utils_1.default.info(`get-coin-price tool called... ${coinId}`);
        utils_1.default.info(`sessionId: ${ctx.sessionId}`);
        try {
            // const coinId = "bitcoin";
            const from = Math.floor(new Date().getTime() / 1000) - 600;
            const to = Math.floor(new Date().getTime() / 1000);
            const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;
            utils_1.default.info(`visit : ${url}`);
            const response = yield fetch(url, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    "x-cg-demo-api-key": token,
                },
            });
            utils_1.default.info(`response: ${response.status} ${response.statusText} ${response.ok}`);
            const data = yield response.json();
            utils_1.default.info(`data: ${JSON.stringify(data)}`);
            return {
                content: [
                    {
                        type: "text",
                        text: `Current ${coinId} price: ${JSON.stringify(data)}`,
                    },
                ],
            };
        }
        catch (error) {
            utils_1.default.error(`Failed to get ${coinId} price:`, error);
            return {
                content: [
                    { type: "text", text: `Failed to get ${coinId} price: ${error}` },
                ],
            };
        }
    }));
    return server;
};
exports.createServer = createServer;
