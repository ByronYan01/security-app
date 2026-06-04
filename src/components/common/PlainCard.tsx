import React from "react";
import type { ReactNode } from "react";

interface PlainCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

const PlainCard: React.FC<PlainCardProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* 极简标题: 纯文字，无装饰 */}
      {title && (
        <div className="text-[#FFFFFF] text-[16px] font-semibold mb-[8px] shrink-0">
          {title}
        </div>
      )}

      {/* 内容区域 */}
      <div className="flex-1 min-h-[0px] relative">{children}</div>
    </div>
  );
};

export default PlainCard;
