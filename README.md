# boot-mcp

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]
[![javascript_code style][code-style-image]][code-style-url]

A starter template for building Model Context Protocol (MCP) applications with TypeScript.

## What is MCP?

The Model Context Protocol (MCP) lets you build servers that expose data and functionality to LLM applications in a secure, standardized way. Think of it like a web API, but specifically designed for LLM interactions. MCP servers can:

- Expose data through Resources (think of these sort of like GET endpoints; they are used to load information into the LLM's context)
- Provide functionality through Tools (sort of like POST endpoints; they are used to execute code or otherwise produce a side effect)
- Define interaction patterns through Prompts (reusable templates for LLM interactions)

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
pnpm start

# Start the HTTP server
pnpm start:http
```

## Project Structure

```
boot-mcp/
├── src/
│   ├── index.ts          # Main entry point
│   ├── server/           # MCP server implementations
│   │   ├── stdio.ts      # Stdio transport server
│   │   └── http.ts       # HTTP with SSE transport server
│   ├── resources/        # Resource implementations
│   ├── tools/            # Tool implementations
│   └── prompts/          # Prompt implementations
├── examples/             # Example usage
└── test/                 # Tests
```

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
