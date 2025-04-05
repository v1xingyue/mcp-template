import dotenv from "dotenv";
dotenv.config();
import logger from "./utils";
import { validate } from "./notion";
import { CoinGeckoClient } from "coingecko-api-v3";

import { ProxyAgent, setGlobalDispatcher } from "undici";

dotenv.config();
const proxy = process.env.PROXY;
if (proxy) {
  logger.info(`Using proxy: ${proxy}`);
  setGlobalDispatcher(new ProxyAgent(proxy));
}

const main = async () => {
  const token = process.env.COINGECKO_TOKEN;
  const url = `https://api.coingecko.com/api/v3/coins/markets?per_page=100&page=1&vs_currency=usd&price_change_percentage=24h`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": token,
    } as any,
  });
  const data = await response.json();
  console.log(
    data.map((item: any) => {
      return {
        name: item.name,
        symbol: item.symbol,
        price: item.current_price,
        coin_id: item.id,
        price_change_percentage: item.price_change_percentage_24h,
      };
    })
  );
};

main().catch((error) => {
  logger.error("Failed to start bot:", error);
  process.exit(1);
});
