import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import logger from "./utils";
import { z } from "zod";

export const createServer = () => {
  const server = new McpServer({
    name: "mcp-coin-price",
    version: "1.0.0",
    description: "Get current coin price",
    context: {
      coinId: z.string(),
    },
  });

  server.tool(
    "get-coin-price",
    "Get current coin price",
    {
      coinId: z.string(),
    },
    async ({ coinId }) => {
      logger.info(`get-coin-price tool called... ${coinId}`);
      const token = process.env.COINGECKO_TOKEN;
      try {
        // const coinId = "bitcoin";
        const from = Math.floor(new Date().getTime() / 1000) - 600;
        const to = Math.floor(new Date().getTime() / 1000);
        const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;
        logger.info(`visit : ${url}`);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            accept: "application/json",
            "x-cg-demo-api-key": token,
          } as any,
        });
        logger.info(
          `response: ${response.status} ${response.statusText} ${response.ok}`
        );

        const data = await response.json();
        logger.info(`data: ${JSON.stringify(data)}`);
        return {
          content: [
            {
              type: "text",
              text: `Current ${coinId} price: ${JSON.stringify(data)}`,
            },
          ],
        };
      } catch (error) {
        logger.error(`Failed to get ${coinId} price:`, error);
        return {
          content: [
            { type: "text", text: `Failed to get ${coinId} price: ${error}` },
          ],
        };
      }
    }
  );

  return server;
};
