import { useResumeStore } from '../../stores/resume'

export default function BasicInfoPreview() {
  const resumeStore = useResumeStore()
  const { basicInfo } = resumeStore.resumeData

  return (
    <div class="preview-basic-info">
      <h1 class="name">{basicInfo.name || '姓名'}</h1>
      <div class="contact-info">
        <span>{basicInfo.phone}</span>
        <span>{basicInfo.email}</span>
        <span>{basicInfo.location}</span>
      </div>
      {basicInfo.jobTarget && (
        <div class="job-intention">
          求职意向：{basicInfo.jobTarget}
        </div>
      )}
    </div>
  )
} 