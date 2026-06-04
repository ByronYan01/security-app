import React from "react";
import BaseChart from "./BaseChart";
import { radarDimensions, securityStatus } from "@/data/mockData";
import type { EChartsOption } from "echarts";

interface SecurityRadarChartProps {
  score?: number;
  dimensions?: typeof radarDimensions;
}

const SecurityRadarChart: React.FC<SecurityRadarChartProps> = ({
  score = securityStatus.score,
  dimensions = radarDimensions,
}) => {
  const option: EChartsOption = {
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(17, 34, 64, 0.9)",
      borderColor: "rgba(25, 178, 255, 0.6)",
      textStyle: {
        color: "#FFFFFF",
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (params: any) => {
        let html = `<div style="font-weight:bold;margin-bottom:4px;color:#0AFFFF">各项安全态势指标</div>`;
        dimensions.forEach((dim, idx) => {
          html += `<div>${dim.name}: <span style="color:#FFFFFF;font-weight:bold">${params.value[idx]}</span> / ${dim.max}</div>`;
        });
        return html;
      },
    },
    radar: {
      shape: "polygon", // 多边形网格线
      center: ["50%", "50%"],
      radius: "60%",
      indicator: dimensions.map((dim) => ({
        name: dim.name,
        max: dim.max,
      })),
      axisName: {
        color: "#9B9DA5",
        fontSize: 12,
        fontFamily: '"PingFangSC", "PingFang SC", sans-serif',
        padding: [-2, -2],
      },
      splitArea: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: "rgba(25, 178, 255, 0.25)", // 半透明科技蓝背景线
          width: 1,
        },
      },
      axisLine: {
        lineStyle: {
          color: "rgba(25, 178, 255, 0.25)",
        },
      },
    },
    series: [
      {
        name: "安全态势评估",
        type: "radar",
        data: [
          {
            value: dimensions.map((dim) => dim.value),
            name: "安全评分",
            symbol: "circle",
            symbolSize: 6,
            itemStyle: {
              color: "#0AFFFF", // 节点高亮青色
            },
            lineStyle: {
              color: "#0AFFFF", // 边框线高亮青色
              width: 2,
              shadowColor: "rgba(10, 255, 255, 0.6)", // 阴影效果
              shadowBlur: 8,
            },
            areaStyle: {
              color: {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [
                  { offset: 0, color: "rgba(25, 178, 255, 0.1)" },
                  { offset: 1, color: "rgba(25, 178, 255, 0.35)" }, // #19B2FF 的半透明渐变
                ],
              },
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="relative w-full h-full">
      {/* 雷达图底座 */}
      <BaseChart option={option} height="100%" />

      {/* 中心绝对定位的安全评分显示 */}
      <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex flex-col items-center justify-center pointer-events-none z-20">
        <span className="font-jlinxin text-[46px] font-bold text-[#0AFFFF] leading-none drop-shadow-[0_0_8px_rgba(10,255,255,0.7)] tracking-normal">
          {score}
        </span>
        <span className="text-[11px] text-[#9B9DA5] font-normal mt-[2px] tracking-wider uppercase">
          安全指数
        </span>
      </div>
    </div>
  );
};

export default SecurityRadarChart;
