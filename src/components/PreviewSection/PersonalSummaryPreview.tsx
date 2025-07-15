import { useResumeStore } from '../../stores/resume'

export default function PersonalSummaryPreview() {
  const resumeStore = useResumeStore()
  const { personalSummary, sections } = resumeStore.resumeData
  
  const summarySection = sections.find(s => s.type === 'summary')
  const shouldShow = summarySection?.expanded && personalSummary.content

  if (!shouldShow) return null

  return (
    <div class="preview-section">
      <h2>个人总结</h2>
      <div class="summary-content">{personalSummary.content}</div>
    </div>
  )
} 