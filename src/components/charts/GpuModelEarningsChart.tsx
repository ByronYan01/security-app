import React from "react";
import BaseChart from "./BaseChart";
import type { GpuModelEarning } from "@/data/mockData";
import type { EChartsOption } from "echarts";

interface GpuModelEarningsChartProps {
  data?: GpuModelEarning[];
}

const GpuModelEarningsChart: React.FC<GpuModelEarningsChartProps> = ({
  data = [],
}) => {
  // 数据逆序排列，以使高收益卡型号展示在最上方
  const sortedData = [...data].reverse();
  const yData = sortedData.map((item) => item.modelName);
  const xData = sortedData.map((item) => item.earningsPerHour);

  const option: EChartsOption = {
    grid: {
      left: "3%",
      right: "15%", // 为右侧文字标签留出足够的排版空间，防止顶格截断
      bottom: "2%", // 优化底部，从 3% 缩减为更紧凑的 2%以消除底边多余空白
      top: "4%",    // 顶部从 5% 缩减为 4%
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      backgroundColor: "rgba(17, 34, 64, 0.9)",
      borderColor: "rgba(25, 178, 255, 0.6)",
      textStyle: {
        color: "#FFFFFF",
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (params: any) => {
        const item = params[0];
        return `${item.name}: <span style="color:#FFDA47;font-weight:bold">¥${item.value}/小时</span>`;
      },
    },
    xAxis: {
      type: "value",
      show: false,
    },
    yAxis: {
      type: "category",
      data: yData,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#9B9DA5",
        fontSize: 11,
        fontFamily: '"PingFangSC", "PingFang SC", sans-serif',
      },
    },
    series: [
      {
        name: "平均收益",
        type: "bar",
        data: xData,
        barWidth: 10,
        showBackground: true,
        backgroundStyle: {
          color: "rgba(25, 178, 255, 0.04)",
          borderRadius: 5,
        },
        itemStyle: {
          borderRadius: 5,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: "#FFA319" }, // 起色：金色/橙黄色
              { offset: 1, color: "#FFDA47" }, // 止色：亮黄色/金黄
            ],
          },
        },
        label: {
          show: true,
          position: "right",
          formatter: "¥{c}/h",
          color: "#FFDA47",
          fontWeight: "bold",
          fontSize: 11,
          fontFamily: "sans-serif",
          distance: 8,
        },
      },
    ],
  };

  return <BaseChart option={option} height="100%" />;
};

export default GpuModelEarningsChart;
