import React from "react";
import BaseChart from "./BaseChart";
import { vulnTypeData } from "@/data/mockData";
import type { EChartsOption } from "echarts";

interface VulnTypePieChartProps {
  data?: typeof vulnTypeData;
}

const VulnTypePieChart: React.FC<VulnTypePieChartProps> = ({ data = vulnTypeData }) => {
  // 转换数据格式以适配 ECharts 饼图
  const chartData = data.slice(0, 5).map((item) => ({
    name: item.type,
    value: item.count,
  }));

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
        return `${params.marker} ${params.name}: <span style="color:#0AFFFF;font-weight:bold">${params.value}</span> 次 (${params.percent}%)`;
      },
    },
    legend: {
      orient: "horizontal",
      bottom: "1%",
      left: "center",
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: "#9B9DA5",
        fontSize: 11,
        fontFamily: '"PingFangSC", "PingFang SC", sans-serif',
      },
      icon: "circle",
    },
    // 指定色盘配色
    color: ["#FA7736", "#FFA319", "#FFDA47", "#AB70FF", "#6FC7FF"],
    series: [
      {
        name: "漏洞攻击类型",
        type: "pie",
        radius: ["24%", "48%"],
        center: ["50%", "44%"],
        roseType: "radius",
        itemStyle: {
          borderRadius: 4,
        },
        label: {
          show: true,
          color: "#9B9DA5",
          fontSize: 10,
          fontFamily: '"PingFangSC", "PingFang SC", sans-serif',
          formatter: "{b}\n{d}%",
        },
        labelLine: {
          show: true,
          length: 4,
          length2: 5,
          lineStyle: {
            color: "rgba(155, 157, 165, 0.3)",
          },
        },
        data: chartData,
      },
    ],
  };

  return <BaseChart option={option} height="100%" />;
};

export default VulnTypePieChart;
