# 字体文件安装指南

为了解决PDF导出中文乱码问题，请将相应的字体文件放置在此目录中。

## 支持的字体文件

### 1. 思源黑体（推荐）
- **文件名**: `SourceHanSansCN-Regular.ttf`, `SourceHanSansCN-Bold.ttf`
- **下载地址**: https://github.com/adobe-fonts/source-han-sans/releases
- **说明**: Adobe开源字体，支持简体中文，显示效果佳

### 2. Noto Sans CJK
- **文件名**: `NotoSansCJK-Regular.ttc`, `NotoSansCJK-Bold.ttc`
- **下载地址**: https://github.com/googlefonts/noto-cjk/releases
- **说明**: Google开源字体，支持中日韩文字

### 3. 黑体
- **文件名**: `SimHei.ttf`
- **说明**: Windows系统字体，较为常见

### 4. 宋体
- **文件名**: `SimSun.ttf`
- **说明**: Windows系统字体，传统中文字体

## 安装步骤

1. 从上述下载地址获取字体文件
2. 将字体文件重命名为指定的文件名
3. 将字体文件复制到 `public/fonts/` 目录中
4. 刷新浏览器页面
5. 在字体选择器中选择要使用的字体

## 文件结构示例

```
public/
└── fonts/
    ├── SourceHanSansCN-Regular.ttf
    ├── SourceHanSansCN-Bold.ttf
    ├── NotoSansCJK-Regular.ttc
    ├── NotoSansCJK-Bold.ttc
    ├── SimHei.ttf
    ├── SimSun.ttf
    └── README.md
```

## 注意事项

- 字体文件通常较大（10-50MB），请确保网络状况良好
- 建议使用思源黑体，显示效果最佳
- 如果字体文件加载失败，PDF导出会显示友好的错误提示
- 字体文件仅在PDF导出时使用，不影响页面显示效果

## 常见问题

**Q: 字体文件在哪里下载？**
A: 推荐使用思源黑体，从 GitHub 官方仓库下载最新版本。

**Q: 为什么选择字体后还是乱码？**
A: 请检查字体文件是否正确放置，文件名是否匹配，并尝试刷新页面。

**Q: 可以使用其他字体吗？**
A: 可以修改 `src/utils/fontManager.ts` 文件添加新的字体配置。 