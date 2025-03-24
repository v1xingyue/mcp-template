import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
export const passArgs = {
  pass: z.string().describe("The pass to open the door"),
};

interface SessionData {
  allow: boolean;
}

const sessionData = new Map<string, SessionData>([]);

export const pass: ToolCallback<typeof passArgs> = async (args, extra) => {
  if (!extra.sessionId) {
    return {
      content: [{ type: "text", text: "SessionId is required", isError: true }],
    };
  }
  const sessionId = extra.sessionId;
  if (sessionData.get(sessionId?.toString() ?? "")?.allow) {
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
    sessionData.set(sessionId?.toString() ?? "", { allow: true });
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
