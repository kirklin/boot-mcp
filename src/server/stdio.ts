/**
 * Stdio transport implementation for MCP server
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

/**
 * Creates and connects an MCP server using stdio transport
 *
 * @param options Server configuration options
 * @returns Connected MCP server instance
 */
export async function createStdioServer(options: {
  name: string;
  version: string;
}) {
  // Create an MCP server
  const server = new McpServer({
    name: options.name,
    version: options.version,
  });

  // Create stdio transport
  const transport = new StdioServerTransport();

  // Connect the server to the transport
  await server.connect(transport);

  return server;
}

/**
 * Example usage of stdio server
 */
if (require.main === module) {
  // This code only runs when the file is executed directly
  createStdioServer({
    name: "Example Stdio Server",
    version: "1.0.0",
  }).catch(console.error);
}
