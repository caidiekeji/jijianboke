# 个人博客系统

一个基于 Node.js + Express + Vue 3 + Prisma + SQLite 的个人博客系统。

## 功能特性

- ✅ 文章管理（发布、编辑、删除）
- ✅ 分类管理
- ✅ 标签管理
- ✅ 评论系统
- ✅ 用户认证（登录、注册）
- ✅ 访问统计
- ✅ 响应式设计
- ✅ 支持多架构 Docker 部署

## 技术栈

### 后端
- Node.js 18+
- Express.js
- Prisma ORM
- SQLite 数据库
- JWT 认证

### 前端
- Vue 3
- Vite
- Pinia（状态管理）
- Vue Router
- Notion 设计系统

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/caidiekeji/jijianboke.git
cd jijianboke
```

### 2. 安装依赖

```bash
# 后端依赖
npm install

# 前端依赖
cd frontend
npm install
cd ..
```

### 3. 配置环境变量

复制 `.env.example` 文件并重命名为 `.env`，然后根据需要修改配置。

```bash
cp .env.example .env
```

### 4. 初始化数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev

# 生成示例数据（可选）
node database/seed.js
```

### 5. 构建前端

```bash
cd frontend
npm run build
cd ..
```

### 6. 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

服务将在 `http://localhost:3000` 运行。

## Docker 部署

### 构建镜像

```bash
docker build -t jijianboke .
```

### 运行容器

```bash
docker run -d -p 3000:3000 --name blog jijianboke
```

### 使用 Docker Compose

```bash
docker-compose up -d
```

## 项目结构

```
.
├── .github/              # GitHub Actions 配置
├── database/             # 数据库相关文件
├── frontend/             # 前端代码
├── middleware/           # Express 中间件
├── prisma/               # Prisma 配置和迁移
├── routes/               # Express 路由
├── scripts/              # 工具脚本
├── .env                  # 环境变量
├── .env.example          # 环境变量示例
├── Dockerfile            # Docker 构建文件
├── docker-compose.yml    # Docker Compose 配置
├── index.js              # 后端入口文件
├── package.json          # 后端依赖
└── README.md             # 项目文档
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License