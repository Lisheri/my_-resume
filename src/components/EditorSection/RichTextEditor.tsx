import { defineComponent } from 'vue'
import { ElInput } from 'element-plus'

export default defineComponent({
  name: 'RichTextEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const handleInput = (value: string) => {
      emit('update:modelValue', value)
    }

    return () => (
      <div class="rich-text-editor">
        <ElInput
          type="textarea"
          modelValue={props.modelValue}
          onUpdate:modelValue={handleInput}
          placeholder={props.placeholder}
          rows={6}
          resize="vertical"
          class="form-textarea"
        />
      </div>
    )
  }
}) 