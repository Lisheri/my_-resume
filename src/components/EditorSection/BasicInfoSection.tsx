import { ElInput, ElRow, ElCol, ElSelect, ElOption } from 'element-plus'
import { useResumeStore } from '../../stores/resume'
import './SectionCommon.css'

export default function BasicInfoSection() {
  const resumeStore = useResumeStore()
  const basicInfo = resumeStore.resumeData.basicInfo

  const updateBasicInfo = (field: string, value: string) => {
    resumeStore.updateBasicInfo({ [field]: value })
  }

  return (
    <div class="section-content">
      <ElRow gutter={20} class="form-row">
        <ElCol span={8}>
          <div class="form-item">
            <label>姓名</label>
            <ElInput
              modelValue={basicInfo.name}
              onInput={(value: string) => updateBasicInfo('name', value)}
              placeholder="请输入姓名"
            />
          </div>
        </ElCol>
        <ElCol span={8}>
          <div class="form-item">
            <label>电话</label>
            <ElInput
              modelValue={basicInfo.phone}
              onInput={(value: string) => updateBasicInfo('phone', value)}
              placeholder="请输入电话号码"
            />
          </div>
        </ElCol>
        <ElCol span={8}>
          <div class="form-item">
            <label>邮箱</label>
            <ElInput
              modelValue={basicInfo.email}
              onInput={(value: string) => updateBasicInfo('email', value)}
              placeholder="请输入邮箱地址"
            />
          </div>
        </ElCol>
      </ElRow>

      <ElRow gutter={20} class="form-row">
        <ElCol span={12}>
          <div class="form-item">
            <label>地址</label>
            <ElInput
              modelValue={basicInfo.location}
              onInput={(value: string) => updateBasicInfo('location', value)}
              placeholder="请输入地址"
            />
          </div>
        </ElCol>
        <ElCol span={12}>
          <div class="form-item">
            <label>个人网站/博客</label>
            <ElInput
              modelValue={basicInfo.website}
              onInput={(value: string) => updateBasicInfo('website', value)}
              placeholder="请输入个人网站或博客地址"
            />
          </div>
        </ElCol>
      </ElRow>

      <ElRow gutter={20} class="form-row">
        <ElCol span={8}>
          <div class="form-item">
            <label>工作状态</label>
            <ElSelect
              modelValue={basicInfo.workStatus}
              onChange={(value: string) => updateBasicInfo('workStatus', value)}
              placeholder="请选择工作状态"
            >
              <ElOption label="在职" value="在职" />
              <ElOption label="离职" value="离职" />
              <ElOption label="在校" value="在校" />
            </ElSelect>
          </div>
        </ElCol>
      </ElRow>

      <ElRow gutter={20} class="form-row">
        <ElCol span={12}>
          <div class="form-item">
            <label>求职意向</label>
            <ElInput
              modelValue={basicInfo.jobTarget}
              onInput={(value: string) => updateBasicInfo('jobTarget', value)}
              placeholder="请输入求职意向"
            />
          </div>
        </ElCol>
        <ElCol span={12}>
          <div class="form-item">
            <label>意向城市</label>
            <ElInput
              modelValue={basicInfo.targetLocation}
              onInput={(value: string) => updateBasicInfo('targetLocation', value)}
              placeholder="请输入意向城市"
            />
          </div>
        </ElCol>
      </ElRow>
    </div>
  )
} 