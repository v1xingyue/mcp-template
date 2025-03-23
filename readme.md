# mcp-template

Start as SSE

```shell
node dist/mcp.js sse
```

Start as stdio

```shell
node dist/mcp.js stdio
```

Or install by npx:

```shell
npx -y git+https://github.com/v1xingyue/mcp-template.git
```

start inspector

```shell
npx @modelcontextprotocol/inspector
```

mcp json

```json
{
      "command":"npx",
      "args": ["-y","@v1xingyue/mcp-template"],
      "env": {
        "PROXY": "http://localhost:7890",
        "COINGECKO_TOKEN": ""
      }
    }
```