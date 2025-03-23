#!/usr/bin/env node
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
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
const server_1 = require("./server");
const utils_1 = __importDefault(require("./utils"));
const commander_1 = require("commander");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const undici_1 = require("undici");
const program = new commander_1.Command();
class SessionTransport extends stdio_js_1.StdioServerTransport {
    constructor() {
        super(...arguments);
        this.sessionId = `session_${Date.now()}`;
    }
}
program
    .command("stdio", {
    isDefault: true,
})
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const server = (0, server_1.createServer)();
        const transport = new SessionTransport();
        yield server.connect(transport);
        utils_1.default.info("MCP Server started successfully");
    }
    catch (error) {
        utils_1.default.error("Failed to start MCP Server:", error);
    }
}));
program.command("sse").action(() => __awaiter(void 0, void 0, void 0, function* () {
    utils_1.default.info("Let's start SSE Server... ");
    const server = (0, server_1.createServer)();
    const app = (0, express_1.default)();
    const sessions = {};
    app.get("/sse", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`New SSE connection from ${req.ip}`);
        const sseTransport = new sse_js_1.SSEServerTransport("/messages", res);
        const sessionId = sseTransport.sessionId;
        console.log(`sessionId: ${sessionId} is connected....`);
        if (sessionId) {
            sessions[sessionId] = { transport: sseTransport, response: res };
        }
        yield server.connect(sseTransport);
    }));
    app.post("/messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const sessionId = req.query.sessionId;
        const session = sessions[sessionId];
        if (!session) {
            res.status(404).send("Session not found");
            return;
        }
        yield session.transport.handlePostMessage(req, res);
    }));
    const port = process.env.PORT || 3001;
    app.listen(port);
    utils_1.default.info("SSE Server started successfully");
    utils_1.default.info(`visit http://localhost:${port}/sse`);
}));
dotenv_1.default.config();
const proxy = process.env.PROXY;
if (proxy) {
    utils_1.default.info(`Using proxy: ${proxy}`);
    (0, undici_1.setGlobalDispatcher)(new undici_1.ProxyAgent(proxy));
}
program.parse(process.argv);
