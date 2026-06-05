// security-app 静态 Mock 数据源
// 开发或打包时可直接修改此文件中的数据来改变大屏的展示内容

// ==================== 1. 数据结构类型声明 ====================

// 综合安全评分与大屏今日状态
export interface SecurityStatus {
  score: number; // 当前总体安全评分（显示在雷达大图中心，如 92）
  statusText: string; // 安全状态评语（如 "态势良好"、"中度风险"）
  todayAttacks: number; // 今日遭受攻击总数（显示在大屏左上角，如 14,285）
}

// 攻击源IP排名Top5
export interface AttackIpRank {
  rank: number; // 排行名次（1 - 5）
  ip: string; // 源 IP 地址
  location: string; // IP 对应的归属地理位置（如 "华东地区"、"海外地区"）
  count: number; // 攻击发起次数
}

// 漏洞类型占比Top5
export interface VulnTypeRatio {
  type: string; // 漏洞攻击类型名称（如 "SQL注入攻击"）
  count: number; // 漏洞被触发或阻击的累计次数
}

// 卡型号平均收益（卡型号平均收益卡片数据）
export interface GpuModelEarning {
  modelName: string; // GPU 显卡型号名称（如 "NVIDIA H800"）
  earningsPerHour: number; // 每小时平均收益金额 (单位：CNY/hour)
}

// 节点安全状态扫描
export interface SecurityScanStats {
  totalNodesScanned: number; // 已扫描的节点总数（如 120）
  scanProgress: number; // 扫描进度百分比（用于圆环进度条，如 88 表示 88%）
  passedCount: number; // 扫描已通过的安全节点数（如 112）
  vulnWarningCount: number; // 发现的漏洞告警节点数（如 6）
  highRiskCount: number; // 发现的高危风险节点数（如 2）
}

// 雷达态势维度数据（安全态势中心大图的 5 个顶角数据）
export interface RadarDimension {
  name: string; // 维度名称（如 "应用安全"）
  value: number; // 该维度当前的安全得分（0 - 100）
  max: number; // 维度上限值（固定为 100）
}

// 告警变化趋势折线数据点
export interface AlarmTrendPoint {
  time: string; // 时间点（X轴刻度，如 "00:00"、"02:00"）
  critical: number; // 该时段内发生的严重威胁告警数量（橙色折线）
  warning: number; // 该时段内发生的常规告警数量（黄色折线）
}

// 实时安全告警日志
export interface AttackLog {
  id: string; // 告警唯一标识符 ID
  time: string; // 触发时间点（格式为 hh:mm:ss）
  sourceIp: string; // 发起攻击的源 IP
  targetName: string; // 遭受攻击的目标服务器/服务名称
  attackType: string; // 具体的攻击威胁类型
  severity: "critical" | "warning" | "info"; // 威胁严重等级（决定日志流中前缀的颜色与高亮状态）
}

// ==================== 2. 统一导出 Mock 数据常量 ====================

/**
 * 1. 综合安全状态与今日遭受攻击总数
 * 影响位置：
 * - 顶栏左侧：“今日遭受攻击总数”的显示值 (todayAttacks)
 * - 中间大图：“安全态势感知中心”雷达图中心的巨大安全指数分值 (score)
 */
export const securityStatus: SecurityStatus = {
  score: 92, // 雷达图中心安全指数数字
  statusText: "态势良好", // 系统状态（预留）
  todayAttacks: 14285, // 顶栏左侧今日遭受攻击次数（数字自动格式化，如 14,285 次）
};

/**
 * 2. 攻击源IP排名Top5
 * 影响位置：
 * - 左侧栏卡片1：“攻击源IP排名Top5”的表格数据以及柱状图
 */
export const attackIpRankData: AttackIpRank[] = [
  { rank: 1, ip: "198.51.100.42", location: "海外地区", count: 3412 },
  { rank: 2, ip: "203.0.113.88", location: "华东地区", count: 2180 },
  { rank: 3, ip: "192.0.2.145", location: "海外地区", count: 1890 },
  { rank: 4, ip: "81.92.12.33", location: "华南地区", count: 1250 },
  { rank: 5, ip: "45.112.9.11", location: "局域网段", count: 870 },
];

/**
 * 3. 漏洞攻击类型分布Top5
 * 影响位置：
 * - 左侧栏卡片2：“漏洞攻击类型分布Top5”的半圆环形比例图
 */
export const vulnTypeData: VulnTypeRatio[] = [
  { type: "SQL注入攻击", count: 4850 },
  { type: "XSS跨站脚本", count: 3200 },
  { type: "DDoS流量攻击", count: 2900 },
  { type: "密码暴力破解", count: 1800 },
  { type: "非授权文件上传", count: 1535 },
];

/**
 * 4. 卡型号平均收益
 * 影响位置：
 * - 左侧栏卡片3：“卡型号平均收益”的横向柱状图
 */
export const gpuModelEarnings: GpuModelEarning[] = [
  { modelName: "NVIDIA H800", earningsPerHour: 45.0 },
  { modelName: "NVIDIA A100", earningsPerHour: 32.5 },
  { modelName: "NVIDIA L40S", earningsPerHour: 24.8 },
  { modelName: "RTX 4090", earningsPerHour: 12.0 },
  { modelName: "NVIDIA A30", earningsPerHour: 8.5 },
];

/**
 * 5. 安全状态扫描
 * 影响位置：
 * - 右侧栏卡片6（上）：“安全状态扫描”的圆形扫描进度条与各项扫描数字指标
 */
export const securityScanStats: SecurityScanStats = {
  totalNodesScanned: 120, // 已扫描节点总数
  scanProgress: 88, // 圆环进度条刻度（%）
  passedCount: 112, // 绿色高亮：“已通过”节点数
  vulnWarningCount: 6, // 黄色高亮：“漏洞告警”节点数
  highRiskCount: 2, // 红色高亮：“高危风险”节点数
};

/**
 * 6. 安全态势中心 - 五大安全维度因子数据
 * 影响位置：
 * - 中间主栏卡片4（上）：“安全态势感知中心”的雷达图顶点拉伸范围
 * - 右侧监控面板：“安全维度因子监控”中对应的 5 个能量监控进度条的值
 * 注：此处数组中 name、value 需与右侧面板进度条组件一一映射
 */
export const radarDimensions: RadarDimension[] = [
  { name: "应用安全", value: 88, max: 100 }, // 对应：应用安全评估
  { name: "边界防御", value: 95, max: 100 }, // 对应：边界防御等级
  { name: "主机入侵", value: 92, max: 100 }, // 对应：主机防御指数
  { name: "漏洞态势", value: 85, max: 100 }, // 对应：漏洞态势健康
  { name: "合规检测", value: 90, max: 100 }, // 对应：合规检测评估
];

/**
 * 7. 告警变化趋势分析（24小时走势）
 * 影响位置：
 * - 中间主栏卡片5（下）：“告警变化趋势分析”图表折线的 12 个时刻点取样数据
 * X轴展示 time (时刻)；Y轴分别画出 critical (严重威胁数，橙色线) 和 warning (常规告警数，黄色线)
 */
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
  { time: "22:00", critical: 10, warning: 35 },
];

/**
 * 8. 实时安全告警日志流
 * 影响位置：
 * - 右侧栏卡片7（下）：“实时安全告警日志流”中滚动的最新攻击告警日志项列表
 * - severity 可选值为：'critical' (严重，红标高亮) | 'warning' (警告，橙标) | 'info' (常规通知，蓝标)
 */
export const attackLogs: AttackLog[] = [
  {
    id: "1",
    time: "16:01:05",
    sourceIp: "198.51.100.42",
    targetName: "API_Gateway_01",
    attackType: "SQL注入恶意探测",
    severity: "critical",
  },
  {
    id: "2",
    time: "16:01:42",
    sourceIp: "203.0.113.88",
    targetName: "Portal_Web_Server",
    attackType: "密码暴破尝试",
    severity: "warning",
  },
  {
    id: "3",
    time: "16:02:11",
    sourceIp: "192.0.2.145",
    targetName: "DB_Server_Cluster",
    attackType: "未授权敏感文件读取",
    severity: "critical",
  },
  {
    id: "4",
    time: "16:03:00",
    sourceIp: "81.92.12.33",
    targetName: "LB_Router_02",
    attackType: "SYN Flood 流量清洗警告",
    severity: "info",
  },
  {
    id: "5",
    time: "16:03:55",
    sourceIp: "45.112.9.11",
    targetName: "Auth_Service",
    attackType: "SSRF漏洞请求劫持",
    severity: "warning",
  },
];
