import { ElInput, ElButton, ElMessage } from 'element-plus'
import { useResumeStore } from '../stores/resume'
import { ref } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// 导入各个区块组件
import SectionContainer from '../components/SectionContainer'
import BasicInfoSection from '../components/BasicInfoSection'
import SkillsSection from '../components/SkillsSection'
import WorkExperienceSection from '../components/WorkExperienceSection'
import ProjectExperienceSection from '../components/ProjectExperienceSection'
import EducationSection from '../components/EducationSection'
import PersonalSummarySection from '../components/PersonalSummarySection'

import './ResumeEditor.css'

export default function ResumeEditor() {
  const resumeStore = useResumeStore()
  const isEditingFilename = ref(false)
  const tempFilename = ref(resumeStore.resumeData.filename)

  const toggleSection = (sectionId: string) => {
    resumeStore.toggleSectionExpanded(sectionId)
  }

  const startEditFilename = () => {
    isEditingFilename.value = true
    tempFilename.value = resumeStore.resumeData.filename
  }

  const saveFilename = () => {
    if (tempFilename.value.trim()) {
      resumeStore.updateFilename(tempFilename.value.trim())
    }
    isEditingFilename.value = false
  }

  const cancelEditFilename = () => {
    isEditingFilename.value = false
    tempFilename.value = resumeStore.resumeData.filename
  }

  const handleKeydown = (evt: Event | KeyboardEvent) => {
    const e = evt as KeyboardEvent
    if (e.key === 'Enter') {
      saveFilename()
    } else if (e.key === 'Escape') {
      cancelEditFilename()
    }
  }

  const exportToPDF = async () => {
    try {
      const previewElement = document.querySelector('.preview-content') as HTMLElement
      if (!previewElement) {
        ElMessage.error('预览内容未找到')
        return
      }

      // 使用 html2canvas 将 HTML 转换为 canvas
      const canvas = await html2canvas(previewElement, {
        scale: 2, // 提高清晰度
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      // 创建 PDF 文档
      const imgWidth = 210 // A4 纸宽度 (mm)
      const pageHeight = 295 // A4 纸高度 (mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      const pdf = new jsPDF('p', 'mm', 'a4')
      let position = 0

      // 添加图片到 PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // 如果内容超过一页，添加新页
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // 下载 PDF
      pdf.save(`${resumeStore.resumeData.filename}.pdf`)
      ElMessage.success('PDF 导出成功')
    } catch (error) {
      console.error('PDF 导出失败:', error)
      ElMessage.error('PDF 导出失败，请重试')
    }
  }

  const renderSectionComponent = (sectionType: string) => {
    const componentMap = {
      basic: () => <BasicInfoSection />,
      skills: () => <SkillsSection />,
      work: () => <WorkExperienceSection />,
      project: () => <ProjectExperienceSection />,
      education: () => <EducationSection />,
      summary: () => <PersonalSummarySection />
    }
    
    const Component = componentMap[sectionType as keyof typeof componentMap]
    return Component ? Component() : null
  }

  return (
    <div class="resume-editor">
      <div class="editor-container">
        <div class="left-panel">
          <div class="panel-header">
            <h2>简历编辑</h2>
          </div>
          
          <div class="sections-container">
            {resumeStore.resumeData.sections.map((section) => (
              <SectionContainer
                key={section.id}
                section={section}
                onCardClick={() => toggleSection(section.id)}
              >
                {renderSectionComponent(section.type)}
              </SectionContainer>
            ))}
          </div>
        </div>

        <div class="right-panel">
          <div class="panel-header">
            <div class="filename-area">
              {!isEditingFilename.value ? (
                <div class="filename-display" onClick={startEditFilename}>
                  <span class="filename">{resumeStore.resumeData.filename}</span>
                  <span class="edit-hint">点击编辑</span>
                </div>
              ) : (
                <div class="filename-edit">
                  <ElInput
                    modelValue={tempFilename.value}
                    onInput={(value: string) => tempFilename.value = value}
                    onKeydown={handleKeydown}
                    onBlur={saveFilename}
                    autofocus
                    size="small"
                  />
                </div>
              )}
            </div>
            <ElButton type="primary" onClick={exportToPDF}>
              导出PDF
            </ElButton>
          </div>
          
          <div class="preview-container">
            <div class="preview-content">
              {/* 基本信息预览 */}
              <div class="preview-basic-info">
                <h1 class="name">{resumeStore.resumeData.basicInfo.name || '姓名'}</h1>
                <div class="contact-info">
                  <span>{resumeStore.resumeData.basicInfo.phone}</span>
                  <span>{resumeStore.resumeData.basicInfo.email}</span>
                  <span>{resumeStore.resumeData.basicInfo.location}</span>
                </div>
                {resumeStore.resumeData.basicInfo.jobTarget && (
                  <div class="job-intention">
                    求职意向：{resumeStore.resumeData.basicInfo.jobTarget}
                  </div>
                )}
              </div>

              {/* 专业技能预览 */}
              {resumeStore.resumeData.sections.find(s => s.type === 'skills')?.expanded && 
               resumeStore.resumeData.skills.technical.length > 0 && (
                <div class="preview-section">
                  <h2>专业技能</h2>
                  <div class="skills-content">
                    {resumeStore.resumeData.skills.technical.map((skill, index) => (
                      <p key={index}>{skill}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* 工作经历预览 */}
              {resumeStore.resumeData.sections.find(s => s.type === 'work')?.expanded && 
               resumeStore.resumeData.workExperiences.length > 0 && (
                <div class="preview-section">
                  <h2>工作经历</h2>
                  {resumeStore.resumeData.workExperiences.map((work) => (
                    <div key={work.id} class="experience-item-preview">
                      <div class="experience-header-preview">
                        <h3>{work.company}</h3>
                        <span class="duration">{work.startDate} - {work.endDate}</span>
                      </div>
                      <div class="position-info">
                        <span class="position">{work.position}</span>
                        {work.department && <span class="department"> | {work.department}</span>}
                        {work.location && <span class="location"> | {work.location}</span>}
                      </div>
                      {work.description && (
                        <div class="description">{work.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 项目经历预览 */}
              {resumeStore.resumeData.sections.find(s => s.type === 'project')?.expanded && 
               resumeStore.resumeData.projectExperiences.length > 0 && (
                <div class="preview-section">
                  <h2>项目经历</h2>
                  {resumeStore.resumeData.projectExperiences.map((project) => (
                    <div key={project.id} class="experience-item-preview">
                      <div class="experience-header-preview">
                        <h3>{project.name}</h3>
                        <span class="duration">{project.startDate} - {project.endDate}</span>
                      </div>
                      <div class="position-info">
                        <span class="position">{project.role}</span>
                        {project.department && <span class="department"> | {project.department}</span>}
                        {project.location && <span class="location"> | {project.location}</span>}
                      </div>
                      {project.description && (
                        <div class="description">{project.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 教育经历预览 */}
              {resumeStore.resumeData.sections.find(s => s.type === 'education')?.expanded && 
               resumeStore.resumeData.educations.length > 0 && (
                <div class="preview-section">
                  <h2>教育经历</h2>
                  {resumeStore.resumeData.educations.map((education) => (
                    <div key={education.id} class="experience-item-preview">
                      <div class="experience-header-preview">
                        <h3>{education.school}</h3>
                        <span class="duration">{education.startDate} - {education.endDate}</span>
                      </div>
                      <div class="position-info">
                        <span class="position">{education.major}</span>
                        <span class="degree"> | {education.degree}</span>
                        {education.gpa && <span class="gpa"> | GPA: {education.gpa}</span>}
                      </div>
                      {education.description && (
                        <div class="description">{education.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 个人总结预览 */}
              {resumeStore.resumeData.sections.find(s => s.type === 'summary')?.expanded && 
               resumeStore.resumeData.personalSummary.content && (
                <div class="preview-section">
                  <h2>个人总结</h2>
                  <div class="summary-content">{resumeStore.resumeData.personalSummary.content}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 