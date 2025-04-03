import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as http from "node:http";
/**
 * Transports for MCP server
 *
 * Transports in the Model Context Protocol (MCP) provide the foundation for
 * communication between clients and servers. A transport handles the underlying
 * mechanics of how messages are sent and received.
 */
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as cors from "cors";
import * as express from "express";

/**
 * Options for creating a transport
 */
export interface TransportOptions {
  /**
   * Type of transport to create
   */
  type: "stdio" | "sse";

  /**
   * Port to use for HTTP-based transports
   */
  port?: number;

  /**
   * Host to bind to for HTTP-based transports
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

  /**
   * Server name for status responses
   */
  serverName?: string;
}

/**
 * Default options for transports
 */
export const DEFAULT_TRANSPORT_OPTIONS: Omit<TransportOptions, "type"> = {
  port: 3000,
  host: "localhost",
  ssePath: "/sse",
  messagesPath: "/messages",
  enableCors: true,
  serverName: "MCP Server",
};

/**
 * Setup an MCP server with a stdio transport
 *
 * @param server MCP server instance
 * @returns The transport instance
 */
export async function setupStdioTransport(server: McpServer): Promise<StdioServerTransport> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  return transport;
}

/**
 * Setup an MCP server with an HTTP/SSE transport
 *
 * @param server MCP server instance
 * @param options Transport options
 * @returns Express app, HTTP server, and connected status
 */
export async function setupHttpTransport(
  server: McpServer,
  options: Omit<TransportOptions, "type"> = {},
): Promise<{
    app: express.Application;
    httpServer: http.Server;
    connected: boolean;
  }> {
  const mergedOptions = { ...DEFAULT_TRANSPORT_OPTIONS, ...options };

  // Create Express application
  const app = express.default();

  // Enable CORS if requested
  if (mergedOptions.enableCors) {
    app.use(cors.default());
  }

  // Parse JSON request bodies
  app.use(express.json());

  // Create HTTP server from Express app
  const httpServer = http.createServer(app);

  // Add a simple status route
  app.get("/status", (_req, res) => {
    res.json({ status: "ok", server: mergedOptions.serverName });
  });

  // NOTE: The actual SSE transport implementation is not included here
  // as it requires more complex implementation with the specific protocol
  // This is just a stub for demonstration purposes

  // Start the HTTP server
  await new Promise<void>((resolve, reject) => {
    httpServer.listen(mergedOptions.port, mergedOptions.host, () => {
      // Use console.error for logs instead of console.log
      console.error(`HTTP server listening on http://${mergedOptions.host}:${mergedOptions.port}`);
      resolve();
    });

    httpServer.on("error", (error) => {
      reject(error);
    });
  });

  return {
    app,
    httpServer,
    connected: false, // Since we don't have a real SSE transport implementation
  };
}

/**
 * Create and setup a transport based on options
 *
 * @param server MCP server instance
 * @param options Transport options
 * @returns The transport and any associated services
 */
export async function setupTransport(
  server: McpServer,
  options: TransportOptions,
): Promise<unknown> {
  switch (options.type) {
    case "stdio":
      return setupStdioTransport(server);
    case "sse":
      return setupHttpTransport(server, options);
    default:
      throw new Error(`Unsupported transport type: ${(options as TransportOptions).type}`);
  }
}
