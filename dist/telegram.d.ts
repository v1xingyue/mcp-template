import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
export declare const sendTelegramNoticeArgs: {
    message: z.ZodString;
};
export declare const sendTelegramNotice: ToolCallback<typeof sendTelegramNoticeArgs>;
