import { ElInput, ElButton, ElMessage } from 'element-plus';
import { useResumeStore } from '../stores/resume';
import { ref, onMounted } from 'vue';
import { exportHighQualityPDF } from '../utils/exportPdf';
import { applyFontToPreview, initDefaultFont } from '../utils/fontLoader';
import { getSelectedFont } from '../utils/fontManager';

// 导入各个区块组件
import SectionContainer from '../components/EditorSection/SectionContainer';
import BasicInfoSection from '../components/EditorSection/BasicInfoSection';
import SkillsSection from '../components/EditorSection/SkillsSection';
import WorkExperienceSection from '../components/EditorSection/WorkExperienceSection';
import ProjectExperienceSection from '../components/EditorSection/ProjectExperienceSection';
import EducationSection from '../components/EditorSection/EducationSection';
import PersonalSummarySection from '../components/EditorSection/PersonalSummarySection';
import ResumePreview from '../components/PreviewSection/ResumePreview';
import FontSelector from '../components/FontSelector.vue';

import './ResumeEditor.css';

export default function ResumeEditor() {
  const resumeStore = useResumeStore();
  const isEditingFilename = ref(false);
  const tempFilename = ref(resumeStore.resumeData.filename);
  const currentFont = ref<string>('');

  const toggleSection = (sectionId: string) => {
    resumeStore.toggleSectionExpanded(sectionId);
  };

  const startEditFilename = () => {
    isEditingFilename.value = true;
    tempFilename.value = resumeStore.resumeData.filename;
  };

  const saveFilename = () => {
    if (tempFilename.value.trim()) {
      resumeStore.updateFilename(tempFilename.value.trim());
    }
    isEditingFilename.value = false;
  };

  const cancelEditFilename = () => {
    isEditingFilename.value = false;
    tempFilename.value = resumeStore.resumeData.filename;
  };

  const handleFontChange = async (fontConfig: any) => {
    if (fontConfig) {
      currentFont.value = fontConfig.displayName;
      // 应用字体到预览区域
      await applyFontToPreview(fontConfig.name);
    }
  };

  // 初始化字体
  onMounted(async () => {
    // 加载保存的字体设置
    const selectedFont = getSelectedFont();
    if (selectedFont) {
      await applyFontToPreview(selectedFont);
    } else {
      // 如果没有保存的字体，加载默认字体
      await initDefaultFont();
    }
  });

  const handleKeydown = (evt: Event | KeyboardEvent) => {
    const e = evt as KeyboardEvent;
    if (e.key === 'Enter') {
      saveFilename();
    } else if (e.key === 'Escape') {
      cancelEditFilename();
    }
  };

  const exportToPDFDirect = async () => {
    let loadingMessage: any = null
    
    try {
      // 显示加载提示
      loadingMessage = ElMessage({
        message: '正在生成PDF，请稍候...',
        type: 'info',
        duration: 0
      })

      // 导出PDF
      await exportHighQualityPDF(resumeStore.resumeData)
      
      // 成功后关闭加载提示并显示成功消息
      loadingMessage.close()
      ElMessage.success('PDF导出成功！')
      
    } catch (error: any) {
      // 失败时关闭加载提示并显示错误消息
      if (loadingMessage) {
        loadingMessage.close()
      }
      
      console.error('PDF导出失败:', error)
      ElMessage.error(`PDF导出失败: ${error?.message || '未知错误'}`)
    }
  }

  const renderSectionComponent = (sectionType: string) => {
    const componentMap = {
      basic: () => <BasicInfoSection />,
      skills: () => <SkillsSection />,
      work: () => <WorkExperienceSection />,
      project: () => <ProjectExperienceSection />,
      education: () => <EducationSection />,
      summary: () => <PersonalSummarySection />,
    };

    const Component = componentMap[sectionType as keyof typeof componentMap];
    return Component ? Component() : null;
  };

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
                  <span class="filename">
                    {resumeStore.resumeData.filename}
                  </span>
                  <span class="edit-hint">点击编辑</span>
                </div>
              ) : (
                <div class="filename-edit">
                  <ElInput
                    modelValue={tempFilename.value}
                    onInput={(value: string) => (tempFilename.value = value)}
                    onKeydown={handleKeydown}
                    onBlur={saveFilename}
                    autofocus
                    size="small"
                  />
                </div>
              )}
            </div>
            <div class="header-controls">
              {/* 字体选择器 */}
              <div class="font-selector-inline">
                <span class="font-label">字体:</span>
                <FontSelector onFontChange={handleFontChange} />
              </div>

              <div class="export-buttons">
                <ElButton type="primary" onClick={exportToPDFDirect}>
                  导出PDF
                </ElButton>
              </div>
            </div>
          </div>

          <div class="preview-container">
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  );
}
