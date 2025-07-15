import { useResumeStore } from '../../stores/resume'

export default function EducationPreview() {
  const resumeStore = useResumeStore()
  const { educations, sections } = resumeStore.resumeData
  
  const educationSection = sections.find(s => s.type === 'education')
  const shouldShow = educationSection?.expanded && educations.length > 0

  if (!shouldShow) return null

  return (
    <div class="preview-section">
      <h2>教育经历</h2>
      {educations.map((education) => (
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
  )
} 