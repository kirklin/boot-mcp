import { registerCommonResources } from "../src/resources";
/**
 * HTTP MCP server example
 *
 * This example demonstrates how to create an MCP server with HTTP/SSE transport.
 */
import { createHttpServer } from "../src/server/http";
import { registerCommonTools } from "../src/tools";

async function main() {
  try {
    // Create an HTTP MCP server
    const { server, app } = await createHttpServer({
      name: "Example HTTP MCP Server",
      version: "1.0.0",
      port: 3000,
    });

    // Register common tools and resources
    registerCommonTools(server);
    registerCommonResources(server);

    console.error("MCP HTTP server running at http://localhost:3000");
    console.error("Available endpoints:");
    console.error("- GET /sse?sessionId=<id> - SSE endpoint for receiving messages");
    console.error("- POST /messages?sessionId=<id> - Endpoint for sending messages");
  } catch (error) {
    console.error("Error starting HTTP MCP server:", error);
    process.exit(1);
  }
}

// Run the example
main().catch((error) => {
  console.error("Error running HTTP MCP server:", error);
  process.exit(1);
});
