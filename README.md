# boot-mcp

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]
[![javascript_code style][code-style-image]][code-style-url]

A comprehensive starter template for building Model Context Protocol (MCP) applications with TypeScript.

## What is MCP?

The Model Context Protocol (MCP) lets you build servers that expose data and functionality to LLM applications in a secure, standardized way. Think of it like a web API, but specifically designed for LLM interactions. MCP servers can:

- Expose data through **Resources** (think of these sort of like GET endpoints; they are used to load information into the LLM's context)
- Provide functionality through **Tools** (sort of like POST endpoints; they are used to execute code or otherwise produce a side effect)
- Define interaction patterns through **Prompts** (reusable templates for LLM interactions)
- Set boundaries with **Roots** (defining the operational scope for servers)
- Enable agent behaviors with **Sampling** (allowing servers to request completions from LLMs)
- Establish connections via **Transports** (communication mechanisms between clients and servers)

## Installation

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Quick Start

This template includes examples of MCP servers with different transports:

- Stdio transport (for command-line tools and direct integrations)
- HTTP with SSE transport (for remote servers)

### Running the Example Server

```bash
# Start the stdio server
pnpm start:basic

# Start the HTTP server
pnpm start:http
```

## Project Structure

```
boot-mcp/
├── src/
│   ├── index.ts          # Main entry point
│   ├── server/           # MCP server implementations
│   │   ├── basic.ts      # Basic server with common functionality
│   │   └── http.ts       # HTTP with SSE transport server
│   ├── resources/        # Resource implementations
│   │   └── index.ts      # Common resource types and utilities
│   ├── tools/            # Tool implementations
│   │   └── index.ts      # Various tools organized by category
│   ├── prompts/          # Prompt implementations
│   │   └── index.ts      # Common prompt templates and workflows
│   ├── roots/            # Root management
│   │   └── index.ts      # Root definition and utilities
│   ├── transports/       # Transport implementations
│   │   └── index.ts      # Stdio and HTTP/SSE transports
│   └── sampling/         # Sampling utilities (experimental)
│       └── index.ts      # LLM sampling capabilities
├── examples/             # Example usage
│   ├── basic-server.ts   # Basic stdio server example
│   └── http-server.ts    # HTTP server example
└── test/                 # Tests
```

## Features

### Resources

- Text and binary resource support
- Dynamic resource templates with parameters
- Standard resource types (files, system info, etc.)
- Resource content helpers

### Tools

- System operation tools (execute commands, read files, etc.)
- Data processing tools (JSON parsing, CSV analysis, etc.)
- Utility tools (random generators, string transformations, etc.)
- Calculator and basic tools

### Prompts

- Simple greeting and text processing prompts
- Code review prompts with language detection
- Multi-step debugging workflows
- Resource-based prompt templates

### Roots

- File system root management
- URI validation and filtering
- Standard root templates

### Transports

- Stdio transport for terminal applications
- HTTP/SSE transport for web applications
- Unified configuration interface

### Sampling (Experimental)

- Text completion requests
- Conversation-based sampling
- Model preference controls
- Agent workflow examples

## License

[MIT](./LICENSE) License &copy; [Kirk Lin](https://github.com/kirklin)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/boot-mcp?style=flat&colorA=080f12&colorB=3491fa
[npm-version-href]: https://npmjs.com/package/boot-mcp
[npm-downloads-src]: https://img.shields.io/npm/dm/boot-mcp?style=flat&colorA=080f12&colorB=3491fa
[npm-downloads-href]: https://npmjs.com/package/boot-mcp
[bundle-src]: https://img.shields.io/bundlephobia/minzip/boot-mcp?style=flat&colorA=080f12&colorB=3491fa&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=boot-mcp
[license-src]: https://img.shields.io/github/license/kirklin/boot-mcp.svg?style=flat&colorA=080f12&colorB=3491fa
[license-href]: https://github.com/kirklin/boot-mcp/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=3491fa
[jsdocs-href]: https://www.jsdocs.io/package/boot-mcp
[code-style-image]: https://img.shields.io/badge/code__style-%40kirklin%2Feslint--config-3491fa?style=flat&colorA=080f12&colorB=3491fa
[code-style-url]: https://github.com/kirklin/eslint-config/
