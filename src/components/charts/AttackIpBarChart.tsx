import React from "react";
import BaseChart from "./BaseChart";
import type { AttackIpRank } from "@/data/mockData";
import type { EChartsOption } from "echarts";

interface AttackIpBarChartProps {
  data?: AttackIpRank[];
}

const AttackIpBarChart: React.FC<AttackIpBarChartProps> = ({ data = [] }) => {
  // 取Top5并逆序，使排名第一的在最上方展示
  const sortedData = [...data].slice(0, 5).reverse();
  const yData = sortedData.map((item) => item.ip);
  const xData = sortedData.map((item) => item.count);

  const option: EChartsOption = {
    grid: {
      left: "3%",
      right: "10%",
      bottom: "3%",
      top: "3%",
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
        return `${item.name}: <span style="color:#FA7736;font-weight:bold">${item.value}</span> 次`;
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
        fontSize: 12,
        fontFamily: '"PingFangSC", "PingFang SC", sans-serif',
      },
    },
    series: [
      {
        name: "攻击次数",
        type: "bar",
        data: xData,
        barWidth: 10,
        showBackground: true,
        backgroundStyle: {
          color: "rgba(25, 178, 255, 0.05)",
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
              { offset: 0, color: "#FFA319" }, // 起色：橙黄色
              { offset: 1, color: "#FA7736" }, // 止色：警告红/橙红
            ],
          },
        },
      },
    ],
  };

  return <BaseChart option={option} height="100%" />;
};

export default AttackIpBarChart;
