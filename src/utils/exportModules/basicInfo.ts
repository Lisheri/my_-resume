import type { ResumeData } from '../../stores/resume'
import { formatText, createIconText, createSeparatorLine, type ModuleGenerator } from './types'

/**
 * 生成基本信息模块
 * 包括：姓名、联系信息、个人网站、工作状态和求职目标
 */
export const generateBasicInfo: ModuleGenerator = (resumeData: ResumeData): any[] => {
  const { basicInfo } = resumeData
  const content: any[] = []

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
  // content.push(createSeparatorLine([0, 0, 0, 14]))

  return content
} 