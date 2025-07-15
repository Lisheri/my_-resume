# 简历编写平台

基于 Vue3 + TypeScript 的在线简历编写平台，参考超级简历的核心功能实现。

## 功能特性

- 📝 **Markdown 编辑**: 使用 md-editor-v3 编辑器，支持实时预览
- 📄 **PDF 导出**: 一键导出高质量PDF简历
- 🏷️ **文件管理**: 支持自定义文件名
- 💾 **自动保存**: 实时保存编辑内容
- 🎨 **美观界面**: 现代化UI设计，优秀的用户体验

## 技术栈

- **前端框架**: Vue 3.3+
- **开发语言**: TypeScript
- **构建工具**: Vite
- **UI组件**: Element Plus
- **状态管理**: Pinia
- **Markdown编辑器**: md-editor-v3
- **PDF导出**: jsPDF + html2canvas

## 快速开始

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 启动开发服务

\`\`\`bash
npm run dev
\`\`\`

### 构建生产版本

\`\`\`bash
npm run build
\`\`\`

## 项目结构

\`\`\`
src/
├── components/         # 公共组件
├── stores/            # Pinia状态管理
├── utils/             # 工具函数
├── views/             # 页面组件
├── router/            # 路由配置
├── App.vue            # 根组件
└── main.ts            # 入口文件
\`\`\`

## 使用说明

1. **编辑简历**: 在左侧Markdown编辑器中输入简历内容
2. **实时预览**: 右侧会实时显示渲染后的简历效果
3. **修改文件名**: 点击顶部文件名可进行编辑
4. **导出PDF**: 点击导出按钮生成PDF文件

## 开发说明

### 核心组件

- `ResumeEditor.vue`: 主编辑器页面
- `useResumeStore`: 简历数据状态管理
- `exportPdf.ts`: PDF导出功能

### 关键特性实现

1. **双向数据绑定**: 使用computed属性实现编辑器与状态的双向绑定
2. **PDF分页处理**: 自动处理长内容的分页导出
3. **样式优化**: 针对PDF导出优化的预览样式

## License

MIT 