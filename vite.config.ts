import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";

export default defineConfig({
    plugins: [vue(), vueJsx()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
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
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name.split('.');
                    const ext = info[info.length - 1];
                    if (['ttf', 'otf', 'woff', 'woff2'].includes(ext)) {
                        return `fonts/[name]-[hash][extname]`;
                    }
                    return `assets/[name]-[hash][extname]`;
                }
            }
        }
    }
});
