/**
 * Tools for MCP server
 *
 * Tools are a powerful primitive in the Model Context Protocol (MCP) that enable
 * servers to expose executable functionality to clients. Through tools, LLMs can
 * interact with external systems, perform computations, and take actions.
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { exec as execCallback } from "node:child_process";
import * as fs from "node:fs/promises";
import * as process from "node:process";
import { promisify } from "node:util";
import { z } from "zod";

// Promisify exec
const exec = promisify(execCallback);

/**
 * Registers common tools on an MCP server
 *
 * @param server MCP server instance
 */
export function registerCommonTools(server: McpServer) {
  // Basic tools
  registerBasicTools(server);

  // System operation tools
  registerSystemTools(server);

  // Data processing tools
  registerDataTools(server);

  // Utility tools
  registerUtilityTools(server);
}

/**
 * Register basic utility tools
 *
 * @param server MCP server instance
 */
function registerBasicTools(server: McpServer) {
  // Register an echo tool
  server.tool(
    "echo",
    { message: z.string().describe("Message to echo back") },
    async ({ message }) => ({
      content: [{ type: "text", text: `Echo: ${message}` }],
    }),
  );

  // Register a calculator tool
  server.tool(
    "calculate",
    {
      operation: z.enum(["add", "subtract", "multiply", "divide"])
        .describe("The mathematical operation to perform"),
      a: z.number().describe("First number"),
      b: z.number().describe("Second number"),
    },
    async ({ operation, a, b }) => {
      let result: number;

      switch (operation) {
        case "add":
          result = a + b;
          break;
        case "subtract":
          result = a - b;
          break;
        case "multiply":
          result = a * b;
          break;
        case "divide":
          if (b === 0) {
            return {
              content: [{ type: "text", text: "Error: Division by zero" }],
              isError: true,
            };
          }
          result = a / b;
          break;
      }

      return {
        content: [{ type: "text", text: String(result) }],
      };
    },
  );
}

/**
 * Register system operation tools
 *
 * @param server MCP server instance
 */
function registerSystemTools(server: McpServer) {
  // Register a command execution tool (with safety constraints)
  server.tool(
    "execute_command",
    {
      command: z.string().describe("Command to execute"),
      args: z.array(z.string()).describe("Command arguments"),
      cwd: z.string().optional().describe("Working directory"),
      timeout: z.number().optional().describe("Timeout in milliseconds"),
    },
    async ({ command, args, cwd, timeout }) => {
      try {
        // SECURITY: In a real implementation, you would restrict commands
        // This is just an example and should be used with caution
        const fullCommand = `${command} ${args.join(" ")}`;
        const options = {
          cwd: cwd || process.cwd(),
          timeout: timeout || 10000, // Default timeout: 10 seconds
        };

        const { stdout, stderr } = await exec(fullCommand, options);

        if (stderr) {
          return {
            content: [
              { type: "text", text: "Command executed with warnings:" },
              { type: "text", text: stderr },
              { type: "text", text: "Output:" },
              { type: "text", text: stdout || "(no output)" },
            ],
          };
        }

        return {
          content: [
            { type: "text", text: "Command executed successfully:" },
            { type: "text", text: stdout || "(no output)" },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text", text: `Error executing command: ${errorMessage}` }],
          isError: true,
        };
      }
    },
  );

  // Register a file system tool (read only)
  server.tool(
    "read_file",
    {
      path: z.string().describe("Path to the file"),
      encoding: z.string().optional().default("utf-8").describe("File encoding"),
    },
    async ({ path: filePath, encoding }) => {
      try {
        // SECURITY: In a real implementation, you would restrict access
        // to specific directories or file types
        const content = await fs.readFile(filePath, { encoding: encoding as BufferEncoding });

        return {
          content: [
            {
              type: "text",
              text: `Content of ${filePath}:\n\n${content}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text", text: `Error reading file: ${errorMessage}` }],
          isError: true,
        };
      }
    },
  );

  // Register a directory listing tool
  server.tool(
    "list_directory",
    {
      path: z.string().optional().default(".").describe("Directory path"),
      recursive: z.boolean().optional().default(false).describe("Whether to list recursively"),
    },
    async ({ path: dirPath, recursive: _recursive }) => {
      try {
        // SECURITY: In a real implementation, you would restrict access
        // to specific directories
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        const fileList = entries.map((entry) => {
          const isDir = entry.isDirectory();
          return `${isDir ? "[dir]" : "[file]"} ${entry.name}`;
        }).join("\n");

        return {
          content: [
            {
              type: "text",
              text: `Contents of ${dirPath}:\n\n${fileList}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text", text: `Error listing directory: ${errorMessage}` }],
          isError: true,
        };
      }
    },
  );
}

/**
 * Register data processing tools
 *
 * @param server MCP server instance
 */
function registerDataTools(server: McpServer) {
  // Register a JSON parsing tool
  server.tool(
    "parse_json",
    {
      json: z.string().describe("JSON string to parse"),
      path: z.string().optional().describe("Optional JSONPath-like expression to extract"),
    },
    async ({ json, path }) => {
      try {
        const parsed = JSON.parse(json);

        if (path) {
          // Simple path handling (not a full JSONPath implementation)
          const segments = path.split(".");
          let current = parsed;

          for (const segment of segments) {
            if (segment in current) {
              current = current[segment];
            } else {
              return {
                content: [{ type: "text", text: `Path ${path} not found in JSON object` }],
                isError: true,
              };
            }
          }

          return {
            content: [{
              type: "text",
              text: `Extracted value at ${path}:\n\n${JSON.stringify(current, null, 2)}`,
            }],
          };
        }

        return {
          content: [{
            type: "text",
            text: `Parsed JSON:\n\n${JSON.stringify(parsed, null, 2)}`,
          }],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text", text: `Error parsing JSON: ${errorMessage}` }],
          isError: true,
        };
      }
    },
  );

  // Register a CSV analysis tool
  server.tool(
    "analyze_csv",
    {
      csv: z.string().describe("CSV content to analyze"),
      operations: z.array(
        z.enum(["count", "summary", "list_columns"]),
      ).describe("Operations to perform on the CSV"),
    },
    async ({ csv, operations }) => {
      try {
        // Simple CSV parsing (in a real implementation, use a proper CSV library)
        const lines = csv.trim().split("\n");
        const headers = lines[0].split(",").map(h => h.trim());
        const rows = lines.slice(1).map(line =>
          line.split(",").map(cell => cell.trim()),
        );

        const results = [];

        for (const operation of operations) {
          switch (operation) {
            case "count":
              results.push(`Row count: ${rows.length}`);
              break;
            case "summary":
              results.push(`Columns: ${headers.length}, Rows: ${rows.length}`);
              break;
            case "list_columns":
              results.push(`Columns: ${headers.join(", ")}`);
              break;
          }
        }

        return {
          content: [{
            type: "text",
            text: `CSV Analysis:\n\n${results.join("\n")}`,
          }],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text", text: `Error analyzing CSV: ${errorMessage}` }],
          isError: true,
        };
      }
    },
  );
}

/**
 * Register utility tools
 *
 * @param server MCP server instance
 */
function registerUtilityTools(server: McpServer) {
  // Register a random number generator tool
  server.tool(
    "random",
    {
      min: z.number().default(0).describe("Minimum value (inclusive)"),
      max: z.number().default(1).describe("Maximum value (inclusive for integers, exclusive for floats)"),
      type: z.enum(["float", "integer"]).default("float").describe("Type of random number"),
    },
    async ({ min, max, type }) => {
      let result: number;

      if (type === "integer") {
        // For integers, include max in the range
        min = Math.ceil(min);
        max = Math.floor(max);
        result = Math.floor(Math.random() * (max - min + 1)) + min;
      } else {
        // For floats, standard random behavior (excludes max)
        result = Math.random() * (max - min) + min;
      }

      return {
        content: [{ type: "text", text: String(result) }],
      };
    },
  );

  // Register a timestamp tool
  server.tool(
    "timestamp",
    {
      format: z.enum(["iso", "unix", "readable"]).optional().default("iso").describe("Timestamp format"),
    },
    async ({ format }) => {
      const now = new Date();
      let timestamp: string;

      switch (format) {
        case "unix":
          timestamp = String(Math.floor(now.getTime() / 1000));
          break;
        case "readable":
          timestamp = now.toLocaleString();
          break;
        case "iso":
        default:
          timestamp = now.toISOString();
          break;
      }

      return {
        content: [{ type: "text", text: timestamp }],
      };
    },
  );

  // Register a string transformation tool
  server.tool(
    "transform_string",
    {
      text: z.string().describe("Text to transform"),
      operation: z.enum([
        "uppercase",
        "lowercase",
        "capitalize",
        "reverse",
        "count_chars",
        "count_words",
      ]).describe("Transformation to apply"),
    },
    async ({ text, operation }) => {
      let result: string;

      switch (operation) {
        case "uppercase":
          result = text.toUpperCase();
          break;
        case "lowercase":
          result = text.toLowerCase();
          break;
        case "capitalize":
          result = text.split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          break;
        case "reverse":
          result = text.split("").reverse().join("");
          break;
        case "count_chars":
          result = `Character count: ${text.length}`;
          break;
        case "count_words":
          result = `Word count: ${text.split(/\s+/).filter(w => w.length > 0).length}`;
          break;
      }

      return {
        content: [{ type: "text", text: result }],
      };
    },
  );
}
