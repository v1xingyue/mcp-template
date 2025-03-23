import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
export const passArgs = {
  pass: z.string(),
  sessionId: z.string().optional(),
};

export const pass: ToolCallback<typeof passArgs> = async (args, extra) => {
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
    const sessionId = `session_${uuidv4()}`;
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
