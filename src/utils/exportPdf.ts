import pdfMake from 'pdfmake/build/pdfmake'
import type { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces'
import type { ResumeData } from '../stores/resume'
import { 
  getSelectedFontConfig, 
  type FontConfig 
} from './fontManager'

// 字体加载状态
let fontsLoaded = false
let currentFontConfig: FontConfig | null = null

// 设置默认字体（不使用自定义字体）
const setupDefaultFonts = (): void => {
  const fonts: TFontDictionary = {
    Roboto: {
      normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
      bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
      italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
      bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
    }
  }
  
  pdfMake.fonts = fonts
  console.log('使用默认Roboto字体配置')
}

// 文本处理函数
const formatText = (text: string): string => {
  if (!text) return ''
  return text.trim()
}

// 创建PDF文档定义
const createDocumentDefinition = (resumeData: ResumeData): TDocumentDefinitions => {
  const { basicInfo, sections, skills, workExperiences, projectExperiences, educations, personalSummary } = resumeData

  const content: any[] = []

  // ====== 基本信息 ======
  content.push({
    text: formatText(basicInfo.name) || '简历',
    style: 'header',
    alignment: 'center',
    margin: [0, 0, 0, 20]
  })

  // 联系信息
  const contactInfo = [
    basicInfo.phone && `📞 ${basicInfo.phone}`,
    basicInfo.email && `📧 ${basicInfo.email}`,
    basicInfo.location && `📍 ${formatText(basicInfo.location)}`
  ].filter(Boolean).join('  |  ')

  if (contactInfo) {
    content.push({
      text: contactInfo,
      alignment: 'center',
      margin: [0, 0, 0, 10]
    })
  }

  // 个人网站
  if (basicInfo.website) {
    content.push({
      text: `🔗 ${basicInfo.website}`,
      alignment: 'center',
      margin: [0, 0, 0, 10]
    })
  }

  // 工作状态
  const statusInfo = [
    basicInfo.workStatus && `👤 ${formatText(basicInfo.workStatus)}`,
    basicInfo.jobTarget && `🎯 ${formatText(basicInfo.jobTarget)}`
  ].filter(Boolean).join('  |  ')

  if (statusInfo) {
    content.push({
      text: statusInfo,
      alignment: 'center',
      margin: [0, 0, 0, 20]
    })
  }

  // 分割线
  content.push({
    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
    margin: [0, 0, 0, 20]
  })

  // ====== 专业技能 ======
  const skillsSection = sections.find(s => s.type === 'skills')
  if (skillsSection?.expanded && skills.technical.length > 0) {
    content.push({
      text: 'PROFESSIONAL SKILLS',
      style: 'sectionHeader',
      margin: [0, 0, 0, 10]
    })

    skills.technical.forEach(skill => {
      content.push({
        text: `• ${formatText(skill)}`,
        margin: [0, 0, 0, 5]
      })
    })
    
    content.push({ text: '', margin: [0, 0, 0, 15] })
  }

  // ====== 工作经历 ======
  const workSection = sections.find(s => s.type === 'work')
  if (workSection?.expanded && workExperiences.length > 0) {
    content.push({
      text: 'WORK EXPERIENCE',
      style: 'sectionHeader',
      margin: [0, 0, 0, 10]
    })

    workExperiences.forEach(work => {
      content.push({
        text: `${formatText(work.position)} | ${formatText(work.company)}`,
        style: 'subHeader',
        margin: [0, 0, 0, 5]
      })

      content.push({
        text: `${work.startDate} - ${work.endDate || 'Present'}`,
        style: 'dateText',
        margin: [0, 0, 0, 5]
      })

      if (work.description) {
        content.push({
          text: formatText(work.description),
          margin: [0, 0, 0, 15]
        })
      }
    })
  }

  // ====== 项目经历 ======
  const projectSection = sections.find(s => s.type === 'project')
  if (projectSection?.expanded && projectExperiences.length > 0) {
    content.push({
      text: 'PROJECT EXPERIENCE',
      style: 'sectionHeader',
      margin: [0, 0, 0, 10]
    })

    projectExperiences.forEach(project => {
      content.push({
        text: formatText(project.name),
        style: 'subHeader',
        margin: [0, 0, 0, 5]
      })

      content.push({
        text: `${project.startDate} - ${project.endDate || 'Present'}`,
        style: 'dateText',
        margin: [0, 0, 0, 5]
      })

      if (project.role) {
        content.push({
          text: `Role: ${formatText(project.role)}`,
          style: 'roleText',
          margin: [0, 0, 0, 5]
        })
      }

      if (project.description) {
        content.push({
          text: formatText(project.description),
          margin: [0, 0, 0, 15]
        })
      }
    })
  }

  // ====== 教育经历 ======
  const educationSection = sections.find(s => s.type === 'education')
  if (educationSection?.expanded && educations.length > 0) {
    content.push({
      text: 'EDUCATION',
      style: 'sectionHeader',
      margin: [0, 0, 0, 10]
    })

    educations.forEach(edu => {
      content.push({
        text: `${formatText(edu.degree)} | ${formatText(edu.school)}`,
        style: 'subHeader',
        margin: [0, 0, 0, 5]
      })

      content.push({
        text: `${edu.startDate} - ${edu.endDate || 'Present'}`,
        style: 'dateText',
        margin: [0, 0, 0, 15]
      })
    })
  }

  // ====== 个人总结 ======
  const summarySection = sections.find(s => s.type === 'summary')
  if (summarySection?.expanded && personalSummary.content) {
    content.push({
      text: 'PERSONAL SUMMARY',
      style: 'sectionHeader',
      margin: [0, 0, 0, 10]
    })

    content.push({
      text: formatText(personalSummary.content),
      margin: [0, 0, 0, 10]
    })
  }

  return {
    content,
    styles: {
      header: {
        fontSize: 24,
        bold: true,
        color: '#333333'
      },
      sectionHeader: {
        fontSize: 16,
        bold: true,
        color: '#333333',
        decoration: 'underline'
      },
      subHeader: {
        fontSize: 12,
        bold: true,
        color: '#333333'
      },
      dateText: {
        fontSize: 10,
        color: '#666666',
        italics: true
      },
      roleText: {
        fontSize: 10,
        color: '#666666',
        italics: true
      }
    },
    defaultStyle: {
      fontSize: 11,
      color: '#333333',
      lineHeight: 1.3
    },
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60] as [number, number, number, number]
  }
}

// 旧的导出函数（已废弃）
export const exportToPDFDirect = async (resumeData: ResumeData): Promise<any> => {
  console.warn('该函数已废弃，请使用 exportHighQualityPDF')
  throw new Error('请使用 exportHighQualityPDF 函数')
}

// 高质量PDF导出（暂时使用默认字体，避免复杂的字体加载问题）
export const exportHighQualityPDF = async (resumeData: ResumeData): Promise<void> => {
  try {
    console.log('开始生成PDF...')
    
    // 暂时使用默认字体，避免字体加载问题
    setupDefaultFonts()
    
    // 创建文档定义
    const docDefinition = createDocumentDefinition(resumeData)
    const fileName = `${formatText(resumeData.basicInfo.name) || 'resume'}_resume.pdf`
    
    console.log('正在生成PDF文件...')
    
    // 生成并下载PDF
    pdfMake.createPdf(docDefinition).download(fileName)
    
    console.log('PDF导出成功! 文件名:', fileName)
    
  } catch (error) {
    console.error('PDF导出失败:', error)
    alert('PDF导出失败，请重试')
    throw error // 重新抛出错误，确保调用者知道失败了
  }
}