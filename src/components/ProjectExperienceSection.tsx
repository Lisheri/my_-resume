import { ElInput, ElButton, ElRow, ElCol } from 'element-plus'
import { useResumeStore } from '../stores/resume'
import '../components/SectionCommon.css'

export default function ProjectExperienceSection() {
  const resumeStore = useResumeStore()
  const projectExperiences = resumeStore.resumeData.projectExperiences

  const addProjectExperience = () => {
    resumeStore.addProjectExperience()
  }

  const updateProjectExperience = (id: string, field: string, value: string) => {
    resumeStore.updateProjectExperience(id, { [field]: value })
  }

  const removeProjectExperience = (id: string) => {
    resumeStore.deleteProjectExperience(id)
  }

  return (
    <div class="section-content">
      {projectExperiences.map((project, index) => (
        <div key={project.id} class="experience-item">
          <div class="experience-header">
            <h4>项目经历 {index + 1}</h4>
            <ElButton
              type="danger"
              size="small"
              onClick={() => removeProjectExperience(project.id)}
            >
              删除
            </ElButton>
          </div>
          
          <ElRow gutter={20} class="form-row">
            <ElCol span={12}>
              <div class="form-item">
                <label>项目名称</label>
                <ElInput
                  modelValue={project.name}
                  onInput={(value: string) => updateProjectExperience(project.id, 'name', value)}
                  placeholder="请输入项目名称"
                />
              </div>
            </ElCol>
            <ElCol span={12}>
              <div class="form-item">
                <label>项目角色</label>
                <ElInput
                  modelValue={project.role}
                  onInput={(value: string) => updateProjectExperience(project.id, 'role', value)}
                  placeholder="请输入项目中的角色"
                />
              </div>
            </ElCol>
          </ElRow>

          <ElRow gutter={20} class="form-row">
            <ElCol span={8}>
              <div class="form-item">
                <label>部门</label>
                <ElInput
                  modelValue={project.department}
                  onInput={(value: string) => updateProjectExperience(project.id, 'department', value)}
                  placeholder="请输入部门"
                />
              </div>
            </ElCol>
            <ElCol span={8}>
              <div class="form-item">
                <label>项目地点</label>
                <ElInput
                  modelValue={project.location}
                  onInput={(value: string) => updateProjectExperience(project.id, 'location', value)}
                  placeholder="请输入项目地点"
                />
              </div>
            </ElCol>
            <ElCol span={8}>
              <div class="form-item">
                <label>开始时间</label>
                <ElInput
                  modelValue={project.startDate}
                  onInput={(value: string) => updateProjectExperience(project.id, 'startDate', value)}
                  placeholder="如：2023-01"
                />
              </div>
            </ElCol>
          </ElRow>

          <ElRow gutter={20} class="form-row">
            <ElCol span={12}>
              <div class="form-item">
                <label>结束时间</label>
                <ElInput
                  modelValue={project.endDate}
                  onInput={(value: string) => updateProjectExperience(project.id, 'endDate', value)}
                  placeholder="如：2023-06 或 至今"
                />
              </div>
            </ElCol>
          </ElRow>

          <div class="form-item">
            <label>项目描述</label>
            <ElInput
              type="textarea"
              modelValue={project.description}
              onInput={(value: string) => updateProjectExperience(project.id, 'description', value)}
              placeholder="请详细描述项目背景、您的贡献和成果..."
              rows={4}
            />
          </div>
        </div>
      ))}
      
      <div class="add-button-container">
        <ElButton type="primary" onClick={addProjectExperience}>
          添加项目经历
        </ElButton>
      </div>
    </div>
  )
} 