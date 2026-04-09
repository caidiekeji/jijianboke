# 博客系统

基于 Vue.js 3 + Node.js + Express + SQLite/PostgreSQL + Prisma 构建的现代博客系统。

## 功能特性

### 前端功能
- 响应式设计，支持移动端和桌面端
- Markdown 编辑器支持实时预览
- 文章分类和标签管理
- 评论系统（支持嵌套回复）
- 文章搜索功能
- 用户个人中心
- 管理员后台面板

### 后端功能
- RESTful API 设计
- JWT 身份认证
- 用户权限管理（管理员/普通用户）
- 文章 CRUD 操作
- 分类和标签管理
- 评论审核机制
- 数据统计仪表盘
- 网站设置管理

### 数据库特性
- 支持 SQLite 和 PostgreSQL 数据库
- Prisma ORM 简化数据库操作
- 完整的关联关系设计
- 自动化的数据库迁移

## 技术栈

### 后端
- **Node.js** - JavaScript 运行时
- **Express** - Web 应用框架
- **Prisma** - 现代数据库工具包
- **SQLite/PostgreSQL** - 关系型数据库
- **JWT** - JSON Web Token 认证
- **bcrypt** - 密码加密

### 前端
- **Vue.js 3** - 渐进式 JavaScript 框架
- **Vue Router** - 官方路由管理器
- **Axios** - HTTP 客户端
- **Marked** - Markdown 解析器
- **Highlight.js** - 代码高亮
- **DOMPurify** - XSS 防护

## 项目结构

```
boke/
├── index.js                 # 后端入口文件
├── package.json             # 后端依赖配置
├── .env                     # 环境变量配置
├── prisma/
│   └── schema.prisma        # Prisma 数据库模型定义
├── routes/                  # API 路由
│   ├── users.js             # 用户相关 API
│   ├── posts.js             # 文章相关 API
│   ├── categories.js        # 分类相关 API
│   ├── tags.js              # 标签相关 API
│   ├── comments.js          # 评论相关 API
│   ├── settings.js          # 设置相关 API
│   └── stats.js             # 统计相关 API
├── middleware/
│   └── auth.js              # JWT 认证中间件
├── database/
│   ├── init.sql             # 数据库初始化 SQL 脚本
│   └── seed.js              # 数据库种子数据脚本
├── tests/
│   └── api.test.js          # API 测试脚本
├── frontend/                # 前端项目目录
│   ├── package.json         # 前端依赖配置
│   ├── vite.config.js       # Vite 配置
│   ├── index.html           # HTML 入口
│   └── src/
│       ├── main.js          # 前端入口
│       ├── App.vue          # 根组件
│       ├── router/          # 路由配置
│       ├── api/             # API 请求封装
│       ├── views/           # 页面组件
│       ├── components/      # 可复用组件
│       ├── layouts/         # 布局组件
│       └── utils/           # 工具函数
└── API_DOCUMENTATION.md     # API 接口文档
```

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm 或 yarn
- SQLite（默认）或 PostgreSQL（可选）

### 1. 克隆项目

```bash
git clone <repository-url>
cd boke
```

### 2. 安装依赖

#### 安装后端依赖
```bash
npm install
```

#### 安装前端依赖
```bash
cd frontend
npm install
cd ..
```

### 3. 配置环境变量

复制 `.env` 文件并修改配置：

```bash
cp .env.example .env  # 如果不存在则直接编辑 .env
```

编辑 `.env` 文件：

**使用 SQLite（默认）：**
```env
# 数据库连接信息
DATABASE_URL="file:./dev.db"

# JWT密钥（请修改为强密码）
JWT_SECRET="your-secret-key-here-change-this-in-production"

# 服务器配置
PORT=3000
NODE_ENV=development
```

**使用 PostgreSQL（可选）：**
```env
# 数据库连接信息
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db?schema=public"

# JWT密钥（请修改为强密码）
JWT_SECRET="your-secret-key-here-change-this-in-production"

# 服务器配置
PORT=3000
NODE_ENV=development
```

### 4. 初始化数据库

#### 方法一：使用 Prisma Migrate（推荐）

```bash
# 创建数据库迁移
npx prisma migrate dev --name init

# 生成 Prisma Client
npx prisma generate

# 插入种子数据
npm run db:seed
```

#### 方法二：使用 SQL 脚本

```bash
# 使用 psql 执行初始化脚本
psql -U your_username -d blog_db -f database/init.sql
```

### 5. 启动服务

#### 开发模式

```bash
# 启动后端服务（带热重载）
npm run dev

# 在另一个终端启动前端开发服务器
cd frontend
npm run dev
```

#### 生产模式

```bash
# 构建前端
npm run build:frontend

# 启动后端服务
npm start
```

### 6. 访问应用

- 前端页面：http://localhost:5173
- 后端 API：http://localhost:3000/api
- API 文档：查看 [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## 默认账号

系统初始化后会创建以下默认账号：

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@example.com | admin123 |
| 普通用户 | user@example.com | user123 |

**注意**：生产环境请务必修改默认密码！

## 可用脚本

### 后端脚本

```bash
# 启动服务
npm start

# 开发模式（带热重载）
npm run dev

# 运行 API 测试
npm test

# 数据库操作
npm run db:migrate      # 创建迁移
npm run db:generate     # 生成 Prisma Client
npm run db:seed         # 插入种子数据
npm run db:reset        # 重置数据库并插入种子数据
npm run db:studio       # 打开 Prisma Studio

# 构建前端
npm run build:frontend
```

### 前端脚本

```bash
cd frontend

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## API 接口概览

### 认证相关
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `GET /api/users/me` - 获取当前用户信息

### 文章相关
- `GET /api/posts` - 获取文章列表
- `GET /api/posts/:id` - 获取文章详情
- `POST /api/posts` - 创建文章（需认证）
- `PUT /api/posts/:id` - 更新文章（需认证）
- `DELETE /api/posts/:id` - 删除文章（需认证）

### 分类相关
- `GET /api/categories` - 获取分类列表
- `POST /api/categories` - 创建分类（需认证）
- `PUT /api/categories/:id` - 更新分类（需认证）
- `DELETE /api/categories/:id` - 删除分类（需认证）

### 标签相关
- `GET /api/tags` - 获取标签列表
- `POST /api/tags` - 创建标签（需认证）
- `PUT /api/tags/:id` - 更新标签（需认证）
- `DELETE /api/tags/:id` - 删除标签（需认证）

### 评论相关
- `GET /api/comments` - 获取评论列表
- `POST /api/comments` - 创建评论（需认证）
- `PUT /api/comments/:id` - 更新评论（需认证）
- `DELETE /api/comments/:id` - 删除评论（需认证）
- `POST /api/comments/:id/like` - 点赞评论（需认证）

### 统计相关
- `GET /api/stats/dashboard` - 仪表盘统计数据
- `GET /api/stats/posts` - 文章统计数据
- `GET /api/stats/users` - 用户统计数据
- `GET /api/stats/comments` - 评论统计数据

详细 API 文档请查看 [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## 测试

### 运行 API 测试

```bash
# 确保后端服务已启动
npm start

# 在另一个终端运行测试
npm test
```

测试脚本会自动：
1. 测试用户注册和登录
2. 测试文章 CRUD 操作
3. 测试分类和标签管理
4. 测试评论功能
5. 测试统计数据接口
6. 清理测试数据

## 部署

### Docker 部署（推荐）

#### 支持多架构（amd64、arm/v7、arm64）

项目已配置 GitHub Actions 工作流，自动构建和推送多架构 Docker 镜像。

**使用已构建的镜像：**

```bash
# 拉取多架构镜像
docker pull your-username/blog:latest

# 运行容器（使用 SQLite 数据库）
docker run -d -p 3000:3000 --name blog your-username/blog:latest
```

**本地构建：**

1. 创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:./dev.db  # 使用 SQLite
      - JWT_SECRET=your-production-secret-key
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - ./dev.db:/app/dev.db  # 持久化 SQLite 数据库
    restart: unless-stopped
```

2. Dockerfile 已配置支持多架构构建：

```dockerfile
FROM --platform=$BUILDPLATFORM node:18-alpine AS builder

WORKDIR /app

# 复制后端文件
COPY package*.json ./
RUN npm ci

COPY . .

# 构建前端
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

WORKDIR /app

# 生成 Prisma Client
RUN npx prisma generate

FROM --platform=$TARGETPLATFORM node:18-alpine

WORKDIR /app

# 复制构建产物
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/middleware ./middleware
COPY --from=builder /app/database ./database
COPY --from=builder /app/index.js ./
COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 3000

CMD ["node", "index.js"]
```

3. 启动服务：

```bash
docker-compose up -d
```

### GitHub Actions 自动构建

项目已配置 GitHub Actions 工作流，当代码推送到 `main` 分支时，会自动：

1. 构建多架构 Docker 镜像（amd64、arm/v7、arm64）
2. 推送镜像到 Docker Hub
3. 支持跨平台部署

**配置步骤：**
1. 在 GitHub 仓库的 "Settings" → "Secrets and variables" → "Actions" 中添加以下 secrets：
   - `DOCKERHUB_USERNAME`：Docker Hub 用户名
   - `DOCKERHUB_TOKEN`：Docker Hub 访问令牌
2. 修改 `.github/workflows/docker-build.yml` 文件中的 `tags` 部分，将 `username/blog` 替换为您的 Docker Hub 用户名和镜像名称

### 传统部署

**使用 SQLite（推荐）：**

1. 准备服务器环境（Node.js）
2. 克隆代码并安装依赖
3. 配置环境变量（使用 `DATABASE_URL="file:./dev.db"`）
4. 初始化数据库：`npx prisma migrate dev --name init && npx prisma generate`
5. 构建前端：`npm run build:frontend`
6. 使用 PM2 启动后端：`pm2 start index.js`
7. 配置 Nginx 反向代理

**使用 PostgreSQL：**

1. 准备服务器环境（Node.js + PostgreSQL）
2. 克隆代码并安装依赖
3. 配置环境变量（使用 PostgreSQL 连接字符串）
4. 初始化数据库：`npx prisma migrate dev --name init && npx prisma generate`
5. 构建前端：`npm run build:frontend`
6. 使用 PM2 启动后端：`pm2 start index.js`
7. 配置 Nginx 反向代理

## 常见问题

### 1. 数据库连接失败

检查 `.env` 文件中的 `DATABASE_URL` 配置是否正确，确保 PostgreSQL 服务已启动。

### 2. Prisma Client 未生成

运行以下命令重新生成：
```bash
npx prisma generate
```

### 3. 前端无法连接后端

检查 `frontend/.env.development` 中的 API 地址配置：
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 4. 跨域问题

后端已配置 CORS，如需修改允许的域名，编辑 `index.js`：
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com']
}));
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

[ISC](LICENSE)

## 更新日志

### v1.0.0 (2026-04-01)
- 初始版本发布
- 实现完整的博客功能
- 包含用户管理、文章管理、评论系统
- 提供数据统计仪表盘

---

**作者**: 博客系统开发团队  
**项目地址**: [GitHub Repository](https://github.com/yourusername/boke)