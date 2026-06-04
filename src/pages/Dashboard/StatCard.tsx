import React from "react";
import CardFrame from "@/components/common/CardFrame";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subLabel?: string; // For "(FP16)" part if we want to separate it
}

const StatCard: React.FC<StatCardProps> = ({ label, value, unit }) => {
  return (
    <CardFrame className="!p-0 flex flex-col h-full">
      <div className="h-full flex flex-col relative pt-[12px]">
        {/* Label: Top-Left */}
        <div className="absolute top-3 left-4 text-[#FFFFFF] text-[14px] font-semibold tracking-wide z-10">
          {label}
        </div>

        {/* Content: Centered */}
        <div className="flex-1 flex items-center justify-center z-10">
          <div className="flex items-baseline gap-1">
            <span className="font-jlinxin text-[50px] font-bold text-[#0AFFFF] leading-[25px] tracking-[7px] text-right">
              {value}
            </span>
            {unit && (
              <span className="text-[14px] text-[#FFFFFF] font-normal tracking-wider">
                {unit}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Optional: subtle background glow grid or effect if visible in screenshot (hard to tell, but CardFrame has blur) */}
    </CardFrame>
  );
};

export default StatCard;
