import { useResumeStore } from '../../stores/resume'

export default function SkillsPreview() {
  const resumeStore = useResumeStore()
  const { skills, sections } = resumeStore.resumeData
  
  const skillsSection = sections.find(s => s.type === 'skills')
  const shouldShow = skillsSection?.expanded && skills.technical.length > 0

  if (!shouldShow) return null

  return (
    <div class="preview-section">
      <h2>专业技能</h2>
      <div class="skills-content">
        {skills.technical.map((skill, index) => (
          <p key={index}>{skill}</p>
        ))}
      </div>
    </div>
  )
} 