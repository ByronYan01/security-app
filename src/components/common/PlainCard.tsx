import React from "react";
import type { ReactNode } from "react";

interface PlainCardProps {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  children: ReactNode;
  className?: string;
}

const PlainCard: React.FC<PlainCardProps> = ({
  title,
  extra,
  children,
  className = "",
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* 标题与额外操作栏 */}
      {(title || extra) && (
        <div className="flex justify-between items-center mb-[8px] shrink-0 min-h-[24px]">
          {title && (
            <div className="text-[#FFFFFF] text-[16px] font-semibold flex items-center gap-[6px]">
              {/* 精美的橙色科技感发光竖条 */}
              <span className="inline-block w-[3px] h-[14px] bg-[#FA7736] shadow-[0_0_5px_#FA7736]"></span>
              {title}
            </div>
          )}
          {extra}
        </div>
      )}

      {/* 内容区域 */}
      <div className="flex-1 min-h-[0px] relative">{children}</div>
    </div>
  );
};

export default PlainCard;
