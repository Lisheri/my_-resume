# 多阶段构建 Dockerfile
# 阶段1: 构建阶段
FROM registry.cn-hangzhou.aliyuncs.com/library/node:22.16.0-alpine AS builder

# 设置工作目录
WORKDIR /app

# 设置npm源为淘宝镜像（可选，加速下载）
RUN npm config set registry https://registry.npmmirror.com

# 安装pnpm
RUN npm install -g pnpm@8.15.0

# 复制package.json和pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建项目
RUN pnpm run build

# 创建构建信息文件
RUN echo '{"buildTime":"'$(date -Iseconds)'","nodeVersion":"22.16.0","buildStage":"docker"}' > dist/build-info.json

# 阶段2: 生产阶段
FROM registry.cn-hangzhou.aliyuncs.com/library/nginx:1.25-alpine AS production

# 安装必要的工具
RUN apk add --no-cache curl

# 删除默认的nginx配置
RUN rm -rf /etc/nginx/conf.d/*

# 创建nginx配置文件
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 3333;
    listen [::]:3333;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # 启用gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        application/xml
        image/svg+xml;

    # 静态资源缓存配置
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin *;
    }

    # HTML文件不缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
    }

    # 主路由配置 - SPA路由支持
    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
    }

    # API代理配置（如果需要）
    # location /api/ {
    #     proxy_pass http://backend:3000/;
    #     proxy_set_header Host \$host;
    #     proxy_set_header X-Real-IP \$remote_addr;
    #     proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    #     proxy_set_header X-Forwarded-Proto \$scheme;
    # }

    # 健康检查端点
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # 隐藏nginx版本信息
    server_tokens off;

    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # 错误页面
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

# 从构建阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 创建nginx用户目录
RUN mkdir -p /var/cache/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3333/health || exit 1

# 暴露端口
EXPOSE 3333

# 启动nginx
CMD ["nginx", "-g", "daemon off;"] 