// 字体资源模块 - 直接使用public目录路径

// 字体名称映射 - 直接使用public目录的路径
export const FONT_NAME_MAP = {
  // 'XinyiGuanHei': '/fonts/字体圈欣意冠黑体.ttf',
  // 'YouSheBiaoTiHei': '/fonts/优设标题黑.ttf',
  // 'YixinYuzhouHei': '/fonts/壹心宇宙黑.ttf',
  // 'YixinQingHei': '/fonts/壹心晴黑体.ttf',
  // 'YixinChongFengHao': '/fonts/壹心冲锋号.ttf',
  // 'HanyiYakuHei': '/fonts/汉仪雅酷黑.ttf',
  // 'FangzhengLantingCuHei': '/fonts/方正兰亭粗黑简体.TTF',
  // 'EryaXinDaHei': '/fonts/尔雅新大黑.ttf',
  // 'EryaJingsiHei': '/fonts/尔雅静思黑.ttf',
  // 'CangjiGaoDeGuoMiaoHei': '/fonts/仓迹高德国妙黑.otf',
  // 'FZLTTHJW': '/fonts/FZLTTHJW.TTF',
  // 'FZLTCHJW': '/fonts/FZLTCHJW.TTF',
  // 'NotoSansHans': '/fonts/NotoSansHans-Regular.otf'
}

// 获取字体资源URL
export const getFontAssetUrl = (fontName: string): string | null => {
  const url = FONT_NAME_MAP[fontName as keyof typeof FONT_NAME_MAP]
  console.log(`获取字体资源: ${fontName} -> ${url}`)
  return url || null
} 