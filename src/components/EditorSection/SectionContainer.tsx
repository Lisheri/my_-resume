import { ElIcon } from 'element-plus'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import type { ResumeSection } from '../../stores/resume'
import './SectionContainer.css'

interface SectionContainerProps {
  section: ResumeSection
  onCardClick?: () => void
  children?: any
}

export default function SectionContainer(props: SectionContainerProps, { slots }: any) {
  return (
    <div class="section-container">
      <div class="section-header" onClick={props.onCardClick}>
        <div class="section-title-area">
          <span class="section-title">{props.section.title}</span>
          <ElIcon
            class={`expand-icon ${props.section.expanded ? 'expanded' : ''}`}
          >
            {props.section.expanded ? <ArrowUp /> : <ArrowDown />}
          </ElIcon>
        </div>
      </div>
      
      {props.section.expanded && (
        <div class="section-content">
          {slots.default?.()}
        </div>
      )}
    </div>
  )
} 