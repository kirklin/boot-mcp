# Boot-MCP 与 Claude Desktop 集成指南

本指南将帮助您设置 Boot-MCP 服务器，并将其与 Claude Desktop 应用程序集成。

## 配置文件

`mcp-servers.json` 文件包含了 Claude Desktop 可以连接的 MCP 服务器配置。每个配置项定义了一个可用的服务器，包括其启动命令和描述。

## 可用服务器

我们提供了以下几种 MCP 服务器配置：

1. **boot-mcp-basic**: 基础 MCP 服务器，提供所有功能 (工具、资源、提示)
2. **boot-mcp-tools**: 专用工具服务器，仅提供工具功能
3. **boot-mcp-resources**: 专用资源服务器，仅提供资源功能
4. **boot-mcp-http**: HTTP MCP 服务器，提供 REST API 和 SSE 连接

## 设置步骤

### 配置包发布

在使用前，确保已将 Boot-MCP 包发布到 npm：

```bash
# 登录到 npm
npm login

# 发布包
npm publish
```

或者使用本地路径配置，将 `mcp-servers.json` 中的包名替换为本地路径。

### 在 Claude Desktop 中配置

1. 打开 Claude Desktop
2. 进入设置 > MCP 服务器
3. 点击 "添加服务器"
4. 浏览并选择 `claude-config/mcp-servers.json` 文件
5. 保存配置

### 启动 HTTP 服务器

如果要使用 HTTP 服务器配置，需要先启动服务器:

```bash
npx -y boot-mcp@latest http
```

然后在 Claude Desktop 中选择 `boot-mcp-http` 服务器。

## 服务器详情

- **boot-mcp-basic**: 启动完整功能的 MCP 服务器，包括所有工具、资源和提示模板
- **boot-mcp-tools**: 专注于工具能力的服务器，提供各种工具类别
- **boot-mcp-resources**: 专注于资源能力的服务器，提供文本、二进制和模板资源
- **boot-mcp-http**: HTTP 服务器，提供 REST API 和 SSE 连接，适合需要网络接口的场景

## 直接使用 npm 包

可以直接从命令行运行 Boot-MCP 服务器：

```bash
# 启动基础服务器
npx -y boot-mcp@latest basic

# 启动工具服务器
npx -y boot-mcp@latest tools

# 启动资源服务器
npx -y boot-mcp@latest resources

# 启动HTTP服务器
npx -y boot-mcp@latest http
```

## 故障排除

如果遇到连接问题，请检查:

1. 确认包已正确发布到 npm 或使用了正确的本地路径
2. 如果使用 HTTP 服务器，确认它已经在运行
3. 尝试手动使用 npx 命令运行服务器，检查是否有错误输出
4. 查看 Claude Desktop 日志获取更多信息
