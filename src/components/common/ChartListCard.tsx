import React, { useState } from "react";
import PlainCard from "./PlainCard";

export interface SimpleColumn<T> {
  title: React.ReactNode;
  dataIndex?: keyof T;
  key?: string;
  width: string; // 宽度占比，用于列对齐，例如 "30%"
  align?: "left" | "right" | "center";
  render?: (record: T, index: number) => React.ReactNode;
  cellClassName?: string;
}

interface ChartListCardProps<T> {
  title: string;
  className?: string;
  chart: React.ReactNode;
  tableData: T[];
  columns: SimpleColumn<T>[];
  rowBackgroundColor?: string; // 可选的行渐变背景基底色
}

/**
 * ChartListCard 组件
 *
 * 优化方案：不再同时并排展示图表和列表。
 * 在右上角添加 Tab 切换按钮，用户可以手动切换“柱形图”和“表格”。
 * 切换后内容均以 100% 宽度宽敞地展现，并伴有平滑的淡入过渡动画。
 */
const ChartListCard = <T extends object>({
  title,
  className = "",
  chart,
  tableData,
  columns,
  rowBackgroundColor = "rgba(250, 119, 54, 0.15)", // 默认与外部传入一致
}: ChartListCardProps<T>) => {
  // 定义 Tab 状态：'chart'（柱形图）或 'table'（表格列表），默认展示柱形图
  const [activeTab, setActiveTab] = useState<"chart" | "table">("chart");

  // 卡片右上角精致的 Tab 切换按钮
  const tabSelector = (
    <div className="flex bg-[#112240] rounded-[4px] p-[2px] border border-[#19B2FF]/20 text-[11px] select-none">
      <button
        onClick={() => setActiveTab("chart")}
        className={`px-[10px] py-[2px] rounded-[3px] transition-all duration-200 font-medium ${
          activeTab === "chart"
            ? "bg-[#FA7736] text-white shadow-[0_0_6px_rgba(250,119,54,0.5)]"
            : "text-[#9B9DA5] hover:text-white"
        }`}
      >
        柱形图
      </button>
      <button
        onClick={() => setActiveTab("table")}
        className={`px-[10px] py-[2px] rounded-[3px] transition-all duration-200 font-medium ${
          activeTab === "table"
            ? "bg-[#FA7736] text-white shadow-[0_0_6px_rgba(250,119,54,0.5)]"
            : "text-[#9B9DA5] hover:text-white"
        }`}
      >
        表格
      </button>
    </div>
  );

  return (
    <PlainCard title={title} extra={tabSelector} className={className}>
      <div className="w-full h-full relative">
        {/* 1. 柱形图展示区 */}
        {activeTab === "chart" && (
          <div className="w-full h-full min-w-[0px] animate-fadeIn">
            {chart}
          </div>
        )}

        {/* 2. 表格数据展示区 */}
        {activeTab === "table" && (
          <div className="w-full h-full flex flex-col min-h-[0px] animate-fadeIn">
            {/* 表头对齐 */}
            <div className="flex items-center pb-[6px] px-[8px] text-[12px] font-normal text-[#9B9DA5]">
              {columns.map((col, idx) => (
                <div
                  key={col.key || idx}
                  style={{ width: col.width }}
                  className={`shrink-0 flex items-center ${
                    col.align === "right"
                      ? "justify-end"
                      : col.align === "center"
                        ? "justify-center"
                        : "justify-start"
                  } ${idx === columns.length - 1 ? "" : "pr-[8px]"}`}
                >
                  {col.title}
                </div>
              ))}
            </div>

            {/* 表身内容 */}
            <div className="flex-1 flex flex-col gap-[6px] min-h-[0px] overflow-y-auto custom-scrollbar">
              {tableData.map((record, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex items-center px-[8px] text-[12px] font-normal text-[#FFFFFF] h-[34px] 2xl:h-[38px] shrink-0"
                  style={{
                    // 渐变起始至全透明色过渡
                    background: `linear-gradient(90deg, ${rowBackgroundColor} 0%, rgba(250, 119, 54, 0) 100%)`,
                    borderRadius: "4px",
                  }}
                >
                  {columns.map((col, colIndex) => {
                    let content: React.ReactNode = null;
                    if (col.render) {
                      content = col.render(record, rowIndex);
                    } else if (col.dataIndex) {
                      content = record[col.dataIndex] as React.ReactNode;
                    }

                    return (
                      <div
                        key={col.key || colIndex}
                        style={{
                          width: col.width,
                          textAlign: col.align || "left",
                        }}
                        className={`shrink-0 flex items-center ${
                          col.align === "right"
                            ? "justify-end"
                            : col.align === "center"
                              ? "justify-center"
                              : "justify-start"
                        } ${colIndex === columns.length - 1 ? "" : "pr-[8px]"} ${col.cellClassName || ""}`}
                      >
                        {content}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PlainCard>
  );
};

export default ChartListCard;
