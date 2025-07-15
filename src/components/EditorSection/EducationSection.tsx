import { ElInput, ElButton, ElRow, ElCol, ElSelect, ElOption } from 'element-plus'
import { useResumeStore } from '../../stores/resume'
import './SectionCommon.css'

export default function EducationSection() {
  const resumeStore = useResumeStore()
  const educations = resumeStore.resumeData.educations

  const addEducation = () => {
    resumeStore.addEducation()
  }

  const updateEducation = (id: string, field: string, value: string) => {
    resumeStore.updateEducation(id, { [field]: value })
  }

  const removeEducation = (id: string) => {
    resumeStore.deleteEducation(id)
  }

  return (
    <div class="section-content">
      {educations.map((education, index) => (
        <div key={education.id} class="experience-item">
          <div class="experience-header">
            <h4>教育经历 {index + 1}</h4>
            <ElButton
              type="danger"
              size="small"
              onClick={() => removeEducation(education.id)}
            >
              删除
            </ElButton>
          </div>
          
          <ElRow gutter={20} class="form-row">
            <ElCol span={12}>
              <div class="form-item">
                <label>学校名称</label>
                <ElInput
                  modelValue={education.school}
                  onInput={(value: string) => updateEducation(education.id, 'school', value)}
                  placeholder="请输入学校名称"
                />
              </div>
            </ElCol>
            <ElCol span={12}>
              <div class="form-item">
                <label>专业</label>
                <ElInput
                  modelValue={education.major}
                  onInput={(value: string) => updateEducation(education.id, 'major', value)}
                  placeholder="请输入专业名称"
                />
              </div>
            </ElCol>
          </ElRow>

          <ElRow gutter={20} class="form-row">
            <ElCol span={8}>
              <div class="form-item">
                <label>学历</label>
                <ElSelect
                  modelValue={education.degree}
                  onChange={(value: string) => updateEducation(education.id, 'degree', value)}
                  placeholder="请选择学历"
                >
                  <ElOption label="高中" value="高中" />
                  <ElOption label="大专" value="大专" />
                  <ElOption label="本科" value="本科" />
                  <ElOption label="硕士" value="硕士" />
                  <ElOption label="博士" value="博士" />
                </ElSelect>
              </div>
            </ElCol>
            <ElCol span={8}>
              <div class="form-item">
                <label>开始时间</label>
                <ElInput
                  modelValue={education.startDate}
                  onInput={(value: string) => updateEducation(education.id, 'startDate', value)}
                  placeholder="如：2016-09"
                />
              </div>
            </ElCol>
            <ElCol span={8}>
              <div class="form-item">
                <label>结束时间</label>
                <ElInput
                  modelValue={education.endDate}
                  onInput={(value: string) => updateEducation(education.id, 'endDate', value)}
                  placeholder="如：2020-06"
                />
              </div>
            </ElCol>
          </ElRow>

          <ElRow gutter={20} class="form-row">
            <ElCol span={12}>
              <div class="form-item">
                <label>GPA/成绩</label>
                <ElInput
                  modelValue={education.gpa}
                  onInput={(value: string) => updateEducation(education.id, 'gpa', value)}
                  placeholder="如：3.8/4.0"
                />
              </div>
            </ElCol>
            <ElCol span={12}>
              <div class="form-item">
                <label>排名/等级</label>
                <ElInput
                  modelValue={education.ranking}
                  onInput={(value: string) => updateEducation(education.id, 'ranking', value)}
                  placeholder="如：专业前10%"
                />
              </div>
            </ElCol>
          </ElRow>

          <div class="form-item">
            <label>教育描述</label>
            <ElInput
              type="textarea"
              modelValue={education.description}
              onInput={(value: string) => updateEducation(education.id, 'description', value)}
              placeholder="请输入主要课程或在校期间的成就..."
              rows={3}
            />
          </div>
        </div>
      ))}
      
      <div class="add-button-container">
        <ElButton type="primary" onClick={addEducation}>
          添加教育经历
        </ElButton>
      </div>
    </div>
  )
} 