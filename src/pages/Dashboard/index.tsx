import React, { useState, useEffect } from "react";
import CardFrame from "@/components/common/CardFrame";
import ChartListCard from "@/components/common/ChartListCard";
import type { SimpleColumn } from "@/components/common/ChartListCard";
import type {
  SecurityStatus,
  AttackIpRank,
  VulnTypeRatio,
  GpuModelEarning,
  SecurityScanStats,
  RadarDimension,
  AlarmTrendPoint,
  AttackLog,
} from "@/data/mockData";
import headerTop from "@/assets/svg/header-top.svg";
import headerBottom from "@/assets/svg/header-bottom.svg";

// 导入图表与子组件
import AttackIpBarChart from "@/components/charts/AttackIpBarChart";
import VulnTypePieChart from "@/components/charts/VulnTypePieChart";
import SecurityRadarChart from "@/components/charts/SecurityRadarChart";
import AlarmTrendChart from "@/components/charts/AlarmTrendChart";
import RealtimeAttackList from "./RealtimeAttackList";
import GpuModelEarningsChart from "@/components/charts/GpuModelEarningsChart";
import SecurityScanScanner from "./SecurityScanScanner";

// 微型安全维度监控进度条组件
const MiniIndicator: React.FC<{
  label: string;
  value: number;
  color: string;
  shadowColor: string;
}> = ({ label, value, color, shadowColor }) => {
  return (
    <div className="flex flex-col gap-[6px] w-full">
      <div className="flex justify-between items-center">
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

interface DashboardData {
  securityStatus: SecurityStatus;
  attackIpRankData: AttackIpRank[];
  vulnTypeData: VulnTypeRatio[];
  gpuModelEarnings: GpuModelEarning[];
  securityScanStats: SecurityScanStats;
  radarDimensions: RadarDimension[];
  alarmTrendData: AlarmTrendPoint[];
  attackLogs: AttackLog[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          securityStatus,
          attackIpRankData,
          vulnTypeData,
          gpuModelEarnings,
          securityScanStats,
          radarDimensions,
          alarmTrendData,
          attackLogs,
        ] = await Promise.all([
          fetch("/data/securityStatus.json").then((res) => res.json()),
          fetch("/data/attackIpRankData.json").then((res) => res.json()),
          fetch("/data/vulnTypeData.json").then((res) => res.json()),
          fetch("/data/gpuModelEarnings.json").then((res) => res.json()),
          fetch("/data/securityScanStats.json").then((res) => res.json()),
          fetch("/data/radarDimensions.json").then((res) => res.json()),
          fetch("/data/alarmTrendData.json").then((res) => res.json()),
          fetch("/data/attackLogs.json").then((res) => res.json()),
        ]);

        setData({
          securityStatus,
          attackIpRankData,
          vulnTypeData,
          gpuModelEarnings,
          securityScanStats,
          radarDimensions,
          alarmTrendData,
          attackLogs,
        });
      } catch (error) {
        console.error("加载安全大屏数据失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

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
      title: "源IP / 归属地",
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

  if (loading || !data) {
    return (
      <div className="w-screen h-screen bg-[#020619] flex flex-col items-center justify-center text-white font-sans select-none">
        <div className="flex flex-col items-center gap-[16px]">
          <div className="w-[48px] h-[48px] border-[3px] border-[#19B2FF]/20 border-t-[#0AFFFF] rounded-full animate-spin shadow-[0_0_15px_rgba(10,255,255,0.2)]"></div>
          <span className="text-[14px] text-[#9B9DA5] font-medium tracking-widest animate-pulse">
            安全数据同步中...
          </span>
        </div>
      </div>
    );
  }

  // 获取特定名称因子的分值，有安全的回退默认值
  const getRadarValue = (name: string, fallback: number): number => {
    const dim = data.radarDimensions.find((d) => d.name === name);
    return dim ? dim.value : fallback;
  };

  return (
    <div className="w-screen h-screen bg-[#020619] flex flex-col overflow-hidden text-white font-sans px-[24px] pb-[20px] box-border relative">
      {/* 左上角今日攻击总数 */}
      <div className="absolute left-[32px] top-[24px] flex items-baseline gap-[8px] z-20 select-none">
        <span className="text-[#9B9DA5] text-[13px] font-normal tracking-wide">
          今日遭受攻击总数
        </span>
        <span className="font-jlinxin text-[#FFA319] text-[24px] font-bold tracking-[1px] drop-shadow-[0_0_6px_rgba(255,163,25,0.4)]">
          {data.securityStatus.todayAttacks.toLocaleString()}
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
        {/* 左栏 (自适应 25% 比例宽度，垂直排布3张卡片以分配 33 : 33 : 34) */}
        <div className="flex-1 flex flex-col gap-[14px] h-full min-h-[0px]">
          {/* 卡片1 (上，占比 flex-[33]) */}
          <CardFrame className="flex-[33] min-h-0 flex flex-col">
            <ChartListCard
              title="攻击源IP排名Top5"
              chart={<AttackIpBarChart data={data.attackIpRankData} />}
              tableData={data.attackIpRankData}
              columns={ipRankColumns}
              rowBackgroundColor="rgba(250, 119, 54, 0.15)"
              className="h-full"
            />
          </CardFrame>

          {/* 卡片2 (中，占比 flex-[33]) */}
          <CardFrame className="flex-[33] min-h-0 flex flex-col">
            <div className="text-[#FFFFFF] text-[16px] font-semibold mb-[10px] shrink-0 flex items-center gap-[6px]">
              <span className="inline-block w-[3px] h-[14px] bg-[#19B2FF]"></span>
              漏洞攻击类型分布Top5
            </div>
            <div className="flex-1 min-h-[0px] flex flex-col">
              <VulnTypePieChart data={data.vulnTypeData} />
            </div>
          </CardFrame>

          {/* 卡片3 (下，占比 flex-[34]) */}
          <CardFrame className="flex-[34] min-h-0 flex flex-col">
            <div className="text-[#FFFFFF] text-[16px] font-semibold mb-[10px] shrink-0 flex items-center gap-[6px]">
              <span className="inline-block w-[3px] h-[14px] bg-[#FFDA47]"></span>
              卡型号平均收益
            </div>
            <div className="flex-1 min-h-[0px] flex flex-col">
              <GpuModelEarningsChart data={data.gpuModelEarnings} />
            </div>
          </CardFrame>
        </div>

        {/* 中间主视觉栏 (自适应 50% 比例宽度) */}
        <div className="flex-[2] flex flex-col gap-[14px] h-full min-h-[0px]">
          {/* 卡片4 (上，高度占约 64%，采用方案三：雷达图 + 底部5大维度圆环仪表盘) */}
          <CardFrame className="flex-[64] min-h-0 flex flex-col">
            <div className="text-[#FFFFFF] text-[16px] font-semibold mb-[8px] shrink-0 flex items-center gap-[6px]">
              <span className="inline-block w-[3px] h-[14px] bg-[#0AFFFF] shadow-[0_0_5px_#0AFFFF]"></span>
              安全态势感知中心
            </div>
            <div className="flex-1 min-h-[0px] flex items-center justify-between gap-[24px]">
              {/* 左侧雷达大图 */}
              <div className="flex-[65] h-full min-w-[0px]">
                <SecurityRadarChart score={data.securityStatus.score} dimensions={data.radarDimensions} />
              </div>

              {/* 右侧安全维度因子监控面板 */}
              <div className="flex-[35] h-[82%] flex flex-col justify-center select-none bg-[#112240]/20 border border-[#19B2FF]/10 rounded-[8px] px-[20px] py-[16px] mr-[16px]">
                <div className="text-[14px] text-[#0AFFFF] font-semibold flex items-center gap-[6px] mb-[12px] border-b border-[#19B2FF]/10 pb-[8px]">
                  <span className="inline-block w-[3px] h-[12px] bg-[#0AFFFF] shadow-[0_0_4px_#0AFFFF]"></span>
                  安全维度因子监控
                </div>
                <div className="flex-1 flex flex-col justify-around min-h-0">
                  <MiniIndicator
                    label="应用安全评估"
                    value={getRadarValue("应用安全", 88)}
                    color="#0AFFFF"
                    shadowColor="rgba(10, 255, 255, 0.4)"
                  />
                  <MiniIndicator
                    label="边界防御等级"
                    value={getRadarValue("边界防御", 95)}
                    color="#3ED99C"
                    shadowColor="rgba(62, 217, 156, 0.4)"
                  />
                  <MiniIndicator
                    label="主机防御指数"
                    value={getRadarValue("主机入侵", 92)}
                    color="#FFA319"
                    shadowColor="rgba(255, 163, 25, 0.4)"
                  />
                  <MiniIndicator
                    label="漏洞态势健康"
                    value={getRadarValue("漏洞态势", 85)}
                    color="#FA7736"
                    shadowColor="rgba(250, 119, 54, 0.4)"
                  />
                  <MiniIndicator
                    label="合规检测评估"
                    value={getRadarValue("合规检测", 90)}
                    color="#8A9BF7"
                    shadowColor="rgba(138, 155, 247, 0.4)"
                  />
                </div>
              </div>
            </div>
          </CardFrame>

          {/* 卡片5 (下，高度占约 36%) */}
          <CardFrame className="flex-[36] min-h-0 flex flex-col">
            <div className="text-[#FFFFFF] text-[16px] font-semibold mb-[8px] shrink-0 flex items-center gap-[6px]">
              <span className="inline-block w-[3px] h-[14px] bg-[#FFA319] shadow-[0_0_5px_#FFA319]"></span>
              告警变化趋势分析
            </div>
            <div className="flex-1 min-h-[0px] flex flex-col">
              <AlarmTrendChart data={data.alarmTrendData} />
            </div>
          </CardFrame>
        </div>

        {/* 右栏 (自适应 25% 比例宽度，垂直排布2张卡片以分配 27 : 73) */}
        <div className="flex-1 flex flex-col gap-[14px] h-full min-h-[0px]">
          {/* 卡片6 (上，占比 flex-[27]) */}
          <CardFrame className="flex-[27] min-h-0 flex flex-col">
            <div className="text-[#FFFFFF] text-[16px] font-semibold mb-[8px] shrink-0 flex items-center gap-[6px]">
              <span className="inline-block w-[3px] h-[14px] bg-[#0AFFFF] shadow-[0_0_5px_#0AFFFF]"></span>
              安全状态扫描
            </div>
            <div className="flex-1 min-h-[0px] flex flex-col">
              <SecurityScanScanner data={data.securityScanStats} />
            </div>
          </CardFrame>

          {/* 卡片7 (下，占比 flex-[73]) */}
          <CardFrame className="flex-[73] min-h-0 flex flex-col">
            <div className="text-[#FFFFFF] text-[#16px] font-semibold mb-[12px] shrink-0 flex items-center gap-[6px]">
              <span className="inline-block w-[3px] h-[14px] bg-[#FA7736] shadow-[0_0_5px_#FA7736]"></span>
              实时安全告警日志流
            </div>
            <div className="flex-1 min-h-[0px] flex flex-col">
              <RealtimeAttackList initialLogs={data.attackLogs} attackIpRankData={data.attackIpRankData} />
            </div>
          </CardFrame>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
