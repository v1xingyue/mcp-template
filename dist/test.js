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
const undici_1 = require("undici");
dotenv_1.default.config();
const proxy = process.env.PROXY;
if (proxy) {
    utils_1.default.info(`Using proxy: ${proxy}`);
    (0, undici_1.setGlobalDispatcher)(new undici_1.ProxyAgent(proxy));
}
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const token = process.env.COINGECKO_TOKEN;
    const url = `https://api.coingecko.com/api/v3/coins/markets?per_page=100&page=1&vs_currency=usd&price_change_percentage=24h`;
    const response = yield fetch(url, {
        method: "GET",
        headers: {
            accept: "application/json",
            "x-cg-demo-api-key": token,
        },
    });
    const data = yield response.json();
    console.log(data.map((item) => {
        return {
            name: item.name,
            symbol: item.symbol,
            price: item.current_price,
            coin_id: item.id,
            price_change_percentage: item.price_change_percentage_24h,
        };
    }));
});
main().catch((error) => {
    utils_1.default.error("Failed to start bot:", error);
    process.exit(1);
});
