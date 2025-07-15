<template>
  <div class="font-selector">
    <!-- 组件内容由TSX渲染 -->
  </div>
</template>

<script lang="tsx">
import FontSelector from './FontSelector'
export default FontSelector
</script>

<style scoped>
.font-selector {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.font-selector__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.font-selector__header h4 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.font-selector__content {
  margin-bottom: 20px;
}

.font-selector__label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.font-selector__preview {
  margin-top: 16px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.preview-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.5;
}

.preview-english {
  font-size: 12px;
  color: #666;
  font-style: italic;
}

.font-selector__help ul {
  margin: 8px 0;
  padding-left: 20px;
}

.font-selector__help li {
  margin-bottom: 4px;
  font-size: 13px;
}

.font-selector__help code {
  background: #f1f3f4;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}
</style> 