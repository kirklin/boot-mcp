#!/usr/bin/env node

/**
 * Boot-MCP CLI
 * 命令行工具，用于启动各种类型的MCP服务器
 */
import * as process from "node:process";

const [, , serverType = "basic"] = process.argv;

async function main() {
  try {
    switch (serverType) {
      case "basic":
        await import("../examples/basic-server.js");
        break;
      case "tools":
        await import("../examples/tools-server.js");
        break;
      case "resources":
        await import("../examples/resources-server.js");
        break;
      case "http":
        await import("../examples/http-server.js");
        break;
      default:
        console.error(`未知的服务器类型: ${serverType}`);
        console.error("可用的服务器类型: basic, tools, resources, http");
        process.exit(1);
    }
  } catch (error) {
    console.error(`启动MCP服务器时出错: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main();
