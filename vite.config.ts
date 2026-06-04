import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 15170,
    proxy: {
      "/api": {
        target: "http://10.62.2.101:31070",
        // target: 'http://192.168.103.17:31070',
        changeOrigin: true,
      },
    },
  },
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
  build: {
    // 2. 目标环境：现代浏览器
    target: "esnext",
    minify: "esbuild",
    // 6. 开启静态资源压缩
    // 确保打包出来的文件尽可能小
    assetsInlineLimit: 4096, // 4kb 以下的小文件转为 base64
    // 7. 配置 rollup 选项进行代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "echarts-vendor": ["echarts", "echarts-for-react"],
          "antd-vendor": ["antd", "@ant-design/icons"],
        },
      },
    },
    // 8. 调整 chunk 大小警告限制 (默认 500kb，这里设为 1000kb)
    chunkSizeWarningLimit: 1000,
  },
});
