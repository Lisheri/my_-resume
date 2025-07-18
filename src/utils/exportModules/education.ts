import type { ResumeData } from '../../stores/resume'
import { formatText, type ModuleGenerator } from './types'

/**
 * 生成教育经历模块
 * 包括：学校名称、专业学历、就读时间
 */
export const generateEducation: ModuleGenerator = (resumeData: ResumeData): any[] => {
  const { sections, educations } = resumeData
  const content: any[] = []

  const educationSection = sections.find(s => s.type === 'education')
  if (educationSection?.expanded && educations.length > 0) {
    content.push({
      text: '教育经历',
      style: 'sectionHeader',
      margin: [0, 0, 0, 12]
    })

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

      // 专业和学历
      const eduDetails = []
      if (edu.major) eduDetails.push(formatText(edu.major))
      if (edu.degree) eduDetails.push(formatText(edu.degree))
      
      if (eduDetails.length > 0) {
        content.push({
          text: eduDetails.join(' | '),
          style: 'jobDetails',
          margin: [0, 0, 0, index === educations.length - 1 ? 8 : 12]
        })
      }
    })
  }

  return content
} 