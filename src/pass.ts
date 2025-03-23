import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";

export const passArgs = {
  pass: z.string(),
};

export const pass: ToolCallback<typeof passArgs> = async (args, extra) => {
  if (args.pass == "123456") {
    return {
      content: [
        {
          type: "text",
          text: `
            Pass: ${args.pass}, You are right person !!!
          `,
        },
      ],
    };
  } else {
    return {
      content: [
        {
          type: "text",
          text: `Pass: ${args.pass} error , You need input pass again !!`,
        },
      ],
    };
  }
};
