import React from "react";
import BaseChart from "./BaseChart";
import type { EChartsOption } from "echarts";

interface RingGaugeProps {
  title: string;
  value: number; // 0 - 100
  color?: string; // 默认使用getColorByPosition生成的科技渐变色
}

// 根据进度位置，进行从青蓝到高亮绿的科技风颜色渐变计算
const getColorByPosition = (position: number): string => {
  const p = Math.max(0, Math.min(100, position)) / 100;
  const color1 = { r: 10, g: 255, b: 255 }; // #0AFFFF - 亮青 (0%)
  const color2 = { r: 25, g: 178, b: 255 }; // #19B2FF - 科技蓝 (40%)
  const color3 = { r: 62, g: 217, b: 156 }; // #3ED99C - 淡绿/正常 (100%)

  let r: number, g: number, b: number;

  if (p <= 0.4) {
    const t = p / 0.4;
    r = Math.round(color1.r + (color2.r - color1.r) * t);
    g = Math.round(color1.g + (color2.g - color1.g) * t);
    b = Math.round(color1.b + (color2.b - color1.b) * t);
  } else {
    const t = (p - 0.4) / 0.6;
    r = Math.round(color2.r + (color3.r - color2.r) * t);
    g = Math.round(color2.g + (color3.g - color2.g) * t);
    b = Math.round(color2.b + (color3.b - color2.b) * t);
  }

  return `rgb(${r}, ${g}, ${b})`;
};

const RingGauge: React.FC<RingGaugeProps> = ({ title, value }) => {
  const dotRadius = 1.8; // 外部细线上的微型圆点半径
  const totalSegments = 40; // 离散格子的总切片数
  const activeCount = Math.floor((value / 100) * totalSegments);

  // 构造饼图离散格子的数据数组
  const pieData = [];
  for (let i = 0; i < totalSegments; i++) {
    if (i < activeCount) {
      let positionInCircle: number;
      if (activeCount === 1) {
        positionInCircle = value;
      } else if (i === 0) {
        positionInCircle = 0;
      } else if (i === activeCount - 1) {
        positionInCircle = value;
      } else {
        positionInCircle = (i / (activeCount - 1)) * value;
      }
      pieData.push({
        value: 1,
        itemStyle: {
          color: getColorByPosition(positionInCircle),
          borderWidth: 2,
          borderColor: "#020619", // 暗色背景色分割线线框以体现科技切片感
        },
      });
    } else {
      pieData.push({
        value: 1,
        itemStyle: {
          color: "rgba(25, 178, 255, 0.05)", // 未激活部分的极暗蓝色
          borderWidth: 0,
          borderColor: "transparent",
        },
      });
    }
  }

  // 终点弧度 (ECharts中使用极坐标以-PI/2即正上方起算，顺逆时针由clockwise控制)
  const endAngleRadian = -Math.PI / 2 - (value / 100) * 2 * Math.PI;

  const option: EChartsOption = {
    title: {
      text: `{value|${value}}{unit|%}`,
      left: "center",
      top: "center",
      textStyle: {
        rich: {
          value: {
            fontSize: 20, // 调整为更紧凑的字号以解决扁平容器的排版
            fontWeight: "bold",
            color: "#FFFFFF",
            fontFamily: "sans-serif",
            padding: [0, 1, 0, 0],
            align: "center",
            verticalAlign: "bottom",
          },
          unit: {
            fontSize: 11,
            padding: [0, 0, 2, 1],
            color: "#9B9DA5",
            align: "center",
            verticalAlign: "bottom",
          },
        },
      },
    },
    series: [
      // 1. 离散刻度切片环
      {
        type: "pie",
        radius: ["65%", "85%"],
        center: ["50%", "44%"],
        startAngle: 90, // 正上方起算
        clockwise: false, // 逆时针渲染
        silent: true,
        label: { show: false },
        data: pieData,
      },
      // 2. 外部细发光装饰线
      {
        type: "gauge",
        radius: "96%",
        center: ["50%", "44%"],
        startAngle: 90,
        endAngle: -270,
        clockwise: false,
        axisLine: {
          lineStyle: {
            width: 1,
            color: (() => {
              const segments = 40;
              const colorStops: [number, string][] = [];
              for (let i = 0; i <= segments; i++) {
                const ratio = i / segments;
                const position = ratio * value;
                const color = getColorByPosition(position);
                colorStops.push([(i / segments) * (value / 100), color]);
              }
              colorStops.push([1, "rgba(25, 178, 255, 0.05)"]);
              return colorStops;
            })(),
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: { show: false },
        detail: { show: false },
        data: [{ value }],
      },
      // 3. 顶部固定起点微圆点
      {
        type: "custom",
        coordinateSystem: "none",
        renderItem: (_params, api) => {
          const width = api.getWidth();
          const height = api.getHeight();
          const cx = width / 2;
          const cy = height * 0.44;
          const r = (Math.min(width, height) / 2) * 0.96;

          const angle = -Math.PI / 2;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);

          return {
            type: "circle",
            shape: {
              cx: x,
              cy: y,
              r: dotRadius,
            },
            style: {
              fill: "#0AFFFF",
              shadowBlur: 3,
              shadowColor: "#0AFFFF",
            },
            silent: true,
          };
        },
        data: [0],
        z: 1000,
      },
      // 4. 动态终点微发光圆点
      {
        type: "custom",
        coordinateSystem: "none",
        renderItem: (_params, api) => {
          const width = api.getWidth();
          const height = api.getHeight();
          const cx = width / 2;
          const cy = height * 0.44;
          const r = (Math.min(width, height) / 2) * 0.96;

          const x = cx + r * Math.cos(endAngleRadian);
          const y = cy + r * Math.sin(endAngleRadian);

          const endDotColor = getColorByPosition(value);

          return {
            type: "circle",
            shape: {
              cx: x,
              cy: y,
              r: dotRadius,
            },
            style: {
              fill: endDotColor,
              shadowBlur: 3,
              shadowColor: endDotColor,
            },
            silent: true,
          };
        },
        data: [0],
        z: 1000,
      },
    ],
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center select-none">
      {/* 图表渲染容器 */}
      <div className="w-full flex-1 min-h-[0px]">
        <BaseChart option={option} />
      </div>

      {/* 底部细字标题 */}
      <div className="mt-[2px] text-[11px] font-medium text-[#9B9DA5] truncate">
        {title}
      </div>
    </div>
  );
};

export default RingGauge;
