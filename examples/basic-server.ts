import * as process from "node:process";
import { registerCommonPrompts } from "../src/prompts/index.js";
import { registerCommonResources } from "../src/resources/index.js";
/**
 * Basic MCP server example
 *
 * This example demonstrates how to create a simple MCP server with stdio transport.
 * 这个示例演示如何创建一个带有stdio传输的简单MCP服务器。
 */
import { createBasicServer } from "../src/server/basic.js";
import { registerCommonTools } from "../src/tools/index.js";
import { setupStdioTransport } from "../src/transports/index.js";

async function main() {
  // Create a basic MCP server with all capabilities enabled
  // 创建一个启用所有功能的基本MCP服务器
  const server = createBasicServer({
    name: "Example MCP Server",
    version: "1.0.0",
    enableTools: true,
    enableResources: true,
    enablePrompts: true,
    enableRoots: true,
  });

  console.error("Starting MCP server...");

  // Set up stdio transport
  // 设置stdio传输
  await setupStdioTransport(server);

  console.error("MCP server ready");
  console.error("Available capabilities:");
  console.error("- Tools: Various utility functions, system operations, and data processing");
  console.error("- Resources: Static and dynamic content resources");
  console.error("- Prompts: Reusable templates for LLM interactions");
  console.error("- Roots: Directory and URI boundary definitions");
  console.error("\nUse with Claude Desktop by configuring an MCP server with stdio transport.");
}

// Run the example
// 运行示例
main().catch((error) => {
  console.error("Error running MCP server:", error);
  process.exit(1);
});
