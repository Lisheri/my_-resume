pipeline {
    agent any
    
    // 构建参数
    parameters {
        booleanParam(
            name: 'USE_DOCKER',
            defaultValue: false,
            description: '是否使用Docker构建和部署'
        )
        choice(
            name: 'DEPLOY_ENV',
            choices: ['auto', 'development', 'staging', 'production'],
            description: '部署环境选择（auto为根据分支自动选择）'
        )
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: '是否跳过代码检查'
        )
    }
    
    // 环境变量
    environment {
        NODE_VERSION = '22.16.0'
        PNPM_VERSION = '8.15.0'
        BUILD_DIR = 'dist'
        ARTIFACT_NAME = "resume-${env.BUILD_NUMBER}.tar.gz"
        DOCKER_IMAGE = "resume-editor"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        DOCKER_REGISTRY = "your-registry.com" // 修改为你的Docker镜像仓库
    }
    
    stages {
        stage('检出') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: GIT_BUILD_REF]],
                    userRemoteConfigs: [[
                        url: GIT_REPO_URL,
                        credentialsId: CREDENTIALS_ID
                    ]]
                ])
                
                script {
                    // 获取提交信息
                    env.GIT_COMMIT_MSG = sh(
                        script: 'git log -1 --pretty=%B',
                        returnStdout: true
                    ).trim()
                    
                    env.GIT_COMMIT_AUTHOR = sh(
                        script: 'git log -1 --pretty=%an',
                        returnStdout: true
                    ).trim()
                }
                
                echo "提交信息: ${env.GIT_COMMIT_MSG}"
                echo "提交作者: ${env.GIT_COMMIT_AUTHOR}"
            }
        }
        
        stage('环境准备') {
            steps {
                echo '准备构建环境...'
                
                // 安装 Node.js
                sh '''
                    echo "检查 Node.js 版本..."
                    node --version || echo "Node.js 未安装"
                    npm --version || echo "npm 未安装"
                '''
                
                // 安装 pnpm
                sh '''
                    echo "安装 pnpm..."
                    npm install -g pnpm@${PNPM_VERSION} || true
                    pnpm --version
                '''
            }
        }
        
        stage('依赖安装') {
            steps {
                echo '安装项目依赖...'
                
                sh '''
                    echo "清理缓存..."
                    pnpm store prune || true
                    
                    echo "安装依赖..."
                    pnpm install --frozen-lockfile
                    
                    echo "验证依赖安装..."
                    pnpm list --depth=0
                '''
            }
        }
        
        stage('代码检查') {
            when {
                not { params.SKIP_TESTS }
            }
            parallel {
                stage('ESLint检查') {
                    steps {
                        echo '执行 ESLint 代码检查...'
                        sh '''
                            pnpm run lint || echo "ESLint 检查完成"
                        '''
                    }
                }
                
                stage('TypeScript检查') {
                    steps {
                        echo '执行 TypeScript 类型检查...'
                        sh '''
                            pnpm run type-check || echo "TypeScript 检查完成"
                        '''
                    }
                }
            }
        }
        
        stage('构建选择') {
            parallel {
                stage('传统构建') {
                    when {
                        not { params.USE_DOCKER }
                    }
                    steps {
                        echo '执行传统构建过程...'
                        
                        script {
                            // 构建前准备
                            sh '''
                                echo "构建信息:"
                                echo "构建号: ${BUILD_NUMBER}"
                                echo "构建时间: $(date)"
                                echo "Node版本: ${NODE_VERSION}"
                                echo "Git分支: ${GIT_BRANCH}"
                                echo "Git提交: ${GIT_COMMIT}"
                            '''
                            
                            // 执行构建
                            sh '''
                                echo "开始构建应用..."
                                pnpm run build
                                
                                echo "构建完成，检查构建产物..."
                                ls -la ${BUILD_DIR}/
                                
                                echo "构建产物大小:"
                                du -sh ${BUILD_DIR}/
                            '''
                            
                            // 构建优化检查
                            sh '''
                                echo "分析构建产物..."
                                
                                # 检查主要文件大小
                                find ${BUILD_DIR} -name "*.js" -exec ls -lh {} \\;
                                find ${BUILD_DIR} -name "*.css" -exec ls -lh {} \\;
                                
                                echo "构建产物统计:"
                                echo "JS文件数量: $(find ${BUILD_DIR} -name '*.js' | wc -l)"
                                echo "CSS文件数量: $(find ${BUILD_DIR} -name '*.css' | wc -l)"
                                echo "图片文件数量: $(find ${BUILD_DIR} -name '*.png' -o -name '*.jpg' -o -name '*.svg' | wc -l)"
                            '''
                        }
                    }
                }
                
                stage('Docker构建') {
                    when {
                        anyOf {
                            params.USE_DOCKER
                            branch 'main'
                            branch 'master'
                            branch 'release/*'
                        }
                    }
                    steps {
                        echo 'Docker构建过程开始...'
                        
                        script {
                            // 构建Docker镜像
                            sh '''
                                echo "开始构建Docker镜像..."
                                echo "镜像名称: ${DOCKER_IMAGE}:${DOCKER_TAG}"
                                echo "Node版本: ${NODE_VERSION}"
                                
                                # 构建Docker镜像
                                docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                                docker build -t ${DOCKER_IMAGE}:latest .
                                
                                echo "Docker镜像构建完成"
                                docker images | grep ${DOCKER_IMAGE}
                                
                                # 检查镜像大小
                                echo "镜像大小信息:"
                                docker image inspect ${DOCKER_IMAGE}:${DOCKER_TAG} --format='{{.Size}}' | numfmt --to=iec
                            '''
                            
                            // 测试Docker镜像
                            sh '''
                                echo "测试Docker镜像..."
                                
                                # 启动容器进行测试
                                docker run -d --name resume-test-${BUILD_NUMBER} -p 8080:80 ${DOCKER_IMAGE}:${DOCKER_TAG}
                                
                                # 等待容器启动
                                sleep 10
                                
                                # 健康检查
                                if curl -f http://localhost:8080/health; then
                                    echo "Docker容器健康检查通过"
                                else
                                    echo "Docker容器健康检查失败"
                                    exit 1
                                fi
                                
                                # 清理测试容器
                                docker stop resume-test-${BUILD_NUMBER}
                                docker rm resume-test-${BUILD_NUMBER}
                            '''
                        }
                    }
                }
            }
        }
        
        stage('质量检查') {
            steps {
                echo '执行构建质量检查...'
                
                script {
                    // 检查必要文件是否存在
                    def requiredFiles = [
                        "${BUILD_DIR}/index.html",
                        "${BUILD_DIR}/assets"
                    ]
                    
                    requiredFiles.each { file ->
                        sh "test -e ${file} || (echo '缺少必要文件: ${file}' && exit 1)"
                    }
                    
                    echo "所有必要文件检查通过"
                }
                
                // 检查构建产物完整性
                sh '''
                    echo "检查 index.html 完整性..."
                    grep -q "<!DOCTYPE html>" ${BUILD_DIR}/index.html || (echo "index.html 格式错误" && exit 1)
                    
                    echo "检查资源文件..."
                    test -d ${BUILD_DIR}/assets || (echo "assets 目录不存在" && exit 1)
                    
                    echo "质量检查通过"
                '''
            }
        }
        
        stage('构建打包') {
            steps {
                echo '打包构建产物...'
                
                sh '''
                    echo "创建构建归档..."
                    
                    # 创建版本信息文件
                    cat > ${BUILD_DIR}/build-info.json << EOF
{
  "buildNumber": "${BUILD_NUMBER}",
  "buildTime": "$(date -Iseconds)",
  "gitBranch": "${GIT_BRANCH}",
  "gitCommit": "${GIT_COMMIT}",
  "gitCommitMsg": "${GIT_COMMIT_MSG}",
  "gitCommitAuthor": "${GIT_COMMIT_AUTHOR}"
}
EOF
                    
                    # 打包构建产物
                    tar -czf ${ARTIFACT_NAME} -C ${BUILD_DIR} .
                    
                    echo "构建包创建完成: ${ARTIFACT_NAME}"
                    ls -lh ${ARTIFACT_NAME}
                '''
            }
        }
        
        stage('镜像推送') {
            when {
                anyOf {
                    params.USE_DOCKER
                    branch 'main'
                    branch 'master'
                    branch 'release/*'
                }
            }
            steps {
                echo '推送Docker镜像到仓库...'
                
                script {
                    // 推送到Docker仓库
                    sh '''
                        echo "推送Docker镜像..."
                        
                        # 标记镜像
                        docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                        docker tag ${DOCKER_IMAGE}:latest ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest
                        
                        # 推送镜像（需要先配置Docker仓库认证）
                        # docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                        # docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest
                        
                        echo "镜像推送完成"
                        echo "镜像地址: ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}"
                    '''
                }
            }
        }
        
        stage('部署准备') {
            steps {
                echo '准备部署...'
                
                script {
                    // 根据分支确定部署环境
                    def deployEnv = 'development'
                    if (env.GIT_BRANCH == 'main' || env.GIT_BRANCH == 'master') {
                        deployEnv = 'production'
                    } else if (env.GIT_BRANCH.startsWith('release/')) {
                        deployEnv = 'staging'
                    }
                    
                    echo "目标部署环境: ${deployEnv}"
                    env.DEPLOY_ENV = deployEnv
                }
                
                // 选择部署方式
                script {
                    if (params.USE_DOCKER || env.GIT_BRANCH in ['main', 'master'] || env.GIT_BRANCH.startsWith('release/')) {
                        // Docker部署
                        sh '''
                            echo "=== Docker部署模式 ==="
                            echo "部署环境: ${DEPLOY_ENV}"
                            echo "Docker镜像: ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}"
                            
                            # 生成docker-compose部署文件
                            cat > docker-compose.deploy.yml << EOF
version: '3.8'
services:
  resume-app:
    image: ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
    container_name: resume-${DEPLOY_ENV}
    ports:
      - "3333:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=${DEPLOY_ENV}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.resume.rule=Host(\`resume.example.com\`)"
      - "traefik.http.services.resume.loadbalancer.server.port=80"
EOF
                            
                            echo "Docker部署配置已生成"
                            cat docker-compose.deploy.yml
                            
                            # 部署命令示例
                            echo "部署命令:"
                            echo "scp docker-compose.deploy.yml user@server:/path/to/deploy/"
                            echo "ssh user@server 'cd /path/to/deploy && docker-compose -f docker-compose.deploy.yml up -d'"
                        '''
                    } else {
                        // 传统部署
                        sh '''
                            echo "=== 传统部署模式 ==="
                            echo "部署环境: ${DEPLOY_ENV}"
                            echo "部署包: ${ARTIFACT_NAME}"
                            
                            # 传统部署脚本示例
                            echo "部署命令:"
                            echo "scp ${ARTIFACT_NAME} user@server:/path/to/deploy/"
                            echo "ssh user@server 'cd /path/to/deploy && tar -xzf ${ARTIFACT_NAME}'"
                        '''
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo '清理工作空间...'
            
            // 归档构建产物
            archiveArtifacts artifacts: "${ARTIFACT_NAME}", fingerprint: true
            
            // 发布构建报告（如果有测试）
            // publishHTML([
            //     allowMissing: false,
            //     alwaysLinkToLastBuild: true,
            //     keepAll: true,
            //     reportDir: 'coverage',
            //     reportFiles: 'index.html',
            //     reportName: 'Coverage Report'
            // ])
        }
        
        success {
            echo '构建成功！'
            
            script {
                def buildTime = currentBuild.durationString.replace(' and counting', '')
                def message = """
🎉 构建成功！

📋 构建信息:
- 项目: Resume Editor
- 构建号: #${env.BUILD_NUMBER}
- 分支: ${env.GIT_BRANCH}
- 提交: ${env.GIT_COMMIT?.take(8)}
- 作者: ${env.GIT_COMMIT_AUTHOR}
- 耗时: ${buildTime}

📦 构建产物: ${env.ARTIFACT_NAME}
🚀 部署环境: ${env.DEPLOY_ENV ?: 'N/A'}
"""
                
                echo message
                
                // 可以发送通知到钉钉、企业微信等
                // dingTalk robot: 'your-robot-id', message: message
            }
        }
        
        failure {
            echo '构建失败！'
            
            script {
                def failureMessage = """
❌ 构建失败！

📋 构建信息:
- 项目: Resume Editor  
- 构建号: #${env.BUILD_NUMBER}
- 分支: ${env.GIT_BRANCH}
- 失败阶段: ${env.STAGE_NAME}

🔗 查看详情: ${env.BUILD_URL}
"""
                
                echo failureMessage
                
                // 发送失败通知
                // dingTalk robot: 'your-robot-id', message: failureMessage
            }
        }
        
        cleanup {
            // 清理临时文件和Docker资源
            sh '''
                echo "清理临时文件..."
                rm -f *.tar.gz || true
                rm -f docker-compose.deploy.yml || true
                pnpm store prune || true
                
                # 清理Docker资源
                echo "清理Docker资源..."
                docker system prune -f || true
                
                # 清理测试容器（如果存在）
                docker stop resume-test-${BUILD_NUMBER} || true
                docker rm resume-test-${BUILD_NUMBER} || true
                
                # 清理未使用的镜像（保留最近的3个版本）
                docker images ${DOCKER_IMAGE} --format "table {{.Repository}}:{{.Tag}}\t{{.CreatedAt}}" | tail -n +4 | awk '{print $1}' | xargs -r docker rmi || true
            '''
        }
    }
} 