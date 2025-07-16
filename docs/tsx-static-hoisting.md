# TSX 静态提升优化指南

## 🚀 什么是静态提升（Static Hoisting）

静态提升是Vue 3编译器的一项重要优化技术，它能够：

1. **减少内存分配**：将不变的元素提升到渲染函数外部，避免重复创建
2. **提升渲染性能**：静态元素不参与响应式更新，减少diff开销
3. **优化包体积**：重复的静态内容可以被复用

## 🔧 实现方法

### 1. 使用 `defineComponent` 包装

```tsx
// ❌ 函数式组件，无法享受静态提升
export default function MyComponent() {
  return <div class="static">内容</div>
}

// ✅ 使用defineComponent，支持静态提升
export default defineComponent({
  name: 'MyComponent',
  setup() {
    return () => <div class="static">内容</div>
  }
})
```

### 2. 静态常量外部化

```tsx
// ✅ 静态常量放在组件外部
const STATIC_CLASSES = {
  container: 'my-container',
  header: 'my-header',
  content: 'my-content'
} as const;

const STATIC_ELEMENTS = {
  title: <h1>标题</h1>,
  loading: <div>加载中...</div>
};

export default defineComponent({
  setup() {
    return () => (
      <div class={STATIC_CLASSES.container}>
        {STATIC_ELEMENTS.title}
        <div class={STATIC_CLASSES.content}>
          动态内容
        </div>
      </div>
    )
  }
})
```

### 3. 事件处理器缓存

```tsx
// ❌ 每次渲染都创建新函数
const handleClick = () => console.log('clicked')

// ✅ 使用缓存避免重复创建
const handlerCache = createHandlerCache();

export default defineComponent({
  setup() {
    const cachedHandler = handlerCache.get('click', () => {
      console.log('clicked')
    });
    
    return () => (
      <button onClick={cachedHandler}>点击</button>
    )
  }
})
```

### 4. 条件渲染优化

```tsx
// ❌ 每次都重新创建元素
const showContent = ref(true)
return () => (
  <div>
    {showContent.value ? <div class="content">内容</div> : <div class="empty">空状态</div>}
  </div>
)

// ✅ 静态元素提升
const STATIC_CONTENT = <div class="content">内容</div>
const STATIC_EMPTY = <div class="empty">空状态</div>

return () => (
  <div>
    {showContent.value ? STATIC_CONTENT : STATIC_EMPTY}
  </div>
)
```

## 📊 Vite 配置优化

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          hoistStatic: true,        // 启用静态提升
          cacheHandlers: true,      // 缓存事件处理器
        }
      }
    }),
    vueJsx({
      optimize: true,              // 启用JSX优化
      transformOn: true,           // 优化事件处理
      mergeProps: true,            // 合并props
    })
  ]
})
```

## 🎯 最佳实践

### 1. 组件结构优化

```tsx
export default defineComponent({
  name: 'OptimizedComponent',
  setup() {
    // 响应式状态
    const count = ref(0)
    
    // 静态处理器（会被缓存）
    const increment = () => count.value++
    
    // 静态样式类
    const classes = {
      container: 'flex flex-col',
      button: 'px-4 py-2 bg-blue-500',
      text: 'text-lg font-bold'
    }
    
    // 静态元素
    const staticTitle = <h1 class={classes.text}>计数器</h1>
    
    return () => (
      <div class={classes.container}>
        {staticTitle}
        <span>当前计数: {count.value}</span>
        <button class={classes.button} onClick={increment}>
          增加
        </button>
      </div>
    )
  }
})
```

### 2. 列表渲染优化

```tsx
// ❌ 每次都重新创建模板
items.map(item => (
  <div class="item">
    <span class="label">名称:</span>
    <span class="value">{item.name}</span>
  </div>
))

// ✅ 静态部分提升
const ITEM_TEMPLATE = {
  container: 'item',
  label: 'label',
  value: 'value',
  labelText: '名称:'
}

items.map(item => (
  <div class={ITEM_TEMPLATE.container}>
    <span class={ITEM_TEMPLATE.label}>{ITEM_TEMPLATE.labelText}</span>
    <span class={ITEM_TEMPLATE.value}>{item.name}</span>
  </div>
))
```

## 🔍 性能监控

```tsx
import { withPerformanceTracking } from '@/utils/vueOptimization'

export default defineComponent({
  setup() {
    // 包装性能敏感的函数
    const expensiveOperation = withPerformanceTracking('expensiveOperation')(
      () => {
        // 复杂计算逻辑
      }
    )
    
    return () => (
      <div onClick={expensiveOperation}>
        点击执行复杂操作
      </div>
    )
  }
})
```

## 📈 效果对比

### 优化前
- 每次渲染创建新的VNode
- 事件处理器重复创建
- 静态内容参与diff

### 优化后
- 静态元素复用，减少内存分配
- 事件处理器缓存，避免重复绑定
- 静态内容跳过diff，提升性能

## ⚠️ 注意事项

1. **静态提升的限制**：只有真正静态的内容才会被提升
2. **过度优化**：不要为了优化而牺牲代码可读性
3. **调试困难**：静态提升后的代码在开发工具中可能难以追踪

## 🛠️ 调试工具

```tsx
// 开发环境下检查静态提升效果
if (process.env.NODE_ENV === 'development') {
  checkStaticHoisting('MyComponent', {
    classes: STATIC_CLASSES,
    elements: STATIC_ELEMENTS
  })
}
```

通过这些优化技术，你的TSX组件将获得更好的性能表现！ 