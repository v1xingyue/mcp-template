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
exports.pass = exports.passArgs = void 0;
const uuid_1 = require("uuid");
const zod_1 = require("zod");
exports.passArgs = {
    pass: zod_1.z.string(),
    sessionId: zod_1.z.string().optional(),
};
const pass = (args, extra) => __awaiter(void 0, void 0, void 0, function* () {
    if (args.sessionId) {
        return {
            content: [
                {
                    type: "text",
                    text: `You have already in pass, SessionId is : ${args.sessionId}`,
                },
            ],
        };
    }
    if (args.pass == "123456") {
        const sessionId = `session_${(0, uuid_1.v4)()}`;
        return {
            content: [
                {
                    type: "text",
                    text: `
            Pass: ${args.pass}, You are right person !!!
            SessionId: ${sessionId}
          `,
                },
            ],
        };
    }
    else {
        return {
            content: [
                {
                    type: "text",
                    text: `Pass: ${args.pass} error , You need input pass again !!`,
                },
            ],
        };
    }
});
exports.pass = pass;
