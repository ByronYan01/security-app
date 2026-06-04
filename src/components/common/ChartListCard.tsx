import React from "react";
import PlainCard from "./PlainCard";

export interface SimpleColumn<T> {
  title: React.ReactNode;
  dataIndex?: keyof T;
  key?: string;
  width: string; // Percent "30%" or "50px". Required for alignment.
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
  // Optional: Allow customizing the row background gradient color base
  // e.g. "rgba(255, 218, 71, 0.1)"
  rowBackgroundColor?: string;
}

/**
 * ChartListCard
 *
 * Re-implemented using native CSS Flexbox/Grid instead of Antd Table.
 * Supports custom row styling with gradients and strict column alignment.
 */
const ChartListCard = <T extends object>({
  title,
  className = "",
  chart,
  tableData,
  columns,
  rowBackgroundColor = "rgba(255, 218, 71, 0.20)", // Default yellowish tint
}: ChartListCardProps<T>) => {
  return (
    <PlainCard title={title} className={className}>
      <div className="flex h-full">
        {/* Left Chart Area */}
        <div className="w-[58%] h-full min-w-[0px]">{chart}</div>

        {/* Right List Area */}
        <div className="ml-[12px] w-[42%] h-full flex flex-col">
          <div className="flex items-center pb-[8px] px-[8px] text-[14px] font-normal text-[#9B9DA5]">
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

          {/* Table Body - Scrollable if needed, though Top5 implies fixed count */}
          <div className="flex-1 flex flex-col gap-[8px] min-h-[0px] overflow-y-auto custom-scrollbar">
            {tableData.map((record, rowIndex) => (
              <div
                key={rowIndex}
                className="flex-1 flex items-center px-[8px] text-[14px] font-normal text-[#FFFFFF] min-h-[0px]"
                style={{
                  // Apply the gradient background requested
                  background: `linear-gradient(90deg, ${rowBackgroundColor} 0%, rgba(255, 218, 71, 0)`,
                  borderRadius: "4px",
                }}
              >
                {columns.map((col, colIndex) => {
                  // Resolve cell content
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
      </div>
    </PlainCard>
  );
};

export default ChartListCard;
