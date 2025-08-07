import { createApp } from 'vue';
import type { App as VueApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App';
import router from './router';
// 导入图标字体CSS
import '@/styles/icon.css';

const render = () => {
  const app = createApp(App);
  const pinia = createPinia();

  // 注册所有图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }

  app.use(pinia);
  app.use(ElementPlus);
  app.use(router);

  app.mount('#app');
  return app;
};

if (window.__POWERED_BY_WUJIE__) {
  let instance: VueApp<Element>;
  window.__WUJIE_MOUNT = () => {
    instance = render();
  };
  window.__WUJIE_UNMOUNT = () => {
    instance.unmount();
  };
} else {
  render();
}
