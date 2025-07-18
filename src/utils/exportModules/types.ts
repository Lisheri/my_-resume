import type { ResumeData } from '../../stores/resume'

// 图标映射 - 将iconfont类名映射到Unicode字符
export const ICON_MAP: { [key: string]: string } = {
  'icon-gengduobeifen25': '\ue717',  // 电话图标
  'icon-youjian1': '\ue733',        // 邮件图标
  'icon-weizhi': '\ue810',          // 位置图标
  'icon-out_link': '\ue6e2',        // 链接图标
  'icon-tysp_renshu': '\ue6ec',     // 个人图标 (工作状态)
  'icon-jifen-kaoshirenwu': '\ue839' // 目标图标
}

// 获取图标字符
export const getIconChar = (iconClass: string): string => {
  return ICON_MAP[iconClass] || ''
}

// 创建带图标的文本 - 使用iconfont字体
export const createIconText = (iconClass: string, text: string): any[] => {
  const iconChar = getIconChar(iconClass)
  if (iconChar) {
    return [
      {
        text: iconChar,
        font: 'iconfont',
        style: 'iconStyle'
      },
      {
        text: ` ${text}`,
        style: 'contactText'
      }
    ]
  }
  return [{
    text: text,
    style: 'contactText'
  }]
}

// 文本处理函数
export const formatText = (text: string): string => {
  if (!text) return ''
  return text.replace(/\n/g, ' ').trim()
}

// 保持换行的文本处理函数（用于个人总结等需要保持格式的内容）
export const formatTextWithLineBreaks = (text: string): string => {
  if (!text) return ''
  return text.trim()
}

// 模块生成器类型定义
export type ModuleGenerator = (resumeData: ResumeData) => any[] 