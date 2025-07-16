import { defineComponent, ref, onMounted, watch } from 'vue'
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
          
          // 设置当前选中的字体
          const currentSelected = getSelectedFont()
          selectedFont.value = currentSelected
          
          // 如果当前选中的字体在可用字体列表中，发射变更事件
          const currentFontConfig = fonts.find(f => f.name === currentSelected)
          if (currentFontConfig) {
            emit('fontChange', currentFontConfig)
          }
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

    // 监听字体变化，确保选择器始终显示正确的字体
    watch(() => selectedFont.value, (newFont) => {
      console.log('当前选中字体:', newFont)
      const fontConfig = availableFonts.value.find(f => f.name === newFont)
      if (fontConfig) {
        console.log('当前字体显示名:', fontConfig.displayName)
      }
    })

    onMounted(() => {
      // 首先设置当前保存的字体
      selectedFont.value = getSelectedFont()
      console.log('初始化字体选择器，当前字体:', selectedFont.value)
      
      // 然后加载可用字体列表
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