// 导出所有模块生成器
export { generateBasicInfo } from './basicInfo'
export { generateSkills } from './skills'
export { generateWorkExperience } from './workExperience'
export { generateProjectExperience } from './projectExperience'
export { generateEducation } from './education'
export { generatePersonalSummary } from './personalSummary'

// 导出类型和工具函数
export type { ModuleGenerator } from './types'
export { formatText, formatTextWithLineBreaks, createIconText, getIconChar, ICON_MAP, createSeparatorLine } from './types' 