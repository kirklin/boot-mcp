/**
 * Resources for MCP server
 *
 * This file exports all resource implementations.
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Registers common resources on an MCP server
 *
 * @param server MCP server instance
 */
export function registerCommonResources(server: McpServer) {
  // Register a static text resource
  server.resource(
    "info",
    "info://app",
    async uri => ({
      contents: [{
        uri: uri.href,
        text: "This is a static information resource.",
      }],
    }),
  );

  // Register a dynamic greeting resource
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

  // Register a timestamp resource
  server.resource(
    "timestamp",
    "timestamp://current",
    async uri => ({
      contents: [{
        uri: uri.href,
        text: `Current timestamp: ${new Date().toISOString()}`,
      }],
    }),
  );
}
