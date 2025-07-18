#!/bin/bash

# 生产环境部署脚本
# 用途：快速在服务器上部署简历编辑器前端服务
# 访问地址：http://服务器IP:3333

set -e

echo "=== 简历编辑器 - 生产环境部署 ==="

# 配置变量
APP_NAME="resume-editor"
PORT="3333"
DEPLOY_DIR="/opt/resume-editor"
BACKUP_DIR="/opt/resume-editor/backups"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查Docker是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装，请先安装Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose未安装，请先安装Docker Compose"
        exit 1
    fi
    
    log_info "Docker环境检查通过"
}

# 创建部署目录
create_directories() {
    log_info "创建部署目录..."
    
    sudo mkdir -p "$DEPLOY_DIR"
    sudo mkdir -p "$BACKUP_DIR"
    sudo mkdir -p "$DEPLOY_DIR/logs"
    
    # 设置权限
    sudo chown -R $USER:$USER "$DEPLOY_DIR"
    
    log_info "部署目录创建完成: $DEPLOY_DIR"
}

# 停止现有服务
stop_existing_service() {
    log_info "停止现有服务..."
    
    # 停止容器（如果存在）
    if docker ps -q --filter "name=$APP_NAME" | grep -q .; then
        log_warn "发现运行中的容器，正在停止..."
        docker stop "$APP_NAME" || true
        docker rm "$APP_NAME" || true
    fi
    
    # 停止docker-compose服务（如果存在）
    if [ -f "$DEPLOY_DIR/docker-compose.yml" ]; then
        cd "$DEPLOY_DIR"
        docker-compose down || true
    fi
    
    log_info "现有服务已停止"
}

# 备份现有版本
backup_current_version() {
    if [ -d "$DEPLOY_DIR/current" ]; then
        log_info "备份当前版本..."
        
        BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
        sudo mv "$DEPLOY_DIR/current" "$BACKUP_DIR/$BACKUP_NAME"
        
        log_info "备份完成: $BACKUP_DIR/$BACKUP_NAME"
        
        # 只保留最近5个备份
        cd "$BACKUP_DIR"
        ls -t | tail -n +6 | xargs -r rm -rf
    fi
}

# 构建Docker镜像
build_docker_image() {
    log_info "构建Docker镜像..."
    
    cd "$DEPLOY_DIR"
    
    # 构建镜像
    docker build -t $APP_NAME:latest .
    
    if [ $? -eq 0 ]; then
        log_info "Docker镜像构建成功"
    else
        log_error "Docker镜像构建失败"
        exit 1
    fi
}

# 生成docker-compose配置
generate_docker_compose() {
    log_info "生成Docker Compose配置..."
    
    cat > "$DEPLOY_DIR/docker-compose.production.yml" << EOF
version: '3.8'

services:
  resume-app:
    image: $APP_NAME:latest
    container_name: $APP_NAME
    ports:
      - "$PORT:80"
    environment:
      - NODE_ENV=production
    volumes:
      - ./logs:/var/log/nginx
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - resume-network

networks:
  resume-network:
    driver: bridge
EOF
    
    log_info "Docker Compose配置已生成"
}

# 启动服务
start_service() {
    log_info "启动服务..."
    
    cd "$DEPLOY_DIR"
    docker-compose -f docker-compose.production.yml up -d
    
    if [ $? -eq 0 ]; then
        log_info "服务启动成功"
    else
        log_error "服务启动失败"
        exit 1
    fi
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    # 等待服务启动
    sleep 10
    
    # 检查容器状态
    if docker ps --filter "name=$APP_NAME" --filter "status=running" | grep -q $APP_NAME; then
        log_info "容器运行正常"
    else
        log_error "容器未正常运行"
        docker logs $APP_NAME
        exit 1
    fi
    
    # 检查服务响应
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "http://localhost:$PORT/health" > /dev/null; then
            log_info "服务健康检查通过"
            break
        fi
        
        log_warn "健康检查失败，重试中... ($attempt/$max_attempts)"
        sleep 2
        ((attempt++))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        log_error "服务健康检查失败，请检查日志"
        docker logs $APP_NAME
        exit 1
    fi
}

# 显示部署信息
show_deployment_info() {
    log_info "=== 部署完成 ==="
    echo ""
    echo "🚀 服务已成功部署！"
    echo ""
    echo "📋 部署信息:"
    echo "   • 应用名称: $APP_NAME"
    echo "   • 监听端口: $PORT"
    echo "   • 部署目录: $DEPLOY_DIR"
    echo ""
    echo "🌐 访问地址:"
    echo "   • 本地访问: http://localhost:$PORT"
    echo "   • 网络访问: http://$(hostname -I | awk '{print $1}'):$PORT"
    echo "   • 健康检查: http://localhost:$PORT/health"
    echo ""
    echo "🔧 管理命令:"
    echo "   • 查看日志: docker logs $APP_NAME"
    echo "   • 重启服务: docker restart $APP_NAME"
    echo "   • 停止服务: docker stop $APP_NAME"
    echo "   • 查看状态: docker ps | grep $APP_NAME"
    echo ""
    echo "📁 目录结构:"
    echo "   • 应用目录: $DEPLOY_DIR"
    echo "   • 日志目录: $DEPLOY_DIR/logs"
    echo "   • 备份目录: $BACKUP_DIR"
    echo ""
}

# 主执行流程
main() {
    log_info "开始部署流程..."
    
    # 检查系统环境
    check_docker
    
    # 创建必要目录
    create_directories
    
    # 停止现有服务
    stop_existing_service
    
    # 备份当前版本
    backup_current_version
    
    # 如果当前目录有源码，构建镜像
    if [ -f "package.json" ] && [ -f "Dockerfile" ]; then
        log_info "检测到源码，开始构建..."
        
        # 复制源码到部署目录
        cp -r . "$DEPLOY_DIR/current/"
        cd "$DEPLOY_DIR/current"
        
        # 构建镜像
        build_docker_image
    else
        log_warn "未检测到源码，请确保在项目根目录执行脚本"
        log_info "或手动将代码复制到 $DEPLOY_DIR/current/ 目录"
        exit 1
    fi
    
    # 生成配置
    generate_docker_compose
    
    # 启动服务
    start_service
    
    # 健康检查
    health_check
    
    # 显示部署信息
    show_deployment_info
}

# 脚本入口
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help     显示帮助信息"
    echo "  --force        强制重新部署"
    echo ""
    echo "示例:"
    echo "  $0              # 正常部署"
    echo "  $0 --force      # 强制重新部署"
    echo ""
    exit 0
fi

# 执行主流程
main "$@" 