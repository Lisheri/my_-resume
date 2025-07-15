import { useResumeStore } from '../../stores/resume'

export default function ProjectExperiencePreview() {
  const resumeStore = useResumeStore()
  const { projectExperiences, sections } = resumeStore.resumeData
  
  const projectSection = sections.find(s => s.type === 'project')
  const shouldShow = projectSection?.expanded && projectExperiences.length > 0

  if (!shouldShow) return null

  return (
    <div class="preview-section">
      <h2>项目经历</h2>
      {projectExperiences.map((project) => (
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
  )
} 