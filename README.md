# My Postman 2026 - Desktop Edition

一个现代化的桌面 HTTP 客户端工具，类似 Postman，使用 Electron + React + TypeScript 构建。

## ✨ 功能特点

### 🖥️ 真正的桌面应用
- **原生桌面体验** - 完整的桌面应用程序
- **无 CORS 限制** - 可以请求任何 API，无跨域问题
- **系统集成** - 原生菜单栏、键盘快捷键
- **离线使用** - 完全本地运行，无需网络连接

### 🚀 强大的 HTTP 功能
- **完整 HTTP 方法支持** - GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- **智能请求构建** - 直观的请求头和请求体编辑器
- **实时响应查看** - 自动格式化 JSON，显示响应头和状态码
- **请求历史** - 自动保存所有请求，支持快速重放
- **内置示例 API** - 预置多个测试 API，快速上手

### 🎨 现代化界面
- **精美设计** - 渐变色彩，圆角设计，现代化 UI
- **响应式布局** - 适配不同屏幕尺寸
- **流畅动画** - 丰富的交互反馈和动画效果
- **暗色主题** - 保护视力的侧边栏暗色设计

## 📦 安装与使用

### 开发环境

1. **克隆项目**
   ```bash
   git clone https://github.com/wizardleeen/my-postman-2026.git
   cd my-postman-2026
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```
   这将同时启动 Vite 开发服务器和 Electron 应用

### 生产构建

**构建所有平台：**
```bash
npm run dist
```

**构建特定平台：**
```bash
# Windows
npm run dist-win

# macOS
npm run dist-mac

# Linux
npm run dist-linux
```

构建完成后，安装包将在 `release` 文件夹中。

## 🛠️ 技术架构

### 前端技术栈
- **React 18** - 现代化 UI 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的构建工具
- **Lucide React** - 精美的图标库

### 桌面技术栈
- **Electron** - 跨平台桌面应用框架
- **Axios** - HTTP 请求库（在主进程中运行）
- **Electron Store** - 本地数据存储
- **Electron Builder** - 打包和分发工具

### 架构设计
```
┌──────────────────────────────────────────────┐
│                渲染进程 (React)                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │ RequestPanel│ │ResponsePanel│ │ Sidebar │ │
│  └─────────────┘ └─────────────┘ └─────────┘ │
└─────────────────┬────────────────────────────┘
                  │ IPC 通信
                  ▼
┌──────────────────────────────────────────────┐
│               主进程 (Node.js)               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │ HTTP Client │ │ File System │ │ Menu    │ │
│  │   (Axios)   │ │   Access    │ │ System  │ │
│  └─────────────┘ └─────────────┘ └─────────┘ │
└──────────────────────────────────────────────┘
```

## 📋 项目结构

```
my-postman-2026/
├── public/
│   ├── electron.js          # Electron 主进程
│   ├── preload.js           # 预加载脚本
│   └── icon.png             # 应用图标
├── src/
│   ├── components/          # React 组件
│   │   ├── RequestPanel.tsx # 请求配置面板
│   │   ├── ResponsePanel.tsx# 响应显示面板
│   │   └── Sidebar.tsx      # 侧边栏组件
│   ├── types/              # TypeScript 类型定义
│   │   ├── index.ts        # 业务类型
│   │   └── global.d.ts     # 全局类型声明
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # React 入口文件
│   └── index.css           # 全局样式
├── package.json            # 项目配置
├── vite.config.ts          # Vite 配置
└── tsconfig.json           # TypeScript 配置
```

## 🎯 核心特性详解

### 1. 无 CORS 限制
与 Web 版本不同，桌面版使用 Electron 主进程发送 HTTP 请求，完全绕过浏览器的 CORS 限制：

```typescript
// 主进程中的 HTTP 请求处理
ipcMain.handle('make-http-request', async (event, requestData) => {
  // 使用 axios 在 Node.js 环境中发送请求，无 CORS 限制
  const response = await axios(requestData)
  return response
})
```

### 2. 安全的 IPC 通信
使用 Electron 的 `contextBridge` 确保渲染进程与主进程的安全通信：

```typescript
// preload.js - 暴露安全的 API
contextBridge.exposeInMainWorld('electronAPI', {
  makeHttpRequest: (data) => ipcRenderer.invoke('make-http-request', data)
})
```

### 3. 本地数据持久化
请求历史自动保存到本地存储，重启应用后依然可用。

### 4. 原生菜单系统
完整的原生菜单栏，支持键盘快捷键（Ctrl/Cmd + N 新建请求等）。

## 🚀 使用指南

### 发送 HTTP 请求
1. 选择 HTTP 方法（GET, POST 等）
2. 输入请求 URL
3. 添加请求头（可选）
4. 输入请求体（POST/PUT 请求）
5. 点击 "Send" 或按 Ctrl/Cmd + Enter

### 查看响应
- **响应体** - 自动格式化 JSON，支持其他格式
- **响应头** - 查看所有响应头信息
- **状态码** - 颜色标识成功/失败状态
- **响应时间** - 显示请求耗时

### 管理历史记录
- 自动保存所有请求到历史记录
- 点击历史项快速重新发送请求
- 支持清空历史记录

### 快速测试
侧边栏提供多个示例API，包括：
- JSONPlaceholder（测试 REST API）
- HTTPBin（HTTP 测试服务）
- GitHub API（真实 API 示例）
- 等等...

## 🔧 开发指南

### 添加新功能
1. **前端功能** - 在 `src/components/` 中添加 React 组件
2. **后端功能** - 在 `public/electron.js` 中添加 IPC 处理器
3. **类型定义** - 在 `src/types/` 中添加 TypeScript 类型

### 调试
- **渲染进程调试** - Electron 窗口中按 F12 打开开发者工具
- **主进程调试** - 在终端查看 console.log 输出
- **热重载** - 开发模式支持热重载

## 📊 性能优化

- **代码分割** - 使用 Vite 的动态导入进行代码分割
- **图标优化** - 按需加载 Lucide 图标
- **内存管理** - 合理管理 Electron 进程内存
- **构建优化** - 生产构建自动压缩和优化

## 🔒 安全特性

- **沙盒环境** - 渲染进程运行在沙盒中
- **安全通信** - 使用 contextBridge 进行安全的进程间通信
- **输入验证** - 对用户输入进行验证和清理
- **最小权限原则** - 只暴露必要的 API 给渲染进程

## 🌟 未来规划

- [ ] **集合管理** - 支持请求集合和文件夹组织
- [ ] **环境变量** - 支持多环境变量管理
- [ ] **认证支持** - 内置常见认证方式（Bearer Token, Basic Auth 等）
- [ ] **代码生成** - 生成 curl、JavaScript、Python 等代码
- [ ] **响应缓存** - 缓存响应数据
- [ ] **插件系统** - 支持第三方插件
- [ ] **团队协作** - 支持导入/导出集合，团队共享
- [ ] **性能监控** - API 性能监控和分析
- [ ] **自动化测试** - 内置简单的 API 测试功能
- [ ] **主题系统** - 支持自定义主题

## 📄 许可证

本项目采用 MIT 许可证开源。

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

**My Postman 2026** - 让 HTTP 请求测试变得简单而强大！ 🚀