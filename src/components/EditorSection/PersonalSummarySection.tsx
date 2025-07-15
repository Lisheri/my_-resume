import { ElInput } from 'element-plus'
import { useResumeStore } from '../../stores/resume'
import './SectionCommon.css'

export default function PersonalSummarySection() {
  const resumeStore = useResumeStore()
  const personalSummary = resumeStore.resumeData.personalSummary

  const updatePersonalSummary = (content: string) => {
    resumeStore.updatePersonalSummary(content)
  }

  return (
    <div class="section-content">
      <div class="form-item">
        <label>个人总结</label>
        <ElInput
          type="textarea"
          modelValue={personalSummary.content}
          onInput={(value: string) => updatePersonalSummary(value)}
          placeholder="请简要介绍您的个人特色、优势和职业目标..."
          rows={6}
        />
      </div>
    </div>
  )
} 