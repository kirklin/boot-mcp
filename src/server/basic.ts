/**
 * Basic MCP server implementation with common tools and resources
 */
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Creates a basic MCP server with common tools and resources
 *
 * @param options Server configuration options
 * @returns Configured MCP server instance
 */
export function createBasicServer(options: {
  name: string;
  version: string;
}) {
  // Create an MCP server
  const server = new McpServer({
    name: options.name,
    version: options.version,
  });

  // Add a simple echo tool
  server.tool(
    "echo",
    { message: z.string() },
    async ({ message }) => ({
      content: [{ type: "text", text: `Echo: ${message}` }],
    }),
  );

  // Add a calculator tool
  server.tool(
    "calculate",
    {
      operation: z.enum(["add", "subtract", "multiply", "divide"]),
      a: z.number(),
      b: z.number(),
    },
    async ({ operation, a, b }) => {
      let result: number;

      switch (operation) {
        case "add":
          result = a + b;
          break;
        case "subtract":
          result = a - b;
          break;
        case "multiply":
          result = a * b;
          break;
        case "divide":
          if (b === 0) {
            return {
              content: [{ type: "text", text: "Error: Division by zero" }],
              isError: true,
            };
          }
          result = a / b;
          break;
      }

      return {
        content: [{ type: "text", text: String(result) }],
      };
    },
  );

  // Add a dynamic greeting resource
  server.resource(
    "greeting",
    new ResourceTemplate("greeting://{name}", { list: undefined }),
    async (uri, { name }) => ({
      contents: [{
        uri: uri.href,
        text: `Hello, ${name}!`,
      }],
    }),
  );

  // Add a simple prompt
  server.prompt(
    "greet",
    { name: z.string() },
    ({ name }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please greet ${name} in a friendly way.`,
        },
      }],
    }),
  );

  return server;
}
