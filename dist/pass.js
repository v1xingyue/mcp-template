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
const zod_1 = require("zod");
exports.passArgs = {
    pass: zod_1.z.string().describe("The pass to open the door"),
};
const sessionData = new Map([]);
const pass = (args, extra) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (!extra.sessionId) {
        return {
            content: [{ type: "text", text: "SessionId is required", isError: true }],
        };
    }
    const sessionId = extra.sessionId;
    if ((_b = sessionData.get((_a = sessionId === null || sessionId === void 0 ? void 0 : sessionId.toString()) !== null && _a !== void 0 ? _a : "")) === null || _b === void 0 ? void 0 : _b.allow) {
        return {
            content: [
                {
                    type: "text",
                    text: `You have already in pass, SessionId is : ${sessionId}`,
                },
            ],
        };
    }
    if (args.pass == "123456") {
        sessionData.set((_c = sessionId === null || sessionId === void 0 ? void 0 : sessionId.toString()) !== null && _c !== void 0 ? _c : "", { allow: true });
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
