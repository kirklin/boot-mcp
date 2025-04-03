import * as process from "node:process";
import { registerCommonPrompts } from "../src/prompts/index.js";
import { registerCommonResources } from "../src/resources/index.js";
/**
 * HTTP MCP server example
 *
 * This example demonstrates how to create an MCP server with HTTP/SSE transport.
 * 这个示例演示如何创建一个带有HTTP/SSE传输的MCP服务器。
 */
import { createHttpServer } from "../src/server/http.js";
import { registerCommonTools } from "../src/tools/index.js";

async function main() {
  try {
    // Create an HTTP MCP server with all capabilities
    // 创建一个具有所有功能的HTTP MCP服务器
    const { server, httpServer } = await createHttpServer({
      name: "Example HTTP MCP Server",
      version: "1.0.0",
      port: 3000,
      host: "localhost",
      enableCors: true,
    });

    // Register common components (already done in createHttpServer, but shown here for clarity)
    // 注册通用组件（已经在createHttpServer中完成，这里只是为了清晰展示）
    registerCommonPrompts(server);
    registerCommonTools(server);
    registerCommonResources(server);

    console.error("MCP HTTP server running at http://localhost:3000");
    console.error("Available endpoints:");
    console.error("- GET /status - Server status information");
    console.error("- GET /sse - SSE endpoint for receiving messages");
    console.error("- POST /messages - Endpoint for sending messages");
    console.error("\nAvailable MCP capabilities:");
    console.error("- Tools: Various utility functions and system operations");
    console.error("- Resources: Static and dynamic content resources");
    console.error("- Prompts: Reusable templates for LLM interactions");

    // Add a shutdown handler
    // 添加关闭处理程序
    process.on("SIGINT", () => {
      console.error("Shutting down server...");
      httpServer.close(() => {
        console.error("Server shutdown complete");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Error starting HTTP MCP server:", error);
    process.exit(1);
  }
}

// Run the example
// 运行示例
main().catch((error) => {
  console.error("Error running HTTP MCP server:", error);
  process.exit(1);
});
