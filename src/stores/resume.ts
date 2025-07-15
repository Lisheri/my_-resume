import { defineStore } from 'pinia'
import { ref } from 'vue'

// 基本信息
export interface BasicInfo {
  name: string
  phone: string
  email: string
  location: string
  website: string
  jobTarget: string
  expectedSalaryMin: string
  expectedSalaryMax: string
  workStatus: string
  targetLocation: string
  avatar?: string
}

// 专业技能
export interface Skills {
  technical: string[]
  certificates: string[]
  languages: string[]
  hobbies: string[]
  activities: string[]
}

// 工作经历
export interface WorkExperience {
  id: string
  company: string
  position: string
  department: string
  location: string
  startDate: string
  endDate: string
  description: string
}

// 项目经历
export interface ProjectExperience {
  id: string
  name: string
  role: string
  department: string
  location: string
  startDate: string
  endDate: string
  description: string
}

// 教育经历
export interface Education {
  id: string
  school: string
  major: string
  degree: string
  gpa?: string
  ranking?: string
  startDate: string
  endDate: string
  description: string
}

// 个人总结
export interface PersonalSummary {
  content: string
}

// 简历区块
export interface ResumeSection {
  id: string
  title: string
  type: 'basic' | 'skills' | 'work' | 'project' | 'education' | 'summary'
  expanded: boolean
  visible: boolean
  order: number
}

export interface ResumeData {
  filename: string
  lastModified: Date
  sections: ResumeSection[]
  basicInfo: BasicInfo
  skills: Skills
  workExperiences: WorkExperience[]
  projectExperiences: ProjectExperience[]
  educations: Education[]
  personalSummary: PersonalSummary
}

export const useResumeStore = defineStore('resume', () => {
  const resumeData = ref<ResumeData>({
    filename: '我的简历',
    lastModified: new Date(),
    sections: [
      { id: 'basic', title: '基本信息', type: 'basic', expanded: true, visible: true, order: 1 },
      { id: 'skills', title: '专业技能', type: 'skills', expanded: true, visible: true, order: 2 },
      { id: 'work', title: '工作经历', type: 'work', expanded: true, visible: true, order: 3 },
      { id: 'project', title: '项目经历', type: 'project', expanded: true, visible: true, order: 4 },
      { id: 'education', title: '教育经历', type: 'education', expanded: true, visible: true, order: 5 },
      { id: 'summary', title: '个人总结', type: 'summary', expanded: true, visible: true, order: 6 },
    ],
    basicInfo: {
      name: '莫洪恩',
      phone: '18181612986',
      email: '496585582@qq.com',
      location: '成都',
      website: 'https://github.com/Lisheri',
      jobTarget: '前端开发工程师',
      expectedSalaryMin: '',
      expectedSalaryMax: '',
      workStatus: '在职',
      targetLocation: '请填写意向城市'
    },
    skills: {
      technical: ['Vue(熟练使用Vue2、3，了解其底层原理)、javascript(熟练使用)、typescript(熟练使用)、HTML5+CSS3(熟练使用)、node.js (7年)、react(7年)、react-native(7年)、uniapp(7年)、qiankun(7年)、vueief(7年)'],
      certificates: [],
      languages: [],
      hobbies: [],
      activities: []
    },
    workExperiences: [
      {
        id: '1',
        company: '北京值得买科技股份有限公司',
        position: '前端开发工程师',
        department: '大前端研发部',
        location: '成都',
        startDate: '2023-09',
        endDate: '至今',
        description: '1. 负责达摩可视化平台(pnpm monorepo + vue3架)架构设计、调研、开发、维护以及优化，包含管理后台、编辑器、渲染器、业务组件包、hooks包以及nestjs中间层。\n2. 负责前端工具平台(以vue3+wujie为基座的微前端应用，共计接入7个微应用)架构设计、开发以及微应用接入。\n3.负责迷途低代码平台服务端(nestjs+mysql)开发及维护。\n4.负责阿拉丁(vue2+fabricjs)图片生成工具开发及维护。\n5.负责商品库后台管理系统(vue3)开发及优化'
      },
      {
        id: '2',
        company: '深圳小鹅网络技术有限公司',
        position: '前端开发工程师',
        department: '多产品中心',
        location: '深圳',
        startDate: '2021-07',
        endDate: '2023-07',
        description: '负责小鹅通直播间以及小程序(uniapp+vue3+vueuse)产品迭代，功能迭代主要集中在代目及优化小程序商品及页面直播间等登录优化、3.负责小直播管理后台(vue2)开发，并维护以及功能迭代。'
      }
    ],
    projectExperiences: [
      {
        id: '1',
        name: 'damo可视化平台',
        role: '前端开发工程师',
        department: '选填',
        location: '成都',
        startDate: '2023-10',
        endDate: '至今',
        description: '该平台整体上是一个基于 pnpm workspace + turborepo的 monorepo方案，主要技术栈是vue3+ts+wasm，主要包含管理后台，编辑器，H5渲染器，PC渲染器，多个组件库以及公用逻辑，主要目的是通过模板创建H5页面支持多个业务，通过拖拉拽域修改json的方式配置页面。\n我的主要贡献是：\n1.主导项目基础架构以及基础功能开发\n2.升级平台构建，从 Vite 3 升至 Vite7，引入 SWC替代Babel，升级rolldown，优化构建时间从150s左右到15s左右(单核服务器)。\n3. 封装基本校验组件，统一组件开发方式与校验入口，解决表单校验冲突、表单校验入口混乱等问题。\n4.优化组件直接依赖管理系统，优化依赖分析算法及效果，引入rust wasm性能提升80%。\n5. 封装前端基础设施优化开发一体化，并提高效优化添加出cli填载等(实测V400k主包Bios FMP保持0.6~0.8s，Android8左右，所有分包步优化，实用缓存注入人，核下载缓存)'
      }
    ],
    educations: [
      {
        id: '1',
        school: '成都理工大学',
        major: '数字媒体技术',
        degree: '本科',
        gpa: '',
        ranking: '',
        startDate: '2016-09',
        endDate: '2020-06',
        description: '可以列出成绩、荣誉奖项、相关课程等'
      }
    ],
    personalSummary: {
      content: '• 喜欢研究前端新技术，新思想，喜欢研究前端工程化和自动化。\n• 有代码洁癖，对空行和空格都很注意。追求注释的准确性。\n• 对工作项目积极负责，对于上级的安排严格服从。\n• 善于与人沟通交流，喜欢交流新知识，喜欢学习他人优点，也喜欢分享自己积累知识。\n• 对于自己手下上线的项目会有成就感。'
    }
  })

  // 更新文件名
  const updateFilename = (filename: string) => {
    resumeData.value.filename = filename
    resumeData.value.lastModified = new Date()
  }

  // 更新基本信息
  const updateBasicInfo = (info: Partial<BasicInfo>) => {
    Object.assign(resumeData.value.basicInfo, info)
    resumeData.value.lastModified = new Date()
  }

  // 更新技能
  const updateSkills = (skills: Partial<Skills>) => {
    Object.assign(resumeData.value.skills, skills)
    resumeData.value.lastModified = new Date()
  }

  // 添加工作经历
  const addWorkExperience = () => {
    const newWork: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      department: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    }
    resumeData.value.workExperiences.push(newWork)
    resumeData.value.lastModified = new Date()
    return newWork.id
  }

  // 更新工作经历
  const updateWorkExperience = (id: string, work: Partial<WorkExperience>) => {
    const index = resumeData.value.workExperiences.findIndex(w => w.id === id)
    if (index > -1) {
      Object.assign(resumeData.value.workExperiences[index], work)
      resumeData.value.lastModified = new Date()
    }
  }

  // 删除工作经历
  const deleteWorkExperience = (id: string) => {
    const index = resumeData.value.workExperiences.findIndex(w => w.id === id)
    if (index > -1) {
      resumeData.value.workExperiences.splice(index, 1)
      resumeData.value.lastModified = new Date()
    }
  }

  // 添加项目经历
  const addProjectExperience = () => {
    const newProject: ProjectExperience = {
      id: Date.now().toString(),
      name: '',
      role: '',
      department: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    }
    resumeData.value.projectExperiences.push(newProject)
    resumeData.value.lastModified = new Date()
    return newProject.id
  }

  // 更新项目经历
  const updateProjectExperience = (id: string, project: Partial<ProjectExperience>) => {
    const index = resumeData.value.projectExperiences.findIndex(p => p.id === id)
    if (index > -1) {
      Object.assign(resumeData.value.projectExperiences[index], project)
      resumeData.value.lastModified = new Date()
    }
  }

  // 删除项目经历
  const deleteProjectExperience = (id: string) => {
    const index = resumeData.value.projectExperiences.findIndex(p => p.id === id)
    if (index > -1) {
      resumeData.value.projectExperiences.splice(index, 1)
      resumeData.value.lastModified = new Date()
    }
  }

  // 添加教育经历
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      school: '',
      major: '',
      degree: '',
      gpa: '',
      ranking: '',
      startDate: '',
      endDate: '',
      description: ''
    }
    resumeData.value.educations.push(newEducation)
    resumeData.value.lastModified = new Date()
    return newEducation.id
  }

  // 更新教育经历
  const updateEducation = (id: string, education: Partial<Education>) => {
    const index = resumeData.value.educations.findIndex(e => e.id === id)
    if (index > -1) {
      Object.assign(resumeData.value.educations[index], education)
      resumeData.value.lastModified = new Date()
    }
  }

  // 删除教育经历
  const deleteEducation = (id: string) => {
    const index = resumeData.value.educations.findIndex(e => e.id === id)
    if (index > -1) {
      resumeData.value.educations.splice(index, 1)
      resumeData.value.lastModified = new Date()
    }
  }

  // 更新个人总结
  const updatePersonalSummary = (content: string) => {
    resumeData.value.personalSummary.content = content
    resumeData.value.lastModified = new Date()
  }

  // 切换区块展开状态
  const toggleSectionExpanded = (sectionId: string) => {
    const section = resumeData.value.sections.find(s => s.id === sectionId)
    console.log(section)
    if (section) {
      section.expanded = !section.expanded
    }
  }

  // 更新区块顺序
  const updateSectionsOrder = (sections: ResumeSection[]) => {
    resumeData.value.sections = sections.map((section, index) => ({
      ...section,
      order: index + 1
    }))
    resumeData.value.lastModified = new Date()
  }

  return {
    resumeData,
    updateFilename,
    updateBasicInfo,
    updateSkills,
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    addProjectExperience,
    updateProjectExperience,
    deleteProjectExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    updatePersonalSummary,
    toggleSectionExpanded,
    updateSectionsOrder
  }
}) 