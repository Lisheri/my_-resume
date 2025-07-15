import { ElInput, ElButton, ElMessage } from 'element-plus'
import { useResumeStore } from '../stores/resume'
import { ref } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// 导入各个区块组件
import SectionContainer from '../components/EditorSection/SectionContainer'
import BasicInfoSection from '../components/EditorSection/BasicInfoSection'
import SkillsSection from '../components/EditorSection/SkillsSection'
import WorkExperienceSection from '../components/EditorSection/WorkExperienceSection'
import ProjectExperienceSection from '../components/EditorSection/ProjectExperienceSection'
import EducationSection from '../components/EditorSection/EducationSection'
import PersonalSummarySection from '../components/EditorSection/PersonalSummarySection'
import ResumePreview from '../components/PreviewSection/ResumePreview'

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
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  )
} 