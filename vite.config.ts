import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue({
      // 启用静态提升优化
      template: {
        compilerOptions: {
          hoistStatic: true,
          cacheHandlers: true,
        },
      },
    }),
    vueJsx({
      // JSX编译优化
      optimize: true,
      // 启用静态提升
      transformOn: true,
      mergeProps: true,
      // 启用静态提升
      isCustomElement: (tag) => false,
      // 确保编译器优化
      babelPlugins: [],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  // 包含字体文件作为静态资源
  assetsInclude: ['**/*.ttf', '**/*.otf', '**/*.woff', '**/*.woff2'],
  // 确保public目录的文件能被正确访问
  publicDir: 'public',
  build: {
    // 确保字体文件被包含在构建中
    assetsDir: 'assets',
    // 编译优化
    minify: 'esbuild',
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [{ name: 'vendor', test: /\/vue(?:-router)?/ }],
        },
      },
    },
  },
});
