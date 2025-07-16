import { defineComponent, ref } from 'vue'
import { ElInput, ElButton } from 'element-plus'
import { useResumeStore } from '../../stores/resume'
import './SectionCommon.css'

export default defineComponent({
  name: 'SkillsSection',
  setup() {
    const resumeStore = useResumeStore()
    const skills = resumeStore.resumeData.skills

    // 创建响应式输入框状态
    const technicalInput = ref('')
    const certificatesInput = ref('')
    const languagesInput = ref('')

    const updateSkills = (field: string, value: string[]) => {
      resumeStore.updateSkills({ [field]: value })
    }

    const addSkillTag = (type: 'technical' | 'certificates' | 'languages') => {
      let inputValue = ''
      let inputRef = null
      
      switch (type) {
        case 'technical':
          inputValue = technicalInput.value
          inputRef = technicalInput
          break
        case 'certificates':
          inputValue = certificatesInput.value
          inputRef = certificatesInput
          break
        case 'languages':
          inputValue = languagesInput.value
          inputRef = languagesInput
          break
      }

      if (inputValue.trim()) {
        const currentSkills = skills[type] || []
        const newSkills = [...currentSkills, inputValue.trim()]
        updateSkills(type, newSkills)
        inputRef!.value = ''
      }
    }

    const removeSkillTag = (type: 'technical' | 'certificates' | 'languages', tagToRemove: string) => {
      const currentSkills = skills[type] || []
      const newSkills = currentSkills.filter(skill => skill !== tagToRemove)
      updateSkills(type, newSkills)
    }

    const renderSkillTags = (type: 'technical' | 'certificates' | 'languages') => {
      const skillList = skills[type] || []
      if (skillList.length === 0) return null
      
      return (
        <div class="skill-tags">
          {skillList.map((skill: string, index: number) => (
            <span key={index} class="skill-tag">
              {skill}
              <span 
                class="tag-remove" 
                onClick={() => removeSkillTag(type, skill)}
              >
                ×
              </span>
            </span>
          ))}
        </div>
      )
    }

    return () => (
      <div class="section-content">
        <div class="form-item">
          <label>专业技能</label>
          <div class="skill-input-group">
            <ElInput
              v-model={technicalInput.value}
              placeholder="输入技能后按回车或点击添加"
              onKeydown={(e: any) => {
                if (e.key === 'Enter') {
                  addSkillTag('technical')
                }
              }}
            />
            <ElButton 
              type="primary" 
              onClick={() => addSkillTag('technical')}
            >
              添加
            </ElButton>
          </div>
          {renderSkillTags('technical')}
        </div>

        <div class="form-item">
          <label>证书/资质</label>
          <div class="skill-input-group">
            <ElInput
              v-model={certificatesInput.value}
              placeholder="输入证书后按回车或点击添加"
              onKeydown={(e: any) => {
                if (e.key === 'Enter') {
                  addSkillTag('certificates')
                }
              }}
            />
            <ElButton 
              type="primary" 
              onClick={() => addSkillTag('certificates')}
            >
              添加
            </ElButton>
          </div>
          {renderSkillTags('certificates')}
        </div>

        <div class="form-item">
          <label>语言能力</label>
          <div class="skill-input-group">
            <ElInput
              v-model={languagesInput.value}
              placeholder="输入语言能力后按回车或点击添加"
              onKeydown={(e: any) => {
                if (e.key === 'Enter') {
                  addSkillTag('languages')
                }
              }}
            />
            <ElButton 
              type="primary" 
              onClick={() => addSkillTag('languages')}
            >
              添加
            </ElButton>
          </div>
          {renderSkillTags('languages')}
        </div>
      </div>
    )
  }
}) 