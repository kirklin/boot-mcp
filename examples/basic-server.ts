import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
/**
 * Basic MCP server example
 *
 * This example demonstrates how to create a simple MCP server with stdio transport.
 */
import { createBasicServer } from "../src/server/basic";

async function main() {
  // Create a basic MCP server
  const server = createBasicServer({
    name: "Example MCP Server",
    version: "1.0.0",
  });

  console.log("Starting MCP server...");

  // Create stdio transport
  const transport = new StdioServerTransport();

  // Connect the server to the transport
  await server.connect(transport);

  console.log("MCP server connected to stdio transport");
}

// Run the example
main().catch((error) => {
  console.error("Error running MCP server:", error);
  process.exit(1);
});
