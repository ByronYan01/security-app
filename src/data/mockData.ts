// security-app 静态 Mock 数据源
// 开发或打包时可直接修改此文件中的数据

// 1. 综合安全评分
export interface SecurityStatus {
  score: number;       // 当前安全评分
  statusText: string;  // 安全评估（如 "态势良好"、"中度风险"）
  todayAttacks: number;// 今日遭受攻击总数
}

// 2. 攻击源IP排名
export interface AttackIpRank {
  rank: number;
  ip: string;
  location: string; // 地理归属地
  count: number;
}

// 3. 漏洞类型占比
export interface VulnTypeRatio {
  type: string;
  count: number;
}

// 新增：卡型号平均收益
export interface GpuModelEarning {
  modelName: string;
  earningsPerHour: number; // 收益金额 (CNY/hour)
}

// 新增：节点安全扫描状态
export interface SecurityScanStats {
  totalNodesScanned: number;
  scanProgress: number;   // 扫描进度 %
  passedCount: number;    // 已通过
  vulnWarningCount: number; // 漏洞告警数
  highRiskCount: number;  // 高危风险数
}

// 4. 雷达态势数据
export interface RadarDimension {
  name: string;
  value: number; // 0 - 100
  max: number;
}

// 5. 告警变化趋势
export interface AlarmTrendPoint {
  time: string; // 时间点 e.g., "10:00"
  critical: number; // 严重告警数
  warning: number;  // 常规告警数
}

// 6. 实时攻击日志
export interface AttackLog {
  id: string;
  time: string;       // 发生时间 e.g., "16:05:19"
  sourceIp: string;   // 攻击源
  targetName: string; // 攻击目标
  attackType: string; // 攻击类型
  severity: "critical" | "warning" | "info";
}

// ==================== 统一导出 Mock 数据常量 ====================
export const securityStatus: SecurityStatus = {
  score: 92,
  statusText: "态势良好",
  todayAttacks: 14285
};

export const attackIpRankData: AttackIpRank[] = [
  { rank: 1, ip: "198.51.100.42", location: "海外地区", count: 3412 },
  { rank: 2, ip: "203.0.113.88", location: "华东地区", count: 2180 },
  { rank: 3, ip: "192.0.2.145", location: "海外地区", count: 1890 },
  { rank: 4, ip: "81.92.12.33", location: "华南地区", count: 1250 },
  { rank: 5, ip: "45.112.9.11", location: "局域网段", count: 870 }
];

export const vulnTypeData: VulnTypeRatio[] = [
  { type: "SQL注入攻击", count: 4850 },
  { type: "XSS跨站脚本", count: 3200 },
  { type: "DDoS流量攻击", count: 2900 },
  { type: "密码暴力破解", count: 1800 },
  { type: "非授权文件上传", count: 1535 }
];

export const gpuModelEarnings: GpuModelEarning[] = [
  { modelName: "NVIDIA H800", earningsPerHour: 45.00 },
  { modelName: "NVIDIA A100", earningsPerHour: 32.50 },
  { modelName: "NVIDIA L40S", earningsPerHour: 24.80 },
  { modelName: "RTX 4090", earningsPerHour: 12.00 },
  { modelName: "NVIDIA A30", earningsPerHour: 8.50 }
];

export const securityScanStats: SecurityScanStats = {
  totalNodesScanned: 120,
  scanProgress: 88,
  passedCount: 112,
  vulnWarningCount: 6,
  highRiskCount: 2
};

export const radarDimensions: RadarDimension[] = [
  { name: "应用安全", value: 88, max: 100 },
  { name: "边界防御", value: 95, max: 100 },
  { name: "主机入侵", value: 92, max: 100 },
  { name: "漏洞态势", value: 85, max: 100 },
  { name: "合规检测", value: 90, max: 100 }
];

export const alarmTrendData: AlarmTrendPoint[] = [
  { time: "00:00", critical: 5, warning: 18 },
  { time: "02:00", critical: 3, warning: 12 },
  { time: "04:00", critical: 4, warning: 15 },
  { time: "06:00", critical: 2, warning: 10 },
  { time: "08:00", critical: 8, warning: 28 },
  { time: "10:00", critical: 15, warning: 45 },
  { time: "12:00", critical: 12, warning: 38 },
  { time: "14:00", critical: 20, warning: 56 },
  { time: "16:00", critical: 18, warning: 50 },
  { time: "18:00", critical: 28, warning: 75 },
  { time: "20:00", critical: 22, warning: 62 },
  { time: "22:00", critical: 10, warning: 35 }
];

export const attackLogs: AttackLog[] = [
  { id: "1", time: "16:01:05", sourceIp: "198.51.100.42", targetName: "API_Gateway_01", attackType: "SQL注入恶意探测", severity: "critical" },
  { id: "2", time: "16:01:42", sourceIp: "203.0.113.88", targetName: "Portal_Web_Server", attackType: "密码暴破尝试", severity: "warning" },
  { id: "3", time: "16:02:11", sourceIp: "192.0.2.145", targetName: "DB_Server_Cluster", attackType: "未授权敏感文件读取", severity: "critical" },
  { id: "4", time: "16:03:00", sourceIp: "81.92.12.33", targetName: "LB_Router_02", attackType: "SYN Flood 流量清洗警告", severity: "info" },
  { id: "5", time: "16:03:55", sourceIp: "45.112.9.11", targetName: "Auth_Service", attackType: "SSRF漏洞请求劫持", severity: "warning" }
];
