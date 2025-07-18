import pdfMake from 'pdfmake/build/pdfmake'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import type { ResumeData } from '../stores/resume'

// 图标映射 - 将iconfont类名映射到Unicode字符
const ICON_MAP: { [key: string]: string } = {
  'icon-gengduobeifen25': '\ue717',  // 电话图标
  'icon-youjian1': '\ue733',        // 邮件图标
  'icon-weizhi': '\ue810',          // 位置图标
  'icon-out_link': '\ue6e2',        // 链接图标
  'icon-tysp_renshu': '\ue6ec',     // 个人图标 (工作状态)
  'icon-jifen-kaoshirenwu': '\ue839' // 目标图标
}

// 配置字体支持
const setupChineseFont = async (): Promise<void> => {
  try {
    console.log('配置字体支持...')
    
    // 配置pdfMake字体 - 包含中文字体和iconfont
    pdfMake.fonts = {
      Roboto: {
        normal: 'https://cdn.jsdelivr.net/npm/@zf-web-font/sourcehansanscn@0.2.0/SourceHanSansCN-Bold.ttf',
        bold: 'https://cdn.jsdelivr.net/npm/@zf-web-font/sourcehansanscn@0.2.0/SourceHanSansCN-Bold.ttf',
        italics: 'https://cdn.jsdelivr.net/npm/@zf-web-font/sourcehansanscn@0.2.0/SourceHanSansCN-Heavy.ttf',
        // bolditalics: 'https://cdn.jsdelivr.net/npm/@zf-web-font/sourcehansanscn@0.2.0/SourceHanSansCN-Bold.ttf'
        bolditalics: 'https://cdn.jsdelivr.net/npm/@zf-web-font/sourcehansanscn@0.2.0/SourceHanSansCN-ExtraLight.ttf'
        
      },
      // 添加iconfont字体支持 - 使用TTF格式
      iconfont: {
        normal: 'https://at.alicdn.com/t/c/font_4976813_y9pc58z6rd.ttf',
        bold: 'https://at.alicdn.com/t/c/font_4976813_y9pc58z6rd.ttf',
        italics: 'https://at.alicdn.com/t/c/font_4976813_y9pc58z6rd.ttf',
        bolditalics: 'https://at.alicdn.com/t/c/font_4976813_y9pc58z6rd.ttf'
      }
    }
    
    console.log('字体配置完成 (包含iconfont字体)')
    
  } catch (error) {
    console.error('字体配置失败:', error)
    // 即使出错也不抛出异常，确保PDF可以正常生成
  }
}

// 获取图标字符
const getIconChar = (iconClass: string): string => {
  return ICON_MAP[iconClass] || ''
}

// 创建带图标的文本 - 使用iconfont字体
const createIconText = (iconClass: string, text: string): any[] => {
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
const formatText = (text: string): string => {
  if (!text) return ''
  return text.replace(/\n/g, ' ').trim()
}

// 保持换行的文本处理函数（用于个人总结等需要保持格式的内容）
const formatTextWithLineBreaks = (text: string): string => {
  if (!text) return ''
  return text.trim()
}

// 创建PDF文档定义
const createDocumentDefinition = (resumeData: ResumeData): TDocumentDefinitions => {
  const { basicInfo, sections, skills, workExperiences, projectExperiences, educations, personalSummary } = resumeData

  const content: any[] = []

  // ====== 基本信息（Header优化） ======
  // 姓名
  content.push({
    text: formatText(basicInfo.name) || '简历',
    style: 'header',
    alignment: 'center',
    margin: [0, 0, 0, 16]
  })

  // 联系信息 - 优化布局，放在一行
  const contactTexts = []
  if (basicInfo.phone) {
    contactTexts.push(createIconText('icon-gengduobeifen25', basicInfo.phone))
  }
  if (basicInfo.email) {
    contactTexts.push(createIconText('icon-youjian1', basicInfo.email))
  }
  if (basicInfo.location) {
    contactTexts.push(createIconText('icon-weizhi', formatText(basicInfo.location)))
  }

  if (contactTexts.length > 0) {
    // 将联系信息合并为一行，用分隔符分开
    const combinedContact: any[] = []
    contactTexts.forEach((contact, index) => {
      combinedContact.push(...contact)
      if (index < contactTexts.length - 1) {
        combinedContact.push({
          text: '  |  ',
          style: 'separatorText'
        })
      }
    })
    
    content.push({
      text: combinedContact,
      alignment: 'center',
      margin: [0, 0, 0, 8]
    })
  }

  // 个人网站
  if (basicInfo.website) {
    content.push({
      text: createIconText('icon-out_link', basicInfo.website),
      alignment: 'center',
      margin: [0, 0, 0, 8]
    })
  }

  // 工作状态和求职目标 - 优化布局
  const statusTexts = []
  if (basicInfo.workStatus) {
    statusTexts.push(createIconText('icon-tysp_renshu', formatText(basicInfo.workStatus)))
  }
  if (basicInfo.jobTarget) {
    statusTexts.push(createIconText('icon-jifen-kaoshirenwu', formatText(basicInfo.jobTarget)))
  }

  if (statusTexts.length > 0) {
    // 将状态信息合并为一行
    const combinedStatus: any[] = []
    statusTexts.forEach((status, index) => {
      combinedStatus.push(...status)
      if (index < statusTexts.length - 1) {
        combinedStatus.push({
          text: '  |  ',
          style: 'separatorText'
        })
      }
    })
    
    content.push({
      text: combinedStatus,
      alignment: 'center',
      margin: [0, 0, 0, 14]
    })
  }

  // 分割线
  content.push({
    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
    margin: [0, 0, 0, 14]
  })

  // ====== 专业技能 ======
  const skillsSection = sections.find(s => s.type === 'skills')
  const hasAnySkills = skills.technical.length > 0 || 
                      skills.certificates.length > 0 || 
                      skills.languages.length > 0
  
  if (skillsSection?.expanded && hasAnySkills) {
    content.push({
      text: '专业技能',
      style: 'sectionHeader',
      margin: [0, 0, 0, 8]
    })

    // 技术技能
    if (skills.technical.length > 0) {
      content.push({
        text: '技术技能',
        style: 'skillSubHeader',
        margin: [0, 0, 0, 6]
      })
      
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
    
    // 添加底部间距
    content.push({ text: '', margin: [0, 0, 0, 4] })
  }

  // ====== 工作经历 ======
  const workSection = sections.find(s => s.type === 'work')
  if (workSection?.expanded && workExperiences.length > 0) {
    content.push({
      text: '工作经历',
      style: 'sectionHeader',
      margin: [0, 0, 0, 12]
    })

    workExperiences.forEach((work, index) => {
      // 公司和职位
      content.push({
        text: `${formatText(work.company)} | ${formatText(work.position)}`,
        style: 'subHeader',
        margin: [0, 0, 0, 4]
      })

      // 时间
      const timeRange = `${work.startDate} - ${work.endDate || '至今'}`
      content.push({
        text: timeRange,
        style: 'dateText',
        margin: [0, 0, 0, 6]
      })

      // 工作描述
      if (work.description) {
        const descriptions = work.description.split('\n').filter(Boolean)
        descriptions.forEach((desc, i) => {
          content.push({
            text: `• ${desc.trim()}`,
            style: 'listItem',
            margin: [0, 0, 0, 2]
          })
        })
      }

      // 添加间距（除了最后一项）
      if (index < workExperiences.length - 1) {
        content.push({ text: '', margin: [0, 0, 0, 8] })
      }
    })
  }

  // ====== 项目经历 ======
  const projectSection = sections.find(s => s.type === 'project')
  if (projectSection?.expanded && projectExperiences.length > 0) {
    content.push({
      text: '项目经历',
      style: 'sectionHeader',
      margin: [0, 0, 0, 12]
    })

    projectExperiences.forEach((project, index) => {
      content.push({
        text: `${formatText(project.name)} | ${formatText(project.role)}`,
        style: 'subHeader',
        margin: [0, 0, 0, 4]
      })

      const timeRange = `${project.startDate} - ${project.endDate || '至今'}`
      content.push({
        text: timeRange,
        style: 'dateText',
        margin: [0, 0, 0, 6]
      })

      if (project.description) {
        const descriptions = project.description.split('\n').filter(Boolean)
        descriptions.forEach((desc, i) => {
          content.push({
            text: `• ${desc.trim()}`,
            style: 'listItem',
            margin: [0, 0, 0, 2]
          })
        })
      }

      if (index < projectExperiences.length - 1) {
        content.push({ text: '', margin: [0, 0, 0, 8] })
      }
    })
  }

  // ====== 教育经历 ======
  const educationSection = sections.find(s => s.type === 'education')
  if (educationSection?.expanded && educations.length > 0) {
    content.push({
      text: '教育经历',
      style: 'sectionHeader',
      margin: [0, 0, 0, 12]
    })

    educations.forEach((edu, index) => {
      content.push({
        text: `${formatText(edu.school)} | ${formatText(edu.major)}`,
        style: 'subHeader',
        margin: [0, 0, 0, 4]
      })

      const timeRange = `${edu.startDate} - ${edu.endDate || '至今'}`
      content.push({
        text: timeRange,
        style: 'dateText',
        margin: [0, 0, 0, index === educations.length - 1 ? 12 : 8]
      })
    })
  }

  // ====== 个人总结 ======
  const summarySection = sections.find(s => s.type === 'summary')
  if (summarySection?.expanded && personalSummary.content) {
    content.push({
      text: '个人总结',
      style: 'sectionHeader',
      margin: [0, 0, 0, 8]
    })

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

  return {
    content,
    styles: {
      // 主标题（姓名）
      header: {
        fontSize: 22,
        bold: true,
        color: '#333333',
        font: 'Roboto'
      },
      // 区域标题（专业技能、工作经历等）
      sectionHeader: {
        fontSize: 10,
        bold: true,
        color: '#333333',
        decoration: 'underline',
        font: 'Roboto'
      },
      // 子标题（公司职位、项目名称等）
      subHeader: {
        fontSize: 10,
        bold: true,
        color: '#333333',
        font: 'Roboto'
      },
      // 技能分类标题
      skillSubHeader: {
        fontSize: 10,
        bold: true,
        color: '#333333',
        font: 'Roboto'
      },
      // 日期文本
      dateText: {
        fontSize: 10,
        color: '#333333',
        italics: true,
        font: 'Roboto'
      },
      // 联系信息文本
      contactText: {
        fontSize: 10,
        color: '#333333',
        font: 'Roboto'
      },
      // 图标样式
      iconStyle: {
        fontSize: 10,
        color: '#666666'
      },
      // 分隔符文本
      separatorText: {
        fontSize: 10,
        color: '#999999',
        font: 'Roboto'
      },
      // 列表项（技能、工作描述等）
      listItem: {
        fontSize: 10,
        bold: true,
        color: '#333333',
        lineHeight: 1.4,
        font: 'Roboto'
      },
      // 正文文本（个人总结等）
      bodyText: {
        fontSize: 10,
        bold: true,
        color: '#333333',
        lineHeight: 1.4,
        font: 'Roboto'
      }
    },
    defaultStyle: {
      fontSize: 10,
      color: '#333333',
      lineHeight: 1.4,
      font: 'Roboto'
    },
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60] as [number, number, number, number]
  }
}

// 高质量PDF导出
export const exportHighQualityPDF = async (resumeData: ResumeData): Promise<void> => {
  try {
    console.log('开始生成PDF...')
    console.log('简历数据:', resumeData)
    
    // 设置中文字体和iconfont
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