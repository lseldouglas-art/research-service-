import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

// 论文类型配置
const PAPER_TYPES: Record<string, {
  id: string;
  name: string;
  description: string;
  structure: string[];
  features: string[];
}> = {
  review: {
    id: 'review',
    name: '综述论文',
    description: '系统性梳理某一领域研究进展',
    structure: ['引言', '核心章节', '结论与展望'],
    features: ['大量文献支撑', '章节按主题组织', '强调研究脉络'],
  },
  research: {
    id: 'research',
    name: '研究论文',
    description: '报告原创性研究成果',
    structure: ['引言', '方法', '结果', '讨论', '结论'],
    features: ['IMRaD结构', '强调方法创新', '数据驱动结论'],
  },
  methodology: {
    id: 'methodology',
    name: '方法论文',
    description: '介绍新方法、技术或工具',
    structure: ['引言', '方法原理', '实验设计', '验证', '应用示例'],
    features: ['强调方法新颖性', '可重复性验证', '应用场景展示'],
  },
  case_study: {
    id: 'case_study',
    name: '案例研究',
    description: '深入分析特定案例或现象',
    structure: ['引言', '案例背景', '案例分析', '讨论', '结论'],
    features: ['深入分析', '理论联系实际', '启示与借鉴'],
  },
  theoretical: {
    id: 'theoretical',
    name: '理论论文',
    description: '提出或验证理论模型',
    structure: ['引言', '理论框架', '推导/证明', '讨论', '结论'],
    features: ['理论创新', '逻辑严密', '数学推导'],
  },
  perspective: {
    id: 'perspective',
    name: '观点论文',
    description: '提出新观点或研究展望',
    structure: ['引言', '现状分析', '核心观点', '论证', '展望'],
    features: ['观点鲜明', '论证有力', '前瞻性'],
  },
};

// 第一步：文献批量分析与分级提示词
function generateLiteratureAnalysisPrompt(
  writingTopic: string,
  literatureList: string,
  paperType: string
): string {
  const typeConfig = PAPER_TYPES[paperType] || PAPER_TYPES.review;

  return `## 核心任务

根据我设定的 **[写作主题]**，深入分析我提供的 **[待分析论文列表]** 中的每一篇文献。你的目标不是进行简单的筛选，而是为我的**${typeConfig.name}**写作识别和提取所有潜在有价值的信息，并评估其相关性等级。

---

## 写作主题
${writingTopic}

## 论文类型
${typeConfig.name}：${typeConfig.description}

---

## 工作流程

### 分类标准与信息提取要求

#### 1. 核心相关 (A)
**判断标准**：论文的主要研究内容就是 [写作主题]

**信息提取**：
- 关键信息：用1-2句话，总结与主题相关的关键发现

#### 2. 间接相关 / 可作支撑 (B)
**判断标准**：论文可以用来支撑 [写作主题] 的某个论点

**信息提取**：
- 关键信息：用1-2句话，总结与主题相关的关键发现

#### 3. 关联度较低 / 仅供参考 (C)
**判断标准**：论文只提到了 [写作主题]，但并未对其进行任何实质性的分析、讨论或产生新的数据

**信息提取**：
- 关键信息：用1-2句话，总结与主题相关的关键发现

#### 4. 彻底无关 (D)
**判断标准**：论文内容与 [写作主题] 完全无关

**处理方式**：标记为"D"，并可选择性说明原因（例如：主题词歧义）

---

## 输出格式

请给我一个包含所有论文的完整表格，清晰的列表形式呈现分析结果，按照论文序号（而不是分类标准）排序。

| 序号 | 作者 | 标题 | 年限 | 类型 | 相关性 | 关键信息 |
|------|------|------|------|------|--------|----------|
| 1 | xxx | xxx | 2024 | 研究论文 | A | xxx |
| 2 | xxx | xxx | 2023 | 综述 | B | xxx |
| ... | ... | ... | ... | ... | ... | ... |

---

## 核心原则（请始终牢记）

我的最终目标是"寻找一切可能的关联，而非轻易地排除任何一篇文献"。在论文写作中，一个看似微弱的联系点也可能成为连接不同研究领域的桥梁。请你务必以这种包容、深入、富有洞察力的视角来完成这项任务。

---

## 待分析论文列表

${literatureList}`;
}

// 第二步：大纲生成提示词 - 综述论文
function generateReviewOutlinePrompt(
  writingTopic: string,
  literatureAnalysis: string,
  paperType: string
): string {
  return `你是一位经验丰富的科研分析师和学术作家。你的任务是基于用户提供的综述主题和相关的论文信息列表，构建一个逻辑严密、结构完整、且文献支撑充足的综述论文大纲。

请严格按照以下步骤和格式要求执行：

---

## 设定主题

本次综述论文的主题是："${writingTopic}"。

---

## 构建框架

首先，请创建大纲的整体框架，必须包含以下部分：
1. 第一章 引言
2. 核心技术章节（根据步骤4生成）
3. 最后一章 结论与展望

---

## 筛选文献

忽略"相关性等级"为 'D' 的论文，只聚焦于等级为 'A', 'B', 'C' 的文献进行分析。

---

## 归纳核心章节

通读所有 'A', 'B', 'C' 级文献的"关键信息"。根据内在的逻辑关系或叙事线索，将这些文献归纳为 3 到 5 个一级核心主题（这将构成大纲的第二、三、四...章）。在每个一级核心主题下，进一步细分出具体的二级子主题，每个子主题代表一种具体的技术路径或科学问题。

---

## 映射与计数

将每一篇 'A', 'B', 'C' 级的论文明确地映射到一个最相关的二级子主题下。请严格遵守以下格式要求：

- 对于第一章 引言和最后一章结论与展望，不要在标题后附加任何文献计数。
- 对于所有核心技术章节中的二级子主题，必须在标题后用括号注明支撑该主题的论文总数范围，格式为：(支撑文献不低于 X 篇)。

---

## 评估与优化

审视你生成的大纲。如果某个二级子主题的支撑文献数量过少（例如少于10篇），请进行优化。优化的方式包括：
1. **合并**：将其与内容相近的子主题合并。
2. **提炼**：提升该子主题的概括性，使其能涵盖更多文献。

---

## 最终输出

以清晰的Markdown层级列表形式输出最终的完整大纲。必须严格遵循以下示例的格式，包括章节编号、标题和文献计数的位置：

# [您的综述论文标题]

## 第一章 引言

- 研究背景与意义
- 研究现状概述
- 本综述的结构安排

## 第二章 [一级主题标题一]

### 2.1 [二级子主题标题一] (支撑文献不低于 X 篇)
- 子章节具体内容示例1
- 子章节具体内容示例2
- 子章节具体内容示例3

### 2.2 [二级子主题标题二] (支撑文献不低于 X 篇)
- 子章节内容示例

## 第三章 [一级主题标题二]

### 3.1 [二级子主题标题一] (支撑文献不低于 X 篇)
- 子章节内容示例

### 3.2 [二级子主题标题二] (支撑文献不低于 X 篇)
- 子章节内容示例

......

## 结论与展望

- 主要研究进展总结
- 存在的问题与挑战
- 未来研究方向展望

---

## 论文信息列表

${literatureAnalysis}`;
}

// 第二步：大纲生成提示词 - 研究论文
function generateResearchOutlinePrompt(
  writingTopic: string,
  literatureAnalysis: string,
  paperType: string
): string {
  return `你是一位经验丰富的科研分析师和学术作家。你的任务是基于用户提供的研究主题和相关的论文信息列表，构建一个逻辑严密、结构完整的研究论文大纲（IMRaD结构）。

请严格按照以下步骤和格式要求执行：

---

## 设定主题

本次研究论文的主题是："${writingTopic}"。

---

## 分析文献

忽略"相关性等级"为 'D' 的论文，只聚焦于等级为 'A', 'B', 'C' 的文献进行分析。

---

## 构建框架

基于IMRaD结构，创建以下框架：

1. **第一章 引言**
   - 研究背景：从'A'级文献中提炼核心研究进展
   - 研究空白：基于文献分析指出当前研究的不足
   - 研究目的与意义：明确本研究要解决的问题
   - 研究内容概述

2. **第二章 方法/实验设计**
   - 基于文献中的方法学总结
   - 本研究的创新方法或改进
   - 实验设计思路

3. **第三章 结果（预期）**
   - 基于文献分析的预期结果方向
   - 可能的数据呈现方式

4. **第四章 讨论**
   - 与现有文献的对比分析角度
   - 可能的理论解释
   - 研究局限性

5. **第五章 结论与展望**
   - 主要发现总结
   - 理论与实践意义
   - 未来研究方向

---

## 输出要求

- 每个章节后用括号注明支撑该主题的论文数量：(支撑文献不低于 X 篇)
- 明确标注哪些文献支撑哪个章节
- 确保逻辑链条完整

---

## 最终输出格式

# [您的研究论文标题]

## 第一章 引言 (支撑文献不低于 X 篇)

### 1.1 研究背景
- 核心概念定义
- 研究领域现状
- 关键技术进展

### 1.2 研究空白与问题
- 现有研究的不足
- 待解决的科学问题

### 1.3 研究目的与意义
- 研究目标
- 理论意义
- 实践价值

### 1.4 研究内容与方法概述

## 第二章 研究方法 (支撑文献不低于 X 篇)

### 2.1 研究设计
- 研究思路
- 技术路线

### 2.2 数据/样本
- 数据来源
- 样本选择

### 2.3 分析方法
- 主要分析方法
- 创新点说明

## 第三章 研究结果（预期）(支撑文献不低于 X 篇)

### 3.1 主要发现
- 核心结果
- 数据呈现

### 3.2 次要发现
- 补充结果
- 对比分析

## 第四章 讨论 (支撑文献不低于 X 篇)

### 4.1 结果解释
- 与预期的对比
- 理论解释

### 4.2 与现有文献对比
- 一致性发现
- 差异性分析

### 4.3 研究局限性
- 方法局限
- 数据局限

## 第五章 结论与展望

### 5.1 主要结论
- 核心发现总结

### 5.2 研究贡献
- 理论贡献
- 实践贡献

### 5.3 未来研究方向

---

## 论文信息列表

${literatureAnalysis}`;
}

// 第二步：大纲生成提示词 - 方法论文
function generateMethodologyOutlinePrompt(
  writingTopic: string,
  literatureAnalysis: string,
  paperType: string
): string {
  return `你是一位经验丰富的科研分析师和方法学专家。你的任务是基于用户提供的方法主题和相关的论文信息列表，构建一个逻辑严密、结构完整的方法论文大纲。

请严格按照以下步骤和格式要求执行：

---

## 设定主题

本次方法论文的主题是："${writingTopic}"。

---

## 分析文献

忽略"相关性等级"为 'D' 的论文，只聚焦于等级为 'A', 'B', 'C' 的文献进行分析。

---

## 构建框架

基于方法论文特点，创建以下框架：

1. **第一章 引言**
   - 方法背景：为什么需要新方法
   - 现有方法综述：从文献中总结现有方法
   - 新方法的必要性与创新点
   - 方法应用前景

2. **第二章 方法原理**
   - 理论基础
   - 核心算法/流程
   - 关键技术突破

3. **第三章 实验设计与验证**
   - 验证数据集
   - 对比方法
   - 评价指标

4. **第四章 结果与分析**
   - 性能对比
   - 消融实验
   - 适用性分析

5. **第五章 应用示例**
   - 典型应用场景
   - 实际案例分析

6. **第六章 结论与展望**

---

## 最终输出格式

# [您的方法论文标题]

## 第一章 引言 (支撑文献不低于 X 篇)

### 1.1 研究背景与动机
- 领域问题概述
- 现有方法局限性

### 1.2 现有方法综述
- 传统方法
- 现代方法
- 方法比较分析

### 1.3 本方法的创新点
- 核心创新
- 预期优势

## 第二章 方法原理 (支撑文献不低于 X 篇)

### 2.1 问题定义
- 形式化描述
- 问题约束

### 2.2 理论基础
- 相关理论
- 数学推导

### 2.3 方法流程
- 整体架构
- 关键步骤
- 算法伪代码

### 2.4 技术细节
- 关键模块设计
- 参数设置

## 第三章 实验设计 (支撑文献不低于 X 篇)

### 3.1 数据集
- 数据来源
- 数据预处理
- 数据统计

### 3.2 基线方法
- 对比方法选择
- 参数设置

### 3.3 评价指标
- 评价维度
- 计算公式

## 第四章 结果与分析 (支撑文献不低于 X 篇)

### 4.1 主要结果
- 整体性能对比
- 显著性分析

### 4.2 消融实验
- 模块贡献分析
- 参数敏感性

### 4.3 结果讨论
- 优势分析
- 局限性

## 第五章 应用示例 (支撑文献不低于 X 篇)

### 5.1 应用场景一
- 场景描述
- 应用效果

### 5.2 应用场景二
- 场景描述
- 应用效果

## 第六章 结论与展望

### 6.1 方法总结
### 6.2 主要贡献
### 6.3 未来改进方向

---

## 论文信息列表

${literatureAnalysis}`;
}

// 第二步：大纲生成提示词 - 案例研究
function generateCaseStudyOutlinePrompt(
  writingTopic: string,
  literatureAnalysis: string,
  paperType: string
): string {
  return `你是一位经验丰富的科研分析师。你的任务是基于用户提供的案例研究主题和相关的论文信息列表，构建一个逻辑严密、结构完整的案例研究论文大纲。

请严格按照以下步骤和格式要求执行：

---

## 设定主题

本次案例研究论文的主题是："${writingTopic}"。

---

## 分析文献

忽略"相关性等级"为 'D' 的论文，只聚焦于等级为 'A', 'B', 'C' 的文献进行分析。

---

## 构建框架

基于案例研究特点，创建以下框架：

1. **第一章 引言**
   - 研究背景
   - 案例选择依据
   - 研究问题与目的
   - 研究意义

2. **第二章 案例背景**
   - 案例主体介绍
   - 行业/领域背景
   - 相关理论基础

3. **第三章 研究方法**
   - 研究设计
   - 数据收集方法
   - 分析框架

4. **第四章 案例分析**
   - 描述性分析
   - 深度分析
   - 跨案例比较（如适用）

5. **第五章 讨论与启示**
   - 理论贡献
   - 实践启示
   - 研究局限

6. **第六章 结论**

---

## 最终输出格式

# [您的案例研究论文标题]

## 第一章 引言 (支撑文献不低于 X 篇)

### 1.1 研究背景
### 1.2 案例选择依据
### 1.3 研究问题
### 1.4 研究意义

## 第二章 案例背景 (支撑文献不低于 X 篇)

### 2.1 案例主体介绍
### 2.2 行业/领域背景
### 2.3 相关理论框架

## 第三章 研究方法 (支撑文献不低于 X 篇)

### 3.1 研究设计
### 3.2 数据收集
### 3.3 分析方法

## 第四章 案例分析 (支撑文献不低于 X 篇)

### 4.1 情境描述
### 4.2 关键事件分析
### 4.3 模式识别
### 4.4 机制分析

## 第五章 讨论与启示 (支撑文献不低于 X 篇)

### 5.1 理论贡献
### 5.2 实践启示
### 5.3 研究局限

## 第六章 结论

### 6.1 主要发现
### 6.2 未来研究方向

---

## 论文信息列表

${literatureAnalysis}`;
}

// 第二步：大纲生成提示词 - 理论论文
function generateTheoreticalOutlinePrompt(
  writingTopic: string,
  literatureAnalysis: string,
  paperType: string
): string {
  return `你是一位经验丰富的理论研究者。你的任务是基于用户提供的理论主题和相关的论文信息列表，构建一个逻辑严密、结构完整的理论论文大纲。

请严格按照以下步骤和格式要求执行：

---

## 设定主题

本次理论论文的主题是："${writingTopic}"。

---

## 分析文献

忽略"相关性等级"为 'D' 的论文，只聚焦于等级为 'A', 'B', 'C' 的文献进行分析。

---

## 构建框架

基于理论论文特点，创建以下框架：

1. **第一章 引言**
   - 理论背景与动机
   - 现有理论综述
   - 理论空白与问题
   - 本研究的理论贡献

2. **第二章 理论框架**
   - 核心概念界定
   - 理论假设/命题
   - 理论模型构建

3. **第三章 数学推导/逻辑证明**
   - 公理/假设陈述
   - 推导过程
   - 定理/命题证明

4. **第四章 理论分析**
   - 理论性质分析
   - 边界条件讨论
   - 特殊情况讨论

5. **第五章 理论应用与验证**
   - 理论预测
   - 经验验证（如适用）
   - 应用案例

6. **第六章 结论与展望**

---

## 最终输出格式

# [您的理论论文标题]

## 第一章 引言 (支撑文献不低于 X 篇)

### 1.1 研究背景
### 1.2 现有理论综述
### 1.3 理论空白与问题
### 1.4 研究贡献

## 第二章 理论框架 (支撑文献不低于 X 篇)

### 2.1 核心概念
### 2.2 基本假设
### 2.3 理论模型

## 第三章 数学推导 (支撑文献不低于 X 篇)

### 3.1 基本定义
### 3.2 主要定理
### 3.3 推论与性质

## 第四章 理论分析 (支撑文献不低于 X 篇)

### 4.1 性质分析
### 4.2 边界条件
### 4.3 特殊情况

## 第五章 理论应用 (支撑文献不低于 X 篇)

### 5.1 理论预测
### 5.2 经验验证
### 5.3 应用示例

## 第六章 结论与展望

### 6.1 理论贡献总结
### 6.2 未来研究方向

---

## 论文信息列表

${literatureAnalysis}`;
}

// 第二步：大纲生成提示词 - 观点论文
function generatePerspectiveOutlinePrompt(
  writingTopic: string,
  literatureAnalysis: string,
  paperType: string
): string {
  return `你是一位经验丰富的学术思想家。你的任务是基于用户提供的观点主题和相关的论文信息列表，构建一个观点鲜明、论证有力的观点论文大纲。

请严格按照以下步骤和格式要求执行：

---

## 设定主题

本次观点论文的主题是："${writingTopic}"。

---

## 分析文献

忽略"相关性等级"为 'D' 的论文，只聚焦于等级为 'A', 'B', 'C' 的文献进行分析。

---

## 构建框架

基于观点论文特点，创建以下框架：

1. **第一章 引言**
   - 背景：当前领域的关键问题
   - 核心观点陈述
   - 观点的创新性与意义

2. **第二章 现状分析**
   - 当前主流观点
   - 存在的问题与争议
   - 支持与反对的证据

3. **第三章 核心观点论证**
   - 观点一：论述 + 证据
   - 观点二：论述 + 证据
   - 观点三：论述 + 证据

4. **第四章 反驳与回应**
   - 潜在反对意见
   - 回应与辨析

5. **第五章 展望与建议**
   - 理论意义
   - 实践启示
   - 未来研究方向

---

## 最终输出格式

# [您的观点论文标题]

## 第一章 引言 (支撑文献不低于 X 篇)

### 1.1 背景：关键问题
### 1.2 核心观点陈述
### 1.3 创新性与意义

## 第二章 现状分析 (支撑文献不低于 X 篇)

### 2.1 主流观点概述
### 2.2 问题与争议
### 2.3 证据梳理

## 第三章 核心观点论证 (支撑文献不低于 X 篇)

### 3.1 观点一：[具体观点]
- 论述逻辑
- 支持证据

### 3.2 观点二：[具体观点]
- 论述逻辑
- 支持证据

### 3.3 观点三：[具体观点]
- 论述逻辑
- 支持证据

## 第四章 反驳与回应 (支撑文献不低于 X 篇)

### 4.1 潜在反对意见
### 4.2 回应与辨析

## 第五章 展望与建议 (支撑文献不低于 X 篇)

### 5.1 理论意义
### 5.2 实践启示
### 5.3 未来方向

---

## 论文信息列表

${literatureAnalysis}`;
}

// 根据论文类型选择大纲生成提示词
function generateOutlinePrompt(
  writingTopic: string,
  literatureAnalysis: string,
  paperType: string
): string {
  switch (paperType) {
    case 'research':
      return generateResearchOutlinePrompt(writingTopic, literatureAnalysis, paperType);
    case 'methodology':
      return generateMethodologyOutlinePrompt(writingTopic, literatureAnalysis, paperType);
    case 'case_study':
      return generateCaseStudyOutlinePrompt(writingTopic, literatureAnalysis, paperType);
    case 'theoretical':
      return generateTheoreticalOutlinePrompt(writingTopic, literatureAnalysis, paperType);
    case 'perspective':
      return generatePerspectiveOutlinePrompt(writingTopic, literatureAnalysis, paperType);
    case 'review':
    default:
      return generateReviewOutlinePrompt(writingTopic, literatureAnalysis, paperType);
  }
}

// 获取系统提示词
function getSystemPrompt(step: 'analysis' | 'outline', paperType: string): string {
  const typeConfig = PAPER_TYPES[paperType] || PAPER_TYPES.review;

  if (step === 'analysis') {
    return `你是一位资深的文献分析专家，擅长对大规模文献集进行批量定性评估与信息结构化。

你的核心能力：
1. **精准判断相关性**：能够根据论文标题和摘要准确判断与写作主题的相关程度
2. **提取关键信息**：善于从复杂文本中提炼核心发现和结论
3. **结构化输出**：输出格式规范、信息完整

【分析原则】
1. **包容性原则**：目标是"寻找一切可能的关联，而非轻易地排除任何一篇文献"
2. **深度洞察**：一个看似微弱的联系点也可能成为连接不同研究领域的桥梁
3. **准确性**：基于文献内容客观判断，避免主观臆断

【相关性等级】
- A级（核心相关）：主要研究内容就是写作主题
- B级（间接相关）：可支撑写作主题的某个论点
- C级（关联较低）：只提到主题，未进行实质分析
- D级（彻底无关）：与主题完全无关

请确保输出为规范的表格格式，便于后续处理。`;
  }

  return `你是一位经验丰富的科研分析师和学术写作专家，擅长构建逻辑严密、结构完整的论文大纲。

你的核心能力：
1. **文献归纳能力**：能够从大量文献中提炼核心主题和逻辑线索
2. **结构设计能力**：善于设计符合${typeConfig.name}特点的章节结构
3. **文献映射能力**：能够准确将文献映射到相应章节

【${typeConfig.name}特点】
- 结构：${typeConfig.structure.join(' → ')}
- 特征：${typeConfig.features.join('、')}

【大纲构建原则】
1. **文献支撑充足**：每个章节都要有足够的文献支撑
2. **逻辑清晰**：章节之间要有明确的逻辑递进关系
3. **结构完整**：包含所有必要章节
4. **可操作性**：每个子章节都有明确的内容方向

【输出要求】
- 使用Markdown层级格式
- 每个章节标注支撑文献数量
- 确保文献映射准确

请生成专业、规范、可直接使用的大纲。`;
}

export async function GET() {
  return NextResponse.json({
    paperTypes: Object.values(PAPER_TYPES),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      writingTopic, 
      literatureList, 
      literatureAnalysis, 
      paperType, 
      model, 
      step 
    } = body;

    if (!model) {
      return NextResponse.json({ error: '请选择AI模型' }, { status: 400 });
    }

    // 初始化LLM客户端
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    let prompt: string;
    let systemPrompt: string;

    if (step === 'analysis') {
      // 第一步：文献分析
      if (!writingTopic || !literatureList) {
        return NextResponse.json({ error: '请提供写作主题和文献列表' }, { status: 400 });
      }
      
      prompt = generateLiteratureAnalysisPrompt(writingTopic, literatureList, paperType || 'review');
      systemPrompt = getSystemPrompt('analysis', paperType || 'review');
    } else if (step === 'outline') {
      // 第二步：大纲生成
      if (!writingTopic || !literatureAnalysis) {
        return NextResponse.json({ error: '请提供写作主题和文献分析结果' }, { status: 400 });
      }
      
      prompt = generateOutlinePrompt(writingTopic, literatureAnalysis, paperType || 'review');
      systemPrompt = getSystemPrompt('outline', paperType || 'review');
    } else {
      return NextResponse.json({ error: '无效的步骤' }, { status: 400 });
    }

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: prompt },
    ];

    const selectedModel = model || 'deepseek-r1-250528';

    // 使用流式输出
    const stream = client.stream(messages, {
      model: selectedModel,
      temperature: 0.3,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.content) {
              const text = chunk.content.toString();
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in outline generator:', error);
    return NextResponse.json(
      { error: '处理请求时出错，请稍后重试' },
      { status: 500 }
    );
  }
}
