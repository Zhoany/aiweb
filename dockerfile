# 使用轻量级的 Node.js 镜像来运行应用
FROM node:18-alpine AS runtime

# 设置工作目录
WORKDIR /app

# 复制本地项目文件和 node_modules 到容器中
COPY . .

# 确保 pnpm 已全局安装
RUN npm install -g pnpm

# 暴露端口（Next.js 默认端口是 3000）
EXPOSE 3000

# 启动 Next.js 应用
CMD ["pnpm", "start"]