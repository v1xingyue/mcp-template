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
const createServer = () => {
    const server = new mcp_js_1.McpServer({
        name: "mcp-coin-price",
        version: "1.0.0",
        description: "Get current coin price",
        context: {
            coinId: zod_1.z.string(),
        },
    });
    server.tool("get-coin-price", "Get current coin price", {
        coinId: zod_1.z.string(),
    }, (_a) => __awaiter(void 0, [_a], void 0, function* ({ coinId }) {
        utils_1.default.info(`get-coin-price tool called... ${coinId}`);
        const token = process.env.COINGECKO_TOKEN;
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
