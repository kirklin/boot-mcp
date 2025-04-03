/**
 * Resources for MCP server
 *
 * Resources are a core primitive in the Model Context Protocol (MCP) that allow
 * servers to expose data and content that can be read by clients and used as
 * context for LLM interactions.
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Buffer } from "node:buffer";
import * as process from "node:process";
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
        mimeType: "text/plain",
      }],
    }),
  );

  // Register a dynamic greeting resource with template
  server.resource(
    "greeting",
    new ResourceTemplate("greeting://{name}", { list: undefined }),
    async (uri, { name }) => ({
      contents: [{
        uri: uri.href,
        text: `Hello, ${name}!`,
        mimeType: "text/plain",
      }],
    }),
  );

  // Register a timestamp resource that could be updated
  server.resource(
    "timestamp",
    "timestamp://current",
    async uri => ({
      contents: [{
        uri: uri.href,
        text: `Current timestamp: ${new Date().toISOString()}`,
        mimeType: "text/plain",
      }],
    }),
  );

  // Register a system info resource
  server.resource(
    "system",
    "system://info",
    async (uri) => {
      // Get basic system information
      const systemInfo = {
        platform: process.platform,
        arch: process.arch,
        version: process.version,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
      };

      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(systemInfo, null, 2),
          mimeType: "application/json",
        }],
      };
    },
  );

  // Register a file resource template example
  server.resource(
    "file",
    new ResourceTemplate("file://{path*}", { list: undefined }),
    async (uri, { path }) => {
      // This is a mock implementation
      // In a real-world scenario, you would validate the path
      // and read an actual file from the filesystem
      return {
        contents: [{
          uri: uri.href,
          text: `Content of file: ${path}`,
          mimeType: "text/plain",
        }],
      };
    },
  );
}

/**
 * Utility function to create a base64 encoded blob from a string
 * Useful for binary resources
 *
 * @param data String data to encode
 * @returns Base64 encoded string
 */
export function createBlob(data: string): string {
  return Buffer.from(data).toString("base64");
}
