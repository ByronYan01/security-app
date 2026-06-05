import React from "react";
import BaseChart from "./BaseChart";
import type { AlarmTrendPoint } from "@/data/mockData";
import type { EChartsOption } from "echarts";

interface AlarmTrendChartProps {
  data?: AlarmTrendPoint[];
}

const AlarmTrendChart: React.FC<AlarmTrendChartProps> = ({ data = [] }) => {
  const xData = data.map((item) => item.time);
  const criticalData = data.map((item) => item.critical);
  const warningData = data.map((item) => item.warning);

  const option: EChartsOption = {
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "16%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(17, 34, 64, 0.9)",
      borderColor: "rgba(25, 178, 255, 0.6)",
      textStyle: {
        color: "#FFFFFF",
      },
      axisPointer: {
        lineStyle: {
          color: "rgba(25, 178, 255, 0.4)",
        },
      },
    },
    legend: {
      data: ["严重威胁数", "常规告警数"],
      top: "0%",
      right: "center",
      itemWidth: 12,
      itemHeight: 4,
      textStyle: {
        color: "#9B9DA5",
        fontSize: 12,
        fontFamily: '"PingFangSC", "PingFang SC", sans-serif',
      },
      icon: "rect",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xData,
      axisLine: {
        lineStyle: {
          color: "rgba(25, 178, 255, 0.2)",
        },
      },
      axisLabel: {
        color: "#9B9DA5",
        fontSize: 11,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          color: "rgba(25, 178, 255, 0.08)",
        },
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: "#9B9DA5",
        fontSize: 11,
      },
    },
    series: [
      {
        name: "严重威胁数",
        type: "line",
        smooth: true,
        data: criticalData,
        symbol: "circle",
        symbolSize: 6,
        showSymbol: false,
        itemStyle: {
          color: "#FA7736",
        },
        lineStyle: {
          color: "#FA7736",
          width: 2,
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(250, 119, 54, 0.22)" }, // 严重威胁折线红透明渐变面积
              { offset: 1, color: "rgba(250, 119, 54, 0)" },
            ],
          },
        },
      },
      {
        name: "常规告警数",
        type: "line",
        smooth: true,
        data: warningData,
        symbol: "circle",
        symbolSize: 6,
        showSymbol: false,
        itemStyle: {
          color: "#FFDA47",
        },
        lineStyle: {
          color: "#FFDA47",
          width: 2,
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(255, 218, 71, 0.22)" }, // 常规告警折线黄透明渐变面积
              { offset: 1, color: "rgba(255, 218, 71, 0)" },
            ],
          },
        },
      },
    ],
  };

  return <BaseChart option={option} height="100%" />;
};

export default AlarmTrendChart;
