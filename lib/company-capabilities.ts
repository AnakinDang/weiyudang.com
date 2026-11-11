export const companyCapabilities = [
  {
    id: "platform", label: "AI Native 平台", title: "为 AI Native 企业，构建共同的运行基础。",
    description: "连接企业 Context、Agent、Workflow 与 Evals，让 AI 应用与现有业务系统共同运行。",
    nodes: ["企业 Context", "业务专家", "Agent 与应用", "权限与 Evals"]
  },
  {
    id: "agents", label: "Agent 构建", title: "从业务描述，走向可验证的应用。",
    description: "通过 Agent Engineering 编排模型、工具与 Workflow，以 Evals 和业务专家反馈验证每一轮迭代。",
    nodes: ["业务需求", "模型与工具", "应用与工作流", "样本评测"]
  },
  {
    id: "knowledge", label: "Context 工程", title: "让企业知识，成为 AI 的 Context。",
    description: "通过 Context Engineering 组织文档、数据与业务经验，让 Agent 在授权范围内检索、引用并追溯来源。",
    nodes: ["企业资料", "知识关联", "业务上下文", "来源与权限"]
  },
  {
    id: "semantics", label: "业务 Ontology", title: "用业务 Ontology，连接数据、判断与行动。",
    description: "定义客户、合同、订单等业务对象及其关系与规则，让业务团队、开发人员和 Agent 在一致的定义上协作。",
    nodes: ["业务对象", "关系与规则", "专家判断", "可追溯行动"]
  },
  {
    id: "voice", label: "Voice AI", title: "让复杂的业务操作，可以从对话开始。",
    description: "将 Voice AI 接入现有应用，结合业务 Context 与工具，让对话连接查询、解释和获授权的任务执行。",
    nodes: ["自然语言", "企业知识", "业务应用", "授权动作"]
  },
  {
    id: "personalization", label: "个性化体验", title: "让每一次服务，都接得上前一次对话。",
    description: "在获授权的范围内关联客户历史、需求和服务状态，支持网站、应用与客服渠道之间的信息衔接和个性化业务协作。",
    nodes: ["客户需求", "服务历史", "多渠道协作", "业务反馈"]
  },
  {
    id: "capture", label: "专家经验沉淀", title: "把熟练员工的经验，沉淀为团队能力。",
    description: "从真实工作中提炼知识、判断和例外，将专家经验转化为 Agent 可用的规则、Workflow 与评测样本。",
    nodes: ["业务现场", "专家经验", "流程与规则", "应用建设"]
  },
  {
    id: "improvement", label: "Evals 与优化", title: "让运行反馈，推动下一轮进化。",
    description: "以 Evals 跟踪质量、成本与异常，把业务反馈转为回归样本，验证改进后再进入运行环境。",
    nodes: ["运行反馈", "问题分析", "改进与复测", "确认与发布"]
  }
] as const;
