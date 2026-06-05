import React, { useState, useEffect, useRef } from "react";
import type { AttackLog, AttackIpRank } from "@/data/mockData";

// 攻击类型随机池
const ATTACK_TYPES = [
  "SQL注入恶意探测",
  "密码暴破尝试",
  "未授权敏感文件读取",
  "SYN Flood 流量清洗警告",
  "SSRF漏洞请求劫持",
  "XSS跨站脚本攻击",
  "非法反弹Shell执行",
  "木马后门文件上传",
  "远程命令执行探测",
  "恶意扫描与越权请求",
];

// 攻击目标随机池
const TARGETS = [
  "API_Gateway_01",
  "Portal_Web_Server",
  "DB_Server_Cluster",
  "LB_Router_02",
  "Auth_Service",
  "Cache_Redis",
  "K8s_Node_03",
  "User_Center_Pod",
];

// 严重程度随机池
const SEVERITIES: ("critical" | "warning" | "info")[] = ["critical", "warning", "info"];

const DEFAULT_IPS = ["198.51.100.42", "203.0.113.88", "192.0.2.145", "81.92.12.33", "45.112.9.11"];

// 生成随机日志函数
const generateRandomLog = (index: number, ipList: AttackIpRank[] = []): AttackLog => {
  const date = new Date();
  const timeStr = [
    String(date.getHours()).padStart(2, "0"),
    String(date.getMinutes()).padStart(2, "0"),
    String(date.getSeconds()).padStart(2, "0"),
  ].join(":");

  const randomIp = ipList.length > 0
    ? ipList[Math.floor(Math.random() * ipList.length)].ip
    : DEFAULT_IPS[Math.floor(Math.random() * DEFAULT_IPS.length)];
  const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
  const type = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];
  const severity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];

  return {
    id: `rand-${Date.now()}-${index}`,
    time: timeStr,
    sourceIp: randomIp,
    targetName: target,
    attackType: type,
    severity,
  };
};

interface RealtimeAttackListProps {
  initialLogs?: AttackLog[];
  attackIpRankData?: AttackIpRank[];
}

const RealtimeAttackList: React.FC<RealtimeAttackListProps> = ({
  initialLogs = [],
  attackIpRankData = [],
}) => {
  const [logs, setLogs] = useState<AttackLog[]>(initialLogs);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);
  const logIndexCounter = useRef(0);

  // 同步外部传入的初始化日志
  useEffect(() => {
    if (initialLogs && initialLogs.length > 0) {
      setLogs(initialLogs);
    }
  }, [initialLogs]);

  // 1. 定期生成新日志，模拟真实态势，最大限制50条以防止DOM堆积与性能下降
  useEffect(() => {
    const timer = setInterval(() => {
      logIndexCounter.current += 1;
      const newLog = generateRandomLog(logIndexCounter.current, attackIpRankData);
      setLogs((prev) => {
        const next = [...prev, newLog];
        // 剪裁队列长度，只保留最新50条
        if (next.length > 50) {
          return next.slice(-50);
        }
        return next;
      });
    }, 2800);

    return () => clearInterval(timer);
  }, [attackIpRankData]);

  // 2. 利用 requestAnimationFrame 实现高度平滑的无缝循环滚动
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    // 每次滚动的位移量（像素值），值越小滚动越慢且越细腻平滑
    const scrollStep = 0.45;

    const scrollFunc = () => {
      if (container && !isHovered.current) {
        container.scrollTop += scrollStep;
        // 如果已滚动的高度超过了实际列表高度的一半（即完成了第一份 logs 的完全滚动）
        // 瞬间重置回 0 形成无缝衔接循环
        if (container.scrollTop >= container.scrollHeight / 2) {
          container.scrollTop = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scrollFunc);
    };

    animationFrameId = requestAnimationFrame(scrollFunc);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [logs]); // 当日志队列更新导致DOM重新计算高度时，重置滚动器以更新参考高度

  // 获取状态等级的色彩与阴影类
  const getSeverityStyle = (severity: AttackLog["severity"]) => {
    switch (severity) {
      case "critical":
        return {
          bg: "bg-[#FA7736]",
          shadow: "shadow-[0_0_8px_#FA7736]",
          text: "text-[#FA7736]",
          label: "严重威胁",
        };
      case "warning":
        return {
          bg: "bg-[#FFA319]",
          shadow: "shadow-[0_0_8px_#FFA319]",
          text: "text-[#FFA319]",
          label: "常规告警",
        };
      case "info":
      default:
        return {
          bg: "bg-[#3ED99C]",
          shadow: "shadow-[0_0_8px_#3ED99C]",
          text: "text-[#3ED99C]",
          label: "安全提示",
        };
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col min-h-[0px]">
      {/* 滚动容器 */}
      <div
        ref={containerRef}
        onMouseEnter={() => {
          isHovered.current = true;
        }}
        onMouseLeave={() => {
          isHovered.current = false;
        }}
        className="flex-1 overflow-y-auto custom-scrollbar select-none"
        style={{ scrollbarWidth: "none" }} // 隐藏标准滚动条以保证纯净大屏体验
      >
        <div className="flex flex-col">
          {/* 第一份日志队列 */}
          {logs.map((log) => {
            const style = getSeverityStyle(log.severity);
            return (
              <div
                key={log.id}
                className="flex items-start py-[10px] px-[8px] border-b border-[#19B2FF]/10 hover:bg-[#19B2FF]/5 transition-colors duration-200 shrink-0"
              >
                {/* 状态指示圆形灯（带呼吸发光效果） */}
                <div className="mt-[5px] mr-[10px] shrink-0">
                  <div className={`w-[8px] h-[8px] rounded-full ${style.bg} ${style.shadow}`}></div>
                </div>

                {/* 文本内容排版 */}
                <div className="flex-1 flex flex-col gap-[3px] min-w-[0px]">
                  {/* 第一行：攻击类型与发生时间 */}
                  <div className="flex justify-between items-center text-[13px] font-normal leading-normal">
                    <span className="text-[#FFFFFF] truncate font-medium pr-[8px]">
                      {log.attackType}
                    </span>
                    <span className="text-[#9B9DA5] font-mono text-[11px] shrink-0">
                      {log.time}
                    </span>
                  </div>

                  {/* 第二行：IP飞往目的指示 */}
                  <div className="text-[12px] font-mono font-medium text-[#0AFFFF]/90 flex items-center gap-[6px]">
                    <span className="truncate">{log.sourceIp}</span>
                    <span className="text-[#9B9DA5] font-sans font-light">→</span>
                    <span className="text-[#FFA319] truncate">{log.targetName}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 第二份副本，用于辅助实现垂直方向无缝滚动 */}
          {logs.map((log) => {
            const style = getSeverityStyle(log.severity);
            return (
              <div
                key={`dup-${log.id}`}
                className="flex items-start py-[10px] px-[8px] border-b border-[#19B2FF]/10 hover:bg-[#19B2FF]/5 transition-colors duration-200 shrink-0"
              >
                <div className="mt-[5px] mr-[10px] shrink-0">
                  <div className={`w-[8px] h-[8px] rounded-full ${style.bg} ${style.shadow}`}></div>
                </div>

                <div className="flex-1 flex flex-col gap-[3px] min-w-[0px]">
                  <div className="flex justify-between items-center text-[13px] font-normal leading-normal">
                    <span className="text-[#FFFFFF] truncate font-medium pr-[8px]">
                      {log.attackType}
                    </span>
                    <span className="text-[#9B9DA5] font-mono text-[11px] shrink-0">
                      {log.time}
                    </span>
                  </div>

                  <div className="text-[12px] font-mono font-medium text-[#0AFFFF]/90 flex items-center gap-[6px]">
                    <span className="truncate">{log.sourceIp}</span>
                    <span className="text-[#9B9DA5] font-sans font-light">→</span>
                    <span className="text-[#FFA319] truncate">{log.targetName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RealtimeAttackList;
