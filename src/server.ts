import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import logger from "./utils";
import { z } from "zod";
import { getSuiAddress, getSuiBalance, transferArgs, transferSui } from "./sui";
import { BUILD_TIME } from "./build-info";
import { pass, passArgs } from "./pass";
import { sendTelegramNotice, sendTelegramNoticeArgs } from "./telegram";

const token = process.env.COINGECKO_TOKEN;

export const createServer = () => {
  const server = new McpServer({
    name: "mcp-coin-price",
    version: "1.0.0",
    description: "Get current coin price",
    context: {
      coinId: z.string(),
      userPass: z.string(),
    },
  });

  server.resource("info", "/info", async (uri) => {
    console.log("info resource called...", uri);
    return {
      contents: [
        {
          uri: uri.href,
          text: `build-time: ${BUILD_TIME}`,
        },
      ],
    };
  });

  server.resource(
    "greeting",
    new ResourceTemplate("greeting://{name}", { list: undefined }),
    async (uri, { name }) => ({
      contents: [
        {
          uri: uri.href,
          text: `Hello, ${name}!`,
        },
      ],
    })
  );

  server.tool(
    "telegram-notice",
    "send notice to telegram",
    sendTelegramNoticeArgs,
    sendTelegramNotice
  );

  server.tool("open-the-door", "Open the door by the pass", passArgs, pass);
  server.tool("get-sui-address", "get sui address", getSuiAddress);
  server.tool("get-sui-balance", "get sui balance", getSuiBalance);
  server.tool(
    "transfer-sui",
    "transfer sui to one address",
    transferArgs,
    transferSui
  );

  server.tool("get-coin-list", "get coin list in coingecko", async () => {
    const url = `https://api.coingecko.com/api/v3/coins/list`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": token,
      } as any,
    });
    const data = await response.json();
    return {
      content: [{ type: "text", text: `Coin list: ${JSON.stringify(data)}` }],
      isError: false,
    };
  });

  server.tool(
    "get-coin-price",
    "Get current coin price",
    {
      coinId: z.string(),
    },
    async ({ coinId }, ctx) => {
      logger.info(`get-coin-price tool called... ${coinId}`);
      logger.info(`sessionId: ${ctx.sessionId}`);

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
