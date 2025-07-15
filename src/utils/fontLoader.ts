// 字体加载器 - 用于在网页预览中加载字体
import { AVAILABLE_FONTS, type FontConfig } from './fontManager'

// 已加载的字体缓存
const loadedFonts = new Set<string>()

// 为网页加载字体
export const loadFontForPreview = async (fontConfig: FontConfig): Promise<void> => {
  try {
    // 如果字体已经加载过，直接返回
    if (loadedFonts.has(fontConfig.name)) {
      return
    }

    console.log('正在为预览加载字体:', fontConfig.displayName)

    // 创建FontFace对象
    const fontFace = new FontFace(fontConfig.name, `url(${fontConfig.regular})`)
    
    // 加载字体
    await fontFace.load()
    
    // 添加到document的字体集合中
    document.fonts.add(fontFace)
    
    // 标记为已加载
    loadedFonts.add(fontConfig.name)
    
    console.log('字体加载成功:', fontConfig.displayName)
  } catch (error) {
    console.warn('字体加载失败:', fontConfig.displayName, error)
  }
}

// 应用字体到预览元素
export const applyFontToPreview = async (fontName: string): Promise<void> => {
  const fontConfig = AVAILABLE_FONTS.find(font => font.name === fontName)
  if (!fontConfig) {
    console.warn('未找到字体配置:', fontName)
    return
  }

  // 先加载字体
  await loadFontForPreview(fontConfig)
  
  // 应用到预览区域
  const previewElement = document.querySelector('.preview-content') as HTMLElement
  if (previewElement) {
    previewElement.style.fontFamily = `"${fontConfig.name}", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`
  }
}

// 初始化默认字体
export const initDefaultFont = async (): Promise<void> => {
  if (AVAILABLE_FONTS.length > 0) {
    const defaultFont = AVAILABLE_FONTS[0]
    await applyFontToPreview(defaultFont.name)
  }
} 