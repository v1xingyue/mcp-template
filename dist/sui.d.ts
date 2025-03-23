import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
export declare const getSuiAddress: ToolCallback;
export declare const getSuiBalance: ToolCallback;
export declare const getTransactionLink: (tx: string) => string | undefined;
export declare const transferArgs: {
    to: z.ZodString;
    amount: z.ZodString;
};
export declare const transferSui: ToolCallback<typeof transferArgs>;
