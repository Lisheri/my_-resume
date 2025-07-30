import type { ResumeData } from '../../stores/resume'
import { formatTextWithLineBreaks, createSeparatorLine, type ModuleGenerator } from './types'

/**
 * 生成个人总结模块
 * 包括：个人总结内容，保持换行格式
 */
export const generatePersonalSummary: ModuleGenerator = (resumeData: ResumeData): any[] => {
  const { sections, personalSummary } = resumeData
  const content: any[] = []

  const summarySection = sections.find(s => s.type === 'summary')
  if (summarySection?.expanded && personalSummary.content) {
    content.push({
      text: '个人总结',
      style: 'sectionHeader',
      margin: [0, 0, 0, 4]
    })

    // 添加标题下的分割线
    content.push(createSeparatorLine([0, 0, 0, 8]))

    // 处理个人总结内容，保持换行格式
    const summaryText = formatTextWithLineBreaks(personalSummary.content)
    
    // 按行分割并创建段落
    const summaryLines = summaryText.split('\n').filter(line => line.trim())
    
    summaryLines.forEach((line, index) => {
      content.push({
        text: line.trim(),
        style: 'bodyText',
        margin: [0, 0, 0, index === summaryLines.length - 1 ? 8 : 4]
      })
    })
  }

  return content
} 