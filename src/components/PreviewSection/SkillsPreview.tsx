import { useResumeStore } from '../../stores/resume';

export default function SkillsPreview() {
  const resumeStore = useResumeStore();
  const { skills, sections } = resumeStore.resumeData;

  const skillsSection = sections.find((s) => s.type === 'skills');
  const hasAnySkills =
    skills.technical.length > 0 ||
    skills.certificates.length > 0 ||
    skills.languages.length > 0;
  const shouldShow = skillsSection?.expanded && hasAnySkills;

  if (!shouldShow) return null;

  return (
    <div class="preview-section">
      <h2>专业技能</h2>
      <div class="skills-content">
        {/* 专业技能 */}
        {skills.technical.length > 0 && (
          <div class="skill-category">
            <h3>技术技能</h3>
            {skills.technical.map((skill, index) => (
              <p key={index}>• {skill}</p>
            ))}
          </div>
        )}

        {/* 证书/资质 */}
        {skills.certificates.length > 0 && (
          <div class="skill-category">
            <h3>证书/资质</h3>
            {skills.certificates.map((cert, index) => (
              <p key={index}>• {cert}</p>
            ))}
          </div>
        )}

        {/* 语言能力 */}
        {skills.languages.length > 0 && (
          <div class="skill-category">
            <h3>语言能力</h3>
            {skills.languages.map((lang, index) => (
              <p key={index}>• {lang}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
