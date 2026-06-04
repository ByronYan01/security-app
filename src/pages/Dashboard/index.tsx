import React from "react";
import CardFrame from "@/components/common/CardFrame";
import ChartListCard from "@/components/common/ChartListCard";
import type { SimpleColumn } from "@/components/common/ChartListCard";
import { attackIpRankData, securityStatus } from "@/data/mockData";
import type { AttackIpRank } from "@/data/mockData";
import headerTop from "@/assets/svg/header-top.svg";
import headerBottom from "@/assets/svg/header-bottom.svg";

// 导入图表与子组件
import AttackIpBarChart from "@/components/charts/AttackIpBarChart";
import VulnTypePieChart from "@/components/charts/VulnTypePieChart";
import SecurityRadarChart from "@/components/charts/SecurityRadarChart";
import AlarmTrendChart from "@/components/charts/AlarmTrendChart";
import RealtimeAttackList from "./RealtimeAttackList";

interface MiniIndicatorProps {
  label: string;
  value: number;
  color: string;
  shadowColor: string;
}

const MiniIndicator: React.FC<MiniIndicatorProps> = ({
  label,
  value,
  color,
  shadowColor,
}) => {
  return (
    <div className="flex flex-col gap-[6px]">
      <div className="flex justify-between items-baseline">
        <span className="text-[12px] text-[#9B9DA5] font-normal leading-none">
          {label}
        </span>
        <span
          className="text-[16px] font-bold font-mono leading-none"
          style={{ color, textShadow: `0 0 6px ${shadowColor}` }}
        >
          {value}%
        </span>
      </div>
      <div className="w-full h-[5px] bg-[#112240] rounded-full overflow-hidden border border-[#19B2FF]/10 relative">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color} 0%, rgba(25, 178, 255, 0.3) 100%)`,
            boxShadow: `0 0 6px ${color}`,
          }}
        ></div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  // 攻击源IP排名Top5 columns配置
  const ipRankColumns: SimpleColumn<AttackIpRank>[] = [
    {
      title: "排名",
      width: "20%",
      align: "center",
      render: (_, index) => {
        // 前三名使用醒目的渐变与橙红色进行高亮，其余为普通蓝色
        const rankColors = [
          "bg-gradient-to-r from-[#FA7736] to-[#FFA319] shadow-[0_0_6px_#FA7736]",
          "bg-gradient-to-r from-[#FFA319] to-[#FFDA47] shadow-[0_0_6px_#FFA319]",
          "bg-[#FFDA47] text-[#020619] shadow-[0_0_6px_#FFDA47]",
        ];
        return (
          <span
            className={`inline-block w-[18px] h-[18px] text-center leading-[18px] rounded text-[11px] font-bold text-white ${
              rankColors[index] ||
              "bg-navy-700 text-[#9B9DA5] border border-[#19B2FF]/30"
            }`}
          >
            {index + 1}
          </span>
        );
      },
    },
    {
      title: "源IP / 地理归属",
      width: "55%",
      align: "left",
      render: (record) => (
        <div className="flex flex-col min-w-[0px]">
          <span className="text-[13px] font-mono font-medium truncate text-white leading-tight">
            {record.ip}
          </span>
          <span className="text-[10px] text-[#9B9DA5] truncate leading-none mt-[2px]">
            {record.location}
          </span>
        </div>
      ),
    },
    {
      title: "次数",
      width: "25%",
      align: "right",
      render: (record) => (
        <span className="text-[#FFA319] font-mono font-bold text-[13px]">
          {record.count.toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="w-screen h-screen bg-[#020619] flex flex-col overflow-hidden text-white font-sans px-[24px] pb-[20px] box-border relative">
      {/* 左上角今日攻击总数 */}
      <div className="absolute left-[32px] top-[24px] flex items-baseline gap-[8px] z-20 select-none">
        <span className="text-[#9B9DA5] text-[13px] font-normal tracking-wide">
          今日遭受攻击总数
        </span>
        <span className="font-jlinxin text-[#FFA319] text-[24px] font-bold tracking-[1px] drop-shadow-[0_0_6px_rgba(255,163,25,0.4)]">
          {securityStatus.todayAttacks.toLocaleString()}
        </span>
        <span className="text-[#9B9DA5] text-[12px]">次</span>
      </div>



      {/* 顶部 Header (与 prometheus-app 保持完全一致) */}
      <div className="flex flex-col items-center justify-center w-full max-w-6xl self-center shrink-0 relative">
        <div className="relative w-full flex justify-center items-center">
          {/* 1. 底层 100% 宽度的 CSS 渐变长线 */}
          <div
            className="absolute h-[1px] w-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(138, 155, 247, 0.16) 0%, rgba(138, 155, 247, 1) 50%, rgba(138, 155, 247, 0.16) 100%)",
            }}
          ></div>

          {/* 2. 顶层原有 SVG */}
          <img
            src={headerTop}
            alt="header top"
            className="relative z-10 h-[1px]"
          />
        </div>
        <h1
          className="text-[50px] font-bold tracking-wider px-8 leading-[52px] mt-[12px]"
          style={{
            background: "linear-gradient(0deg, #ADF7FF 0%, #FFFFFF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0px 0px 10px rgba(173,247,255,0.4))",
          }}
        >
          安全态势感知大屏
        </h1>
        <img
          src={headerBottom}
          alt="header bottom"
          className="w-full mt-[2px]"
        />
      </div>

      {/* 主体区域 (高度填充余下屏幕) */}
      <div className="flex-1 flex gap-[16px] mt-[16px] min-h-[0px]">
        {/* 左栏 (25%) */}
        <div className="w-[25%] shrink-0 flex flex-col gap-[14px] h-full min-h-[0px]">
          {/* 卡片1 (上，高度占约 46%) */}
          <CardFrame className="flex-[46] min-h-0 flex flex-col">
            <ChartListCard
              title="攻击源IP排名Top5"
              chart={<AttackIpBarChart />}
              tableData={attackIpRankData}
              columns={ipRankColumns}
              rowBackgroundColor="rgba(250, 119, 54, 0.15)"
              className="h-full"
            />
          </CardFrame>

          {/* 卡片2 (下，高度占约 50%) */}
          <CardFrame className="flex-[54] min-h-0 flex flex-col">
            <div className="text-[#FFFFFF] text-[16px] font-semibold mb-[10px] shrink-0 flex items-center gap-[6px]">
              <span className="inline-block w-[3px] h-[14px] bg-[#19B2FF]"></span>
              漏洞攻击类型分布Top5
            </div>
            <div className="flex-1 min-h-[0px] flex flex-col">
              <VulnTypePieChart />
            </div>
          </CardFrame>
        </div>

        {/* 中间主视觉栏 (50%) */}
        <div className="w-[50%] shrink-0 flex flex-col gap-[14px] h-full min-h-[0px]">
          {/* 卡片3 (上，高度占约 58%) */}
          <CardFrame className="flex-[58] min-h-0 flex flex-col">
            <div className="text-[#FFFFFF] text-[16px] font-semibold mb-[8px] shrink-0 flex items-center gap-[6px]">
              <span className="inline-block w-[3px] h-[14px] bg-[#0AFFFF] shadow-[0_0_5px_#0AFFFF]"></span>
              安全态势感知中心
            </div>
            <div className="flex-1 min-h-[0px] flex items-center justify-between gap-[24px]">
              {/* 左侧安全维度因子监控 */}
              <div className="w-[22%] flex flex-col gap-[20px] select-none pl-[8px]">
                <MiniIndicator
                  label="应用安全评估"
                  value={88}
                  color="#0AFFFF"
                  shadowColor="rgba(10, 255, 255, 0.4)"
                />
                <MiniIndicator
                  label="边界防御等级"
                  value={95}
                  color="#3ED99C"
                  shadowColor="rgba(62, 217, 156, 0.4)"
                />
              </div>

              {/* 中间雷达大图 (占 56% 宽度) */}
              <div className="flex-1 h-full min-w-[0px]">
                <SecurityRadarChart />
              </div>

              {/* 右侧安全维度因子监控 */}
              <div className="w-[22%] flex flex-col gap-[20px] select-none pr-[8px]">
                <MiniIndicator
                  label="主机防御指数"
                  value={92}
                  color="#FFA319"
                  shadowColor="rgba(255, 163, 25, 0.4)"
                />
                <MiniIndicator
                  label="漏洞态势健康"
                  value={85}
                  color="#FA7736"
                  shadowColor="rgba(250, 119, 54, 0.4)"
                />
              </div>
            </div>
          </CardFrame>

          {/* 卡片4 (下，高度占约 40%) */}
          <CardFrame className="flex-[42] min-h-0 flex flex-col">
            <div className="text-[#FFFFFF] text-[16px] font-semibold mb-[8px] shrink-0 flex items-center gap-[6px]">
              <span className="inline-block w-[3px] h-[14px] bg-[#FFA319] shadow-[0_0_5px_#FFA319]"></span>
              告警变化趋势分析
            </div>
            <div className="flex-1 min-h-[0px] flex flex-col">
              <AlarmTrendChart />
            </div>
          </CardFrame>
        </div>

        {/* 右栏 (25%) */}
        <div className="w-[25%] shrink-0 h-full min-h-[0px]">
          {/* 卡片5 (满高) */}
          <CardFrame className="h-full flex flex-col">
            <div className="text-[#FFFFFF] text-[16px] font-semibold mb-[12px] shrink-0 flex items-center gap-[6px]">
              <span className="inline-block w-[3px] h-[14px] bg-[#FA7736] shadow-[0_0_5px_#FA7736]"></span>
              实时安全告警日志流
            </div>
            <div className="flex-1 min-h-[0px] flex flex-col">
              <RealtimeAttackList />
            </div>
          </CardFrame>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
