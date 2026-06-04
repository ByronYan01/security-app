# 网络安全与态势感知大屏 (security-app) 开发与设计指南

本工程为**网络安全与态势感知大屏**。为了保持与同系列大屏（参考源：`../prometheus-app`）在视觉风格、色彩搭配、组件规范上的完全一致，后续开发人员（包括 AI 助手）应严格遵循本规划文档进行开发。

---

## 1. 整体视觉风格与配色规范

由于本系统是安全主题，除了沿用主系列的科技深蓝色外，会更频繁地引入**橙黄色系和警告红色系**。所有组件及图表必须遵守以下色值定义：

*   **背景色**: 深海军蓝 `#020619` (`bg-navy-900`)
*   **卡片背景**: 半透明蓝黑色 `#112240` (`bg-navy-800`，不透明度 `0.85` ~ `0.9` 混合)
*   **卡片边框与内发光**: 半透明亮蓝色 `#19B2FF/60` (即 `rgba(25, 178, 255, 0.6)`)
    *   边框效果与发光：直接使用本工程中的 `src/components/common/CardFrame.tsx` 组件
*   **警告与状态色系**: 
    *   致命/高级警告 (Critical/High): 红色 `#FA7736` / 亮红 `rgba(250, 119, 54, 0.9)`
    *   一般警告/高亮 (Warning/Medium): 橙黄色 `#FFA319` 到 `#FFDA47`
    *   安全/正常 (Normal): 亮青色 `#0AFFFF` 或淡绿色 `#3ED99C`
*   **文字颜色**: 标题纯白 `#FFFFFF`，指标数字采用 `#FFA319`（警告级指标）或 `#0AFFFF`（安全状态指标），辅助灰色 `#9B9DA5`。

---

## 2. 页面布局与栅格系统 (Layout)

页面采用 `w-screen h-screen overflow-hidden` 绝对自适应布局，整体分为上下结构，主体部分分为左、中、右三栏：

```
+-----------------------------------------------------------------------------+
|                                  顶部 Header                                 |
+----------------------+-------------------------------+----------------------+
|       左侧栏 (25%)   |          中间主视觉 (50%)      |       右侧栏 (25%)   |
|                      |                               |                      |
| +------------------+ | +---------------------------+ | +------------------+ |
| |  攻击IP排行 Top5  | | |        安全态势          | | |                    | |
| |(ChartList-45%)   | | |      (雷达图 - 56%)       | | |                    | |
| +------------------+ | |                           | | |                    | |
| |                  | | +---------------------------+ | |    攻击实时列表    | |
| |                  | | |        告警变化趋势       | | |    (无缝滚动 -     | |
| | 漏洞攻击类型Top5  | | |      (折线面积 - 32%)    | | |       100% 高度)   | |
| |  (ECharts-45%)   | | |                           | | |                    | |
| |                  | | |                           | | |                    | |
| +------------------+ | +---------------------------+ | +------------------+ |
+----------------------+-------------------------------+----------------------+
```

*   **顶部 Header (高度占约 10% 或固定 80px)**:
    *   横向底线：渐变色从两端透明到中间亮蓝 (`rgba(138, 155, 247, 1)`)。
    *   大标题：水平居中，文字“网络安全与态势感知大屏”采用 `#ADF7FF` 到 `#FFFFFF` 的垂直渐变，底部垫有 `src/assets/svg/header-bottom.svg` 装饰线。
*   **主体区域 (高度占约 90%，Flex 横向排布，gap 为 16px)**:
    *   **左侧栏 (宽度 25%，Flex 纵向，gap 为 12px)**:
        *   卡片1（上，高度 46%）：`攻击源IP排名Top5`。采用图表+列表的并排形式（可直接调用通用组件 [ChartListCard.tsx](file:///c:/D/work/zs/security-app/src/components/common/ChartListCard.tsx)）。
        *   卡片2（下，高度 50%）：`漏洞攻击类型分布Top5`。展现常见攻击类型的占比。
    *   **中间主视觉 (宽度 50%，Flex 纵向布局，gap 为 12px)**:
        *   卡片3（上，高度 60%）：`安全态势`（雷达图）。作为中央主视觉，展示安全指标评估。
        *   卡片4（下，高度 40%）：`告警变化趋势`（折线面积图）。
    *   **右侧栏 (宽度 25%)**:
        *   卡片5（占 100% 高度）：`攻击实时列表`。动态无限滚动的安全告警日志列表。

---

## 3. 功能点详细设计与图表实现规范

### 1) 攻击源IP排名Top5 (AttackIpTop5)
*   **实现方式**: 直接调用 [ChartListCard.tsx](file:///c:/D/work/zs/security-app/src/components/common/ChartListCard.tsx)。
*   **图表细节**:
    *   左侧是一个水平柱状图：柱形采用警告色系渐变（起色 `#FFA319`，止色 `#FA7736`）。
    *   右侧是排名列表，列包含 `排名`、`源IP`、`次数`。表格行背景使用红色渐变淡影（设置参数 `rowBackgroundColor="rgba(250, 119, 54, 0.15)"`）。

### 2) 漏洞攻击类型分布Top5 (VulnTypePieChart)
*   **展现形式**: ECharts 南丁格尔玫瑰饼图 (`roseType: "radius"`）。
*   **图表配置**:
    *   圆环半径为 `["30%", "70%"]`，中间镂空。
    *   前 5 大漏洞类型（如 SQL注入、跨站脚本、DDoS、暴力破解、非法上传）使用不同半径大小的扇区突出占比大小。
    *   板块颜色选用色盘 `["#FA7736", "#FFA319", "#FFDA47", "#AB70FF", "#6FC7FF"]`。

### 3) 安全态势中心大图 (SecurityRadarChart)
*   **主视觉设计**: 渲染一个大型的五角雷达图（Radar Chart），评估以下维度：
    1. `应用安全` (Application Security)
    2. `边界防御` (Boundary Defense)
    3. `主机入侵` (Host Intrusion)
    4. `漏洞态势` (Vulnerability)
    5. `合规检测` (Compliance)
*   **图表配置**:
    *   雷达图背景线为半透明科技蓝，网格线类型设为多边形（非圆形）。
    *   雷达区域面积填充为 `#19B2FF` 的半透明渐变（不透明度 `0.3`），边框线为高亮青色 `#0AFFFF`，并带有一圈阴影。
    *   在雷达图中心上方展示一个醒目的当前安全综合评分（例如 `92`），文字采用 `font-jlinxin` 亮青色大字，营造视觉焦点。

### 4) 告警变化趋势 (AlarmTrendChart)
*   **展现形式**: ECharts 双折线面积图。
*   **图表配置**:
    *   双折线分别为：“严重威胁数”和“常规告警数”。
    *   “严重威胁”折线为红色 `#FA7736`，下方填充红透明面积渐变（`rgba(250, 119, 54, 0.15)` 到透明）。
    *   “常规告警”折线为金黄色 `#FFDA47`，下方填充黄透明面积渐变。
    *   X 轴为时间轴（如过去 24 小时或 7 天的采样点），Y 轴为次数。

### 5) 攻击实时列表 (RealtimeAttackList)
*   **展现形式**: 一个竖直占满大屏右侧的自定义滚动列表组件。
*   **自动滚动效果**:
    *   使用纯 CSS（`@keyframes` 或结合 React 状态）实现列表的**无缝循环向上滚动**。
    *   当鼠标悬停（Hover）在列表上时，滚动暂停；鼠标离开后继续滚动。
*   **行样式**:
    *   每一行是一条告警，左侧显示警告级别颜色图标（红色代表 Critical，黄色代表 Warning，绿色代表 Info）。
    *   中间包含三行排版：第一行是攻击类型与时间（白字与灰字），第二行是源 IP 飞往目的 IP 的文字指示（如 `184.22.9.23 -> Web_Server_01`）。
    *   行底框带有一条极细的半透明分割线，整体滚动平滑无卡顿。

---

## 4. Mock 数据管理与文件树规范

所有大屏数据统一维护在 `src/data/mockData.ts` 中，严禁分散硬编码。

### 文件树划分
```
security-app/
├── docs/reference/
│   └── analysis_results.md     # 风格与色系参考指南
├── src/
│   ├── data/
│   │   └── mockData.ts         # 【必填】所有的 Mock 数据定义和实例
│   ├── components/
│   │   ├── common/
│   │   │   ├── CardFrame.tsx   # 已存在：科技感边框
│   │   │   ├── PlainCard.tsx   # 已存在：极简卡片
│   │   │   └── ChartListCard.tsx # 已存在：图表+列表卡片
│   │   └── charts/
│   │       ├── BaseChart.tsx   # 已存在：ECharts 暗色自适应基底
│   │       ├── SecurityRadarChart.tsx # 【新建】雷达安全态势组件
│   │       ├── VulnTypePieChart.tsx   # 【新建】漏洞类型玫瑰图
│   │       └── AlarmTrendChart.tsx    # 【新建】告警折线图组件
│   ├── pages/
│   │   └── Dashboard/
│   │       ├── index.tsx       # 【修改】装配主大屏并引入数据
│   │       ├── StatCard.tsx    # 已存在：指标卡片
│   │       └── RealtimeAttackList.tsx # 【新建】滚动警告列表组件
│   └── App.tsx                 # 已存在：全局暗色主题配置
```

### Mock 数据规范定义 (`src/data/mockData.ts`)
开发时，请在 `mockData.ts` 中编写以下结构并导出：

```typescript
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
  { rank: 2, ip: "203.0.113.88", location: "国内某省", count: 2180 },
  { rank: 3, ip: "192.0.2.145", location: "海外地区", count: 1890 },
  { rank: 4, ip: "81.92.12.33", location: "国内某市", count: 1250 },
  { rank: 5, ip: "45.112.9.11", location: "内网穿透", count: 870 }
];

export const vulnTypeData: VulnTypeRatio[] = [
  { type: "SQL注入攻击", count: 4850 },
  { type: "XSS跨站脚本", count: 3200 },
  { type: "DDoS流量攻击", count: 2900 },
  { type: "密码暴力破解", count: 1800 },
  { type: "非授权文件上传", count: 1535 }
];

export const radarDimensions: RadarDimension[] = [
  { name: "应用安全", value: 88, max: 100 },
  { name: "边界防御", value: 95, max: 100 },
  { name: "主机入侵", value: 92, max: 100 },
  { name: "漏洞态势", value: 85, max: 100 },
  { name: "合规检测", value: 90, max: 100 }
];

// ... 其余 AlarmTrendPoint[] 和 AttackLog[] 均在内部实例化并导出
```

## 5. 项目调试与编译要求

1.  项目须通过 `npm run lint` 和 `npm run build` 进行打包自检，不能带有一切代码规范警告与语法报错。
2.  滚动列表组件 `RealtimeAttackList.tsx` 的 DOM 渲染需要做长度剪裁（例如队列只保留最新 50 条，并在此循环滑动），以避免大屏在长时间运行时因 DOM 节点堆积导致性能下降。
