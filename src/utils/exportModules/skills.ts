import type { ResumeData } from '../../stores/resume'
import { formatText, createSeparatorLine, type ModuleGenerator } from './types'

/**
 * 生成专业技能模块
 * 包括：技术技能、证书/资质、语言能力
 */
export const generateSkills: ModuleGenerator = (resumeData: ResumeData): any[] => {
  const { sections, skills } = resumeData
  const content: any[] = []

  const skillsSection = sections.find(s => s.type === 'skills')
  const hasAnySkills = skills.technical.length > 0 || 
                      skills.certificates.length > 0 || 
                      skills.languages.length > 0
  
  if (skillsSection?.expanded && hasAnySkills) {
    content.push({
      text: '专业技能',
      style: 'sectionHeader',
      margin: [0, 0, 0, 4]
    })

    // 添加标题下的分割线
    content.push(createSeparatorLine([0, 0, 0, 8]))

    // 技术技能
    if (skills.technical.length > 0) {
      // content.push({
      //   text: '技术技能',
      //   style: 'skillSubHeader',
      //   margin: [0, 0, 0, 6]
      // })
      
      skills.technical.forEach((skill) => {
        content.push({
          text: `• ${formatText(skill)}`,
          style: 'listItem',
          margin: [0, 0, 0, 3]
        })
      })
      
      content.push({ text: '', margin: [0, 0, 0, 8] })
    }

    // 证书/资质
    if (skills.certificates.length > 0) {
      content.push({
        text: '证书/资质',
        style: 'skillSubHeader',
        margin: [0, 0, 0, 6]
      })
      
      skills.certificates.forEach((cert) => {
        content.push({
          text: `• ${formatText(cert)}`,
          style: 'listItem',
          margin: [0, 0, 0, 3]
        })
      })
      
      content.push({ text: '', margin: [0, 0, 0, 8] })
    }

    // 语言能力
    if (skills.languages.length > 0) {
      content.push({
        text: '语言能力',
        style: 'skillSubHeader',
        margin: [0, 0, 0, 6]
      })
      
      skills.languages.forEach((lang) => {
        content.push({
          text: `• ${formatText(lang)}`,
          style: 'listItem',
          margin: [0, 0, 0, 3]
        })
      })
      
      content.push({ text: '', margin: [0, 0, 0, 8] })
    }
  }

  return content
} 