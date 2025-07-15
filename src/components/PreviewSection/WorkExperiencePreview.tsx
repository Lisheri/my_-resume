import { useResumeStore } from '../../stores/resume'

export default function WorkExperiencePreview() {
  const resumeStore = useResumeStore()
  const { workExperiences, sections } = resumeStore.resumeData
  
  const workSection = sections.find(s => s.type === 'work')
  const shouldShow = workSection?.expanded && workExperiences.length > 0

  if (!shouldShow) return null

  return (
    <div class="preview-section">
      <h2>工作经历</h2>
      {workExperiences.map((work) => (
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
  )
} 