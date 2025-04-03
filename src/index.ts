/**
 * boot-mcp - A starter template for building Model Context Protocol (MCP) applications with TypeScript
 *
 * This is the main entry point for the package.
 * It exports all the necessary components for building MCP applications.
 */

// Export version
export function getVersion() {
  return "0.1.0";
}

// Export prompts
export * from "./prompts/index.js";
// Export resources
export * from "./resources/index.js";

// Export roots
export * from "./roots/index.js";

// Export server implementations
export * from "./server/basic.js";

export * from "./server/http.js";

// Export tools
export * from "./tools/index.js";

// Export transports
export * from "./transports/index.js";
