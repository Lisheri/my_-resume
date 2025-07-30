import pdfMake from 'pdfmake/build/pdfmake'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import type { ResumeData } from '../stores/resume'
import {
  generateBasicInfo,
  generateSkills,
  generateWorkExperience,
  generateProjectExperience,
  generateEducation,
  generatePersonalSummary
} from './exportModules'

// 配置字体支持
const setupChineseFont = async (): Promise<void> => {
  try {
    console.log('配置字体支持...')
    
    // 配置pdfMake字体 - 包含中文字体和iconfont
    pdfMake.fonts = {
      Roboto: {
        normal: 'https://cdn.jsdelivr.net/npm/@zf-web-font/sourcehansanscn@0.2.0/SourceHanSansCN-Light.ttf',
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

// 创建PDF文档定义 - 重构后的简洁版本
const createDocumentDefinition = (resumeData: ResumeData): TDocumentDefinitions => {
  const content: any[] = []

  // 按顺序生成各个模块
  content.push(...generateBasicInfo(resumeData))
  content.push(...generateSkills(resumeData))
  content.push(...generateWorkExperience(resumeData))
  content.push(...generateProjectExperience(resumeData))
  content.push(...generateEducation(resumeData))
  content.push(...generatePersonalSummary(resumeData))

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
        // italics: true,
        font: 'Roboto'
      },
      // 联系信息文本
      contactText: {
        fontSize: 10,
        color: '#666666',
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
        color: '#333333',
        lineHeight: 1.4,
        font: 'Roboto'
      },
      // 正文文本（个人总结等）
      bodyText: {
        fontSize: 10,
        color: '#333333',
        lineHeight: 1.4,
        font: 'Roboto'
      },
      // 公司名称样式
      companyName: {
        fontSize: 10,
        bold: true,
        color: '#333333',
        font: 'Roboto'
      },
      // 职位详情样式
      jobDetails: {
        fontSize: 10,
        color: '#333333',
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
    
    const fileName = `${resumeData.basicInfo.name || 'resume'}_resume.pdf`
    
    console.log('正在生成PDF文件...')
    
    // 生成并下载PDF
    pdfMake.createPdf(docDefinition).download(fileName)
    
    console.log('PDF导出成功! 文件名:', fileName)
    
  } catch (error) {
    console.error('PDF导出失败:', error)
    throw error
  }
}