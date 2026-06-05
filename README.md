# 安全态势感知大屏 (security-app) 开发与设计指南

本工程为**安全态势感知大屏**。为了保持与同系列大屏（参考源：`../prometheus-app`）在视觉风格、色彩搭配、组件规范上的完全一致，后续开发人员（包括 AI 助手）应严格遵循本规划文档进行开发。

---

## 1. 整体视觉风格与配色规范

由于本系统是安全与收益主题，除了沿用主系列的科技深蓝色外，会更频繁地引入**橙黄色系和警告红色系**。所有组件及图表必须遵守以下色值定义：

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
| |  攻击IP排行 Top5  | | |        安全态势          | | |   安全状态扫描   | |
| |(ChartList-32%)   | | |      (雷达图 - 58%)       | | |  (Scanner-25%)   | |
| +------------------+ | |                           | | +------------------+ |
| |  漏洞类型 Top5   | | +---------------------------+ | |                    | |
| |  (ECharts-32%)   | | |        告警变化趋势       | | |    攻击实时列表    | |
| +------------------+ | |      (折线面积 - 38%)    | | |    (无缝滚动 -     | |
| |  卡型号平均收益  | | |                           | | |       71% 高度)    | |
| |  (ECharts-32%)   | | |                           | | |                    | |
| +------------------+ | +---------------------------+ | +------------------+ |
+----------------------+-------------------------------+----------------------+
```

*   **顶部 Header (高度占约 10% 或固定 80px)**:
    *   横向底线：渐变色从两端透明到中间亮蓝 (`rgba(138, 155, 247, 1)`)。
    *   大标题：水平居中，文字“安全态势感知大屏”采用 `#ADF7FF` 到 `#FFFFFF` 的垂直渐变，底部垫有 `src/assets/svg/header-bottom.svg` 装饰线。
*   **主体区域 (高度占约 90%，Flex 横向排布，gap 为 16px)**:
    *   **左侧栏 (宽度 25%，Flex 纵向，gap 为 12px)**:
        *   卡片1（上，高度 32%）：`攻击源IP排名Top5`。采用图表+列表的并排形式（可直接调用通用组件 [ChartListCard.tsx](file:///c:/D/work/zs/security-app/src/components/common/ChartListCard.tsx)）。
        *   卡片2（中，高度 32%）：`漏洞攻击类型分布Top5`。展现常见攻击类型的占比。
        *   卡片3（下，高度 32%）：`卡型号平均收益`。展示不同 GPU 卡型号的平均小时收益趋势，对比分析资产使用效率。
    *   **中间主视觉 (宽度 50%，Flex 纵向布局，gap 为 12px)**:
        *   卡片4（上，高度 58%）：`安全态势`（雷达图）。作为中央主视觉，展示安全指标评估并带有安全评分核心数值。
        *   卡片5（下，高度 38%）：`告警变化趋势`（折线面积图）。
    *   **右侧栏 (宽度 25%，Flex 纵向，gap 为 12px)**:
        *   卡片6（上，高度 25%）：`安全状态扫描`。动态展示服务器安全合规性扫描的全局概览。
        *   卡片7（下，高度 71%）：`攻击实时列表`。动态无限滚动的安全告警日志列表。

---

## 3. 功能点详细设计与图表实现规范

### 1) 攻击源IP排名Top5 (AttackIpTop5)
*   **实现方式**: 直接调用 [ChartListCard.tsx](file:///c:/D/work/zs/security-app/src/components/common/ChartListCard.tsx)。
*   **图表细节**:
    *   左侧是一个水平柱状图：柱形采用警告色系渐变（起色 `#FFA319`，止色 `#FA7736`）。
    *   右侧是排名列表，列包含 `排名`、`源IP`、`次数`。表格行背景使用红色渐变淡影。

### 2) 漏洞攻击类型分布Top5 (VulnTypePieChart)
*   **展现形式**: ECharts 南丁格尔玫瑰饼图 (`roseType: "radius"`）。
*   **图表配置**:
    *   圆环半径为 `["30%", "70%"]`，中间镂空。
    *   板块颜色选用安全危险度色盘 `["#FA7736", "#FFA319", "#FFDA47", "#AB70FF", "#6FC7FF"]`。

### 3) 卡型号平均收益 (GpuModelEarningsChart)
*   **展现形式**: ECharts 水平渐变柱状图。
*   **图表细节**:
    *   Y轴为卡型号（如 H800, A100, RTX4090），X轴为平均收益（¥/小时）。
    *   柱条使用金色/亮黄色渐变（起色 `#FFA319`，止色 `#FFDA47`），以和算力大屏的收益配色呼应。
    *   右侧配有滑轨槽背景。

### 4) 安全态势中心大图 (SecurityRadarChart)
*   **主视觉设计**: 渲染一个大型的五角雷达图（Radar Chart），评估以下维度：
    1. 应用安全、2. 边界防御、3. 主机入侵、4. 漏洞态势、5. 合规检测。
    雷达中心浮动显示当前安全综合评分（例如 `92`），文字采用 `font-jlinxin` 亮青色大字。

### 5) 告警变化趋势 (AlarmTrendChart)
*   **展现形式**: ECharts 双折线面积图。
*   **图表配置**:
    *   双折线分别为：“严重威胁数”（红 `#FA7736`）和“常规告警数”（黄 `#FFDA47`），下方填充渐变半透明面积阴影。

### 6) 安全状态扫描 (SecurityScanScanner)
*   **展现形式**: 
    *   绘制一个带有雷达扫掠雷达线、转圈动效的圆形状态扫描盘，文字显示“系统安全漏洞扫描中...”。
    *   统计当前参与扫描的节点中：已通过（绿色）、发现高危风险（红色）、存在合规漏洞（黄色）的数量。

### 7) 攻击实时列表 (RealtimeAttackList)
*   **展现形式**: 无缝循环向上滚动列表组件（自动滚动，鼠标悬停时暂停）。
*   **行样式**: 左侧显示警告级别指示图标（红 Critical、黄 Warning、绿 Info），带有两行布局排版和动态更新的日志内容。

---

## 4. Mock 数据管理与文件树规范

所有大屏数据统一维护在 `src/data/mockData.ts` 中。

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
│   │       ├── AlarmTrendChart.tsx    # 【新建】告警折线图组件
│   │       └── GpuModelEarningsChart.tsx # 【新建】卡型号收益柱状图
│   ├── pages/
│   │   └── Dashboard/
│   │       ├── index.tsx       # 【修改】装配主大屏并引入数据
│   │       ├── StatCard.tsx    # 已存在：指标卡片
│   │       ├── RealtimeAttackList.tsx # 【新建】滚动警告列表组件
│   │       └── SecurityScanScanner.tsx # 【新建】安全节点扫描组件
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
  location: string;
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

// ... 其余雷达图、折线图、日志数据接口定义
```

## 5. 项目调试与编译要求

1.  项目须通过 `npm run lint` 和 `npm run build` 进行打包自检，不能带有一切代码规范警告与语法报错。
2.  滚动列表组件 `RealtimeAttackList.tsx` 的 DOM 渲染需要做长度剪裁（例如队列只保留最新 50 条，并在此循环滑动），以避免大屏在长时间运行时因 DOM 节点堆积导致性能下降。
