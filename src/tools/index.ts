/**
 * Tools for MCP server
 *
 * This file exports all tool implementations.
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Registers common tools on an MCP server
 *
 * @param server MCP server instance
 */
export function registerCommonTools(server: McpServer) {
  // Register an echo tool
  server.tool(
    "echo",
    { message: z.string() },
    async ({ message }) => ({
      content: [{ type: "text", text: `Echo: ${message}` }],
    }),
  );

  // Register a calculator tool
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

  // Register a random number generator tool
  server.tool(
    "random",
    {
      min: z.number().default(0),
      max: z.number().default(1),
    },
    async ({ min, max }) => {
      const random = Math.random() * (max - min) + min;
      return {
        content: [{ type: "text", text: String(random) }],
      };
    },
  );

  // Register a timestamp tool
  server.tool(
    "timestamp",
    {},
    async () => ({
      content: [{ type: "text", text: new Date().toISOString() }],
    }),
  );
}
