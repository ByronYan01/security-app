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


