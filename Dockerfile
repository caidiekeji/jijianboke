# ============================================
# 博客系统 Dockerfile
# 多阶段构建以减小镜像体积
# 支持多架构构建（amd64, arm/v7, arm64）
# ============================================

# 阶段 1: 构建前端
FROM --platform=$BUILDPLATFORM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# 复制前端依赖文件
COPY frontend/package*.json ./
RUN npm ci

# 复制前端源代码并构建
COPY frontend/ ./
RUN npm run build

# 阶段 2: 构建后端
FROM --platform=$TARGETPLATFORM node:18-alpine AS backend

WORKDIR /app

# 安装系统依赖（如需编译原生模块）
RUN apk add --no-cache dumb-init

# 复制后端依赖文件
COPY package*.json ./
RUN npm ci --only=production

# 复制后端源代码
COPY . .

# 从前端构建阶段复制构建产物
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# 生成 Prisma Client
RUN npx prisma generate

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 使用 dumb-init 处理信号
ENTRYPOINT ["dumb-init", "--"]

# 启动命令
CMD ["node", "index.js"]