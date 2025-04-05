"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const notionKey = process.env.NOTION_API_KEY;
const validate = () => {
    if (!notionKey) {
        throw new Error("NOTION_API_KEY is not set");
    }
};
exports.validate = validate;
