import type { ResumeData } from '../../stores/resume'
import { formatText, type ModuleGenerator } from './types'

/**
 * 生成项目经历模块
 * 包括：项目名称、角色信息、项目时间、项目描述
 */
export const generateProjectExperience: ModuleGenerator = (resumeData: ResumeData): any[] => {
  const { sections, projectExperiences } = resumeData
  const content: any[] = []

  const projectSection = sections.find(s => s.type === 'project')
  if (projectSection?.expanded && projectExperiences.length > 0) {
    content.push({
      text: '项目经历',
      style: 'sectionHeader',
      margin: [0, 0, 0, 12]
    })

    projectExperiences.forEach((project, index) => {
      // 项目名称和时间在同一行
      content.push({
        columns: [
          {
            text: formatText(project.name),
            style: 'companyName',
            width: '*'
          },
          {
            text: `${project.startDate} - ${project.endDate || '至今'}`,
            style: 'dateText',
            alignment: 'right',
            width: 'auto'
          }
        ],
        margin: [0, 0, 0, 2]
      })
      
      // 角色信息
      if (project.role) {
        content.push({
          text: formatText(project.role),
          style: 'jobDetails',
          margin: [0, 0, 0, 6]
        })
      }

      // 项目描述
      if (project.description) {
        const descriptions = project.description.split('\n').filter(Boolean)
        descriptions.forEach((desc, i) => {
          const trimmedDesc = desc.trim()
          const listText = /^\d+\./.test(trimmedDesc) ? trimmedDesc : `${i + 1}. ${trimmedDesc}`
          content.push({
            text: listText,
            style: 'listItem',
            margin: [0, 0, 0, 2]
          })
        })
      }

      // 添加间距（除了最后一项）
      if (index < projectExperiences.length - 1) {
        content.push({ text: '', margin: [0, 0, 0, 12] })
      }
    })
    
    // 项目经历整个区域的底部间距
    content.push({ text: '', margin: [0, 0, 0, 8] })
  }

  return content
} 