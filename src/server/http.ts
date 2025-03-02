import type { Express, RequestHandler } from "express";
/**
 * HTTP with SSE transport implementation for MCP server
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import cors from "cors";
import express from "express";

/**
 * Creates and starts an MCP server using HTTP with SSE transport
 *
 * @param options Server configuration options
 * @returns Express app and MCP server instance
 */
export async function createHttpServer(options: {
  name: string;
  version: string;
  port?: number;
}): Promise<{ app: Express; server: McpServer }> {
  // Create an MCP server
  const server = new McpServer({
    name: options.name,
    version: options.version,
  });

  // Create Express app
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Map to store active transports
  const transports = new Map<string, SSEServerTransport>();

  // 定义路由处理函数
  const handleSseRequest: RequestHandler = async (req, res) => {
    const sessionId = req.query.sessionId as string || Date.now().toString();

    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Create transport
    const transport = new SSEServerTransport("/messages", res);
    transports.set(sessionId, transport);

    // Handle client disconnect
    req.on("close", () => {
      transports.delete(sessionId);
    });

    // Connect server to transport
    await server.connect(transport);

    // Send session ID
    res.write(`data: ${JSON.stringify({ sessionId })}\n\n`);
  };

  const handleMessageRequest: RequestHandler = (req, res, _next) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports.get(sessionId);

    if (!transport) {
      res.status(404).json({ error: "Session not found" });
      return; // 不返回Response对象，而是直接返回void
    }

    // 使用Promise处理异步操作
    void (async () => {
      try {
        await transport.handlePostMessage(req, res);
      } catch (error) {
        console.error("Error handling message:", error);
        if (!res.headersSent) {
          res.status(500).json({ error: "Internal server error" });
        }
      }
    })();
  };

  // 注册路由
  app.get("/sse", handleSseRequest);
  app.post("/messages", handleMessageRequest);

  // Start server
  const port = options.port || 3000;
  app.listen(port, () => {
    console.error(`MCP HTTP server listening on port ${port}`);
  });

  return { app, server };
}

/**
 * Example usage of HTTP server
 */
if (typeof require !== "undefined" && require.main === module) {
  // This code only runs when the file is executed directly
  createHttpServer({
    name: "Example HTTP Server",
    version: "1.0.0",
    port: 3000,
  }).catch(console.error);
}
