import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
export declare const passArgs: {
    pass: z.ZodString;
};
export declare const pass: ToolCallback<typeof passArgs>;
