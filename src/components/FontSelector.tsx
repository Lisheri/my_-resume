import { defineComponent, ref, onMounted } from 'vue'
import { ElSelect, ElOption } from 'element-plus'
import { 
  getAvailableFonts, 
  getSelectedFont, 
  saveSelectedFont,
  type FontConfig 
} from '../utils/fontManager'

export default defineComponent({
  name: 'FontSelector',
  emits: ['fontChange'],
  setup(_, { emit }) {
    const availableFonts = ref<FontConfig[]>([])
    const selectedFont = ref<string>('')
    const loading = ref(false)

    // 加载可用字体列表
    const loadAvailableFonts = async () => {
      try {
        loading.value = true
        const fonts = await getAvailableFonts()
        availableFonts.value = fonts
        
        if (fonts.length > 0) {
          console.log(`找到 ${fonts.length} 个可用字体`)
        }
      } catch (err) {
        console.error('加载字体列表失败:', err)
      } finally {
        loading.value = false
      }
    }

    // 字体切换处理
    const handleFontChange = (fontName: string) => {
      saveSelectedFont(fontName)
      selectedFont.value = fontName
      
      const selectedFontConfig = availableFonts.value.find(f => f.name === fontName)
      
      // 发射字体变更事件
      emit('fontChange', selectedFontConfig)
    }

    onMounted(() => {
      selectedFont.value = getSelectedFont()
      loadAvailableFonts()
    })

    return () => (
      <ElSelect
        v-model={selectedFont.value}
        placeholder="选择字体"
        style={{ width: '180px' }}
        size="small"
        loading={loading.value}
        onChange={handleFontChange}
        disabled={availableFonts.value.length === 0}
      >
        {availableFonts.value.map(font => (
          <ElOption
            key={font.name}
            label={font.displayName}
            value={font.name}
          />
        ))}
      </ElSelect>
    )
  }
}) 