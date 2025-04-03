import * as process from "node:process";
/**
 * Tools MCP server example
 *
 * This example demonstrates how to create an MCP server focused only on tools functionality.
 * 这个示例演示如何创建一个仅专注于工具功能的MCP服务器。
 */
import { createToolsServer } from "../src/server/basic.js";
import { setupStdioTransport } from "../src/transports/index.js";

async function main() {
  // Create a tools-focused MCP server
  // 创建一个专注于工具的MCP服务器
  const server = createToolsServer({
    name: "Example Tools MCP Server",
    version: "1.0.0",
  });

  console.error("Starting Tools MCP server...");

  // Set up stdio transport
  // 设置stdio传输
  await setupStdioTransport(server);

  console.error("Tools MCP server ready");
  console.error("Available tools categories:");
  console.error("- Basic tools (echo, calculate)");
  console.error("- System tools (execute_command, read_file, list_directory)");
  console.error("- Data tools (parse_json, analyze_csv)");
  console.error("- Utility tools (random, timestamp, transform_string)");
  console.error("\nUse with Claude Desktop by configuring an MCP server with stdio transport.");
}

// Run the example
// 运行示例
main().catch((error) => {
  console.error("Error running Tools MCP server:", error);
  process.exit(1);
});
