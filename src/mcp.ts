#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createServer } from "./server";
import logger from "./utils";
import { Command } from "commander";
import express from "express";
import dotenv from "dotenv";
import { ProxyAgent, setGlobalDispatcher } from "undici";
const program = new Command();

class SessionTransport extends StdioServerTransport {
  public readonly sessionId = `session_${Date.now()}`;
}

program
  .command("stdio", {
    isDefault: true,
  })
  .action(async () => {
    try {
      const server = createServer();
      const transport = new SessionTransport();
      await server.connect(transport);
      logger.info("MCP Server started successfully");
    } catch (error) {
      logger.error("Failed to start MCP Server:", error);
    }
  });

program.command("sse").action(async () => {
  logger.info("Let's start SSE Server... ");
  const server = createServer();
  const app = express();
  const sessions: Record<
    string,
    { transport: SSEServerTransport; response: express.Response }
  > = {};
  app.get("/sse", async (req, res) => {
    console.log(`New SSE connection from ${req.ip}`);
    const sseTransport = new SSEServerTransport("/messages", res);
    const sessionId = sseTransport.sessionId;
    console.log(`sessionId: ${sessionId} is connected....`);
    if (sessionId) {
      sessions[sessionId] = { transport: sseTransport, response: res };
    }
    await server.connect(sseTransport);
  });

  app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const session = sessions[sessionId];
    if (!session) {
      res.status(404).send("Session not found");
      return;
    }

    await session.transport.handlePostMessage(req, res);
  });

  const port = process.env.PORT || 3001;

  app.listen(port);
  logger.info("SSE Server started successfully");
  logger.info(`visit http://localhost:${port}/sse`);
});

dotenv.config();
const proxy = process.env.PROXY;
if (proxy) {
  logger.info(`Using proxy: ${proxy}`);
  setGlobalDispatcher(new ProxyAgent(proxy));
}

program.parse(process.argv);
