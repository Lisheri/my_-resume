import type { ResumeData } from '../../stores/resume'
import { formatText, createSeparatorLine, type ModuleGenerator } from './types'

/**
 * 生成工作经历模块
 * 包括：公司名称、职位信息、工作时间、工作描述
 */
export const generateWorkExperience: ModuleGenerator = (resumeData: ResumeData): any[] => {
  const { sections, workExperiences } = resumeData
  const content: any[] = []

  const workSection = sections.find(s => s.type === 'work')
  if (workSection?.expanded && workExperiences.length > 0) {
    content.push({
      text: '工作经历',
      style: 'sectionHeader',
      margin: [0, 0, 0, 4]
    })

    // 添加标题下的分割线
    content.push(createSeparatorLine([0, 0, 0, 8]))

    workExperiences.forEach((work, index) => {
      // 公司名称和时间在同一行
      content.push({
        columns: [
          {
            text: formatText(work.company),
            style: 'companyName',
            width: '*'
          },
          {
            text: `${work.startDate} - ${work.endDate || '至今'}`,
            style: 'dateText',
            alignment: 'right',
            width: 'auto'
          }
        ],
        margin: [0, 0, 0, 2]
      })

      // 职位、部门、城市等信息
      const jobDetails = []
      if (work.position) jobDetails.push(formatText(work.position))
      if (work.department) jobDetails.push(formatText(work.department))
      if (work.location) jobDetails.push(formatText(work.location))
      
      if (jobDetails.length > 0) {
        content.push({
          text: jobDetails.join(' | '),
          style: 'jobDetails',
          margin: [0, 0, 0, 6]
        })
      }

      // 工作描述
      if (work.description) {
        const descriptions = work.description.split('\n').filter(Boolean)
        descriptions.forEach((desc, i) => {
          const trimmedDesc = desc.trim()
          // 如果描述已经以数字开头，保持原格式；否则添加项目符号
          const listText = /^\d+\./.test(trimmedDesc) ? trimmedDesc : `${i + 1}. ${trimmedDesc}`
          content.push({
            text: listText,
            style: 'listItem',
            margin: [0, 0, 0, 2]
          })
        })
      }

      // 添加间距（除了最后一项）
      if (index < workExperiences.length - 1) {
        content.push({ text: '', margin: [0, 0, 0, 12] })
      }
    })
    
    // 工作经历整个区域的底部间距
    content.push({ text: '', margin: [0, 0, 0, 8] })
  }

  return content
} 