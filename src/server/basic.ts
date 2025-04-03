import * as path from "node:path";
import * as process from "node:process";
/**
 * Basic MCP server implementation with common tools and resources
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCommonPrompts } from "../prompts/index.js";
import { registerCommonResources } from "../resources/index.js";
import { createStandardRoots, registerRootHandling } from "../roots/index.js";
import { registerCommonTools } from "../tools/index.js";

/**
 * Basic server configuration options
 */
export interface ServerOptions {
  /**
   * Name of the server
   */
  name: string;

  /**
   * Version of the server
   */
  version: string;

  /**
   * Base directory for resources and roots
   */
  baseDirectory?: string;

  /**
   * Whether to enable tools
   */
  enableTools?: boolean;

  /**
   * Whether to enable resources
   */
  enableResources?: boolean;

  /**
   * Whether to enable prompts
   */
  enablePrompts?: boolean;

  /**
   * Whether to enable roots
   */
  enableRoots?: boolean;
}

/**
 * Default server options
 */
export const DEFAULT_SERVER_OPTIONS: Partial<ServerOptions> = {
  baseDirectory: process.cwd(),
  enableTools: true,
  enableResources: true,
  enablePrompts: true,
  enableRoots: true,
};

/**
 * Creates a basic MCP server with common tools and resources
 *
 * @param options Server configuration options
 * @returns Configured MCP server instance
 */
export function createBasicServer(options: ServerOptions): McpServer {
  const mergedOptions = { ...DEFAULT_SERVER_OPTIONS, ...options };

  // Normalize base directory
  const baseDir = path.resolve(mergedOptions.baseDirectory || process.cwd());

  // Create server capabilities
  const capabilities: Record<string, Record<string, unknown>> = {};

  // Enable requested features
  if (mergedOptions.enableTools) {
    capabilities.tools = {};
  }

  if (mergedOptions.enableResources) {
    capabilities.resources = {};
  }

  if (mergedOptions.enablePrompts) {
    capabilities.prompts = {};
  }

  if (mergedOptions.enableRoots) {
    capabilities.roots = {};
  }

  // Create an MCP server
  const server = new McpServer({
    name: mergedOptions.name,
    version: mergedOptions.version,
  }, { capabilities });

  // Register common tools if enabled
  if (mergedOptions.enableTools) {
    registerCommonTools(server);
  }

  // Register common resources if enabled
  if (mergedOptions.enableResources) {
    registerCommonResources(server);
  }

  // Register common prompts if enabled
  if (mergedOptions.enablePrompts) {
    registerCommonPrompts(server);
  }

  // Register root handling if enabled
  if (mergedOptions.enableRoots) {
    registerRootHandling(server, {
      defaultRoots: createStandardRoots(baseDir),
    });
  }

  return server;
}

/**
 * Creates a server with minimal features enabled
 *
 * @param options Server configuration options
 * @returns Configured MCP server instance
 */
export function createMinimalServer(options: ServerOptions): McpServer {
  return createBasicServer({
    ...options,
    enableResources: false,
    enablePrompts: false,
    enableRoots: false,
  });
}

/**
 * Creates a server focused on tool functionality
 *
 * @param options Server configuration options
 * @returns Configured MCP server instance
 */
export function createToolsServer(options: ServerOptions): McpServer {
  return createBasicServer({
    ...options,
    enableResources: false,
    enablePrompts: false,
  });
}

/**
 * Creates a server focused on resource functionality
 *
 * @param options Server configuration options
 * @returns Configured MCP server instance
 */
export function createResourcesServer(options: ServerOptions): McpServer {
  return createBasicServer({
    ...options,
    enableTools: false,
    enablePrompts: false,
  });
}
