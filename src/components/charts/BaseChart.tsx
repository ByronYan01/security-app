import React, { useRef, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";

interface BaseChartProps {
  option: EChartsOption;
  style?: React.CSSProperties;
  className?: string;
  height?: string | number;
  notMerge?: boolean;
}

const BaseChart: React.FC<BaseChartProps> = ({
  option,
  style,
  className,
  height = "100%",
  notMerge = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReactECharts>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      if (chartRef.current) {
        try {
          const chartInstance = chartRef.current.getEchartsInstance();
          if (chartInstance) {
            chartInstance.resize();
          }
        } catch {
          // 静默处理热更新或初始挂载时的异常
        }
      }
    });

    resizeObserver.observe(container);

    // 另外，在挂载后稍作延迟触发一次 resize，以防一些容器挂载边缘高度异常
    const timer = setTimeout(() => {
      if (chartRef.current) {
        try {
          chartRef.current.getEchartsInstance().resize();
        } catch {
          // ignore
        }
      }
    }, 150);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ height, width: "100%", position: "relative" }} className={className}>
      <ReactECharts
        ref={chartRef}
        option={{
          ...option,
          backgroundColor: "transparent",
        }}
        notMerge={notMerge}
        lazyUpdate={true}
        style={{ height: "100%", width: "100%", ...style }}
        theme="dark"
        opts={{ renderer: "canvas" }}
      />
    </div>
  );
};

export default BaseChart;

