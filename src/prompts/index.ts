/**
 * Prompts for MCP server
 *
 * Prompts enable servers to define reusable prompt templates and workflows that
 * clients can easily surface to users and LLMs. They provide a powerful way to
 * standardize and share common LLM interactions.
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Registers common prompts on an MCP server
 *
 * @param server MCP server instance
 */
export function registerCommonPrompts(server: McpServer) {
  // Register a greeting prompt
  server.prompt(
    "greet",
    { name: z.string().describe("Name of the person to greet") },
    ({ name }) => ({
      messages: [{
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `Please greet ${name} in a friendly way.`,
        },
      }],
    }),
  );

  // Register a summarization prompt
  server.prompt(
    "summarize",
    { text: z.string().describe("Text to summarize") },
    ({ text }) => ({
      messages: [{
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `Please summarize the following text in a concise way:\n\n${text}`,
        },
      }],
    }),
  );

  // Register a code review prompt
  server.prompt(
    "review-code",
    {
      code: z.string().describe("Code to review"),
      language: z.string().optional().describe("Programming language of the code"),
    },
    ({ code, language }) => {
      const langSpecific = language ? ` This is ${language} code.` : "";
      return {
        messages: [{
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `Please review this code and suggest improvements:${langSpecific}\n\n\`\`\`\n${code}\n\`\`\``,
          },
        }],
      };
    },
  );

  // Register a debugging workflow prompt (multi-step)
  server.prompt(
    "debug-workflow",
    {
      error: z.string().describe("Error message or problem description"),
      context: z.string().optional().describe("Additional context about the error"),
    },
    ({ error, context }, _extra) => {
      const messages = [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `I'm experiencing the following error: ${error}`,
          },
        },
        {
          role: "assistant" as const,
          content: {
            type: "text" as const,
            text: "I'll help you debug this issue. Let's start by understanding what might be causing it.",
          },
        },
      ];

      if (context) {
        messages.push({
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `Here's some additional context: ${context}`,
          },
        });
      }

      return { messages };
    },
  );

  // Register a resource-based prompt for analyzing log files
  server.prompt(
    "analyze-logs",
    {
      timeframe: z.string().describe("Time period to analyze (e.g., '1h', '24h')"),
      logUri: z.string().describe("URI of the log resource to analyze"),
    },
    ({ timeframe, logUri }, _extra) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `Please analyze these system logs from the last ${timeframe} and identify any issues or patterns:`,
          },
        },
        {
          role: "user" as const,
          content: {
            type: "resource" as const,
            resource: {
              uri: logUri,
              text: "", // Adding an empty text field to satisfy the type requirement
            },
          },
        },
      ],
    }),
  );

  // Register a brainstorming prompt
  server.prompt(
    "brainstorm",
    {
      topic: z.string().describe("Topic to brainstorm ideas for"),
      constraints: z.string().optional().describe("Any constraints or requirements"),
    },
    ({ topic, constraints }) => {
      const constraintsText = constraints
        ? `\n\nConsider these constraints: ${constraints}`
        : "";

      return {
        messages: [{
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `Please help me brainstorm ideas related to: ${topic}${constraintsText}`,
          },
        }],
      };
    },
  );
}
