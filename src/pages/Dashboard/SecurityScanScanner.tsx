import React, { useState, useEffect } from "react";
import { securityScanStats } from "@/data/mockData";

const SecurityScanScanner: React.FC = () => {
  const [progress, setProgress] = useState(securityScanStats.scanProgress);

  // 动态递增扫描进度 (88% 到 100% 往复循环)，增强大屏运作的实时感
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 850);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-between gap-[16px] px-[8px] box-border select-none">
      {/* 左侧：动态雷达扫描转盘与文字 */}
      <div className="w-[45%] flex flex-col items-center justify-center gap-[8px]">
        {/* 雷达罗盘容器 */}
        <div className="relative w-[72px] h-[72px] rounded-full border border-[#19B2FF]/20 flex items-center justify-center bg-[#020619] shadow-[0_0_10px_rgba(25,178,255,0.08)] overflow-hidden">
          {/* 同心内圆装饰线 */}
          <div className="absolute w-[48px] h-[48px] rounded-full border border-[#19B2FF]/10"></div>
          <div className="absolute w-[24px] h-[24px] rounded-full border border-[#19B2FF]/5"></div>

          {/* 360度旋转扫掠扇区 (conic-gradient 半透明光栅渐变) */}
          <div
            className="absolute w-full h-full rounded-full animate-spin"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(10, 255, 255, 0.35) 0deg, rgba(25, 178, 255, 0) 120deg, transparent 360deg)",
              animationDuration: "2.8s",
            }}
          ></div>

          {/* 极坐标十字准线 */}
          <div className="absolute w-full h-[1px] bg-[#19B2FF]/10"></div>
          <div className="absolute h-full w-[1px] bg-[#19B2FF]/10"></div>

          {/* 圆心自增进度数值显示块 */}
          <div className="absolute flex items-center justify-center z-10 bg-[#020619]/90 rounded-full w-[36px] h-[36px] border border-[#19B2FF]/30 shadow-[0_0_5px_rgba(25,178,255,0.15)]">
            <span className="text-[11px] font-bold font-mono text-[#0AFFFF] leading-none">
              {progress}%
            </span>
          </div>
        </div>

        {/* 动态脉冲闪烁字样 */}
        <span className="text-[10px] text-[#9B9DA5] font-normal tracking-widest animate-pulse flex items-center gap-[4px]">
          <span className="inline-block w-[5px] h-[5px] rounded-full bg-[#0AFFFF]"></span>
          合规扫描中...
        </span>
      </div>

      {/* 右侧：统计分析面板 */}
      <div className="w-[52%] flex flex-col gap-[7px] justify-center">
        {/* 已通过节点指标项 */}
        <div className="flex items-center justify-between border-b border-[#19B2FF]/5 pb-[4px]">
          <div className="flex items-center gap-[6px]">
            <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#3ED99C] shadow-[0_0_4px_#3ED99C]"></span>
            <span className="text-[11px] text-[#9B9DA5]">已通过节点</span>
          </div>
          <span className="text-[14px] font-bold font-mono text-[#3ED99C] drop-shadow-[0_0_4px_rgba(62,217,156,0.25)]">
            {securityScanStats.passedCount}
          </span>
        </div>

        {/* 合规性漏洞指标项 */}
        <div className="flex items-center justify-between border-b border-[#19B2FF]/5 pb-[4px]">
          <div className="flex items-center gap-[6px]">
            <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#FFA319] shadow-[0_0_4px_#FFA319]"></span>
            <span className="text-[11px] text-[#9B9DA5]">合规性漏洞</span>
          </div>
          <span className="text-[14px] font-bold font-mono text-[#FFA319] drop-shadow-[0_0_4px_rgba(255,163,25,0.25)]">
            {securityScanStats.vulnWarningCount}
          </span>
        </div>

        {/* 高危风险指标项 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[6px]">
            <span
              className="inline-block w-[5px] h-[5px] rounded-full bg-[#FA7736] shadow-[0_0_4px_#FA7736] animate-ping"
              style={{ animationDuration: "1.2s" }}
            ></span>
            <span className="text-[11px] text-[#9B9DA5]">高危风险数</span>
          </div>
          <span className="text-[14px] font-bold font-mono text-[#FA7736] drop-shadow-[0_0_4px_rgba(250,119,54,0.25)]">
            {securityScanStats.highRiskCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SecurityScanScanner;
