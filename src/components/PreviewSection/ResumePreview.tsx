import BasicInfoPreview from './BasicInfoPreview'
import SkillsPreview from './SkillsPreview'
import WorkExperiencePreview from './WorkExperiencePreview'
import ProjectExperiencePreview from './ProjectExperiencePreview'
import EducationPreview from './EducationPreview'
import PersonalSummaryPreview from './PersonalSummaryPreview'

export default function ResumePreview() {
  return (
    <div class="preview-content">
      <BasicInfoPreview />
      <SkillsPreview />
      <WorkExperiencePreview />
      <ProjectExperiencePreview />
      <EducationPreview />
      <PersonalSummaryPreview />
    </div>
  )
} 