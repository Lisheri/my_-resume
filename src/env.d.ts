/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.tsx' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// JSX全局类型声明
declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends ComponentRenderProxy {}
    interface IntrinsicElements extends IntrinsicElementAttributes {}
  }

  // 无界(wujie)微前端相关类型声明
  interface Window {
    __POWERED_BY_WUJIE__?: boolean;
    __WUJIE_MOUNT?: () => void;
    __WUJIE_UNMOUNT?: () => void;
  }
}

import type { VNode } from 'vue'
import type { ComponentRenderProxy } from '@vue/runtime-core'
import type { IntrinsicElementAttributes } from '@vue/runtime-dom' 