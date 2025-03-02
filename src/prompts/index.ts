/**
 * Prompts for MCP server
 *
 * This file exports all prompt implementations.
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Registers common prompts on an MCP server
 *
 * @param server MCP server instance
 */
export function registerCommonPrompts(server: McpServer) {
  // Register a greeting prompt
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

  // Register a summarization prompt
  server.prompt(
    "summarize",
    { text: z.string() },
    ({ text }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please summarize the following text in a concise way:\n\n${text}`,
        },
      }],
    }),
  );

  // Register a code review prompt
  server.prompt(
    "review-code",
    { code: z.string() },
    ({ code }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please review this code and suggest improvements:\n\n\`\`\`\n${code}\n\`\`\``,
        },
      }],
    }),
  );
}
