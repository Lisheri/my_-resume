import { ElInput, ElButton, ElRow, ElCol } from 'element-plus'
import { useResumeStore } from '../../stores/resume'
import './SectionCommon.css'

export default function WorkExperienceSection() {
  const resumeStore = useResumeStore()
  const workExperiences = resumeStore.resumeData.workExperiences

  const addWorkExperience = () => {
    resumeStore.addWorkExperience()
  }

  const updateWorkExperience = (id: string, field: string, value: string) => {
    resumeStore.updateWorkExperience(id, { [field]: value })
  }

  const removeWorkExperience = (id: string) => {
    resumeStore.deleteWorkExperience(id)
  }

  return (
    <div class="section-content">
      {workExperiences.map((work, index) => (
        <div key={work.id} class="experience-item">
          <div class="experience-header">
            <h4>工作经历 {index + 1}</h4>
            <ElButton
              type="danger"
              size="small"
              onClick={() => removeWorkExperience(work.id)}
            >
              删除
            </ElButton>
          </div>
          
          <ElRow gutter={20} class="form-row">
            <ElCol span={12}>
              <div class="form-item">
                <label>公司名称</label>
                <ElInput
                  modelValue={work.company}
                  onInput={(value: string) => updateWorkExperience(work.id, 'company', value)}
                  placeholder="请输入公司名称"
                />
              </div>
            </ElCol>
            <ElCol span={12}>
              <div class="form-item">
                <label>职位</label>
                <ElInput
                  modelValue={work.position}
                  onInput={(value: string) => updateWorkExperience(work.id, 'position', value)}
                  placeholder="请输入职位"
                />
              </div>
            </ElCol>
          </ElRow>

          <ElRow gutter={20} class="form-row">
            <ElCol span={8}>
              <div class="form-item">
                <label>部门</label>
                <ElInput
                  modelValue={work.department}
                  onInput={(value: string) => updateWorkExperience(work.id, 'department', value)}
                  placeholder="请输入部门"
                />
              </div>
            </ElCol>
            <ElCol span={8}>
              <div class="form-item">
                <label>工作地点</label>
                <ElInput
                  modelValue={work.location}
                  onInput={(value: string) => updateWorkExperience(work.id, 'location', value)}
                  placeholder="请输入工作地点"
                />
              </div>
            </ElCol>
            <ElCol span={8}>
              <div class="form-item">
                <label>开始时间</label>
                <ElInput
                  modelValue={work.startDate}
                  onInput={(value: string) => updateWorkExperience(work.id, 'startDate', value)}
                  placeholder="如：2020-01"
                />
              </div>
            </ElCol>
          </ElRow>

          <ElRow gutter={20} class="form-row">
            <ElCol span={12}>
              <div class="form-item">
                <label>结束时间</label>
                <ElInput
                  modelValue={work.endDate}
                  onInput={(value: string) => updateWorkExperience(work.id, 'endDate', value)}
                  placeholder="如：2023-05 或 至今"
                />
              </div>
            </ElCol>
          </ElRow>

          <div class="form-item">
            <label>工作描述</label>
            <ElInput
              type="textarea"
              modelValue={work.description}
              onInput={(value: string) => updateWorkExperience(work.id, 'description', value)}
              placeholder="请详细描述您的工作内容、职责和成果..."
              rows={4}
            />
          </div>
        </div>
      ))}
      
      <div class="add-button-container">
        <ElButton type="primary" onClick={addWorkExperience}>
          添加工作经历
        </ElButton>
      </div>
    </div>
  )
} 