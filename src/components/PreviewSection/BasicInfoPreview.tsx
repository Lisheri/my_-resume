import { useResumeStore } from '../../stores/resume';

export default function BasicInfoPreview() {
  const resumeStore = useResumeStore();
  const { basicInfo } = resumeStore.resumeData;

  return (
    <div class="preview-basic-info">
      <h1 class="name">{basicInfo.name || '姓名'}</h1>

      <div class="contact-info">
        {basicInfo.phone && (
          <span class="contact-item">
            <i class="iconfont icon-gengduobeifen25"></i>
            <span>{basicInfo.phone}</span>
          </span>
        )}
        {basicInfo.email && (
          <span class="contact-item">
            <i class="iconfont icon-youjian1"></i>
            <span>{basicInfo.email}</span>
          </span>
        )}
        {basicInfo.location && (
          <span class="contact-item">
            <i class="iconfont icon-weizhi"></i>
            <span>{basicInfo.location}</span>
          </span>
        )}
      </div>

      {basicInfo.website && (
        <div class="website-info">
          <i class="iconfont icon-out_link"></i>
          <span>{basicInfo.website}</span>
        </div>
      )}

      <div class="status-info">
        {basicInfo.workStatus && (
          <span class="work-status">
            <i class="iconfont icon-tysp_renshu"></i>
            <span>{basicInfo.workStatus}</span>
          </span>
        )}
        {basicInfo.jobTarget && (
          <span class="job-target">
            <i class="iconfont icon-jifen-kaoshirenwu"></i>
            <span>{basicInfo.jobTarget}</span>
          </span>
        )}
      </div>
    </div>
  );
}
