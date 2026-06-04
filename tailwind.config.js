/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 自定义深色科技风色板
        navy: {
          900: "#020619", // 深背景
          800: "#112240", // 卡片背景
          700: "#233554",
        },
        cyan: {
          400: "#4fd1c5",
          500: "#19B2FF", // 主色调
          900: "#052c38", // 装饰性深色
        },
        vendor: {
          green: {
            DEFAULT: "#3ED99C",
            bg: "rgba(62, 217, 156, 0.5)",
          },
          blue: {
            DEFAULT: "#46A5FF",
            bg: "rgba(70, 165, 255, 0.3)",
          },
          orange: {
            DEFAULT: "#FA7736",
            bg: "rgba(250, 119, 54, 0.4)",
          },
        },
      },
      fontFamily: {
        jlinxin: ["JLinXin", "sans-serif"],
        sans: [
          '"PingFangSC"',
          '"PingFang SC"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: ["Menlo", "Monaco", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
