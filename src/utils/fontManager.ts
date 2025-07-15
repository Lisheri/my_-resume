// 字体管理器 - 处理PDF导出中的中文字体支持
export interface FontConfig {
  name: string
  displayName: string
  regular: string
  bold?: string
  italic?: string
}

// 可用字体配置 - 基于用户实际字体文件
export const AVAILABLE_FONTS: FontConfig[] = [
  {
    name: 'XinyiGuanHei',
    displayName: '字体圈欣意冠黑体',
    regular: '/fonts/字体圈欣意冠黑体.ttf'
  },
  {
    name: 'YouSheBiaoTiHei',
    displayName: '优设标题黑',
    regular: '/fonts/优设标题黑.ttf'
  },
  {
    name: 'YixinYuzhouHei',
    displayName: '壹心宇宙黑',
    regular: '/fonts/壹心宇宙黑.ttf'
  },
  {
    name: 'YixinQingHei',
    displayName: '壹心晴黑体',
    regular: '/fonts/壹心晴黑体.ttf'
  },
  {
    name: 'YixinChongFengHao',
    displayName: '壹心冲锋号',
    regular: '/fonts/壹心冲锋号.ttf'
  },
  {
    name: 'HanyiYakuHei',
    displayName: '汉仪雅酷黑',
    regular: '/fonts/汉仪雅酷黑.ttf'
  },
  {
    name: 'FangzhengLantingCuHei',
    displayName: '方正兰亭粗黑简体',
    regular: '/fonts/方正兰亭粗黑简体.TTF'
  },
  {
    name: 'EryaXinDaHei',
    displayName: '尔雅新大黑',
    regular: '/fonts/尔雅新大黑.ttf'
  },
  {
    name: 'EryaJingsiHei',
    displayName: '尔雅静思黑',
    regular: '/fonts/尔雅静思黑.ttf'
  },
  {
    name: 'CangjiGaoDeGuoMiaoHei',
    displayName: '仓迹高德国妙黑',
    regular: '/fonts/仓迹高德国妙黑.otf'
  },
  {
    name: 'FZLTTHJW',
    displayName: '方正兰亭特黑简体',
    regular: '/fonts/FZLTTHJW.TTF'
  },
  {
    name: 'FZLTCHJW',
    displayName: '方正兰亭超黑简体',
    regular: '/fonts/FZLTCHJW.TTF'
  },
  {
    name: "NotoSansHans",
    displayName: "思源黑体",
    regular: "/fonts/NotoSansHans-Regular.otf"
  }
]

// 默认字体
export const DEFAULT_FONT = AVAILABLE_FONTS[0]

// 字体加载函数
export const loadFontAsBase64 = async (fontPath: string): Promise<string> => {
  try {
    const response = await fetch(fontPath)
    if (!response.ok) {
      throw new Error(`字体文件加载失败: ${response.status}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // 转换为base64
    let binary = ''
    uint8Array.forEach(byte => {
      binary += String.fromCharCode(byte)
    })
    
    return btoa(binary)
  } catch (error) {
    console.error('字体加载失败:', fontPath, error)
    throw error
  }
}

// 检查字体文件是否存在
export const checkFontAvailable = async (fontPath: string): Promise<boolean> => {
  try {
    const response = await fetch(fontPath, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

// 获取可用的字体列表
export const getAvailableFonts = async (): Promise<FontConfig[]> => {
  const availableFonts: FontConfig[] = []
  
  for (const font of AVAILABLE_FONTS) {
    const isAvailable = await checkFontAvailable(font.regular)
    if (isAvailable) {
      availableFonts.push(font)
    }
  }
  
  return availableFonts
}

// 字体存储管理
const FONT_STORAGE_KEY = 'resume_selected_font'

export const saveSelectedFont = (fontName: string): void => {
  localStorage.setItem(FONT_STORAGE_KEY, fontName)
}

export const getSelectedFont = (): string => {
  return localStorage.getItem(FONT_STORAGE_KEY) || DEFAULT_FONT.name
}

export const getSelectedFontConfig = (): FontConfig => {
  const selectedName = getSelectedFont()
  return AVAILABLE_FONTS.find(font => font.name === selectedName) || DEFAULT_FONT
} 