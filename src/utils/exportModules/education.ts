import type { ResumeData } from '../../stores/resume'
import { formatText, createSeparatorLine, type ModuleGenerator } from './types'

/**
 * 生成教育经历模块
 * 包括：学校名称、专业学历、就读时间、GPA/成绩、排名/等级、教育描述
 */
export const generateEducation: ModuleGenerator = (resumeData: ResumeData): any[] => {
  const { sections, educations } = resumeData
  const content: any[] = []

  const educationSection = sections.find(s => s.type === 'education')
  if (educationSection?.expanded && educations.length > 0) {
    content.push({
      text: '教育经历',
      style: 'sectionHeader',
      margin: [0, 0, 0, 4]
    })

    // 添加标题下的分割线
    content.push(createSeparatorLine([0, 0, 0, 8]))

    educations.forEach((edu, index) => {
      // 学校名称和时间在同一行
      content.push({
        columns: [
          {
            text: formatText(edu.school),
            style: 'companyName',
            width: '*'
          },
          {
            text: `${edu.startDate} - ${edu.endDate || '至今'}`,
            style: 'dateText',
            alignment: 'right',
            width: 'auto'
          }
        ],
        margin: [0, 0, 0, 2]
      })

      // 专业、学历、GPA和排名放在同一行
      const eduDetails = []
      if (edu.major) eduDetails.push(formatText(edu.major))
      if (edu.degree) eduDetails.push(formatText(edu.degree))
      if (edu.gpa) eduDetails.push(`GPA/成绩: ${formatText(edu.gpa)}`)
      if (edu.ranking) eduDetails.push(`排名/等级: ${formatText(edu.ranking)}`)
      
      if (eduDetails.length > 0) {
        content.push({
          text: eduDetails.join(' | '),
          style: 'jobDetails',
          margin: [0, 0, 0, 6]
        })
      }

      // 教育描述
      if (edu.description) {
        const descriptions = edu.description.split('\n').filter(Boolean)
        descriptions.forEach((desc) => {
          const trimmedDesc = desc.trim()
          if (trimmedDesc) {
            content.push({
              text: trimmedDesc,
              style: 'listItem',
              margin: [0, 0, 0, 2]
            })
          }
        })
      }

      // 添加间距（除了最后一项）
      if (index < educations.length - 1) {
        content.push({ text: '', margin: [0, 0, 0, 12] })
      }
    })

    // 教育经历整个区域的底部间距
    content.push({ text: '', margin: [0, 0, 0, 8] })
  }

  return content
} 