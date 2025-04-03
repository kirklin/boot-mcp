import * as process from "node:process";
/**
 * Resources MCP server example
 *
 * This example demonstrates how to create an MCP server focused only on resources functionality.
 * 这个示例演示如何创建一个仅专注于资源功能的MCP服务器。
 */
import { createResourcesServer } from "../src/server/basic.js";
import { setupStdioTransport } from "../src/transports/index.js";

async function main() {
  // Create a resources-focused MCP server
  // 创建一个专注于资源的MCP服务器
  const server = createResourcesServer({
    name: "Example Resources MCP Server",
    version: "1.0.0",
  });

  console.error("Starting Resources MCP server...");

  // Set up stdio transport
  // 设置stdio传输
  await setupStdioTransport(server);

  console.error("Resources MCP server ready");
  console.error("Available resource types:");
  console.error("- Text resources (plain text, code snippets, documentation)");
  console.error("- Binary resources (images, audio, data files)");
  console.error("- Template resources (resource templates with placeholders)");
  console.error("\nUse with Claude Desktop by configuring an MCP server with stdio transport.");
}

// Run the example
// 运行示例
main().catch((error) => {
  console.error("Error running Resources MCP server:", error);
  process.exit(1);
});
