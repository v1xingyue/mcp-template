"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)({
    level: "info",
    transport: {
        targets: [
            {
                level: "info",
                target: "pino-pretty",
                options: {
                    colorize: true,
                    destination: 2,
                },
            },
        ],
    },
});
exports.default = logger;
