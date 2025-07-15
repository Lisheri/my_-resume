import { ElInput, ElButton, ElRow, ElCol, ElSelect, ElOption } from 'element-plus'
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
        <ElCol span={8}>
          <div class="form-item">
            <label>期望薪资（最低）</label>
            <ElSelect
              modelValue={basicInfo.expectedSalaryMin}
              onChange={(value: string) => updateBasicInfo('expectedSalaryMin', value)}
              placeholder="请选择最低薪资"
            >
              <ElOption label="3K以下" value="3K以下" />
              <ElOption label="3-5K" value="3-5K" />
              <ElOption label="5-10K" value="5-10K" />
              <ElOption label="10-15K" value="10-15K" />
              <ElOption label="15-25K" value="15-25K" />
              <ElOption label="25-40K" value="25-40K" />
              <ElOption label="40K以上" value="40K以上" />
            </ElSelect>
          </div>
        </ElCol>
        <ElCol span={8}>
          <div class="form-item">
            <label>期望薪资（最高）</label>
            <ElSelect
              modelValue={basicInfo.expectedSalaryMax}
              onChange={(value: string) => updateBasicInfo('expectedSalaryMax', value)}
              placeholder="请选择最高薪资"
            >
              <ElOption label="3K以下" value="3K以下" />
              <ElOption label="3-5K" value="3-5K" />
              <ElOption label="5-10K" value="5-10K" />
              <ElOption label="10-15K" value="10-15K" />
              <ElOption label="15-25K" value="15-25K" />
              <ElOption label="25-40K" value="25-40K" />
              <ElOption label="40K以上" value="40K以上" />
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