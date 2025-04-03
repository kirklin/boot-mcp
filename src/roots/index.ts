/**
 * Roots for MCP server
 *
 * Roots are a concept in MCP that define the boundaries where servers can operate.
 * They provide a way for clients to inform servers about relevant resources and their locations.
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Represents a root location in the MCP protocol
 */
export interface Root {
  /**
   * URI for the root location
   */
  uri: string;

  /**
   * Human-readable name for the root
   */
  name: string;

  /**
   * Optional description of the root
   */
  description?: string;
}

/**
 * Registers root handling capabilities for an MCP server
 *
 * @param server MCP server instance
 * @param options Configuration options
 */
export function registerRootHandling(
  server: McpServer,
  options: {
    /**
     * Callback when roots change
     */
    onRootsChanged?: (roots: Root[]) => void;

    /**
     * Default list of supported roots if not provided by client
     */
    defaultRoots?: Root[];
  } = {},
) {
  const currentRoots: Root[] = options.defaultRoots || [];

  // Handle root management and tracking of known roots
  // This is a simplified implementation since we cannot directly
  // modify the server's state in this example

  if (options.onRootsChanged) {
    // For a real implementation, you would subscribe to root changes
    // and call this callback when roots are updated
    options.onRootsChanged(currentRoots);
  }
}

/**
 * Check if a URI is within the boundaries of the provided roots
 *
 * @param uri URI to check
 * @param roots List of roots to check against
 * @returns Whether the URI is within any of the roots
 */
export function isUriWithinRoots(uri: string, roots: Root[]): boolean {
  const normalizedUri = uri.endsWith("/") ? uri : `${uri}/`;

  return roots.some((root) => {
    const normalizedRoot = root.uri.endsWith("/") ? root.uri : `${root.uri}/`;
    return normalizedUri.startsWith(normalizedRoot);
  });
}

/**
 * Filter a list of resources to only those within roots
 *
 * @param resourceUris List of resource URIs
 * @param roots List of roots to filter against
 * @returns Filtered list of URIs that are within roots
 */
export function filterResourcesByRoots(resourceUris: string[], roots: Root[]): string[] {
  return resourceUris.filter(uri => isUriWithinRoots(uri, roots));
}

/**
 * Create a list of standard root locations
 *
 * @param baseDirectory Base directory to use for roots
 * @returns List of standard root locations
 */
export function createStandardRoots(baseDirectory: string): Root[] {
  // Ensure the base directory has a trailing slash
  const base = baseDirectory.endsWith("/") ? baseDirectory : `${baseDirectory}/`;

  return [
    {
      uri: `file://${base}`,
      name: "Project Root",
      description: "The root directory of the project",
    },
    {
      uri: `file://${base}src/`,
      name: "Source Code",
      description: "Source code directory",
    },
    {
      uri: `file://${base}docs/`,
      name: "Documentation",
      description: "Project documentation",
    },
    {
      uri: `file://${base}examples/`,
      name: "Examples",
      description: "Example code and usage",
    },
  ];
}

/**
 * Convert a local file path to a file:// URI
 *
 * @param filePath Local file path
 * @returns file:// URI
 */
export function filePathToUri(filePath: string): string {
  // Remove any leading slashes for Windows paths
  const normalizedPath = filePath.replace(/^\/*/, "");

  // For Windows paths with drive letters, handle specially
  if (/^[a-z]:/i.test(normalizedPath)) {
    return `file:///${normalizedPath}`;
  }

  // For Unix paths, simply prepend file://
  return `file:///${normalizedPath}`;
}
