import { useResumeStore } from '../../stores/resume'

export default function BasicInfoPreview() {
  const resumeStore = useResumeStore()
  const { basicInfo } = resumeStore.resumeData

  return (
    <div class="preview-basic-info">
      <h1 class="name">{basicInfo.name || '姓名'}</h1>
      
      <div class="contact-info">
        {basicInfo.phone && <span class="contact-item">📞 {basicInfo.phone}</span>}
        {basicInfo.email && <span class="contact-item">📧 {basicInfo.email}</span>}
        {basicInfo.location && <span class="contact-item">📍 {basicInfo.location}</span>}
      </div>
      
      {basicInfo.website && (
        <div class="website-info">
          🔗 {basicInfo.website}
        </div>
      )}
      
      <div class="status-info">
        {basicInfo.workStatus && <span class="work-status">👤 {basicInfo.workStatus}</span>}
        {basicInfo.jobTarget && <span class="job-target">🎯 {basicInfo.jobTarget}</span>}
      </div>
    </div>
  )
} 