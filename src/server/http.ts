/**
 * HTTP/SSE transport for MCP server
 */
import type { Application } from "express";
import type { Server } from "node:http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { setupHttpTransport } from "../transports/index.js";

/**
 * Options for creating an HTTP MCP server
 */
export interface HttpServerOptions {
  /**
   * Name of the server
   */
  name: string;

  /**
   * Version of the server
   */
  version: string;

  /**
   * Port to listen on
   */
  port?: number;

  /**
   * Host to bind to
   */
  host?: string;

  /**
   * Path for SSE endpoint
   */
  ssePath?: string;

  /**
   * Path for messages endpoint
   */
  messagesPath?: string;

  /**
   * Whether to enable CORS
   */
  enableCors?: boolean;
}

/**
 * Default HTTP server options
 */
export const DEFAULT_HTTP_SERVER_OPTIONS = {
  port: 3000,
  host: "localhost",
  ssePath: "/sse",
  messagesPath: "/messages",
  enableCors: true,
};

/**
 * Result from creating an HTTP MCP server
 */
export interface HttpServerResult {
  /**
   * The MCP server instance
   */
  server: McpServer;

  /**
   * The Express application
   */
  app: Application;

  /**
   * The HTTP server
   */
  httpServer: Server;
}

/**
 * Creates an MCP server with HTTP/SSE transport
 *
 * @param options HTTP server options
 * @returns The MCP server, Express app, and HTTP server
 */
export async function createHttpServer(options: HttpServerOptions): Promise<HttpServerResult> {
  const mergedOptions = { ...DEFAULT_HTTP_SERVER_OPTIONS, ...options };

  // Create an MCP server
  const server = new McpServer({
    name: mergedOptions.name,
    version: mergedOptions.version,
  }, {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  });

  // Set up HTTP transport
  const { app, httpServer } = await setupHttpTransport(server, {
    port: mergedOptions.port,
    host: mergedOptions.host,
    ssePath: mergedOptions.ssePath,
    messagesPath: mergedOptions.messagesPath,
    enableCors: mergedOptions.enableCors,
    serverName: mergedOptions.name,
  });

  return { server, app, httpServer };
}
