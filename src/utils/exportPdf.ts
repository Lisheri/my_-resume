import pdfMake from 'pdfmake/build/pdfmake'
import type { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces'
import type { ResumeData } from '../stores/resume'

// 简化字体配置，暂时不加载复杂字体避免内存问题
const setupChineseFont = async (): Promise<void> => {
  try {
    console.log('配置字体支持...')
    
    // 暂时使用默认Roboto字体，避免大字体文件导致的内存问题
    // 后续可以优化为使用轻量级的中文字体子集
    pdfMake.fonts = {
      Roboto: {
        normal: 'https://cdn.jsdelivr.net/npm/@zf-web-font/sourcehansanscn@0.2.0/SourceHanSansCN-Bold.ttf',
        bold: 'https://cdn.jsdelivr.net/npm/@zf-web-font/sourcehansanscn@0.2.0/SourceHanSansCN-ExtraLight.ttf',
        italics: 'https://cdn.jsdelivr.net/npm/@zf-web-font/sourcehansanscn@0.2.0/SourceHanSansCN-Heavy.ttf',
        bolditalics: 'https://cdn.jsdelivr.net/npm/@zf-web-font/sourcehansanscn@0.2.0/SourceHanSansCN-ExtraLight.ttf'
      }
    }
    
    console.log('字体配置完成 (使用Roboto字体)')
    
  } catch (error) {
    console.error('字体配置失败:', error)
    // 即使出错也不抛出异常，确保PDF可以正常生成
  }
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

    const skillsText = skills.technical.map(skill => `• ${formatText(skill)}`).join('\n')
    content.push({
      text: skillsText,
      margin: [0, 0, 0, 15]
    })
  }

  // ====== 工作经历 ======
  const workSection = sections.find(s => s.type === 'work')
  if (workSection?.expanded && workExperiences.length > 0) {
    content.push({
      text: 'WORK EXPERIENCE',
      style: 'sectionHeader',
      margin: [0, 0, 0, 15]
    })

    workExperiences.forEach((work, index) => {
      // 公司和职位
      content.push({
        text: `${formatText(work.company)} | ${formatText(work.position)}`,
        style: 'subHeader',
        margin: [0, 0, 0, 5]
      })

      // 时间
      const timeRange = `${work.startDate} - ${work.endDate || '至今'}`
      content.push({
        text: timeRange,
        style: 'dateText',
        margin: [0, 0, 0, 8]
      })

      // 工作描述
      if (work.description) {
        const descriptions = work.description.split('\n').filter(Boolean)
        descriptions.forEach((desc, i) => {
          content.push({
            text: `${i + 1}. ${formatText(desc)}`,
            margin: [0, 0, 0, 3]
          })
        })
      }

      // 添加间距（除了最后一项）
      if (index < workExperiences.length - 1) {
        content.push({ text: '', margin: [0, 0, 0, 10] })
      }
    })
  }

  // ====== 项目经历 ======
  const projectSection = sections.find(s => s.type === 'project')
  if (projectSection?.expanded && projectExperiences.length > 0) {
    content.push({
      text: 'PROJECT EXPERIENCE',
      style: 'sectionHeader',
      margin: [0, 0, 0, 15]
    })

    projectExperiences.forEach((project, index) => {
      content.push({
        text: `${formatText(project.name)} | ${formatText(project.role)}`,
        style: 'subHeader',
        margin: [0, 0, 0, 5]
      })

      const timeRange = `${project.startDate} - ${project.endDate || '至今'}`
      content.push({
        text: timeRange,
        style: 'dateText',
        margin: [0, 0, 0, 8]
      })

      if (project.description) {
        const descriptions = project.description.split('\n').filter(Boolean)
        descriptions.forEach((desc, i) => {
          content.push({
            text: `${i + 1}. ${formatText(desc)}`,
            margin: [0, 0, 0, 3]
          })
        })
      }

      if (index < projectExperiences.length - 1) {
        content.push({ text: '', margin: [0, 0, 0, 10] })
      }
    })
  }

  // ====== 教育经历 ======
  const educationSection = sections.find(s => s.type === 'education')
  if (educationSection?.expanded && educations.length > 0) {
    content.push({
      text: 'EDUCATION',
      style: 'sectionHeader',
      margin: [0, 0, 0, 15]
    })

    educations.forEach((edu, index) => {
      content.push({
        text: `${formatText(edu.school)} | ${formatText(edu.major)}`,
        style: 'subHeader',
        margin: [0, 0, 0, 5]
      })

      const timeRange = `${edu.startDate} - ${edu.endDate || '至今'}`
      content.push({
        text: timeRange,
        style: 'dateText',
        margin: [0, 0, 0, index === educations.length - 1 ? 15 : 10]
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
        color: '#333333',
        font: 'Roboto'
      },
      sectionHeader: {
        fontSize: 16,
        bold: true,
        color: '#333333',
        decoration: 'underline',
        font: 'Roboto'
      },
      subHeader: {
        fontSize: 12,
        bold: true,
        color: '#333333',
        font: 'Roboto'
      },
      dateText: {
        fontSize: 10,
        color: '#666666',
        italics: true,
        font: 'Roboto'
      },
      roleText: {
        fontSize: 10,
        color: '#666666',
        italics: true,
        font: 'Roboto'
      }
    },
    defaultStyle: {
      fontSize: 11,
      color: '#333333',
      lineHeight: 1.3,
      font: 'Roboto'
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

// 高质量PDF导出
export const exportHighQualityPDF = async (resumeData: ResumeData): Promise<void> => {
  try {
    console.log('开始生成PDF...')
    console.log('简历数据:', resumeData)
    
    // 设置中文字体
    await setupChineseFont()
    
    // 创建文档定义
    const docDefinition = createDocumentDefinition(resumeData)
    console.log('PDF文档定义:', docDefinition)
    
    const fileName = `${formatText(resumeData.basicInfo.name) || 'resume'}_resume.pdf`
    
    console.log('正在生成PDF文件...')
    
    // 生成并下载PDF
    pdfMake.createPdf(docDefinition).download(fileName)
    
    console.log('PDF导出成功! 文件名:', fileName)
    
  } catch (error) {
    console.error('PDF导出失败:', error)
    throw error
  }
}