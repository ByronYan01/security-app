import React from "react";
import type { ReactNode } from "react";

interface CardFrameProps {
  title?: string;
  children: ReactNode;
  className?: string;
  extra?: ReactNode;
}

const CardFrame: React.FC<CardFrameProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`relative  border border-[#19B2FF]/60 p-[16px] flex flex-col shadow-[inset_0px_0px_10px_0px_rgba(25,178,255,0.8)] ${className}`}
    >
      {/* 装饰性角标 */}
      <div className="absolute -top-[1px] -left-[1px] w-[12px] h-[12px] border-l-2 border-t-2 border-[#19B2FF]"></div>
      <div className="absolute -top-[1px] -right-[1px] w-[12px] h-[12px] border-r-2 border-t-2 border-[#19B2FF]"></div>
      <div className="absolute -bottom-[1px] -left-[1px] w-[12px] h-[12px] border-l-2 border-b-2 border-[#19B2FF]"></div>
      <div className="absolute -bottom-[1px] -right-[1px] w-[12px] h-[12px] border-r-2 border-b-2 border-[#19B2FF]"></div>

      {/* 标题栏 */}
      {/* {title && (
        <div className="flex justify-between items-center mb-[12px] pb-[8px] border-b border-cyan-500/20 relative">
          <h3 className="text-cyan-400 font-bold text-lg tracking-wider flex items-center">
            <span className="inline-block w-[4px] h-[16px] bg-cyan-500 mr-[8px] shadow-[0_0_5px_#00b5d8]"></span>
            {title}
          </h3>
          {extra && <div>{extra}</div>}
        </div>
      )} */}

      {/* 内容区域 */}
      <div className="flex-1 min-h-[0px] relative z-10 flex flex-col">{children}</div>
    </div>
  );
};

export default CardFrame;
