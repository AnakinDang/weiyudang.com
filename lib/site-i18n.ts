export type SiteLocale = "en" | "zh";

export const DEFAULT_SITE_LOCALE: SiteLocale = "en";
export const SITE_LOCALE_STORAGE_KEY = "weiyu-site-locale";

const exactZhTranslations = {
  "About": "关于",
  "Projects": "项目",
  "Doraemon": "Doraemon",
  "Research": "研究",
  "Journal": "日志",
  "Contact": "联系",
  "Home": "首页",
  "Writing": "写作",
  "Owner Sign in": "私密登录",
  "Owner area": "私密区",
  "Owner": "私密",
  "Owner Cockpit": "私密驾驶舱",
  "Protected Personal OS": "受保护的 Personal OS",
  "Signed private area": "已登录私密区域",
  "Owner routes stay authenticated, read-only, and separate from the public Doraemon window.":
    "私密路由保持认证、只读，并与公开 Doraemon 窗口分离。",
  "Cockpit": "驾驶舱",
  "Today": "今日",
  "Command": "指挥",
  "Agents": "智能体",
  "Trading Team": "交易研究团队",
  "Knowledge Vault": "知识库",
  "Schedules": "日程",
  "Review Queue": "审核队列",
  "System Health": "系统健康",
  "Owner System Health": "私密系统健康",
  "Settings": "设置",
  "Public window": "公开窗口",
  "Doraemon public entry": "Doraemon 公开入口",
  "Sign out": "退出登录",
  "Private": "私密",
  "Owner session": "私密会话",
  "Personal OS Cockpit": "Personal OS 驾驶舱",
  "Private cockpit for approvals, research posture, schedules, and system health.":
    "用于审批、研究状态、日程和系统健康的私密驾驶舱。",
  "Owner-only": "仅限本人",
  "Read-only": "只读",
  "Private mock mode": "私密模拟模式",
  "Public Doraemon": "公开 Doraemon",
  "Owner Today": "今日驾驶舱",
  "Priorities": "优先级",
  "Approvals": "审批",
  "Schedule": "日程",
  "Systems": "系统",
  "Current focus": "当前重点",
  "Private status": "私密状态",
  "Next review": "下次审核",
  "Freshness": "新鲜度",
  "Read-only cockpit": "只读驾驶舱",
  "Research-only trading": "仅研究的交易研究",
  "Priority lanes": "优先级通道",
  "Waiting approvals": "等待审批",
  "Schedule pressure": "日程压力",
  "Boundary locks": "边界锁",
  "Active owner-visible work streams": "仅本人可见的活跃工作流",
  "No hidden execution paths": "没有隐藏执行路径",
  "The private command surface for priorities, approvals, research posture, schedule pressure, and system health. Doraemon prepares the work; you keep the decision boundary.":
    "用于优先级、审批、研究状态、日程压力和系统健康的私密指挥界面。Doraemon 准备工作，你保留决策边界。",
  "Ship the next Personal OS slice without weakening the public/private boundary.":
    "交付下一个 Personal OS 切片，同时不削弱公开 / 私密边界。",
  "Authenticated, read-only, owner-reviewed": "已认证、只读、人工审核",
  "Owner Cockpit Today": "今日私密驾驶舱",
  "Seeded private scaffold": "已接入私密脚手架",
  "Seeded scaffold": "种子脚手架",
  "Unavailable": "不可用",
  "Dev MiniDora": "开发 MiniDora",
  "Trading MiniDora": "交易 MiniDora",
  "Daily brief": "每日简报",
  "What needs attention today.": "今天需要关注什么。",
  "Open Command": "打开指挥",
  "Next step": "下一步",
  "What Doraemon is keeping in view.": "Doraemon 正在持续关注什么。",
  "See agents": "查看智能体",
  "checkpoints": "检查点",
  "Open review queue": "打开审核队列",
  "System health": "系统健康",
  "Operational guardrails.": "运行护栏。",
  "Operating map": "运行地图",
  "Public, private, research, review.": "公开、私密、研究、审核。",
  "Today links the Personal OS surfaces without blurring their boundary. Public pages stay sanitized; owner routes stay authenticated; research stays non-executing.":
    "今日界面连接 Personal OS 的各个表面，但不模糊边界。公开页面保持脱敏；私密路由保持认证；研究保持不执行。",
  "Surface": "界面",
  "Current": "当前",
  "Market research": "市场研究",
  "Evidence before conviction.": "先证据，后判断。",
  "Evidence-first": "证据优先",
  "Read-only posture": "只读状态",
  "Private diagnostics room": "私密诊断室",
  "Selected service": "精选服务",
  "Owner auth gate": "私密认证门",
  "Access boundary": "访问边界",
  "Unauthenticated /app routes redirect to login.": "未认证的 /app 路由会重定向到登录页。",
  "Owner session is required before the cockpit shell renders.":
    "驾驶舱 shell 渲染前必须具备有效私密会话。",
  "Core boundaries are in place and visible at a safe summary level.":
    "核心边界已经就位，并以安全摘要级别可见。",
  "The system is honest about weak signals and missing evidence.":
    "系统会诚实呈现弱信号和缺失证据。",
  "Execution paths remain unavailable until a separate audit design exists.":
    "在单独的审计设计完成前，执行路径保持不可用。",
  "Held": "保持",
  "Watch": "观察",
  "Blocked": "阻塞",
  "Healthy": "健康",
  "Owner gate": "私密门禁",
  "Boundary posture": "边界状态",
  "When attention comes due.": "注意力到期时。",
  "Next surfaces": "后续界面",
  "Move without losing the boundary.": "推进，同时不丢失边界。",
  "Safety boundary": "安全边界",
  "No hidden execution.": "没有隐藏执行。",
  "Authenticated owner route only.": "仅认证后的私密路由可访问。",
  "Read-only UI until command APIs have audit gates.": "在命令 API 具备审计门禁前，界面保持只读。",
  "Public publishing requires explicit review.": "公开发布需要明确审核。",
  "Sense": "感知",
  "Doraemon watches priorities, schedules, research posture, and system health.":
    "Doraemon 观察优先级、日程、研究状态和系统健康。",
  "Live review": "实时审核",
  "Review": "审核",
  "Owner checkpoints stay visible before private work becomes action.":
    "私密工作变成行动前，审核检查点始终可见。",
  "Owner-gated": "人工把关",
  "Prepare": "准备",
  "MiniDoras prepare evidence and next steps without hidden execution.":
    "MiniDoras 准备证据和下一步，但没有隐藏执行。",

  "Weiyu Dang": "党维宇",
  "Physics, AI, research tools": "物理、AI 与研究工具",
  "Physics, quantum computing, AI systems, and research tools.":
    "物理、量子计算、AI 系统与研究工具。",
  "Physics, quantum computing, and personal AI systems.": "物理、量子计算与个人 AI 系统。",
  "One operating system. Four clear surfaces.": "一个个人操作系统，四个清晰界面。",
  "The public site explains the work. Doraemon Office makes agent activity visible. The owner cockpit stays private. Research stays public-safe, evidence-first, and execution-free.":
    "公开站解释工作本身。Doraemon Office 让智能体活动可见。私密驾驶舱保持关闭。研究界面坚持公开安全、证据优先、无执行。",
  "Weiyu Personal OS connected surfaces": "Weiyu Personal OS 的连接界面",
  "Personal OS center": "Personal OS 中心",
  "Public studio": "公开工作室",
  "Projects, research notes, journal entries, and contact paths that explain the work.":
    "用项目、研究笔记、日志和联系入口解释这些工作。",
  "Public": "公开",
  "Safe to share": "可安全分享",
  "Visit studio": "进入工作室",
  "Doraemon Office": "Doraemon Office",
  "A sanitized room for Doraemon, MiniDoras, activity, schedules, and system heartbeat.":
    "Doraemon、MiniDoras、活动、日程和系统心跳的脱敏可视化房间。",
  "Public-safe": "公开安全",
  "Sanitized read-only": "脱敏只读",
  "Open Doraemon": "打开 Doraemon",
  "The private daily surface for priorities, approvals, schedules, and knowledge work.":
    "处理优先级、审批、日程和知识工作的私密日常界面。",
  "Authenticated": "已认证",
  "Open cockpit": "打开驾驶舱",
  "Research desk": "研究台",
  "Public-safe lab notes and evidence-first research context, including MiniDora trading work without execution.":
    "公开安全的实验笔记和证据优先的研究上下文，包括无执行的 MiniDora 交易研究。",
  "Research-only": "仅研究",
  "Public notes": "公开笔记",
  "Open research": "打开研究",
  "Weiyu stays in control": "Weiyu 保持控制",
  "Final authority.": "最终判断权。",
  "Agents are teammates": "智能体是队友",
  "Not replacements.": "不是替代品。",
  "Evidence over claims": "证据先于主张",
  "Always show sources.": "始终展示来源。",
  "Boundaries by design": "边界来自设计",
  "Public, private, research.": "公开、私密、研究。",
  "Selected systems": "精选系统",
  "Public Studio": "公开工作室",
  "Essays, ideas, projects": "文章、想法、项目",
  "Main command-room entrance": "主指挥室入口",
  "Private review and approvals": "私密审核与批准",
  "Research Desk": "研究台",
  "Long-form research notes": "长篇研究笔记",
  "for research, writing, and": "用于研究、写作和",
  "A public studio for essays and systems, Doraemon Office for public-safe agent activity, and an owner-only cockpit for private review.":
    "公开工作室承载文章和系统；Doraemon Office 展示公开安全的智能体活动；私密驾驶舱负责审核与复盘。",
  "Explore the system": "探索系统",
  "Public-safe agent layer": "公开安全智能体层",
  "Doraemon is the entry personality for the public-safe layer of the Personal OS: agent presence, research rhythm, schedules, and review moments.":
    "Doraemon 是 Personal OS 公开安全层的入口人格：展示智能体在线状态、研究节奏、日程和审核节点。",
  "Owner-only cockpit": "私密驾驶舱",
  "Public activity (demo-safe)": "公开活动（演示安全）",
  "Demo activity · public-safe": "演示活动 · 公开安全",
  "Live activity · public-safe": "实时活动 · 公开安全",
  "View all": "查看全部",
  "Attention needed": "需要注意",
  "Public surfaces stay visible. Owner work stays private.": "公开界面保持可见；私密工作留在边界内。",
  "A few systems and artifacts from the studio. Public pages explain the work; private execution stays behind the app shell.":
    "工作室中的一些系统和成果。公开页面解释工作，私密执行留在 app shell 后面。",
  "All projects": "所有项目",
  "Public command room": "公开指挥室",
  "The public window into Weiyu's personal AI command room. Doraemon coordinates MiniDoras across research, writing, data, product, and operations; private work stays behind the owner cockpit.":
    "这是 Weiyu 个人 AI 指挥室的公开窗口。Doraemon 协调研究、写作、数据、产品和运营方向的 MiniDoras；私密工作留在个人驾驶舱内。",
  "Enter Doraemon Office": "进入 Doraemon Office",
  "Meet the MiniDoras": "认识 MiniDoras",
  "Photography, life notes, and field observations.": "摄影、生活笔记和现场观察。",
  "A softer shelf for the life around the technical work: pictures, places, routines, and personal fragments.":
    "技术工作之外更柔软的一层：照片、地点、日常和个人片段。",
  "Open journal": "打开日志",
  "Latest notes": "最新笔记",
  "Thoughts, research, and updates from the desk.": "来自书桌的想法、研究和更新。",

  "The public Doraemon entry for Weiyu Dang's personal AI operating system.":
    "Weiyu Dang 个人 AI 操作系统的公开 Doraemon 入口。",
  "The public window into Weiyu's personal AI command room.": "进入 Weiyu 个人 AI 指挥室的公开窗口。",
  "A personal AI command room built for thinking, creating, and long-term impact.":
    "一个为思考、创造和长期影响而建的个人 AI 指挥室。",
  "Private Area": "私密区域",
  "Public Window": "公开窗口",
  "Sanitized. Demo-safe. Read-only.": "已脱敏。演示安全。只读。",
  "Read the project": "阅读项目",
  "Contact Weiyu": "联系 Weiyu",
  "What Doraemon Does": "Doraemon 做什么",
  "Doraemon Office is Weiyu's personal AI command room. A team of MiniDoras work across research, writing, data, strategy, and operations, coordinated to turn ideas into impact.":
    "Doraemon Office 是 Weiyu 的个人 AI 指挥室。一组 MiniDoras 横跨研究、写作、数据、策略和运营协作，把想法转化为影响。",
  "Multi-Agent Team": "多智能体团队",
  "Specialized MiniDoras collaborate in real time across research, writing, data, strategy, and operations.":
    "专门化的 MiniDoras 在研究、写作、数据、策略和运营之间实时协作。",
  "Always On, Always Learning": "持续在线，持续学习",
  "Doraemon continuously monitors, analyzes, summarizes, and improves the work loop.":
    "Doraemon 持续监测、分析、总结并改进工作循环。",
  "Owner in the Loop": "人在回路中",
  "Weiyu sets direction, reviews decisions, and keeps execution bounded by human judgment.":
    "Weiyu 设定方向、审核决策，并让执行始终受人类判断约束。",
  "Selected visibility is sanitized, read-only, and designed with privacy first.":
    "被选择公开的可见性经过脱敏、只读，并以隐私优先设计。",
  "From research to writing, from data to operations, each MiniDora has a clear role in the public-safe story of the office.":
    "从研究到写作，从数据到运营，每个 MiniDora 都在 Office 的公开安全叙事中承担清晰角色。",
  "Explore the team": "探索团队",
  "Public-safe role": "公开安全角色",
  "Finds signals, reads deeply, and prepares evidence.": "寻找信号，深入阅读，并准备证据。",
  "Turns product slices into working software.": "把产品切片变成可运行的软件。",
  "Shapes scope, quality, and release rhythm.": "塑造范围、质量和发布节奏。",
  "Keeps schedules, health, and routines clear.": "让日程、健康和日常保持清晰。",
  "Maintains long-term context and knowledge.": "维护长期上下文和知识。",
  "Organizes market research with no execution.": "组织市场研究，不进行交易执行。",
  "Creates public-safe visuals and story assets.": "创作公开安全的视觉和叙事素材。",
  "Public Safety Boundary": "公开安全边界",
  "Your trust matters. The public window is designed with a strict boundary.":
    "信任很重要。公开窗口以严格边界设计。",
  "No private tasks or notes": "不公开私密任务或笔记",
  "No prompts or workflows": "不公开 prompt 或工作流",
  "No accounts or credentials": "不公开账户或凭证",
  "No trading or execution": "不进行交易或执行",
  "Research-only. Not an order, recommendation, or execution system.":
    "仅研究用途。不是订单、建议或执行系统。",
  "Project Context": "项目背景",
  "This is a long-term personal OS experiment. Built in public. Designed to compound.":
    "这是一个长期 Personal OS 实验。公开构建，目标是持续复利。",

  "Doraemon Team Agents": "Doraemon 智能体团队",
  "MiniDora Team Agents": "MiniDora 团队",
  "Team Agents": "智能体团队",
  "Doraemon Team": "Doraemon 团队",
  "Recent public team signals": "最近公开团队信号",
  "Live relay": "实时中继",
  "Live relay · demo activity": "实时中继 · 演示活动",
  "Demo replay": "演示回放",
  "Checking relay": "检查中继",
  "Public-safe profiles. Demo-safe posture. No private work exposed.":
    "公开安全档案。演示安全状态。不暴露私密工作。",
  "Read-only profiles": "只读档案",
  "Sanitized": "已脱敏",
  "Public schema": "公开 schema",
  "Private area": "私密区域",
  "public-safe": "公开安全",
  "read-only": "只读",
  "public window": "公开窗口",
  "public activity": "公开活动",
  "public profiles": "公开档案",
  "No execution": "无执行",
  "No private work": "无私密工作",
  "View public activity": "查看公开活动",
  "Operating lanes": "运行分工",
  "Coordinate": "统筹",
  "Build": "构建",
  "Operate": "运营",
  "Public boundary": "公开边界",
  "Boundary details": "边界详情",
  "Team Operating Lanes": "团队运行分工",
  "See the command room": "查看指挥室",
  "Continue Through Doraemon Office": "继续浏览 Doraemon Office",
  "Move between the public-safe views without crossing into private owner systems.":
    "在公开安全视图之间切换，不跨入私密系统。",
  "These lanes show how the MiniDoras above stay coordinated around work that compounds: research, building, operations, memory, and public-safe output.":
    "这些分工展示 MiniDoras 如何围绕能复利的工作保持协同：研究、构建、运营、记忆和公开安全输出。",
  "Turns intent into plans, handoffs, and review checkpoints.":
    "把意图转成计划、交接和审核检查点。",
  "Reads, compares, preserves context, and keeps market work research-only.":
    "阅读、比较、保留上下文，并保持市场工作仅用于研究。",
  "Moves product slices from scope into tested, reviewed software.":
    "把产品切片从范围定义推进到经过测试和审核的软件。",
  "Keeps routines, health, public visuals, and publishing rhythm clear.":
    "让例行节奏、健康状态、公开视觉和发布节奏保持清晰。",
  "Research MiniDora": "研究 MiniDora",
  "Product MiniDora": "产品 MiniDora",
  "Ops MiniDora": "运营 MiniDora",
  "Memory MiniDora": "记忆 MiniDora",
  "Media MiniDora": "媒体 MiniDora",
  "Dev": "开发",
  "Ops": "运营",
  "Memory": "记忆",
  "Trading": "交易",
  "Media": "媒体",
  "Creative Production": "创意生产",
  "Public-safe profiles": "公开安全档案",
  "Sanitized states": "脱敏状态",
  "Fixed event labels": "固定事件标签",
  "Team presence": "团队在线状态",
  "Finds source-backed context and prepares evidence briefs.":
    "寻找有来源支撑的上下文，并准备证据简报。",
  "Translates ideas into plans, handoffs, summaries, and review checkpoints.":
    "把想法转成计划、交接、摘要和审核检查点。",
  "Turns product slices into working software artifacts.":
    "把产品切片变成可运行的软件产物。",
  "Keeps scope, review standards, and release rhythm clear.":
    "让范围、审核标准和发布节奏保持清晰。",
  "Watches routines, schedules, and public-safe system health.":
    "观察例行任务、日程和公开安全的系统健康。",
  "Maintains durable context, summaries, and knowledge hygiene.":
    "维护持久上下文、摘要和知识卫生。",
  "Maintains an evidence-first research queue with owner review.":
    "维护证据优先、需要本人审核的研究队列。",
  "Builds repeatable workflows for images, video, and story assets.":
    "为图片、视频和叙事素材构建可复用工作流。",
  "Doraemon team is showing live public signals.": "Doraemon 团队正在展示实时公开信号。",
  "Doraemon team is showing a public-safe demo snapshot.": "Doraemon 团队正在展示公开安全的演示快照。",
  "Latest label": "最新标签",
  "Live public label": "实时公开标签",
  "Demo public label": "演示公开标签",
  "Profile baseline": "档案基线",
  "No matching public event yet": "暂无匹配的公开事件",
  "Source": "来源",
  "Demo state": "演示状态",

  "Doraemon System": "Doraemon 系统",
  "Public health signal without private infrastructure.": "不暴露私有基础设施的公开健康信号。",
  "Public health": "公开健康",
  "Public health rail preview": "公开健康栏预览",
  "Health rail": "健康栏",
  "public checks": "项公开检查",
  "Overview": "总览",
  "Office Live": "Office 实时",
  "Activity Log": "活动日志",
  "Public Activity Log": "公开活动日志",
  "Public SIGNAL": "公开信号",
  "SIGNAL": "信号",
  "Live / demo posture": "实时 / 演示状态",
  "Closed schema": "封闭 schema",
  "Closed allowlist": "封闭白名单",
  "Safe counters": "安全计数",
  "Live/demo posture, closed schema, and safe counters only.":
    "只展示实时 / 演示状态、封闭 schema 和安全计数。",
  "Public events": "公开事件",
  "View public health": "查看公开健康",
  "Public Health Register": "公开健康登记",
  "Live relay health resolves into safe labels and aggregate counts. Private operations never render.":
    "实时中继健康状态会被解析为安全标签和聚合状态；私密运维永不渲染。",
  "Public health checks": "公开健康检查",
  "Coarse relay posture, schema state, freshness, and replay health only.":
    "只展示粗粒度中继状态、schema 状态、新鲜度和回放健康。",
  "Live relay probe": "实时中继探针",
  "Live relay connected": "实时中继已连接",
  "Reads only the public health summary. Private operational detail is not rendered.":
    "只读取公开健康摘要；私密运维细节不会渲染。",
  "Counters": "计数器",
  "Public relay healthy": "公开中继健康",
  "Registry": "注册表",
  "ready": "就绪",
  "Presence": "在线状态",
  "Public relay active": "公开中继活跃",
  "Relay mode": "中继模式",
  "Registry snapshot OK": "注册表快照正常",
  "Awaiting public signal": "等待公开信号",
  "Dedupe aligned": "去重已对齐",
  "Replay buffer": "回放缓冲",
  "Event freshness": "事件新鲜度",
  "Sanitized event age": "脱敏事件时间",

  "Doraemon Activity": "Doraemon 活动",
  "Activity": "活动",
  "Activity timeline": "活动时间线",
  "Newest first": "最新优先",
  "All public signals": "全部公开信号",
  "No private details": "无私密细节",
  "Display-only": "仅展示",
  "Agent work": "智能体工作",
  "Handoffs": "交接",
  "Tools": "工具",
  "Owner review": "人工审核",
  "Alerts": "提醒",
  "System": "系统",
  "Working": "工作中",
  "Completed": "已完成",
  "Planning": "规划中",
  "Attention": "注意",
  "Tool call": "工具调用",
  "Handoff": "交接",

  "Tasks": "任务",
  "Task posture": "任务状态",
  "Public task queue": "公开任务队列",
  "Schedule rhythm": "日程节奏",
  "Knowledge": "知识",
  "Doraemon Office is showing live public activity.": "Doraemon Office 正在展示实时公开活动。",
  "Doraemon Office is showing a public-safe demo snapshot.": "Doraemon Office 正在展示公开安全的演示快照。",

  "About Weiyu signal row": "关于 Weiyu 的信号行",
  "Explore the Personal OS": "探索 Personal OS",
  "Meet Doraemon": "认识 Doraemon",
  "Physics": "物理",
  "Start with structure, models, and reality checks.": "从结构、模型和现实校验开始。",
  "AI systems": "AI 系统",
  "Build tools that make thinking easier without hiding judgment.":
    "构建让思考更容易、但不隐藏判断的工具。",
  "Research workflows": "研究工作流",
  "Turn questions, evidence, and review into repeatable loops.":
    "把问题、证据和复盘变成可重复循环。",
  "How I think": "我的思考方式",
  "Rigorous when it matters. Playful when it helps.": "该严谨时严谨，该有趣时有趣。",
  "The through-line is a taste for systems that compound: physics intuition, AI tools, research notes, product surfaces, and the private loops that keep work honest.":
    "贯穿其中的是对可复利系统的偏好：物理直觉、AI 工具、研究笔记、产品界面，以及让工作保持诚实的私密循环。",
  "What I build": "我在构建什么",
  "Public artifacts around a private operating layer.": "围绕私密操作层的公开成果。",
  "The public site explains the work. Doraemon makes the agent system legible. The owner cockpit keeps the actual private state, approvals, and review loops protected.":
    "公开站解释工作；Doraemon 让智能体系统可理解；私密驾驶舱保护真实状态、审批和复盘循环。",
  "Projects as artifacts": "项目即成果",
  "Projects as artifacts.": "项目即成果。",
  "Public project index for Weiyu Dang's AI systems, creative workflows, apps, and research tools.":
    "Weiyu Dang 的 AI 系统、创意工作流、应用和研究工具公开项目索引。",
  "A curated index of public projects across systems, tools, experiments, and research. Choose a project to read the public story, understand the boundary, and explore next steps.":
    "一个精选的公开项目索引，涵盖系统、工具、实验和研究。选择项目即可阅读公开故事、理解边界并继续探索。",
  "Browse the archive": "浏览归档",
  "curated artifacts": "精选成果",
  "Public pages, private summaries, and research-only surfaces.":
    "公开页面、私密摘要和仅研究界面。",
  "Public by design": "按公开边界设计",
  "No prompts, accounts, raw IDs, orders, or private execution state.":
    "不包含 prompts、账户、raw IDs、订单或私密执行状态。",
  "What stays private": "哪些保持私密",
  "Useful in public. Careful by default.": "公开时有用，默认保持谨慎。",
  "This site can show concepts, public artifacts, sanitized Doraemon surfaces, and research summaries. It should not pretend the private operating layer is public.":
    "这个网站可以展示概念、公开成果、脱敏 Doraemon 界面和研究摘要；但不应该把私密操作层伪装成公开内容。",

  "Personal AI Systems": "个人 AI 系统",
  "Agent Infrastructure": "智能体基础设施",
  "Research Tools": "研究工具",
  "Trading Research": "交易研究",
  "Creative Media": "创意媒体",
  "Games & Experiments": "游戏与实验",
  "Writing & Field Notes": "写作与现场笔记",
  "Concept": "概念",
  "Prototype": "原型",
  "Active": "进行中",
  "Paused": "暂停",
  "Archived": "归档",
  "Private Summary": "私密摘要",
  "Unlisted": "未列出",
  "Draft": "草稿",
  "Agent Systems": "智能体系统",
  "Design": "设计",
  "Engineering": "工程",
  "Operations": "运营",
  "Product": "产品",
  "Active slice": "活跃切片",
  "Live probe": "实时探针",
  "Now": "现在",
  "Queued": "已排队",
  "Waiting": "等待中",
  "In review": "审核中",
  "Later": "稍后",
  "Next": "下一步",
  "Ready": "就绪",
  "Watching": "观察中",
  "Enabled": "已启用",
  "Live-safe": "实时安全",
  "Disabled": "已禁用",
  "Evidence pending": "等待证据",
  "Morning": "早晨",
  "Market session": "市场时段",
  "Tonight": "今晚",
  "This week": "本周",
  "Turn Today into the owner command surface": "把 Today 打造成私密指挥界面",
  "Keep the private home focused on priorities, approvals, research posture, schedule pressure, and system health.":
    "让私密首页聚焦优先级、审批、研究状态、日程压力和系统健康。",
  "Review the refreshed cockpit layout before the next route expands.":
    "在下一个路由扩展前审核更新后的驾驶舱布局。",
  "Keep the public Doraemon window verifiable": "让公开 Doraemon 窗口保持可验证",
  "Use the public-safe system page as the owner-visible bridge to relay health without exposing internals.":
    "用公开安全的系统页作为本人可见的中继健康桥梁，同时不暴露内部细节。",
  "Preserve route smokes, leak probes, and production bundle checks.":
    "保留路由 smoke、泄漏探针和生产 bundle 检查。",
  "Prepare trading research evidence lanes": "准备交易研究证据通道",
  "Make source quality, gate status, and owner review visible without broker actions.":
    "展示来源质量、门禁状态和人工审核，但不包含券商动作。",
  "Separate signals, gates, and evidence from any execution concept.":
    "把信号、门禁和证据同任何执行概念分离。",
  "Public Doraemon Office": "公开 Doraemon Office",
  "Public-safe live probe": "公开安全实时探针",
  "Sanitized Office pages show public relay posture, agent presence, tasks, schedules, knowledge, and system health.":
    "脱敏 Office 页面展示公开中继状态、智能体在线、任务、日程、知识和系统健康。",
  "No private task titles, raw IDs, prompts, credentials, or repair controls.":
    "不展示私密任务标题、raw IDs、prompts、凭证或修复控制。",
  "Authenticated read-only": "已认证只读",
  "The private shell organizes Today, Command, Agents, Review Queue, Schedules, Settings, and System Health.":
    "私密 shell 组织 Today、Command、智能体、审核队列、日程、设置和系统健康。",
  "Owner session required before private app chrome or data renders.":
    "私密会话有效后才渲染 app 外壳或数据。",
  "MiniDora Trading collects signals, desks, gates, evidence, replay, and source degradation for owner review.":
    "MiniDora Trading 收集信号、研究台、门禁、证据、回放和来源降级，供本人审核。",
  "Decisions stay visible as checkpoints, not hidden execution paths or one-click approvals.":
    "决策以检查点形式保持可见，而不是隐藏执行路径或一键审批。",
  "Future mutations require authentication, audit logging, explicit owner action, and rollback behavior.":
    "未来任何变更都需要认证、审计日志、明确的本人动作和回滚行为。",
  "Review Owner Cockpit Today operating map": "审核今日驾驶舱运行地图",
  "Codex + Opus": "Codex + Opus",
  "Accept, revise, or narrow the next private route slice.":
    "接受、修改或收窄下一个私密路由切片。",
  "Build, auth redirect, screenshot, leak probe, and Opus review.":
    "构建、认证跳转、截图、泄漏探针和 Opus review。",
  "Decide next private cockpit slice": "决定下一个私密驾驶舱切片",
  "Pick Command, Agents, or Trading evidence depth.":
    "选择 Command、智能体或 Trading 的证据深度。",
  "Docs define the route map; implementation should stay read-only.":
    "文档定义路由地图；实现应保持只读。",
  "Define Trading Team evidence bridge": "定义 Trading Team 证据桥",
  "Choose what private research evidence becomes owner-scannable.":
    "选择哪些私密研究证据变成本人可扫描信息。",
  "Research-only boundary remains fixed; no broker writes.":
    "仅研究边界保持固定；没有券商写入。",
  "Research mode": "研究模式",
  "No orders, recommendations, broker writes, or execution controls.":
    "没有订单、建议、券商写入或执行控制。",
  "Signal quality": "信号质量",
  "Today surface should show source coverage before any candidate is promoted.":
    "任何候选项推进前，Today 界面应展示来源覆盖。",
  "Gate posture": "门禁状态",
  "Private console can prepare evidence, but owner review remains the decision point.":
    "私密控制台可以准备证据，但本人审核仍是决策点。",
  "Market scan": "市场扫描",
  "Weekly review": "每周复盘",
  "Private auth gate": "私密认证门",
  "Public relay probe": "公开中继探针",
  "Public Doraemon boundary": "公开 Doraemon 边界",
  "Data source": "数据源",
  "Trading execution": "交易执行",
  "Private writes": "私密写入",
  "Draft plans, review owner checkpoints, and inspect current mission shape.":
    "起草计划、审核检查点，并查看当前任务形状。",
  "Open the research-only console with gates, evidence, and source degradation.":
    "打开仅研究控制台，查看门禁、证据和来源降级。",
  "Review private synthesis layers before anything is curated for public publishing.":
    "任何内容进入公开精选前，先审核私密综合层。",
  "Draft-only": "仅草稿",
  "No dispatch": "不派发",
  "Not connected": "未连接运行时",
  "Authenticated private surface": "已认证的私密界面",
  "Owner Command": "私密指挥",
  "Draft a mission before anything moves. Command is the owner-level surface for shaping intent, previewing a plan, and preparing the exact review packet that must pass before implementation, publishing, or runtime work happens.":
    "在任何动作发生前先起草任务。Command 是本人级指挥界面，用来塑造意图、预览计划，并准备实施、发布或运行时工作开始前必须通过的审核包。",
  "Draft pad": "草稿板",
  "Owner command draft": "私密指挥草稿",
  "Describe intent, constraints, evidence needed, and review gates.":
    "描述意图、约束、所需证据和审核门禁。",
  "Prepare packet": "准备审核包",
  "Reset": "重置",
  "Dispatch unavailable": "派发不可用",
  "Command context lens selector": "指挥上下文视角选择器",
  "Active lens": "当前视角",
  "Plan preview": "计划预览",
  "Five gates before work moves.": "工作推进前有五道门禁。",
  "A command becomes a staged plan before it becomes implementation. Interpretation, design, implementation, verification, and review stay separate.":
    "一条指令先变成分阶段计划，再进入实现。理解、设计、实现、验证和审核保持分离。",
  "Owner checkpoints": "本人检查点",
  "The command surface separates allowed review from blocked execution so the next decision is obvious.":
    "指挥界面把可做的审核和被阻止的执行分开，让下一步决策清清楚楚。",
  "No command execution": "不执行指令",
  "This cockpit can prepare a command packet only. It cannot dispatch tools, mutate files, publish, or approve itself.":
    "这个驾驶舱只能准备指令审核包。它不能派发工具、修改文件、发布内容，也不能自我批准。",
  "Agent routing": "智能体路由",
  "The command surface shows who owns the next decision instead of hiding responsibility behind a single assistant response.":
    "指挥界面展示下一步由谁负责，而不是把责任藏在一次助手回复后面。",
  "Visible responsibility": "责任可见",
  "Evidence required": "需要证据",
  "A command cannot move to PR/deploy without evidence that matches the scope of the requested slice.":
    "一条指令没有匹配当前切片范围的证据，就不能进入 PR 或部署。",
  "Output shelf": "输出架",
  "Audit boundary": "审计边界",
  "These rules keep the command surface useful now while leaving future execution APIs explicit and auditable.":
    "这些规则让当前指挥界面有用，同时把未来执行 API 保持为显式、可审计的设计。",
  "No hidden execution": "没有隐藏执行",
  "Redesign Weiyu Personal OS in safe implementation slices":
    "以安全切片重设计 Weiyu Personal OS",
  "Turn the product blueprint into native website, Doraemon Office, Owner Cockpit, and research console surfaces. Validate each slice and request Opus review before moving on.":
    "把产品蓝图落成原生网站、Doraemon Office、私密驾驶舱和研究控制台界面。每个切片先验证并请求 Opus review，再继续下一步。",
  "No command is sent. This page prepares intent, plan, evidence, and review packets only.":
    "不会发送任何指令。此页只准备意图、计划、证据和审核包。",
  "Review packet": "审核包",
  "Audit": "审计",
  "Implementation slice packet": "实现切片审核包",
  "A useful command becomes a bounded slice, a verification checklist, and an Opus review brief before PR/deploy.":
    "一条有用指令会在 PR / 部署前变成边界清晰的切片、验证清单和 Opus review 简报。",
  "Intent": "意图",
  "What owner wants changed": "本人想改变什么",
  "What must not happen": "什么绝不能发生",
  "Build, auth, browser, leak probes": "构建、认证、浏览器和泄漏探针",
  "Claude Opus GO before merge": "合并前需要 Claude Opus GO",
  "Owner intent": "本人意图",
  "Captured": "已捕获",
  "The draft pad has explicit outcome, constraints, and taste notes.":
    "草稿板已经包含明确结果、约束和品味备注。",
  "Execution path": "执行路径",
  "No runtime dispatch, file mutation, publish, or workflow trigger exists here.":
    "这里不存在运行时派发、文件修改、发布或工作流触发。",
  "Review gate": "审核门禁",
  "A slice cannot move forward without local evidence and Opus review.":
    "没有本地证据和 Opus review，切片不能继续推进。",
  "Capture owner intent without dispatch": "捕获本人意图，但不派发",
  "The draft pad can hold direction, constraints, and taste notes. It stays browser-local in this draft slice and never calls a runtime API.":
    "草稿板可以承载方向、约束和品味备注。在这个草稿切片中它只停留在浏览器本地，永不调用运行时 API。",
  "Local only": "仅本地",
  "Separate thinking from execution": "把思考和执行分开",
  "Doraemon turns intent into a staged plan with owners, gates, and verification. Every step is visible before implementation begins.":
    "Doraemon 会把意图转成带负责人、门禁和验证的分阶段计划。实现开始前，每一步都可见。",
  "Claude review before the next slice": "进入下个切片前先做 Claude review",
  "The review packet captures changed files, local checks, browser evidence, and explicit safety boundaries for Opus review.":
    "审核包会记录改动文件、本地检查、浏览器证据和明确安全边界，供 Opus review。",
  "Proof first, confidence second": "先证明，再自信",
  "Build, browser, auth, screenshot, data-boundary, and production-smoke evidence must exist before work moves forward.":
    "继续推进前必须有构建、浏览器、认证、截图、数据边界和生产 smoke 证据。",
  "Execution APIs remain out of scope": "执行 API 仍不在范围内",
  "Future command APIs need authentication, audit logs, rollback posture, error handling, and explicit owner action.":
    "未来的指令 API 需要认证、审计日志、回滚姿态、错误处理和明确的本人动作。",
  "Complete": "完成",
  "Interpret": "理解",
  "Restate the requested outcome, source docs, public/private boundary, and active slice.":
    "复述目标结果、来源文档、公开 / 私密边界和当前切片。",
  "Owner intent and source docs identified.": "本人意图和来源文档已识别。",
  "Translate the product blueprint into an implementation-ready surface and interaction model.":
    "把产品蓝图转成可实现的界面和交互模型。",
  "Surface responsibility and non-goals are visible.":
    "界面职责和非目标清晰可见。",
  "Implement": "实现",
  "Ship a narrow, native UI slice with local state, route wiring, and no hidden write path.":
    "交付一个范围窄、原生的 UI 切片，包含本地状态和路由接线，但没有隐藏写入路径。",
  "Changed files remain scoped to the slice.": "改动文件保持在当前切片范围内。",
  "Verify": "验证",
  "Run build, diff check, route protection, browser QA, responsive checks, and safety scans.":
    "运行构建、diff 检查、路由保护、浏览器 QA、响应式检查和安全扫描。",
  "Evidence packet exists before review.": "审核前必须存在证据包。",
  "Claude Opus reviews product, safety, privacy, a11y, and regression risk before PR/deploy.":
    "PR / 部署前由 Claude Opus 审核产品、安全、隐私、可访问性和回归风险。",
  "P1/P2 findings are fixed before merge.": "合并前修复 P1 / P2 问题。",
  "Proceed to next slice": "进入下一个切片",
  "Advance only after local checks and Opus review are clean.":
    "只有本地检查和 Opus review 清楚后才继续推进。",
  "Allowed only after evidence is attached.": "只有证据附上后才允许推进。",
  "Expose a new private API": "暴露新的私密 API",
  "Needs auth, audit, error, permission, and rollback design before any write path exists.":
    "任何写入路径存在前，都需要认证、审计、错误、权限和回滚设计。",
  "No API work in this slice.": "这个切片不做 API 工作。",
  "Publish private knowledge": "发布私密知识",
  "Requires explicit curation and public/private contract review.":
    "需要明确精选和公开 / 私密契约审核。",
  "No publishing controls are rendered.": "不渲染发布控制。",
  "Run autonomous workflow": "运行自主工作流",
  "This surface can describe a workflow, but cannot dispatch tools or mutate systems.":
    "这个界面可以描述工作流，但不能派发工具或改变系统。",
  "No dispatch affordance exists.": "不存在派发入口。",
  "Routing": "路由中",
  "Keeps intent, plan, evidence, and review boundaries aligned.":
    "保持意图、计划、证据和审核边界一致。",
  "Draft the mission shape and ask for owner review when ambiguity matters.":
    "起草任务形状，并在存在关键歧义时请求本人审核。",
  "Shaping": "塑形中",
  "Turns the Personal OS blueprint into page responsibility, hierarchy, and interaction rules.":
    "把 Personal OS 蓝图转成页面职责、层级和交互规则。",
  "Keep the surface useful without making it look like a fake assistant demo.":
    "让界面真的有用，而不是看起来像假的助手演示。",
  "Ships small slices and verifies build/browser/auth behavior.":
    "交付小切片，并验证构建、浏览器和认证行为。",
  "Implement only after the slice boundary is clear.":
    "只有切片边界清楚后才实现。",
  "Evidence MiniDora": "证据 MiniDora",
  "Connects decisions back to docs, code, browser screenshots, and production smoke.":
    "把决策连接回文档、代码、浏览器截图和生产 smoke。",
  "Attach the evidence packet before review closes.":
    "review 关闭前附上证据包。",
  "Guarded": "受保护",
  "Maintains market research boundaries without execution.":
    "维护市场研究边界，不做执行。",
  "Keep trading work research-only, no broker writes, no order flow.":
    "交易相关工作保持仅研究，不写入券商，不产生订单流。",
  "Build proof": "构建证据",
  "Production build and TypeScript must pass before Opus review.":
    "Opus review 前必须通过生产构建和 TypeScript。",
  "Browser proof": "浏览器证据",
  "Desktop/mobile route checks, interaction state, console health, and overflow checks.":
    "桌面 / 移动端路由检查、交互状态、控制台健康和溢出检查。",
  "Auth proof": "认证证据",
  "Unauthenticated /app/* requests must redirect to the owner gate without private shell render.":
    "未认证的 /app/* 请求必须重定向到本人门禁，不渲染私密 shell。",
  "Data-boundary proof": "数据边界证据",
  "No sensitive values, raw private paths, prompts, credentials, or execution affordances in the rendered UI.":
    "渲染后的 UI 中不能出现敏感值、原始私密路径、prompt、凭证或执行入口。",
  "Local build": "本地构建",
  "Production build and static checks before review.": "review 前完成生产构建和静态检查。",
  "Browser QA": "浏览器 QA",
  "Desktop/mobile screenshots, console, overflow, and route checks.":
    "桌面 / 移动端截图、控制台、溢出和路由检查。",
  "Opus review": "Opus review",
  "GO/NO-GO with P1/P2 findings before the next slice.":
    "进入下一切片前给出 GO / NO-GO 和 P1 / P2 问题。",
  "Production smoke": "生产 smoke",
  "Post-deploy auth, bundle, and public/private boundary checks.":
    "部署后检查认证、bundle 和公开 / 私密边界。",
  "Runtime dispatch": "运行时派发",
  "Tool execution": "工具执行",
  "File mutation": "文件修改",
  "Public publish": "公开发布",
  "Private API write": "私密 API 写入",
  "Autonomous approval": "自主批准",
  "No write or execution action appears until an authenticated API and audit trail are designed.":
    "在认证 API 和审计轨迹设计完成前，不出现任何写入或执行动作。",
  "Draft, plan, approval, execution, review, and deploy are separate product states.":
    "草稿、计划、批准、执行、审核和部署是分离的产品状态。",
  "Public pages never import this private command scaffold.":
    "公开页面绝不导入这个私密指挥脚手架。",
  "Failed auth should not render command content.":
    "认证失败不应渲染指挥内容。",
  "Every implementation slice gets local evidence and Claude Opus review before PR/deploy.":
    "每个实现切片在 PR / 部署前都要有本地证据和 Claude Opus review。",
  "Plan gates": "计划门禁",
  "Visible before work moves": "工作推进前可见",
  "Review states, not execution": "审核状态，而不是执行",
  "Evidence checks": "证据检查",
  "Required before PR/deploy": "PR / 部署前必须具备",
  "No dispatch in this slice": "此切片不派发",

  "Agent operations": "智能体运行",
  "Read-only roster": "只读花名册",
  "Private MiniDora roster": "私密 MiniDora 花名册",
  "MiniDora Agents": "MiniDora 智能体",
  "Inspect the team behind the Personal OS: current leases, source health, recent outputs, handoffs, and guardrails. Intelligence without execution. You approve the work.":
    "检查 Personal OS 背后的团队：当前 lease、来源健康、近期输出、交接和护栏。智能可以可见，但不执行；工作由你批准。",
  "Doraemon coordinates": "Doraemon 统筹",
  "MiniDoras prepare": "MiniDoras 准备",
  "Owner decides": "本人决策",
  "Active selection": "当前选择",
  "Current lease": "当前 lease",
  "Last output": "最近输出",
  "Guardrail": "护栏",
  "Lease": "Lease",
  "Agent detail": "智能体详情",
  "State history": "状态历史",
  "Inputs watched": "观察输入",
  "Outputs prepared": "准备输出",
  "Capabilities": "能力",
  "Lease map": "Lease 地图",
  "A scan-first view of who is active, who needs review, and which lanes are intentionally queued.":
    "一眼扫描谁在活跃、谁需要审核，以及哪些通道被有意排队。",
  "Owner controlled": "本人控制",
  "Review paths": "审核路径",
  "Prepare a mission packet for the selected agent lane.":
    "为选中的智能体通道准备任务包。",
  "Open Review Queue": "打开审核队列",
  "Review owner-gated work before any future action path exists.":
    "在任何未来动作路径存在前，先审核需要本人把关的工作。",
  "Owner review drilldown": "本人审核下钻",
  "Decide how to read the selected agent lane. This inspector is local-only: it does not dispatch agents, create tasks, publish notes, or promote leases.":
    "决定如何阅读选中的智能体通道。这个检查器仅本地生效：不派发智能体、不创建任务、不发布笔记，也不推进 lease。",
  "Selected lane": "选中通道",
  "Lease posture": "Lease 状态",
  "History trail": "历史轨迹",
  "Recent state history is visible for owner review.":
    "近期状态历史可供本人审核。",
  "No history is available for this agent.": "此智能体暂无历史。",
  "Owner posture": "本人阅读姿态",
  "Choose a local reading posture for this agent. The choice is not saved or sent.":
    "为这个智能体选择一个本地阅读姿态；选择不会保存或发送。",
  "posture": "姿态",
  "If selected": "如果选择",
  "Safe outputs": "安全输出",
  "Owner brief": "本人简报",
  "Allowed": "允许",
  "Review queue": "审核队列",
  "Review queue note": "审核队列备注",
  "A decision packet can point to the Review Queue after explicit owner review.":
    "经过明确本人审核后，决策包可以指向审核队列。",
  "Dispatch": "派发",
  "This page has no execute, approve, publish, trade, or dispatch control.":
    "此页没有执行、批准、发布、交易或派发控制。",
  "Coverage lanes": "覆盖通道",
  "The roster is useful only when every lane says who owns the next review and what evidence is missing.":
    "只有每个通道都说明下一次审核由谁负责、缺少什么证据，花名册才真正有用。",
  "Review map": "审核地图",
  "Recent coordination chain for the selected agent. Empty states are explicit when no direct handoff has been recorded for this slice.":
    "选中智能体的近期协同链。如果当前切片没有直接交接，会明确显示空状态。",
  "No direct handoff recorded.": "暂无直接交接记录。",
  "This agent has no direct handoff in the current slice evidence. Keep the lease visible, but do not invent a coordination chain.":
    "当前切片证据中没有这个智能体的直接交接。保持 lease 可见，但不编造协同链。",
  "MiniDora roster": "MiniDora 花名册",
  "Select an agent to inspect its lease, recent history, inputs, outputs, source posture, and guardrail.":
    "选择一个智能体，检查它的 lease、近期历史、输入、输出、来源状态和护栏。",
  "Interactive inspector": "交互式检查器",
  "Good": "良好",
  "Degraded": "降级",
  "Active lease": "活跃 lease",
  "Review lease": "审核 lease",
  "Queued lease": "排队 lease",
  "Idle lease": "空闲 lease",
  "Implementation": "实现",
  "Reviewing": "审核中",
  "Idle": "空闲",
  "Roster": "花名册",
  "Doraemon plus MiniDoras": "Doraemon 加 MiniDoras",
  "Active leases": "活跃 lease",
  "Active or review leases": "活跃或审核中的 lease",
  "Owner gates": "本人门禁",
  "Owner-gated agent leases": "需要本人把关的智能体 lease",
  "Executions": "执行",
  "No dispatch path in this surface": "此界面没有派发路径",
  "Direction": "方向",
  "Keeps the rollout, scope, and review loop coherent.":
    "保持落地节奏、范围和审核循环一致。",
  "Turns approved slices into native, verified web surfaces.":
    "把已批准的切片变成原生、经过验证的网页界面。",
  "Collects proof, gaps, and boundary risks before PR/deploy.":
    "在 PR / 部署前收集证据、缺口和边界风险。",
  "Keeps market work research-only and evidence-first.":
    "让市场工作保持仅研究、证据优先。",
  "Owner-only route protected before the private shell renders.":
    "私密外壳渲染前，Owner-only 路由已被保护。",
  "Agent data is curated private mock state until authenticated APIs exist.":
    "在认证 API 存在前，智能体数据是精选的私密 mock 状态。",
  "Public Doraemon pages must continue to use sanitized public schemas only.":
    "公开 Doraemon 页面必须继续只使用脱敏后的公开 schema。",
  "Rollout conductor": "落地指挥",
  "Keep Personal OS implementation moving one reviewed slice at a time.":
    "让 Personal OS 按一次一个已审核切片持续推进。",
  "Translate owner intent into bounded work, route it to the right MiniDora, and keep review gates visible.":
    "把本人意图转成有边界的工作，路由给合适的 MiniDora，并保持审核门禁可见。",
  "Plan slicing": "计划拆片",
  "handoff design": "交接设计",
  "review summaries": "审核摘要",
  "boundary memory": "边界记忆",
  "Kept the rollout moving slice by slice with Opus review after each step.":
    "每一步都经过 Opus review 后，持续按切片推进落地。",
  "Docs, local build output, browser checks, and review packets are available.":
    "文档、本地构建输出、浏览器检查和 review 包都可用。",
  "Just now": "刚刚",
  "Confirm the current Agents slice after local evidence and Opus review.":
    "在本地证据和 Opus review 后确认当前 Agents 切片。",
  "Owner instruction": "本人指令",
  "Personal OS docs": "Personal OS 文档",
  "previous review findings": "此前 review 发现",
  "slice brief": "切片简报",
  "handoff packet": "交接包",
  "risk notes": "风险记录",
  "Cannot approve its own work or bypass owner review.":
    "不能批准自己的工作，也不能绕过本人审核。",
  "Agents slice in motion": "Agents 切片推进中",
  "Routing this owner-only roster through implementation, verification, and Opus review.":
    "正在让这个仅本人可见的花名册完成实现、验证和 Opus review。",
  "Command surface closed": "Command 界面已收口",
  "Merged the owner command surface after local QA and Claude review.":
    "在本地 QA 和 Claude review 后合入了私密 Command 界面。",
  "Trading boundary held": "交易边界保持住",
  "Kept market research inside a research-only cockpit with no execution path.":
    "把市场研究保持在仅研究驾驶舱内，没有执行路径。",
  "Frontend surface polish": "前端界面打磨",
  "Turn the private Agents page into a useful team operations surface.":
    "把私密 Agents 页面打磨成有用的团队运行界面。",
  "Build native Next.js interfaces that preserve auth, public/private boundaries, and deployability.":
    "构建原生 Next.js 界面，同时保留认证、公开 / 私密边界和可部署性。",
  "Next.js surfaces": "Next.js 界面",
  "route wiring": "路由接线",
  "browser QA": "浏览器 QA",
  "production smoke": "生产 smoke",
  "Built native Doraemon Office, Owner Today, Trading Team, and Command surfaces.":
    "已构建原生 Doraemon Office、Owner Today、Trading Team 和 Command 界面。",
  "Code and verification artifacts are local to the protected worktree.":
    "代码和验证产物都位于受保护的本地工作区。",
  "This session": "本轮会话",
  "Attach build, route, leak, and visual evidence before merge.":
    "合并前附上构建、路由、泄漏探针和视觉证据。",
  "repo state": "仓库状态",
  "design docs": "设计文档",
  "local QA": "本地 QA",
  "component diff": "组件 diff",
  "verification log": "验证日志",
  "deployment notes": "部署记录",
  "No hidden write path, dispatch button, or private API is added in UI-only slices.":
    "UI-only 切片不会加入隐藏写入路径、派发按钮或私密 API。",
  "Roster interface polish": "花名册界面打磨",
  "Building the private MiniDora roster into a scan-first team control panel.":
    "正在把私密 MiniDora 花名册打磨成可快速扫描的团队控制面板。",
  "Command QA packet": "Command QA 包",
  "Produced build, route, browser, and leak evidence for the command surface.":
    "为 Command 界面产出了构建、路由、浏览器和泄漏探针证据。",
  "Owner Today surface": "Owner Today 界面",
  "Connected daily priorities, review pressure, and command shortcuts.":
    "连接了每日优先级、审核压力和指挥快捷入口。",
  "Experience coherence": "体验一致性",
  "Keep the private cockpit consistent with the public Doraemon story and Owner Cockpit IA.":
    "让私密驾驶舱与公开 Doraemon 故事和 Owner Cockpit 信息架构保持一致。",
  "Translate the Personal OS blueprint into page responsibilities, acceptance checks, and interface hierarchy.":
    "把 Personal OS 蓝图转成页面职责、验收检查和界面层级。",
  "IA alignment": "IA 对齐",
  "copy clarity": "文案清晰度",
  "acceptance gates": "验收门禁",
  "scope control": "范围控制",
  "Kept Command, Today, Trading, and Agents aligned with the source-of-truth docs.":
    "让 Command、Today、Trading 和 Agents 与 source-of-truth 文档保持一致。",
  "Product docs and implementation evidence are available for this slice.":
    "这个切片已有产品文档和实现证据。",
  "Check whether the Agents page now answers roster, lease, source-health, and handoff questions.":
    "检查 Agents 页面是否已经回答花名册、lease、来源健康和交接问题。",
  "IA": "IA",
  "design brief": "设计简报",
  "auth spec": "认证规格",
  "page intent": "页面意图",
  "copy constraints": "文案约束",
  "review checklist": "review 清单",
  "Cannot expand a slice into execution, publishing, or broker behavior.":
    "不能把一个切片扩展成执行、发布或券商行为。",
  "Team surface acceptance": "团队界面验收",
  "Checking that roster, history, capabilities, leases, and source health are all visible.":
    "正在检查花名册、历史、能力、lease 和来源健康是否都可见。",
  "Command hierarchy review": "Command 层级审核",
  "Kept mission drafting separate from hidden execution.":
    "保持任务起草与隐藏执行分离。",
  "Public Office alignment": "公开 Office 对齐",
  "Made the public Doraemon story line up with private cockpit vocabulary.":
    "让公开 Doraemon 故事与私密驾驶舱词汇对齐。",
  "Spec alignment": "规格对齐",
  "Trace every private Agents field back to a documented purpose or a safe mock source.":
    "把每个私密 Agents 字段追溯到文档目的或安全 mock 来源。",
  "Collect evidence, compare it with the design contract, and flag missing proof before owner decisions.":
    "收集证据、对照设计契约，并在本人决策前标出缺失证明。",
  "Design-doc traceability": "设计文档追溯",
  "boundary review": "边界审核",
  "source synthesis": "来源综合",
  "evidence summaries": "证据摘要",
  "Mapped each private surface back to Personal OS docs before implementation.":
    "实现前已把每个私密界面映射回 Personal OS 文档。",
  "Current docs are complete enough for scaffolds; live sources are not connected.":
    "当前文档足以支撑脚手架；实时来源尚未连接。",
  "Verify the page says what evidence exists and what remains mocked.":
    "验证页面是否说明了哪些证据存在、哪些仍是 mock。",
  "docs": "文档",
  "review notes": "review 记录",
  "route smoke": "路由 smoke",
  "evidence packet": "证据包",
  "gap list": "缺口清单",
  "source posture": "来源状态",
  "No private source documents or raw memory records are rendered.":
    "不渲染私密来源文档或原始记忆记录。",
  "Evidence posture check": "证据状态检查",
  "Separating verified local evidence from intentionally mocked cockpit state.":
    "区分已验证的本地证据和有意 mock 的驾驶舱状态。",
  "Leak probe reviewed": "泄漏探针已审核",
  "Confirmed private command copy did not appear on unauthenticated login routes.":
    "确认私密 Command 文案不会出现在未认证登录路由。",
  "Research-only claim traced": "仅研究声明已追溯",
  "Matched trading copy to the research-only contract.":
    "已把交易文案与仅研究契约对齐。",
  "Research-only console": "仅研究控制台",
  "Keep market research visible without creating order, broker, or recommendation paths.":
    "让市场研究可见，但不创建订单、券商或建议路径。",
  "Organize signals, disagreement, source degradation, and replay evidence for owner interpretation.":
    "整理信号、分歧、来源降级和回放证据，供本人解读。",
  "Evidence gates": "证据门禁",
  "desk disagreement": "研究台分歧",
  "source degradation": "来源降级",
  "research replay": "研究回放",
  "Upgraded trading into a research cockpit with no execution affordance.":
    "把交易研究升级为研究驾驶舱，不提供执行入口。",
  "Market data and broker connections are intentionally absent from this web surface.":
    "此网页界面有意不连接市场数据和券商。",
  "Recent slice": "近期切片",
  "Keep the research-only disclaimer visible wherever trading appears.":
    "凡是出现交易研究，都保持仅研究免责声明可见。",
  "curated signal mocks": "精选信号 mock",
  "research boundary": "研究边界",
  "source-health notes": "来源健康记录",
  "research posture": "研究状态",
  "evidence gate": "证据门禁",
  "risk summary": "风险摘要",
  "Owner-gated market lane": "本人把关的市场通道",
  "Visible in the roster, but intentionally separated from broker or order workflows.":
    "在花名册中可见，但有意与券商或订单工作流分离。",
  "Research cockpit passed": "研究驾驶舱已通过",
  "Evidence, disagreement, and replay stayed research-only.":
    "证据、分歧和回放都保持仅研究。",
  "Live data deferred": "实时数据暂缓",
  "Market and broker connections remain absent from this web surface.":
    "此网页界面仍不包含市场和券商连接。",
  "Schedule and health surfaces": "日程和健康界面",
  "Prepare the future Schedules and System Health cockpit slices.":
    "准备未来的 Schedules 和 System Health 驾驶舱切片。",
  "Turn recurring rhythms and system status into calm, reviewable owner dashboards.":
    "把周期节奏和系统状态转成冷静、可审核的本人仪表盘。",
  "schedule rhythm": "日程节奏",
  "system posture": "系统状态",
  "health summaries": "健康摘要",
  "runbook notes": "运行手册记录",
  "Outlined where schedules, system health, and route smokes belong in the Owner Cockpit.":
    "已梳理日程、系统健康和路由 smoke 在 Owner Cockpit 中的位置。",
  "Cron and runtime sources are intentionally not connected to this page yet.":
    "cron 和运行时来源尚未连接到此页面，这是有意的。",
  "Define read-only schedule evidence before any private endpoint exists.":
    "在任何私密端点存在前，先定义只读日程证据。",
  "operating rhythm": "运行节奏",
  "system health mocks": "系统健康 mock",
  "acceptance checks": "验收检查",
  "schedule view": "日程视图",
  "health view": "健康视图",
  "ops handoff": "运维交接",
  "No cron command strings, ports, local paths, or restart controls are displayed.":
    "不展示 cron 命令字符串、端口、本地路径或重启控制。",
  "Schedules slice waiting": "Schedules 切片等待中",
  "Needs a read-only evidence plan before runtime sources are connected.":
    "连接运行时来源前，需要只读证据计划。",
  "System health preview": "系统健康预览",
  "Kept owner cockpit status calm and route-protected.":
    "保持 Owner Cockpit 状态冷静且受路由保护。",
  "Future": "未来",
  "Operational endpoints not wired": "运维端点未接线",
  "No restart controls, cron commands, ports, or local paths are rendered.":
    "不渲染重启控制、cron 命令、端口或本地路径。",
  "Context preservation": "上下文保存",
  "Keep future Knowledge Vault work separate from public pages and owner-only notes.":
    "让未来 Knowledge Vault 工作与公开页面、仅本人笔记保持分离。",
  "Preserve context, decisions, and reusable knowledge without leaking private memory into public bundles.":
    "保存上下文、决策和可复用知识，同时不把私密记忆泄漏进公开 bundle。",
  "context retrieval": "上下文检索",
  "decision history": "决策历史",
  "knowledge synthesis": "知识综合",
  "privacy checks": "隐私检查",
  "Defined that public Knowledge pages show only curated synthesis, not raw vault material.":
    "已定义公开 Knowledge 页面只展示精选综合，不展示原始 vault 材料。",
  "Private vault content is not exposed through this static cockpit slice.":
    "私密 vault 内容不会通过这个静态驾驶舱切片暴露。",
  "Design Knowledge Vault evidence before connecting private sources.":
    "连接私密来源前，先设计 Knowledge Vault 证据。",
  "curated notes": "精选笔记",
  "decision logs": "决策日志",
  "public/private contract": "公开 / 私密契约",
  "context brief": "上下文简报",
  "memory boundary": "记忆边界",
  "knowledge checklist": "知识清单",
  "No raw private vault pages, source files, or memory records appear in the UI.":
    "UI 中不出现原始私密 vault 页面、源文件或记忆记录。",
  "Knowledge Vault deferred": "Knowledge Vault 暂缓",
  "Waiting for a dedicated private knowledge slice.":
    "等待专门的私密知识切片。",
  "Public boundary defined": "公开边界已定义",
  "Public knowledge pages stay curated and never expose raw vault material.":
    "公开知识页面保持精选，永不暴露原始 vault 材料。",
  "Memory sources not connected": "记忆来源未连接",
  "Private memory records are not available through this static cockpit.":
    "私密记忆记录不会通过这个静态驾驶舱提供。",
  "Visual asset strategy": "视觉资产策略",
  "Prepare a future asset pass for the Apple-like Personal OS and Doraemon Office visuals.":
    "为未来苹果式 Personal OS 和 Doraemon Office 视觉资产打样做准备。",
  "Create public-safe visuals that feel alive while keeping source asset collections replaceable and private.":
    "创建有生命力的公开安全视觉，同时让源资产集合保持私密且可替换。",
  "Image workflows": "图像工作流",
  "story assets": "叙事资产",
  "public-safe presentation": "公开安全呈现",
  "asset replacement": "资产替换",
  "Waiting for a future visual asset pass after the core cockpit surfaces stabilize.":
    "等待核心驾驶舱界面稳定后再进行未来视觉资产打样。",
  "No source asset library is exposed through the web app.":
    "网页应用不暴露源资产库。",
  "Generate and review assets only when the target page direction is fixed.":
    "仅在目标页面方向固定后再生成并审核资产。",
  "visual brief": "视觉简报",
  "approved references": "已批准参考",
  "asset policy": "资产策略",
  "concept frames": "概念画面",
  "runtime assets": "运行时资产",
  "replacement notes": "替换记录",
  "Raw/source asset collections stay private and takedown-friendly.":
    "原始 / 源资产集合保持私密，并便于下架。",
  "Asset pass waiting": "资产打样等待中",
  "Visual exploration waits until the target surface is stable enough to judge.":
    "视觉探索会等到目标界面足够稳定、可以判断时再开始。",
  "Apple-like direction captured": "苹果式方向已记录",
  "Personal site direction moved toward premium, minimal, alive interfaces.":
    "个人网站方向已转向高级、简约、有生命力的界面。",
  "Raw assets remain private": "原始资产保持私密",
  "Runtime visuals should stay replaceable and source collections stay outside public repos.":
    "运行时视觉应保持可替换，源集合留在公开仓库之外。",
  "Doraemon Office first screen passed review after P2 fixes.":
    "Doraemon Office 第一屏在 P2 修复后通过 review。",
  "Codex": "Codex",
  "Opus": "Opus",
  "Owner Today passed after the complete packet proved auth and routes.":
    "完整证据包证明认证和路由后，Owner Today 通过 review。",
  "Trading Team passed as research-only with no execution controls.":
    "Trading Team 以仅研究且无执行控制的状态通过 review。",
  "Command Surface passed after removing the accessibility textbox role.":
    "移除可访问性 textbox role 后，Command Surface 通过 review。",
  "Private Agents and Review Queue are being shaped into cockpit surfaces.":
    "Private Agents 和审核队列正在被塑造成驾驶舱界面。",

  "Owner Review Queue": "本人审核队列",
  "Decisions stay explicit before anything moves.": "任何事情推进前，决策都必须保持显式。",
  "Decision packets prepared by Doraemon and MiniDoras. Review evidence, blockers, allowed next steps, and missing proof without approving, dispatching, or silently promoting work.":
    "Doraemon 和 MiniDoras 准备的决策包。你可以查看证据、阻塞项、允许的下一步和缺失证明，但不会批准、派发或静默推进工作。",
  "Read-only packets": "只读审核包",
  "Decision flow": "决策流程",
  "Packet created": "审核包已创建",
  "Prepared by agent": "由智能体准备",
  "Evidence collected": "证据已收集",
  "Proof and gaps named": "证明与缺口已命名",
  "You inspect here": "你在这里审核",
  "Next step stays explicit": "下一步保持显式",
  "Implementation later": "稍后再实现",
  "Only after gates open": "只有门禁打开后才可继续",
  "Current packet": "当前审核包",
  "Recommended handling": "建议处理方式",
  "Allowed next": "允许的下一步",
  "Blockers": "阻塞项",
  "All lanes": "全部通道",
  "Review queue lane filters": "审核队列通道筛选",
  "Lane": "通道",
  "Proof": "证明",
  "Due": "到期",
  "Evidence workbench": "证据工作台",
  "Inspect the selected packet in detail. All information is read-only; missing proof is visible instead of being papered over.":
    "详细检查选中的审核包。所有信息都是只读的；缺失证明会明确显示，而不是被掩盖。",
  "Decision packets": "决策包",
  "Selected packet": "选中审核包",
  "Requested decision": "请求决策",
  "Agent note": "智能体备注",
  "Evidence requested": "请求的证据",
  "Owner decision draft": "本人决策草稿",
  "Choose a local review posture for this packet. No API call, approval, publish, or dispatch is sent.":
    "为这个审核包选择一个本地审核姿态。不会发送 API 调用、批准、发布或派发。",
  "Owner note draft": "本人备注草稿",
  "Private note for this review packet": "这个审核包的私密备注",
  "This note stays in this browser session. It is not saved, sent, or treated as approval.":
    "这条备注只留在本次浏览器会话中。它不会保存、发送，也不会被视为批准。",
  "Gates before merge": "合并前门禁",
  "Still unavailable": "仍不可用",
  "Decision lanes": "决策通道",
  "Each lane says who owns the review, why the item exists, and whether the next step is current, deferred, or blocked.":
    "每个通道说明谁负责审核、这个条目为什么存在，以及下一步是当前处理、暂缓还是阻塞。",
  "Review rules": "审核规则",
  "The queue represents decisions as states only. It can clarify what is allowed next, but it cannot perform the next step.":
    "这个队列只把决策表示为状态。它可以说明下一步允许什么，但不能执行下一步。",
  "Review queue continuation paths": "审核队列后续路径",
  "Continue from review": "从审核继续",
  "Review Queue does not mutate work. When a decision is clear, move to the relevant private surface and keep the next step explicit.":
    "审核队列不会修改工作。当决策清晰后，进入对应的私密界面，并保持下一步显式可见。",
  "Draft a mission packet after review is understood.": "理解审核后再起草任务包。",
  "See Agents": "查看智能体",
  "Inspect the MiniDora lane responsible for the packet.": "查看负责此审核包的 MiniDora 通道。",
  "Review Queue is clear": "审核队列已清空",
  "No owner decision packets are waiting right now. The surface stays read-only and will show evidence, blockers, and allowed next steps when Doraemon prepares a packet.":
    "现在没有等待本人的决策包。这个界面保持只读；当 Doraemon 准备好审核包时，会显示证据、阻塞项和允许的下一步。",
  "Clear": "清空",
  "Evidence cards": "证据卡片",
  "Needs current attention": "需要当前关注",
  "Review needed": "需要审核",
  "Safe hold": "安全暂停",
  "No action path allowed": "不允许动作路径",
  "Publish": "发布",
  "Local evidence and external review must be clean before PR/deploy.":
    "PR / 部署前，本地证据和外部 review 必须干净。",
  "Depth work waits for a real source instead of invented history.":
    "深度工作等待真实来源，而不是编造历史。",
  "The surface says it is not an order, recommendation, or execution system.":
    "界面说明它不是订单、建议或执行系统。",
  "Trading stays research-only and evidence-first.":
    "交易保持仅研究、证据优先。",
  "Write APIs need audit and rollback design before controls exist.":
    "写入 API 需要先有审计和回滚设计，才能出现控制项。",

  "Actions": "动作",
  "After local proof": "本地证明之后",
  "Auth": "认证",
  "Audit log": "审计日志",
  "Audit model": "审计模型",
  "Auth model": "认证模型",
  "Auth/session spec": "认证 / 会话规格",
  "Baseline": "基线",
  "Build output": "构建输出",
  "Defer": "暂缓",
  "Deferred": "已暂缓",
  "Disclaimer": "免责声明",
  "History": "历史",
  "Known": "已知",
  "Missing": "缺失",
  "No ship": "不发版",
  "Open decisions": "未决事项",
  "Owner revisit": "本人复查",
  "Owner wording": "本人措辞",
  "Owner wording choice": "本人措辞选择",
  "Owner-visible review items": "本人可见审核项",
  "Private route gate": "私密路由门禁",
  "Private schema": "私密 schema",
  "Product depth": "产品深度",
  "Proof or gap rows": "证明或缺口行",
  "Real source": "真实来源",
  "Recommended": "推荐",
  "Research-only disclaimer": "仅研究免责声明",
  "Runtime": "运行时",
  "Safe default": "安全默认",
  "Safety design": "安全设计",
  "Ship gate": "发版门禁",
  "Source needed": "需要来源",
  "Source posture": "来源状态",
  "Spec first": "先写规格",
  "Step review history": "步骤审核历史",
  "Visible": "可见",
  "Write APIs": "写入 API",
  "Write endpoint": "写入端点",

  "Owner Knowledge Vault": "私密知识库",
  "Private synthesis, public-safe memory.": "私密综合，公开安全的记忆。",
  "A read-only cockpit for turning owner context, design notes, research method, and release evidence into reviewed knowledge without letting raw source material cross the public boundary.":
    "一个只读驾驶舱，用来把本人语境、设计笔记、研究方法和发布证据转化为已审核知识，同时不让原始来源材料跨过公开边界。",
  "Research-only boundary": "仅研究边界",
  "Candidates": "候选",
  "Sources": "来源",
  "Active controls; publish, sync, trade, and source exposure remain unavailable":
    "可用控制；发布、同步、交易和来源暴露仍不可用",
  "Ready checks across the queue": "队列中的就绪检查",
  "Private-to-public bridge": "私密到公开桥接",
  "Gated": "受控",
  "Private source": "私密来源",
  "Synthesis": "综合",
  "Public-safe output": "公开安全输出",
  "Raw notes, memory, prompts, and unpublished reports stay private.":
    "原始笔记、记忆、prompt 和未发布报告保持私密。",
  "Doraemon and MiniDoras turn inputs into reviewable conclusions.":
    "Doraemon 和 MiniDoras 将输入转化为可审核结论。",
  "Weiyu approves wording, destination, and public safety before release.":
    "发布前由 Weiyu 批准措辞、去向和公开安全性。",
  "Visitors see rewritten pages and sanitized dashboard state only.":
    "访客只能看到重写后的页面和脱敏的 dashboard 状态。",
  "The vault can classify source lanes and review signals, but it never renders raw private source text into the owner cockpit or public routes.":
    "知识库可以分类来源通道和审核信号，但绝不把原始私密来源文本渲染进私密驾驶舱或公开路由。",
  "Source text hidden": "来源文本隐藏",
  "Operating posture": "运行姿态",
  "The vault is deliberately useful before it becomes write-capable.":
    "知识库在具备写入能力之前，就要先以只读方式变得有用。",
  "Source inbox": "来源收件箱",
  "Synthesis briefs": "综合简报",
  "Public candidates": "公开候选",
  "Memory context": "记忆语境",
  "Owner-only captures": "仅本人捕获",
  "Private summaries": "私密摘要",
  "Curated outputs": "策划输出",
  "Owner context": "本人语境",
  "Triage lane": "分诊通道",
  "Decision queue": "决策队列",
  "Rewrite path": "重写路径",
  "Private guide": "私密指引",
  "Incoming notes and evidence are triaged before they become synthesis material.":
    "进入的笔记和证据会先被分诊，然后才成为综合材料。",
  "Raw captures stay outside the web UI.": "原始捕获内容留在网页界面之外。",
  "Draft conclusions and decisions wait for explicit owner review before publication.":
    "草稿结论和决策在发布前等待明确的本人审核。",
  "Only rewritten conclusions can move forward.": "只有重写后的结论可以继续推进。",
  "Candidate project, lab, and journal updates are rewritten into public-safe form.":
    "候选项目、实验室和日志更新会被重写成公开安全形式。",
  "Public pages receive curated text, never raw source.": "公开页面接收策划后的文本，而不是原始来源。",
  "Personal context can guide prioritization, but raw memory records stay out of the UI.":
    "个人语境可以指导优先级，但原始记忆记录不进入界面。",
  "Context can shape priority without becoming content.": "语境可以影响优先级，但不会变成内容。",
  "Private sources": "私密来源",
  "Review gates": "审核门",
  "Public bridge": "公开桥接",
  "Explicit": "显式",
  "Curated": "策划后",
  "Protected inputs can inform the cockpit, but source text is not rendered.":
    "受保护输入可以影响驾驶舱，但来源文本不会被渲染。",
  "Publication requires owner review, public rewrite, and boundary pass.":
    "发布需要本人审核、公开重写和边界检查。",
  "Only safe project pages, notes, and dashboard summaries cross out.":
    "只有安全的项目页、笔记和 dashboard 摘要可以对外。",
  "Owner review workbench": "本人审核工作台",
  "Inspect one synthesis candidate at a time. The controls below only change the local reading posture; they do not publish, sync, expose sources, or create a public page.":
    "一次检查一个综合候选。下面的控件只改变本地阅读姿态；不会发布、同步、暴露来源或创建公开页面。",
  "Local state": "本地状态",
  "Synthesis candidates": "综合候选",
  "Selected synthesis candidate": "已选择综合候选",
  "Selected candidate": "已选择候选",
  "Candidate": "候选",
  "Destination": "去向",
  "Risk": "风险",
  "State": "状态",
  "Review summary": "审核摘要",
  "Evidence readiness": "证据就绪度",
  "Owner review posture": "本人审核姿态",
  "Choose how to read this candidate locally. This does not publish, sync, or expose source material.":
    "选择如何在本地阅读这个候选。这不会发布、同步或暴露来源材料。",
  "No publish": "不发布",
  "Synthesis queue": "综合队列",
  "Candidate outputs are visible as review work, not as publishable source material.":
    "候选输出作为审核工作可见，而不是可直接发布的来源材料。",
  "Shows the public Knowledge page narrative, not private queue items or source records.":
    "展示公开 Knowledge 页叙事，而不是私密队列项或来源记录。",
  "Open the visitor-facing knowledge page. It stays sanitized and does not expose source material from this owner cockpit.":
    "打开面向访客的知识页面。它保持脱敏，并且不会暴露这个私密驾驶舱中的来源材料。",
  "New public text still needs explicit owner review before it becomes a shipped route.":
    "新的公开文本在成为已发布路由前仍需要明确的本人审核。",
  "Open public bridge": "打开公开桥接",
  "Policy": "策略",
  "No publish controls": "没有发布控制",
  "Future publishing needs authenticated APIs, preview, audit logging, explicit owner action, and rollback behavior.":
    "未来发布需要认证 API、预览、审计日志、明确的本人动作和回滚行为。",
  "Unavailable until designed": "设计完成前不可用",
  "Personal OS design memory": "Personal OS 设计记忆",
  "Doraemon Office release notes": "Doraemon Office 发布笔记",
  "Trading research glossary": "交易研究术语表",
  "Product blueprint": "产品蓝图",
  "Product decision summary": "产品决策摘要",
  "Lab note": "实验室笔记",
  "Public lab note candidate": "公开实验室笔记候选",
  "Research explainer": "研究说明",
  "Research-only public explainer": "仅研究的公开说明",
  "Needs public/private boundary pass": "需要公开 / 私密边界检查",
  "Must avoid runtime details": "必须避免运行时细节",
  "No positions, orders, accounts, or recommendations": "没有仓位、订单、账户或建议",
  "Docs cross-check": "文档交叉检查",
  "Owner decision": "本人决策",
  "Public rewrite": "公开重写",
  "Read source context": "读取来源语境",
  "Rewrite conclusion": "重写结论",
  "Boundary signoff": "边界签核",
  "Decision summary": "决策摘要",
  "Blueprint update": "蓝图更新",
  "Raw memory": "原始记忆",
  "Defer rewrite": "暂缓重写",
  "Need boundary pass": "需要边界检查",
  "PR summary": "PR 摘要",
  "Deployment smoke": "部署 smoke",
  "Safe wording": "安全措辞",
  "Collect reviewed work": "收集已审核工作",
  "Remove internals": "移除内部细节",
  "Draft lab note": "起草实验室笔记",
  "Release note": "发布笔记",
  "Verification summary": "验证摘要",
  "Runtime detail": "运行时细节",
  "Draft note": "起草笔记",
  "Hold wording": "暂缓措辞",
  "Archive private": "私密归档",
  "Research disclaimer": "研究免责声明",
  "Account data": "账户数据",
  "No execution path": "没有执行路径",
  "Define terms": "定义术语",
  "Remove signals": "移除信号",
  "Attach disclaimer": "附加免责声明",
  "Glossary explainer": "术语说明",
  "Boundary note": "边界说明",
  "Review explainer": "审核说明",
  "Tighten boundary": "收紧边界",
  "Do not publish": "不要发布",
  "Absent": "不存在",
  "Needed": "需要",
  "Needs rewrite": "需要重写",
  "Needs wording": "需要措辞",
  "Owner read": "本人阅读",
  "No raw memory, private transcript, prompt, or unpublished source text can be copied into public pages.":
    "原始记忆、私密转录、prompt 或未发布来源文本都不能复制进公开页面。",
  "Public blueprint and data contract are available as the source of truth.":
    "公开蓝图和数据契约可作为事实源。",
  "Weiyu must choose what becomes public product language.":
    "Weiyu 必须选择哪些内容成为公开产品语言。",
  "Turn private design context into a public-safe product decision summary.":
    "把私密设计语境转化为公开安全的产品决策摘要。",
  "Private context needs a curated rewrite before leaving the cockpit.":
    "私密语境离开驾驶舱前需要策划重写。",
  "Use private context as input without rendering raw material.":
    "把私密语境作为输入使用，但不渲染原始材料。",
  "Create public product wording from the documented blueprint.":
    "从已记录的蓝图中创建公开产品措辞。",
  "Run the public/private boundary pass before publishing.":
    "发布前运行公开 / 私密边界检查。",
  "A rewritten product decision summary can be reviewed for public use.":
    "重写后的产品决策摘要可以进入公开使用审核。",
  "Documentation changes need explicit owner review.":
    "文档变更需要明确的本人审核。",
  "Private memory records are not displayable outputs.":
    "私密记忆记录不是可显示输出。",
  "Treat this candidate as the next public-language decision.":
    "把这个候选视为下一项公开语言决策。",
  "Read the summary, choose public wording, then keep any edits inside Review Queue until approved.":
    "阅读摘要，选择公开措辞，然后在批准前把所有编辑留在审核队列中。",
  "Leave the candidate visible without moving it toward publication.":
    "保持候选可见，但不把它推向发布。",
  "Keep the source private and revisit after the current Personal OS slice closes.":
    "保持来源私密，在当前 Personal OS 切片关闭后再复查。",
  "Require another privacy review before trusting the candidate.":
    "信任这个候选前，需要再做一次隐私审核。",
  "Check the Data Contract and remove any private-memory-shaped wording first.":
    "先检查数据契约，并移除任何类似私密记忆的措辞。",
  "Prepare a public build note from reviewed PR and deployment evidence.":
    "从已审核 PR 和部署证据准备公开构建笔记。",
  "No internal runtime labels, local service details, raw logs, or operational commands can be shown.":
    "不能展示内部运行时标签、本地服务细节、原始日志或运维命令。",
  "Reviewed product changes are safe inputs for a public build note.":
    "已审核的产品变更可作为公开构建笔记的安全输入。",
  "Public route checks can support the release story.":
    "公开路由检查可以支撑发布叙事。",
  "Runtime and ops language still needs a public rewrite.":
    "运行时和运维语言仍需公开化重写。",
  "Start from merged PRs and production smoke evidence.":
    "从已合并 PR 和生产 smoke 证据开始。",
  "Strip service internals, commands, hostnames, ports, and private traces.":
    "移除服务内部细节、命令、主机名、端口和私密痕迹。",
  "Write a public note about product behavior and design intent.":
    "围绕产品行为和设计意图撰写公开笔记。",
  "A public note can describe shipped user-visible improvements.":
    "公开笔记可以描述已发布的用户可见改进。",
  "Route and privacy smoke checks can be summarized safely.":
    "路由和隐私 smoke 检查可以被安全总结。",
  "Raw logs, shell commands, and private infrastructure details stay out.":
    "原始日志、shell 命令和私密基础设施细节保持不外露。",
  "Use the candidate as a starting point for a public lab note.":
    "用这个候选作为公开实验室笔记的起点。",
  "Write from product impact and verification evidence, not from raw runtime detail.":
    "从产品影响和验证证据出发，而不是从原始运行时细节出发。",
  "Pause until the public wording is less operational.":
    "暂停，直到公开措辞不那么偏运维。",
  "Rewrite toward visitor-facing product behavior before publication.":
    "发布前重写为面向访客的产品行为叙事。",
  "Keep the evidence private and do not create public content.":
    "保持证据私密，不创建公开内容。",
  "Leave the candidate in the vault; no public page or lab note is created.":
    "把候选留在知识库中；不会创建公开页面或实验室笔记。",
  "Trading language must remain research-only and cannot become advice, recommendation, order, account, or position content.":
    "交易语言必须保持仅研究，不能变成建议、推荐、订单、账户或仓位内容。",
  "The fixed research-only disclaimer is required wherever trading appears.":
    "凡出现交易内容，都必须带固定的仅研究免责声明。",
  "No account, position, broker, or credential detail is part of this candidate.":
    "这个候选不包含账户、仓位、券商或凭据细节。",
  "No order, recommendation, sizing, or execution workflow exists.":
    "不存在订单、建议、规模或执行工作流。",
  "Create a public explainer for research vocabulary without market instructions.":
    "创建一个不含市场指令的研究术语公开说明。",
  "Explain vocabulary as learning context, not as market instruction.":
    "把术语作为学习语境解释，而不是市场指令。",
  "Do not include live signals, symbols, positions, or tactical calls.":
    "不要包含实时信号、标的、仓位或战术判断。",
  "Keep the research-only boundary visible in the final public output.":
    "在最终公开输出中保持仅研究边界可见。",
  "A methodology explainer is safe when it contains no actionable market instruction.":
    "只要不包含可执行市场指令，方法论说明就是安全的。",
  "The research-only disclaimer must stay attached.":
    "仅研究免责声明必须保留。",
  "Read the glossary as methodology content only.":
    "只把术语表作为方法论内容阅读。",
  "Open the Trading Team for research context; do not treat the glossary as a signal.":
    "打开交易研究团队查看研究语境；不要把术语表当作信号。",
  "Strengthen language if any phrase sounds like advice.":
    "如果任何措辞听起来像建议，就加强边界语言。",
  "Remove tactical verbs and keep the fixed research-only disclaimer visible.":
    "移除战术动词，并保持固定的仅研究免责声明可见。",
  "Leave the glossary private until the owner approves the boundary.":
    "在本人批准边界前，让术语表保持私密。",
  "No public route, recommendation, order, or execution path is created.":
    "不会创建公开路由、建议、订单或执行路径。",
  "Raw vault pages are never mounted directly into public routes.":
    "原始知识库页面绝不直接挂载到公开路由。",
  "Public publishing requires an explicit owner-reviewed rewrite.":
    "公开发布需要明确的本人审核重写。",
  "Private memory can inform prioritization but must not appear as source text.":
    "私密记忆可以影响优先级，但不能作为来源文本出现。",
  "Trading-related synthesis stays research-only and cannot become an execution workflow.":
    "交易相关综合保持仅研究，不能变成执行工作流。",
  "Publish candidate": "发布候选",
  "Expose source": "暴露来源",
  "Sync private vault": "同步私密知识库",
  "Create trading execution path": "创建交易执行路径",

  "Confirm Review Queue cockpit surface": "确认审核队列驾驶舱界面",
  "Decide agent history depth": "决定智能体历史深度",
  "Review trading research boundary copy": "审核交易研究边界文案",
  "Prepare future private API audit design": "准备未来私密 API 审计设计",
  "Decide whether this review surface is clear enough to enter PR after Opus review.":
    "决定这个审核界面是否足够清晰，可以在 Opus review 后进入 PR。",
  "Check local evidence, read the Opus finding list, then allow merge only if P1/P2 are closed.":
    "检查本地证据，阅读 Opus 问题列表；只有 P1/P2 都关闭后才允许合并。",
  "Production build and TypeScript must pass after the final diff.":
    "最终 diff 之后，生产构建和 TypeScript 必须通过。",
  "Unauthenticated /app/review must redirect before private shell content renders.":
    "未认证访问 /app/review 必须在私密外壳内容渲染前重定向。",
  "Claude Opus must return no open P1/P2 before PR/deploy.":
    "PR / 部署前，Claude Opus 必须返回没有开放 P1/P2。",
  "Claude Opus must return no open P1/P2 before PR, merge, or deploy.":
    "PR、合并或部署前，Claude Opus 必须返回没有开放 P1/P2。",
  "No approve button": "没有批准按钮",
  "Evidence visible": "证据可见",
  "Send to Opus review": "送去 Opus review",
  "Use only after build, auth, browser, and boundary evidence are attached.":
    "只有在构建、认证、浏览器和边界证据都附上后才能使用。",
  "Prepare the Claude Opus review packet. PR waits for a clean P1/P2 result.":
    "准备 Claude Opus review 包。PR 等待干净的 P1/P2 结果。",
  "Request more evidence": "要求更多证据",
  "Keep the packet open and ask for missing screenshots, route smoke, or leak probes.":
    "保持审核包打开，并要求补齐截图、路由 smoke 或泄漏探针。",
  "Do not open the PR. Attach the missing proof to this review item first.":
    "不要打开 PR。先把缺失证明附到这个审核项。",
  "Defer this slice": "暂缓这个切片",
  "Keep the route private and leave implementation paused until scope changes.":
    "保持路由私密，并在范围变化前暂停实现。",
  "Return to Command with a revised mission packet instead of promoting this work.":
    "带着修改后的任务包回到 Command，而不是推进这项工作。",
  "Desktop and narrow viewports must show the decision loop without overflow.":
    "桌面和窄屏视口必须展示决策循环且没有溢出。",
  "No live private review API exists in this slice.": "这个切片没有实时私密 review API。",
  "The page must remain a decision register, not a workflow runner.":
    "这个页面必须保持为决策登记簿，而不是工作流运行器。",
  "Prepare PR only after local verification and Opus review are clean.":
    "只有本地验证和 Opus review 都干净后才准备 PR。",
  "Approve and execute": "批准并执行",
  "Reject and run": "拒绝并运行",
  "Dispatch tools": "派发工具",
  "No private API or execution action should appear in this slice.":
    "这个切片中不应出现私密 API 或执行动作。",

  "Decide whether the next Agents pass needs a full per-agent timeline or the current snapshot is enough.":
    "决定下一轮 Agents 是否需要完整的每智能体时间线，还是当前快照已经足够。",
  "Keep the current roster shipped, then revisit history depth when a private event source exists.":
    "先保留并发布当前花名册，等有私密事件来源后再复查历史深度。",
  "The current Agents surface shows leases, source health, handoffs, and boundary.":
    "当前 Agents 界面展示 lease、来源健康、交接和边界。",
  "True per-agent history needs a private timeline source, not invented UI rows.":
    "真实的每智能体历史需要私密时间线来源，而不是编造 UI 行。",
  "No fake history": "不编造历史",
  "Keep snapshot depth": "保持快照深度",
  "Keep the current roster and source-health view until private history data exists.":
    "在私密历史数据存在前，保持当前花名册和来源健康视图。",
  "Track agent history as a later Events or Agents depth slice.":
    "把智能体历史作为后续 Events 或 Agents 深度切片跟进。",
  "Request source design": "请求来源设计",
  "Ask for a private timeline source design before expanding the UI.":
    "扩展 UI 前，先要求私密时间线来源设计。",
  "Draft schema, retention, auth, and redaction rules before implementation.":
    "实现前先起草 schema、保留、认证和脱敏规则。",
  "Defer history": "暂缓历史",
  "Leave the Agents page as a live roster and avoid invented activity rows.":
    "让 Agents 页面保持为实时花名册，避免编造活动行。",
  "Return when a private event source can supply real per-agent history.":
    "当私密事件来源能提供真实每智能体历史时再回来处理。",
  "No authenticated per-agent timeline source is available yet.":
    "目前还没有认证后的每智能体时间线来源。",
  "No invented rows": "不编造行",
  "The UI must not create fake history to make the page feel busy.":
    "UI 不能为了显得忙碌而创建假历史。",
  "Timeline depth needs an owner-only schema and retention policy.":
    "时间线深度需要仅本人可见的 schema 和保留策略。",
  "No authenticated agent timeline source is connected yet.":
    "尚未连接认证后的智能体时间线来源。",
  "Track as a future Agents or Events depth slice.":
    "作为未来 Agents 或 Events 深度切片跟进。",
  "Invent history": "编造历史",
  "Expose raw runtime events": "暴露原始运行时事件",
  "Add a private API without audit design": "在没有审计设计时新增私密 API",
  "Each cockpit surface should continue landing as a reviewed, coherent slice.":
    "每个驾驶舱界面都应继续以经过审核、边界清晰的切片落地。",

  "Decide whether the research-only disclaimer is strong enough for the private trading cockpit.":
    "决定仅研究免责声明对于私密交易驾驶舱是否足够有力。",
  "Keep the disclaimer visible until the owner explicitly revises it.":
    "在本人明确修改前，保持免责声明可见。",
  "Trading Team states that it is research-only and not an order, recommendation, or execution system.":
    "Trading Team 声明它仅用于研究，不是订单、建议或执行系统。",
  "Market data and broker connections are intentionally absent from the web surface.":
    "网页界面有意不包含市场数据和券商连接。",
  "No broker, paper trading, live order, or auto-promotion path exists.":
    "不存在券商、纸面交易、实盘订单或自动推进路径。",
  "Keep current wording": "保持当前措辞",
  "Keep the fixed research-only disclaimer visible on the private trading cockpit.":
    "在私密交易驾驶舱保持固定的仅研究免责声明可见。",
  "Continue building evidence-first research surfaces with no execution affordance.":
    "继续构建证据优先且无执行入口的研究界面。",
  "Revise owner copy": "修改本人文案",
  "Update the human-readable disclaimer without weakening the research-only boundary.":
    "更新人类可读免责声明，但不削弱仅研究边界。",
  "Review against the Public/Private Data Contract before shipping.":
    "发布前按 Public/Private Data Contract 审核。",
  "Hold trading changes": "暂停交易改动",
  "Pause new Trading Team UI until boundary language is settled.":
    "在边界语言确定前，暂停新的 Trading Team UI。",
  "Return to Command with a narrower copy-only review packet.":
    "带着更窄的纯文案审核包回到 Command。",
  "No broker path": "无券商路径",
  "Signals must link to evidence or show that evidence is missing.":
    "信号必须连接到证据，或显示证据缺失。",
  "No trading execution authorization exists.": "不存在交易执行授权。",
  "Any future data connection must preserve research-only framing.":
    "任何未来数据连接都必须保留仅研究框架。",
  "Owner may revise copy, but not authorize execution from this page.":
    "本人可以修改文案，但不能从此页授权执行。",
  "Position sizing": "仓位规模",
  "Recommendation wording": "建议性措辞",
  "The console remains research-only and has no order, paper, live, or broker path.":
    "控制台保持仅研究，没有订单、纸面交易、实盘或券商路径。",

  "Decide when the team is ready to design audited write APIs.":
    "决定团队何时准备好设计可审计写入 API。",
  "Keep all command surfaces read-only until auth, audit, rollback, and error handling are designed.":
    "在认证、审计、回滚和错误处理设计完成前，保持所有 Command 界面只读。",
  "The current owner token gate is acceptable for read-only v0 dashboards.":
    "当前 owner token 门禁对只读 v0 dashboard 是可接受的。",
  "No audit log, rollback model, or write permission system exists yet.":
    "目前还没有审计日志、回滚模型或写入权限系统。",
  "No command or workflow dispatch endpoint is rendered in the cockpit.":
    "驾驶舱中没有渲染命令或工作流派发端点。",
  "Write audit spec": "编写审计规格",
  "Design auth, audit log, rollback, error, and permission behavior before any write API exists.":
    "任何写入 API 存在前，先设计认证、审计日志、回滚、错误和权限行为。",
  "Produce an implementation spec and review packet, not an endpoint.":
    "产出实现规格和审核包，而不是端点。",
  "Keep read-only": "保持只读",
  "Leave Command and Review Queue as planning and review surfaces only.":
    "让 Command 和审核队列仅作为计划与审核界面。",
  "Continue read-only cockpit slices without adding hidden execution paths.":
    "继续只读驾驶舱切片，不新增隐藏执行路径。",
  "Block write work": "阻塞写入工作",
  "Do not add action buttons or private APIs until the audit model is approved.":
    "审计模型批准前，不添加动作按钮或私密 API。",
  "Revisit only after the owner accepts the audit and rollback design.":
    "只有本人接受审计和回滚设计后再复查。",
  "No append-only action log, actor model, or rollback record exists.":
    "不存在 append-only 动作日志、actor 模型或回滚记录。",
  "No command or workflow dispatch endpoint should be rendered in this cockpit.":
    "这个驾驶舱不应渲染命令或工作流派发端点。",
  "No audited write API design exists.": "不存在已审计的写入 API 设计。",
  "No rollback behavior exists.": "不存在回滚行为。",
  "No owner action confirmation model exists.": "不存在本人动作确认模型。",
  "Write an implementation spec before any action button appears.":
    "任何动作按钮出现前，先写实现规格。",
  "Hidden execution": "隐藏执行",
  "One-click approve": "一键批准",
  "Silent retry": "静默重试",
  "Unaudited mutation": "未审计变更",
  "No write endpoint should be added until audit, rollback, and error handling are designed.":
    "在审计、回滚和错误处理设计完成前，不应添加写入端点。",

  "Approvals, rejects, notes, and deferrals are represented as review states only.":
    "批准、拒绝、备注和暂缓只表示为审核状态。",
  "This page has no approve, reject, publish, execute, or dispatch button.":
    "此页没有批准、拒绝、发布、执行或派发按钮。",
  "Every decision item must show evidence or say what evidence is missing.":
    "每个决策项都必须显示证据，或说明缺少什么证据。",
  "No silent auto-promotion from review state to execution state.":
    "不会从审核状态静默自动推进到执行状态。",

  "Owner Schedules": "本人日程",
  "Read-only register": "只读登记簿",
  "No scheduler controls": "没有调度器控制",
  "Authenticated private rhythm": "已认证的私密节奏",
  "Time awareness and operating windows for Doraemon, MiniDoras, and owner review. The page shows rhythm, evidence, and gates without becoming a scheduler.":
    "Doraemon、MiniDoras 和本人审核的时间感知与运行窗口。这个页面展示节奏、证据和门禁，但不会变成调度器。",
  "Next operating window": "下一个运行窗口",
  "Rhythm map": "节奏地图",
  "Rhythm workbench": "节奏工作台",
  "Inspect one recurring loop at a time. The browser can show cadence, evidence, and owner gates, but it cannot create or mutate scheduler jobs.":
    "一次检查一个循环。浏览器可以展示节奏、证据和本人门禁，但不能创建或修改调度任务。",
  "Schedule cadence filters": "日程节奏筛选",
  "Selected schedule": "选中日程",
  "Reading steps": "阅读步骤",
  "Owner window plan": "本人窗口计划",
  "Pick a local reading posture for this schedule window. No schedule job, delivery, or runtime action is sent.":
    "为这个日程窗口选择本地阅读姿态。不会发送日程任务、投递或运行时动作。",
  "Operating rhythm": "运行节奏",
  "A compact map of when context should become readable and which agent owns the loop.":
    "一张紧凑地图，说明上下文何时应变得可读，以及哪个智能体负责该循环。",
  "Owner visible": "本人可见",
  "Scheduler boundary": "调度器边界",
  "This page can explain cadence and owner gates. It cannot create, pause, resume, delete, edit, or dispatch recurring jobs.":
    "这个页面可以解释节奏和本人门禁。它不能创建、暂停、恢复、删除、编辑或派发循环任务。",
  "Schedules continuation paths": "日程后续路径",
  "Continue from schedules": "从日程继续",
  "Schedule review stays descriptive here. Use adjacent private surfaces to draft work or inspect system posture without exposing scheduler commands.":
    "这里的日程审核保持描述性。使用相邻私密界面起草工作或检查系统状态，同时不暴露调度器命令。",
  "Draft schedule-related owner instructions after review.":
    "审核后起草与日程相关的本人指令。",
  "Inspect posture before trusting recurring loops.":
    "信任循环任务前先检查状态。",
  "Register empty": "登记簿为空",
  "No owner-visible recurring schedules are available in this private mock source. The page remains read-only and does not expose scheduler commands or mutation controls.":
    "这个私密 mock 来源中没有本人可见的循环日程。页面保持只读，不暴露调度器命令或变更控制。",
  "Private schedules rhythm register": "私密日程节奏登记簿",
  "Cadence": "节奏",
  "No-go": "禁止项",
  "No-go actions": "禁止动作",
  "Last run": "上次运行",
  "Dependencies": "依赖",
  "Summary": "摘要",
  "Purpose": "目的",
  "All": "全部",
  "Daily": "每日",
  "Morning review": "晨间审核",
  "Next morning": "下个早晨",
  "Before work starts": "工作开始前",
  "Designed to be read before the first work block.": "设计为在第一个工作块前阅读。",
  "Market day": "市场日",
  "Market days": "市场日",
  "Market": "市场",
  "Next market day": "下一个市场日",
  "Next market session": "下一个市场时段",
  "During market sessions": "市场时段内",
  "Runs as research preparation, not trading instruction.":
    "作为研究准备运行，而不是交易指令。",
  "Evening": "夜间",
  "Evening check": "夜间检查",
  "Before overnight work": "夜间工作前",
  "Designed to reveal attention areas before overnight work.":
    "设计为在夜间工作前揭示需要关注的区域。",
  "Health check": "健康检查",
  "Weekly": "每周",
  "Weekly close": "每周收口",
  "Runs as a review packet, not an automatic planning mutation.":
    "作为复盘包运行，而不是自动规划变更。",
  "Planning close": "规划收口",
  "Pending owner review": "等待本人审核",
  "Recurring loops": "循环任务",
  "Owner-visible operating rhythms": "本人可见运行节奏",
  "Schedules preparing context": "正在准备上下文的日程",
  "Needs explicit owner read": "需要本人明确阅读",
  "Tracked rows": "追踪行",
  "Proof, gaps, or blocked actions": "证明、缺口或被阻塞动作",
  "Next action": "下一步动作",
  "Window": "窗口",
  "Tracked off-page": "在页面外追踪",
  "No schedules match this filter.": "没有日程匹配当前筛选。",
  "Collected": "已收集",
  "Readable": "可读",
  "Prepare a concise daily operating brief for priorities, approvals, and watch items.":
    "为优先级、审批和关注项准备一份简洁的每日运行简报。",
  "Turn overnight context into a short owner-facing operating plan before the day starts.":
    "在一天开始前，把夜间上下文转成一份面向本人的简短运行计划。",
  "Review priority stack, approvals, schedule pressure, and systems that need attention.":
    "审核优先级栈、审批、日程压力和需要关注的系统。",
  "No command string or local path is rendered.": "不会渲染命令字符串或本地路径。",
  "Priority inputs": "优先级输入",
  "Uses curated priorities and review queue state, not raw private prompts.":
    "使用精选优先级和审核队列状态，而不是原始私密 prompt。",
  "Items that need owner decisions stay in review state.":
    "需要本人决策的事项保持审核状态。",
  "Delivery": "投递",
  "This page does not send messages or trigger delivery.":
    "这个页面不会发送消息或触发投递。",
  "Scan priorities": "扫描优先级",
  "Start with priorities, review queue pressure, and schedule constraints.":
    "从优先级、审核队列压力和日程约束开始。",
  "Check owner gates": "检查本人门禁",
  "Identify decisions that need explicit owner action before the day moves.":
    "识别当天推进前需要本人明确动作的决策。",
  "Hold delivery": "保持不投递",
  "No message is sent and no reminder is triggered from this page.":
    "此页面不会发送消息，也不会触发提醒。",
  "Operating brief": "运行简报",
  "A short owner-readable plan with priorities, watch items, and review queue links.":
    "一份本人可读的简短计划，包含优先级、关注项和审核队列链接。",
  "Decision items can be summarized for Review Queue without becoming execution state.":
    "决策项可以汇总到审核队列，但不会变成执行状态。",
  "Runtime action": "运行时动作",
  "Tool dispatch, delivery, or schedule mutation remains outside this surface.":
    "工具派发、投递或日程变更都留在此界面之外。",
  "Read now": "现在阅读",
  "Treat this loop as the next item to inspect in the cockpit.":
    "把这个循环作为驾驶舱中下一项要检查的内容。",
  "Read the brief, then move any decision into Review Queue or Command.":
    "阅读简报，然后把任何决策移动到审核队列或指挥界面。",
  "Defer window": "暂缓窗口",
  "Leave the loop visible but do not promote it into today's work.":
    "保持该循环可见，但不要推进到今天的工作。",
  "Keep the schedule unchanged and revisit at the next owner review window.":
    "保持日程不变，并在下一个本人审核窗口复查。",
  "Need more evidence": "需要更多证据",
  "Ask for more proof before trusting this recurring loop.":
    "信任这个循环任务前要求更多证明。",
  "Open System Health or Review Queue; do not send or mutate the schedule.":
    "打开系统健康或审核队列；不要发送或修改日程。",
  "Owner reads and decides what moves into the day.":
    "本人阅读并决定什么进入当天工作。",
  "No auto-send": "不自动发送",
  "No tool dispatch": "不派发工具",
  "No hidden task promotion": "不隐藏推进任务",
  "Collect market-research context and source-health notes without broker execution.":
    "收集市场研究上下文和来源健康记录，不进行券商执行。",
  "No account, position, order, or broker credential data is shown.":
    "不展示账户、仓位、订单或券商凭证数据。",
  "Keep the trading research desk aware of market context while preserving the research-only boundary.":
    "让交易研究台了解市场上下文，同时保留仅研究边界。",
  "Collect signals, source health, disagreement notes, and evidence gaps for owner reading.":
    "收集信号、来源健康、分歧记录和证据缺口，供本人阅读。",
  "Research posture": "研究姿态",
  "The schedule can prepare evidence, but cannot recommend or execute trades.":
    "日程可以准备证据，但不能推荐或执行交易。",
  "Market data health is summarized without showing accounts or broker details.":
    "市场数据健康以摘要呈现，不展示账户或券商细节。",
  "Execution": "执行",
  "No broker, paper, live, or order path exists in the web cockpit.":
    "网页驾驶舱中不存在券商、纸面、实盘或订单路径。",
  "Read context": "阅读上下文",
  "Scan market context as evidence, not as advice or instruction.":
    "把市场上下文作为证据阅读，而不是建议或指令。",
  "Check source health": "检查来源健康",
  "Treat degraded sources as a blocker, not something to smooth over.":
    "把降级来源视为阻塞项，而不是需要抹平的东西。",
  "Hold execution": "保持不执行",
  "No broker write, paper trade, live order, or recommendation can emerge here.":
    "这里不会产生券商写入、纸面交易、实盘订单或建议。",
  "A private evidence note for owner reading, clearly marked research-only.":
    "一条供本人阅读的私密证据记录，并清楚标注为仅研究。",
  "Evidence gap": "证据缺口",
  "A visible missing-source or disagreement row for future review.":
    "一行可见的缺失来源或分歧，供未来审核。",
  "Trade instruction": "交易指令",
  "No order, recommendation, position sizing, or account action is rendered.":
    "不会渲染订单、建议、仓位规模或账户动作。",
  "Read research": "阅读研究",
  "Use the schedule as a private research context scan.":
    "把这个日程作为私密研究上下文扫描。",
  "Open Trading Team for evidence and gates; do not treat this as a trade action.":
    "打开交易研究团队查看证据和门禁；不要把它视为交易动作。",
  "Hold for sources": "等待来源",
  "Pause interpretation when source health is incomplete.":
    "当来源健康不完整时暂停解读。",
  "Keep the loop visible and require source evidence before summary.":
    "保持循环可见，并在摘要前要求来源证据。",
  "Defer trading": "暂缓交易研究",
  "Leave research untouched for this window.": "在这个窗口保持研究不动。",
  "No schedule mutation, order path, or recommendation is created.":
    "不会创建日程变更、订单路径或建议。",
  "Owner may read research; the page cannot act on it.":
    "本人可以阅读研究；页面不能据此行动。",
  "No order placement": "不下单",
  "No position sizing": "不做仓位规模",
  "Summarize service posture, event freshness, and queue health for owner review.":
    "为本人审核汇总服务状态、事件新鲜度和队列健康。",
  "No internal hostnames, ports, filesystem paths, or credential material is rendered.":
    "不会渲染内部主机名、端口、文件系统路径或凭证材料。",
  "Keep the Personal OS observable without turning the web page into a repair console.":
    "保持 Personal OS 可观察，但不把网页变成维修控制台。",
  "Summarize public boundary, private auth posture, event freshness, and queue health.":
    "汇总公开边界、私密认证状态、事件新鲜度和队列健康。",
  "Auth gate": "认证门禁",
  "Private routes must redirect before owner-only shell content renders.":
    "私密路由必须在仅本人可见的 shell 内容渲染前重定向。",
  "Public Doraemon status stays separate from private diagnostics.":
    "公开 Doraemon 状态与私密诊断保持分离。",
  "Repair controls": "维修控制",
  "Restart, deploy, purge, and raw log actions are not rendered.":
    "不会渲染重启、部署、清理或原始日志动作。",
  "Check boundary": "检查边界",
  "Confirm public and private health views stay separate.":
    "确认公开与私密健康视图保持分离。",
  "Read posture": "阅读状态",
  "Summarize route gates, event freshness, and attention areas.":
    "汇总路由门禁、事件新鲜度和关注区域。",
  "Hold repair": "保持不维修",
  "No restart, deploy, log, or purge affordance belongs in this surface.":
    "此界面不应有重启、部署、日志或清理入口。",
  "Health note": "健康记录",
  "A private summary of posture and attention areas.":
    "一份私密的状态和关注区域摘要。",
  "Review item": "审核项",
  "A future Review Queue packet can be created after separate implementation.":
    "单独实现后，可以创建未来的审核队列包。",
  "Repair command": "维修命令",
  "No operational command or raw service detail is exposed here.":
    "这里不暴露运维命令或原始服务细节。",
  "Read health": "阅读健康状态",
  "Use this window to inspect safe service posture.":
    "使用这个窗口检查安全的服务状态。",
  "Open System Health for details; keep repair work outside the schedule surface.":
    "打开系统健康查看详情；把维修工作留在日程界面之外。",
  "Escalate review": "升级审核",
  "Treat an attention area as a future Review Queue item.":
    "把关注区域视为未来审核队列项。",
  "Draft a reviewed packet; do not add repair controls to schedules.":
    "起草经过审核的包；不要把维修控制加入日程。",
  "Hold repairs": "保持不维修",
  "Keep operations read-only until audit and rollback design exists.":
    "在审计和回滚设计存在前，保持运维只读。",
  "No restart, deploy, purge, or raw log action is created.":
    "不会创建重启、部署、清理或原始日志动作。",
  "Doraemon public boundary": "Doraemon 公开边界",
  "Owner can inspect posture; repair design is a separate future slice.":
    "本人可以检查状态；维修设计是单独的未来切片。",
  "No raw logs": "不展示原始日志",
  "No restart control": "没有重启控制",
  "No deployment trigger": "没有部署触发",
  "Create a review loop for what shipped, what was deferred, and what needs owner decisions.":
    "为已发布、已暂缓和需要本人决策的内容创建复盘循环。",
  "No auto-promotion from review notes into execution.":
    "复盘记录不会自动推进为执行。",
  "Turn shipped work, deferred work, and owner decisions into an explicit weekly review packet.":
    "把已发布工作、暂缓工作和本人决策转成明确的每周复盘包。",
  "Collect shipped slices, review findings, deferred decisions, and next-week candidate work.":
    "收集已发布切片、review 发现、暂缓决策和下周候选工作。",
  "Shipped work": "已发布工作",
  "Summaries should link to reviewed PRs or deployment evidence.":
    "摘要应链接到已审核 PR 或部署证据。",
  "Deferred work": "暂缓工作",
  "Open decisions stay visible instead of silently becoming tasks.":
    "开放决策保持可见，而不是静默变成任务。",
  "Promotion": "推进",
  "Review notes cannot become execution state from this page.":
    "复盘记录不能从此页变成执行状态。",
  "Collect shipped work": "收集已发布工作",
  "Review shipped PRs, deployments, and verification evidence.":
    "审核已发布 PR、部署和验证证据。",
  "Name deferrals": "点名暂缓项",
  "Keep postponed work explicit instead of letting it vanish.":
    "保持延期工作明确可见，而不是让它消失。",
  "Hold promotion": "保持不推进",
  "Review notes cannot become next-week execution without owner approval.":
    "没有本人批准，复盘记录不能变成下周执行。",
  "Weekly packet": "每周复盘包",
  "A private review packet of shipped, deferred, blocked, and candidate work.":
    "一份包含已发布、暂缓、阻塞和候选工作的私密复盘包。",
  "Next-slice shortlist": "下一切片候选清单",
  "Candidate work stays reviewable until the owner chooses the next slice.":
    "候选工作保持可审核，直到本人选择下一切片。",
  "Auto-plan": "自动规划",
  "No automatic planning mutation or task promotion is rendered.":
    "不会渲染自动规划变更或任务推进。",
  "Review now": "现在复盘",
  "Use this loop to choose what should shape the next week.":
    "用这个循环选择下周应由什么来塑形。",
  "Move chosen items into Command or Review Queue after owner decision.":
    "本人决策后，把选中的事项移动到指挥或审核队列。",
  "Defer close": "暂缓收口",
  "Keep the weekly packet open until evidence is complete.":
    "在证据完整前保持每周复盘包打开。",
  "Do not auto-promote postponed work.": "不要自动推进延期工作。",
  "Need proof": "需要证明",
  "Ask for PR, deployment, or review evidence before closing the week.":
    "收口本周前要求 PR、部署或 review 证据。",
  "Attach evidence first; leave execution unavailable.":
    "先附上证据；执行保持不可用。",
  "Deploy evidence": "部署证据",
  "Owner chooses what becomes next-week work.":
    "本人选择什么成为下周工作。",
  "No auto-plan": "不自动规划",
  "No silent promotion": "不静默推进",
  "No execution queue mutation": "不修改执行队列",
  "Priorities, approvals, schedule pressure, and attention items become a short owner brief.":
    "优先级、审批、日程压力和关注项会成为一份简短的本人简报。",
  "Market context is gathered for reading only; no order, recommendation, or execution path exists.":
    "市场上下文仅为阅读而收集；不存在订单、建议或执行路径。",
  "System posture is summarized without exposing raw service internals or repair controls.":
    "系统状态会被汇总，但不暴露原始服务内部信息或维修控制。",
  "Shipped, deferred, and blocked work becomes a review packet before next-week planning.":
    "已发布、暂缓和阻塞工作会在下周规划前成为复盘包。",
  "The web page is a schedule register, not a scheduler.":
    "网页是日程登记簿，不是调度器。",
  "Scheduler command strings, shell paths, and private prompts stay outside the web bundle.":
    "调度器命令字符串、shell 路径和私密 prompt 都留在网页 bundle 之外。",
  "Research schedules can prepare evidence only; they cannot submit orders or mutate accounts.":
    "研究日程只能准备证据；不能提交订单或修改账户。",
  "Owner review remains the boundary before future schedule mutation exists.":
    "在未来日程变更存在前，本人审核仍是边界。",
  "Create job": "创建任务",
  "Pause job": "暂停任务",
  "Resume job": "恢复任务",
  "Delete job": "删除任务",
  "Edit command": "编辑命令",
  "Weiyu AI": "Weiyu AI",
  "A personal AI lab where one human sets direction and a coordinated agent system supports research, building, and review.":
    "一个个人 AI 实验室：由一个人设定方向，协同智能体系统支持研究、构建与复盘。",
  "Explore Doraemon": "探索 Doraemon",
  "Doraemon Agent System": "Doraemon Agent System",
  "The companion and orchestration layer that turns ideas into plans, tasks, summaries, artifacts, and review moments.":
    "把想法转化为计划、任务、摘要、成果和复盘节点的伙伴与编排层。",
  "Enter Doraemon": "进入 Doraemon",
  "Private Command Center": "私密指挥中心",
  "MiniDora Trading": "MiniDora Trading",
  "An AI-assisted trading research desk for observation, evidence generation, validation, and owner review.":
    "用于观察、证据生成、验证和本人审核的 AI 辅助交易研究台。",
  "Read-Only Dashboard": "只读仪表盘",
  "AI Media Lab": "AI Media Lab",
  "AI-generated video, visual experiments, LEGO-style scenes, and workflows for repeatable creative production.":
    "AI 生成视频、视觉实验、LEGO 风格场景，以及可重复创意生产工作流。",
  "Lab": "实验室",
  "Games & Apps": "游戏与应用",
  "Small games, utilities, and lightweight software products built as experiments in AI-assisted execution.":
    "作为 AI 辅助执行实验而构建的小型游戏、工具和轻量软件产品。",
  "Project archive public boundary": "项目归档公开边界",
  "Project filters": "项目筛选",
  "Search projects": "搜索项目",
  "Project": "项目",
  "Category": "类别",
  "Visibility": "可见性",
  "Selected artifact": "选中的成果",
  "Selected project preview": "选中项目预览",
  "Next routes": "后续入口",
  "Read public overview": "阅读公开概览",
  "Open Doraemon office": "打开 Doraemon Office",
  "Open project": "打开项目",
  "Project dossier": "项目档案",
  "Project links": "项目链接",
  "Back to Projects": "返回项目",
  "View all projects": "查看全部项目",
  "Boundary": "边界",
  "High-level view only.": "仅展示高层摘要。",
  "No execution.": "不执行。",
  "Authenticated.": "已认证。",
  "This project is a private summary.": "这个项目是私密摘要。",
  "This project is research-only.": "这个项目仅用于研究。",
  "This project is public.": "这个项目是公开项目。",
  "Public-safe page": "公开安全页面",
  "Public concept, private implementation details.": "公开概念，私密实现细节。",
  "No execution, no broker routing, no orders.": "不执行、不路由券商、不创建订单。",
  "Safe to share. Explains the what and why.": "可安全分享，用来解释是什么以及为什么。",
  "Public page explains the concept only.": "公开页面只解释概念。",
  "Private tasks, prompts, and runtime details stay out.": "私密任务、prompt 和运行时细节不进入公开页。",
  "App links require owner authentication.": "App 链接需要本人认证。",
  "No raw IDs, paths, accounts, or internal state.": "不展示 raw ID、路径、账户或内部状态。",
  "No trading execution or brokerage integration.": "不进行交易执行或券商集成。",
  "No account data, positions, PnL, or order state.": "不展示账户数据、持仓、PnL 或订单状态。",
  "Claims require evidence and source links.": "任何主张都需要证据和来源链接。",
  "Owner review remains required before any next step.": "任何下一步之前都仍需本人审核。",
  "Curated public story and project context.": "经过精选的公开叙事和项目背景。",
  "No private memory or source notes.": "不展示私密记忆或原始来源笔记。",
  "Links route only to public-safe destinations unless gated.": "链接只指向公开安全目的地，除非有门禁保护。",
  "Public/private boundary remains explicit.": "公开 / 私密边界始终明确。",
  "Doraemon Visualizer": "Doraemon Visualizer",
  "The public-safe visual bridge that turns Doraemon and MiniDora activity into an understandable command-room view.":
    "把 Doraemon 与 MiniDora 活动转成可理解指挥室视图的公开安全视觉桥梁。",
  "Native Office": "原生 Office",
  "Activity Timeline": "活动时间线",
  "Public Visualizer": "公开 Visualizer",
  "Doraemon Visualizer makes the agent system legible.": "Doraemon Visualizer 让智能体系统变得可理解。",
  "The long-term direction is native weiyudang.com routes under Doraemon Office. The visualizer remains useful as a public bridge: it can show sanitized activity, agent presence, a command-room stage, and safe system posture without revealing private work.":
    "长期方向是 Doraemon Office 下的 weiyudang.com 原生路由。Visualizer 仍然是有用的公开桥梁：它可以展示脱敏活动、智能体在线状态、指挥室舞台和安全系统状态，同时不暴露私密工作。",
  "What It Shows": "它展示什么",
  "Doraemon and MiniDora presence.": "Doraemon 与 MiniDora 的在线状态。",
  "Public-safe event labels.": "公开安全事件标签。",
  "Current office posture.": "当前 Office 状态。",
  "Recent activity and handoffs at a safe summary level.": "安全摘要级别的近期活动和交接。",
  "Demo fallback when live relay data is unavailable.": "实时中继不可用时的演示回退。",
  "What It Does Not Show": "它不展示什么",
  "Raw run IDs or task IDs.": "raw run ID 或 task ID。",
  "Private task titles or prompt bodies.": "私密任务标题或 prompt 正文。",
  "Tool payloads, artifacts, memory records, accounts, or local paths.": "工具 payload、产物、记忆记录、账户或本地路径。",
  "Execution controls or owner-only actions.": "执行控制或仅限本人的动作。",
  "Product Direction": "产品方向",
  "The visualizer should increasingly feel like part of Doraemon Office rather than a separate iframe-style portal. The public page should explain motion, not expose internals.":
    "Visualizer 应该越来越像 Doraemon Office 的一部分，而不是独立的 iframe 门户。公开页面应该解释运行状态，而不是暴露内部细节。",
  "Knowledge Vault is the memory and synthesis layer for the Personal OS.":
    "Knowledge Vault 是 Personal OS 的记忆与综合层。",
  "A private memory and synthesis layer that turns source material into owner-reviewed, public-safe outputs.":
    "把来源材料转成经过本人审核、公开安全输出的私密记忆与综合层。",
  "Public Knowledge": "公开知识",
  "Private Knowledge Cockpit": "私密知识驾驶舱",
  "Its job is to help preserve context, organize source material, and prepare public-safe summaries without treating private notes as public content. The public website can show the shape of the system and curated outputs; private source pages remain behind the owner boundary.":
    "它的职责是保存上下文、组织来源材料，并准备公开安全的摘要，同时不把私密笔记当成公开内容。公开网站可以展示系统形状和精选输出；私密来源页面仍留在本人边界之后。",
  "Public Version": "公开版本",
  "The public Knowledge route explains the workflow:": "公开 Knowledge 路由解释工作流：",
  "capture source material privately": "私下捕获来源材料",
  "synthesize it into a candidate output": "综合成候选输出",
  "keep owner review visible": "保持本人审核可见",
  "publish only curated, public-safe pages": "只发布精选且公开安全的页面",
  "Private Version": "私密版本",
  "The private cockpit can organize sources, synthesis candidates, evidence rows, rewrite steps, and publish gates. It remains authenticated and read-only until a separate audited write path exists.":
    "私密驾驶舱可以组织来源、综合候选、证据行、重写步骤和发布门禁。在独立审计过的写入路径存在前，它保持认证和只读。",
  "Raw private vault pages, memory records, unpublished drafts, private source files, and owner notes do not become public page data. Public outputs must be curated and reviewed.":
    "原始私密 vault 页面、记忆记录、未发布草稿、私密来源文件和本人笔记不会变成公开页面数据。公开输出必须经过精选和审核。",
  "OpenClaw Runtime": "OpenClaw Runtime",
  "The private runtime and monitoring substrate that supports Doraemon, MiniDoras, health checks, and owner-visible operational posture.":
    "支撑 Doraemon、MiniDoras、健康检查和本人可见运行状态的私密运行时与监控底座。",
  "Public System Posture": "公开系统状态",
  "OpenClaw Runtime is the private operating substrate beneath the Personal OS.":
    "OpenClaw Runtime 是 Personal OS 底层的私密运行底座。",
  "Public visitors do not need runtime internals. They need to know that Doraemon Office has a safe system posture, a public schema boundary, and a graceful fallback. The owner cockpit can show deeper health and review queues without turning public pages into an operations console.":
    "公开访客不需要运行时内部细节。他们只需要知道 Doraemon Office 有安全系统状态、公开 schema 边界和优雅回退。私密驾驶舱可以展示更深层的健康状态和审核队列，但不会把公开页面变成运维控制台。",
  "The public System route shows coarse, safe posture:": "公开 System 路由展示粗粒度、安全的状态：",
  "live or demo mode": "实时或演示模式",
  "public schema status": "公开 schema 状态",
  "event freshness at a safe abstraction level": "安全抽象级别的事件新鲜度",
  "read-only fallback behavior": "只读回退行为",
  "The owner system surface can summarize service posture, review gaps, degraded sources, and boundary checks for Weiyu. It should remain diagnostic and owner-gated.":
    "私密系统界面可以为 Weiyu 汇总服务状态、审核缺口、降级来源和边界检查。它应该保持诊断性质，并由本人门禁保护。",
  "Public pages must not show local paths, private service labels, tokens, internal hostnames, raw logs, or repair controls. System health should reassure without exposing the control plane.":
    "公开页面不得展示本地路径、私密服务标签、令牌、内部主机名、原始日志或修复控制。系统健康应该让人安心，而不暴露控制面。",
  "Weiyu Personal OS": "Weiyu Personal OS",
  "The integrated website, Doraemon Office, owner cockpit, and research surfaces that make Weiyu's work visible without collapsing public and private boundaries.":
    "整合网站、Doraemon Office、私密驾驶舱和研究界面，让 Weiyu 的工作可被理解，同时不压塌公开与私密边界。",
  "Weiyu Personal OS is the product shape behind this website.":
    "Weiyu Personal OS 是这个网站背后的产品形态。",
  "It is not just a portfolio. It is a public studio, a Doraemon command room, a private owner cockpit, and a set of research surfaces that share one language: public things should be understandable, private things should stay bounded, and important work should leave evidence.":
    "它不只是作品集。它是公开工作室、Doraemon 指挥室、私密驾驶舱，以及一组研究界面；它们共享同一种语言：公开内容应当可理解，私密内容应当有边界，重要工作应当留下证据。",
  "Surfaces": "界面层",
  "The public site explains projects, notes, and the operating philosophy.":
    "公开站解释项目、笔记和运行哲学。",
  "Doraemon Office shows sanitized agent activity, team presence, schedules, tasks, knowledge, and system posture.":
    "Doraemon Office 展示脱敏的智能体活动、团队在线、日程、任务、知识和系统状态。",
  "The owner cockpit keeps priorities, approvals, private knowledge work, schedules, and system health behind authentication.":
    "私密驾驶舱把优先级、审批、私密知识工作、日程和系统健康留在认证之后。",
  "Research surfaces such as MiniDora Trading stay evidence-first and execution-free.":
    "MiniDora Trading 这样的研究界面保持证据优先、无执行。",
  "The public side can show concepts, public-safe state, and curated outputs. It does not expose private prompts, raw task names, private memory, credentials, account data, orders, local paths, or execution controls.":
    "公开侧可以展示概念、公开安全状态和精选输出。它不暴露私密 prompts、raw 任务名、私密记忆、凭证、账户数据、订单、本地路径或执行控制。",
  "Current Shape": "当前形态",
  "The v1 system is being built slice by slice. Each slice should improve the real product surface, preserve the public/private contract, and leave enough verification evidence that the next agent can continue safely.":
    "v1 系统正在一片一片地构建。每个切片都应改进真实产品界面，保留公开 / 私密契约，并留下足够验证证据，让下一个智能体能安全接手。",
  "Doraemon Agent System is the coordination layer for Weiyu's personal AI lab.":
    "Doraemon Agent System 是 Weiyu 个人 AI 实验室的协调层。",
  "It helps translate intent into concrete plans, route work to specialized MiniDora agents, collect results, and bring decisions back to Weiyu when judgment is required.":
    "它帮助把意图转成具体计划，把工作路由给专门化 MiniDora，收集结果，并在需要判断时把决策带回给 Weiyu。",
  "The current owner decision allows non-commercial public Doraemon display on weiyudang.com, while raw/source assets remain private, minimal, replaceable, and takedown-friendly.":
    "当前本人决策允许在 weiyudang.com 上进行非商业的公开 Doraemon 展示，同时原始 / 源素材保持私密、最小化、可替换且便于下架。",
  "The public Doraemon page is an informational guide. It cannot read private memory, trading data, credentials, local files, email, calendar, or internal agent runtimes.":
    "公开 Doraemon 页面是信息导览。它不能读取私密记忆、交易数据、凭证、本地文件、邮件、日历或内部智能体运行时。",
  "AI Media Lab explores repeatable creative systems.": "AI Media Lab 探索可复用的创意系统。",
  "The focus is not just making one image or one clip. The focus is building workflows that can produce, revise, and organize creative assets with taste and consistency.":
    "重点不只是生成一张图或一段视频，而是构建能以品味和一致性生产、修改、组织创意素材的工作流。",
  "Future notes will cover video pipelines, visual systems, character development, and production memory.":
    "未来笔记会覆盖视频流水线、视觉系统、角色开发和生产记忆。",
  "Games & Apps is the playground for compact software products.":
    "Games & Apps 是小型软件产品的实验场。",
  "These projects are intentionally small enough to ship, test, and learn from quickly. The long-term pattern is to use the personal AI lab to move from idea to artifact with less drag.":
    "这些项目刻意保持足够小，便于快速发布、测试和学习。长期模式是用个人 AI 实验室更顺畅地从想法推进到成果。",
  "Weiyu AI is the personal AI lab inside this website.":
    "Weiyu AI 是这个网站里的个人 AI 实验室。",
  "The goal is not to replace human judgment. The goal is to give one curious builder a larger surface area for research, engineering, writing, media production, and decision support.":
    "目标不是取代人类判断，而是给一个好奇的建造者更大的研究、工程、写作、媒体生产和决策支持界面。",
  "The public side explains the ideas and projects. The private side will eventually connect to the command center, agent review queue, and owner-facing decision surfaces that help Weiyu decide what should happen next.":
    "公开侧解释想法和项目。私密侧最终会连接指挥中心、智能体审核队列和面向本人的决策界面，帮助 Weiyu 决定下一步该发生什么。",
  "Operating Principles": "运行原则",
  "Weiyu keeps final approval.": "Weiyu 保留最终批准权。",
  "Agents expand speed and memory, not authority.": "智能体扩展速度和记忆，而不是权力。",
  "Every important output should leave an artifact.": "每个重要输出都应该留下产物。",
  "Public pages explain concepts; private systems hold execution detail.": "公开页面解释概念；私密系统保存执行细节。",
  "MiniDora Trading is a research desk, not an autonomous trading bot.":
    "MiniDora Trading 是研究台，不是自主交易机器人。",
  "It observes markets, gathers evidence, validates assumptions, and prepares artifacts for owner review. Weiyu keeps final approval.":
    "它观察市场、收集证据、验证假设，并准备给本人审核的产物。Weiyu 保留最终批准权。",
  "The public page intentionally avoids account data, live signals, strategy parameters, broker state, API keys, and real-time PnL.":
    "公开页面有意避开账户数据、实时信号、策略参数、券商状态、API keys 和实时 PnL。",
  "Current Safety Posture": "当前安全状态",
  "Broker write is disabled.": "券商写入已禁用。",
  "Paper submit is disabled.": "纸面提交已禁用。",
  "Live submit is disabled.": "实时提交已禁用。",
  "Phase auto-promotion is disabled.": "阶段自动推进已禁用。",
  "The MVP dashboard is read-only and has no order buttons.": "MVP 仪表盘是只读的，没有订单按钮。",
  "Building a Personal AI Research Studio": "构建个人 AI 研究工作室",
  "A first public note on turning personal AI workflows into a small operating system.":
    "第一篇公开笔记：如何把个人 AI 工作流变成一个小型操作系统。",
  "The first version of this website is a personal public shell for a larger private system.":
    "这个网站的第一版，是一个更大私密系统的个人公开外壳。",
  "The important design choice is boundary clarity: public pages explain the system, while private routes hold command, events, review queues, and operational dashboards.":
    "最重要的设计选择是边界清晰：公开页面解释系统，私密路由承载指挥、事件、审核队列和运行仪表盘。",
  "Field Observations": "现场观察",
  "Observation": "观察",
  "Travel and daily fragments": "旅行与日常片段",
  "A flexible shelf for travel notes, visual references, small thoughts, and things that may later become projects.":
    "一个灵活的架子，用来放旅行笔记、视觉参考、小想法，以及日后可能变成项目的东西。",
  "Life Outside the Lab": "实验室之外的生活",
  "Personal": "个人",
  "Everyday notes": "日常笔记",
  "Lightweight personal sharing: routines, objects, places, moods, and the human parts around technical work.":
    "轻量的个人分享：日常、物件、地点、心情，以及技术工作周围的人味。",
  "Photography Walks": "摄影散步",
  "Photography": "摄影",
  "City walks": "城市散步",
  "A place for quiet frames, light, texture, reflections, and the small scenes that make a day feel specific.":
    "一个放置安静画面、光线、纹理、反射，以及让一天变得具体的小场景的地方。",

  "I am building a public research studio and a private Personal OS: Doraemon as the entrance personality, MiniDoras as specialized teammates, and an owner cockpit where final judgment stays human.":
    "我正在构建一个公开研究工作室和一个私密 Personal OS：Doraemon 作为入口人格，MiniDoras 作为专门队友，而私密驾驶舱保留人类最终判断。",
  "Physics-first curiosity": "物理优先的好奇心",
  "I like questions that survive contact with equations, experiments, constraints, and messy real systems.":
    "我喜欢那些经得起方程、实验、约束和真实复杂系统碰撞的问题。",
  "Taste before automation": "品味先于自动化",
  "Agents are useful when they amplify judgment. They are dangerous when they hide it.":
    "智能体在放大判断时有用，在隐藏判断时危险。",
  "Evidence before confidence": "证据先于信心",
  "Content model": "内容模型",
  "A living index of systems, tools, experiments, and research.":
    "一个持续生长的系统、工具、实验和研究索引。",
  "Public explains": "公开页负责解释",
  "Public pages explain the work; private execution stays behind the app shell.":
    "公开页面解释工作；私密执行留在 app shell 之后。",
  "No raw internals": "不暴露原始内部信息",
  "No prompts, raw IDs, accounts, orders, or execution.":
    "不展示 prompts、raw IDs、账户、订单或执行。",
  "Trading content is research-only. No execution.": "交易内容仅研究用途，不执行。",
  "Field notes from life outside the lab.": "实验室之外的生活现场笔记。",
  "Photography, everyday observations, places, and personal fragments. A softer shelf beside the technical work.":
    "摄影、日常观察、地点和个人片段。技术工作旁边更柔软的一层。",
  "Frames, light, texture, and visual memory.": "画面、光线、质感和视觉记忆。",
  "Life Notes": "生活笔记",
  "Small personal updates without turning the site into a feed.":
    "轻量个人更新，但不把网站变成信息流。",
  "Places": "地点",
  "Travel fragments, daily walks, and field observations.":
    "旅行片段、日常散步和现场观察。",
  "Public research notes, system sketches, design decisions, and experiments from Weiyu Dang's personal research studio.":
    "来自 Weiyu Dang 个人研究工作室的公开研究笔记、系统草图、设计决策和实验。",
  "Research notes.": "研究笔记。",
  "Public experiments, system sketches, design decisions, and research fragments from Weiyu's personal research studio. Public by design.":
    "来自 Weiyu 个人研究工作室的公开实验、系统草图、设计决策和研究片段。按公开边界设计。",
  "Read the latest note": "阅读最新笔记",
  "Browse projects": "浏览项目",
  "Research principles": "研究原则",
  "Linked to work": "连接到真实工作",
  "Every note connects to projects and artifacts.": "每篇笔记都连接到项目和产物。",
  "Public research surface sketch": "公开研究界面草图",
  "RESEARCH SURFACE": "研究界面",
  "Observe": "观察",
  "Watch, collect, and question.": "观察、收集、追问。",
  "Prototype, test, and document.": "原型、测试、记录。",
  "Reflect, decide, and refine.": "反思、决策、打磨。",
  "Private boundary": "私密边界",
  "Research protocol": "研究发布协议",
  "Public publishing protocol": "公开发布协议",
  "Draft privately": "先私密起草",
  "Capture raw ideas and evidence.": "收集原始想法和证据。",
  "Rewrite safely": "安全改写",
  "Remove sensitive details and reduce to principles.": "移除敏感细节，沉淀为原则。",
  "Publish public note": "发布公开笔记",
  "Share summaries, sketches, and lessons.": "分享摘要、草图和经验。",
  "Link artifact": "连接产物",
  "Connect to projects, datasets, and code.": "连接到项目、数据集和代码。",
  "Public Research": "公开研究",
  "Curated summaries": "精选摘要",
  "Design sketches": "设计草图",
  "Concepts and methods": "概念与方法",
  "Private Vault": "私密知识库",
  "Raw notes and drafts": "原始笔记和草稿",
  "Prompts and credentials": "Prompt 和凭证",
  "Internal runtime and logs": "内部运行时和日志",
  "Account and system state": "账户和系统状态",
  "We publish what is safe, useful, and durable. The rest stays private by default.":
    "我们只发布安全、有用、可长期保存的内容。其余内容默认保持私密。",
  "This is living research.": "这是持续生长的研究。",
  "New notes land when experiments evolve. Follow along, learn from the process, and build with care.":
    "实验推进时，新的笔记会继续补上。你可以沿着过程阅读、学习，并更谨慎地构建。",
  "How we organize notes": "我们如何组织笔记",
  "Research model": "研究模型",
  "Build logs": "构建日志",
  "Ship, test, learn.": "交付、测试、学习。",
  "Design notes": "设计笔记",
  "Decisions and tradeoffs.": "决策和取舍。",
  "Research sketches": "研究草图",
  "Ideas in progress.": "进行中的想法。",
  "What we share.": "我们分享什么。",
  "Public research notes": "公开研究笔记",
  "Research note filters": "研究笔记筛选",
  "Search research notes": "搜索研究笔记",
  "Search notes": "搜索笔记",
  "Featured note": "精选笔记",
  "Research note": "研究笔记",
  "Read Building a Personal AI Research Studio": "阅读《构建个人 AI 研究工作室》",
  "No public research notes yet.": "还没有公开研究笔记。",
  "Clear search": "清除搜索",
  "Selected research note": "选中的研究笔记",
  "Selected note": "选中笔记",
  "Read note": "阅读笔记",
  "Related project": "相关项目",
  "Back to Research": "返回研究",
  "Public-safe note": "公开安全笔记",
  "This note is public-safe.": "这篇笔记是公开安全的。",
  "Curated summary only. No private prompts, raw notes, credentials, runtime IDs, or account state.":
    "仅展示精选摘要。不包含私密 prompt、原始笔记、凭证、运行时 ID 或账户状态。",
  "Note": "笔记",
  "Research note metadata": "研究笔记元数据",
  "Note dossier": "笔记档案",
  "Date": "日期",
  "Public research note": "公开研究笔记",
  "Public rules": "公开规则",
  "Explain principles, decisions, and sketches.": "解释原则、决策和草图。",
  "Omit private source text and raw drafts.": "省略私密来源文本和原始草稿。",
  "No credentials, accounts, prompts, or runtime logs.": "不包含凭证、账户、prompt 或运行日志。",
  "Link back to durable project artifacts.": "回链到可长期保存的项目产物。",
  "What this studio is for": "这个研究工作室用来做什么",
  "The public studio is a place to make the work understandable without making the private operating layer public. It can show projects, principles, architecture sketches, and safe lessons from building Doraemon Office.":
    "公开工作室用来让工作变得可理解，但不把私密运行层公开。它可以展示项目、原则、架构草图，以及构建 Doraemon Office 时可安全分享的经验。",
  "System shape": "系统形态",
  "Doraemon is the public entrance personality. MiniDoras are specialized teammates for research, writing, data, product, memory, media, operations, and market research. The owner cockpit is the private place where approvals, sensitive context, and final judgment stay with Weiyu.":
    "Doraemon 是公开入口人格。MiniDoras 是面向研究、写作、数据、产品、记忆、媒体、运营和市场研究的专门队友。Owner cockpit 是私密区域，审批、敏感上下文和最终判断都留在 Weiyu 手里。",
  "Publishing boundary": "发布边界",
  "A public note should explain the durable idea, the design decision, and the evidence that can be shared. It should not include raw prompts, private drafts, local paths, account data, runtime IDs, credentials, order details, or private knowledge-base source text.":
    "公开笔记应该解释可长期保存的想法、设计决策，以及可以分享的证据。它不应包含原始 prompt、私密草稿、本地路径、账户数据、运行时 ID、凭证、订单细节或私密知识库原文。",
  "That boundary is not a temporary launch constraint. It is part of the product: public enough to build trust, private enough to keep the system honest.":
    "这条边界不是上线初期的临时限制，而是产品的一部分：足够公开以建立信任，也足够私密以保持系统诚实。",
  "Share what's safe. Protect what's not.": "分享安全的内容，保护不该公开的内容。",
  "Evidence first": "证据优先",
  "Show the why, the how, and the limits.": "展示原因、方法和边界。",
  "Start with a focused note.": "从一封聚焦的消息开始。",
  "The best collaboration requests are specific about the system, workflow, or project surface you want to explore.":
    "最好的合作请求会具体说明你想探索的系统、工作流或项目界面。",
  "AI agent systems": "AI 智能体系统",
  "Physics and quantum computing notes": "物理与量子计算笔记",
  "Creative production workflows": "创意生产工作流",
  "Evidence-first research tooling": "证据优先的研究工具",
  "Email": "邮箱",
  "Use the domain mailbox once it is configured in Cloudflare or your preferred mail provider.":
    "域名邮箱在 Cloudflare 或你偏好的邮件服务商配置好后即可使用。",

  "The native public office overview: sanitized activity, MiniDora presence, operating rhythm, and system posture inside weiyudang.com.":
    "weiyudang.com 内的原生公开 Office 总览：脱敏活动、MiniDora 在线状态、运行节奏和系统状态。",
  "Meet the Team": "认识团队",
  "Native route": "原生路由",
  "Live/demo relay": "实时 / 演示中继",
  "Public Office": "公开 Office",
  "Doraemon coordinates visible state while task names, prompt bodies, memory records, and controls stay out.":
    "Doraemon 协调可见状态，同时任务名、prompt 正文、记忆记录和控制入口都不公开。",
  "Every public signal, ordered. A readable command log for MiniDora motion without exposing private work.":
    "所有公开信号按序展示。它是 MiniDora 运行的可读指挥日志，但不暴露私密工作。",
  "Explore public log": "探索公开日志",
  "Fixed titles. Safe timestamps. No private payloads.":
    "固定标题。安全时间戳。不含私密 payload。",
  "Private area hidden": "私密区域隐藏",
  "Public event stream": "公开事件流",
  "Sanitized public schema sample": "脱敏公开 schema 样本",
  "Doraemon leads. MiniDoras specialize across research, product, engineering, memory, media, operations, and market research.":
    "Doraemon 负责统筹。MiniDoras 分工覆盖研究、产品、工程、记忆、媒体、运营和市场研究。",
  "Product Quality": "产品质量",
  "Orchestrator": "编排者",
  "Dedupe by opaque ID": "按不透明 ID 去重",
  "Owner controls": "私密控制",
  "Hidden": "隐藏",
  "Signals": "信号",
  "Desks": "研究台",
  "Instruments": "标的",
  "Options Lab": "期权研究室",
  "Replay": "回放",
  "Evidence-first research cockpit for market understanding, desk disagreement, gates, and replay.":
    "证据优先的研究驾驶舱，用于市场理解、研究台分歧、门禁和回放。",
  "MiniDora Trading provides research artifacts for owner review. No broker connectivity. No accounts. No auto-execution.":
    "MiniDora Trading 为本人审核提供研究成果。不连接券商，不展示账户，不自动执行。",
  "Private research console": "私密研究控制台",
  "Evidence scaffold": "证据脚手架",
  "Owner review required": "需要人工审核",
  "Mock session": "模拟会话",
  "Partial": "部分完成",
  "Incomplete": "不完整",
  "Pending": "待处理",
  "Required": "必需",
  "Attached": "已附加",
  "Opened": "已打开",
  "Low": "低",
  "Medium": "中",
  "Medium-low": "中低",
  "High": "高",
  "Needs evidence": "需要证据",
  "No view": "暂无观点",
  "Scenario": "情景研究",
  "Scenario research": "情景研究",
  "Cautious": "谨慎",
  "Investigating": "调查中",
  "Research steady": "研究状态稳定",
  "What matters today": "今天真正重要的事",
  "Signals needing review": "需要审核的信号",
  "Signal rows are research artifacts. They show uncertainty, evidence state, and blockers; they do not produce orders or trading recommendations.":
    "信号行是研究成果。它们展示不确定性、证据状态和阻塞点；不会生成订单或交易建议。",
  "Desk disagreement": "研究台分歧",
  "Different desks, visible uncertainty": "不同研究台的分歧和不确定性清晰可见",
  "Source degradation": "来源降级",
  "Open questions": "开放问题",
  "Evidence packets": "证据包",
  "Missing evidence stays visible": "缺失证据保持可见",
  "Open blockers": "开放阻塞点",
  "Degraded sources": "降级来源",
  "Gate blockers": "门禁阻塞",
  "Gates blocked": "已阻塞门禁",
  "Replay events": "回放事件",
  "Gates & Evidence": "门禁与证据",
  "Gates & Evidence summary": "门禁与证据摘要",
  "Every important signal needs evidence, counter-evidence, source health, and owner review before confidence can rise. Missing packets stay visible as blockers.":
    "每个重要信号都必须具备证据、反证、来源健康和人工审核，置信度才可以提升。缺失证据会继续作为阻塞项可见。",
  "Traceable research only": "仅可追溯研究",
  "Linked signal": "关联信号",
  "Evidence state": "证据状态",
  "All signals": "全部信号",
  "All states": "全部状态",
  "Filtered evidence": "已筛选证据",
  "Full trace": "完整追踪",
  "No evidence packets match this filter set. Clear filters to return to the full evidence trace.":
    "没有证据包匹配当前筛选。清除筛选可回到完整证据追踪。",
  "Open evidence queue": "打开证据队列",
  "Open evidence center": "打开证据中心",
  "Trace evidence": "追溯证据",
  "No missing evidence in this filtered set.": "当前筛选结果没有缺失证据。",
  "Signal trace coverage": "信号追踪覆盖",
  "Signals mapped to evidence": "信号与证据映射",
  "Packet counts are grouped evidence packets. They complement the raw evidence and counter-evidence counts on each signal row.":
    "包数量按证据包分组，用来补充每条信号行里的原始证据和反证数量。",
  "Gate status": "门禁状态",
  "Missing evidence": "缺失证据",
  "Replay timeline": "回放时间线",
  "How the research day formed": "研究日如何形成",
  "Reconstruct how desks formed or revised a research view. Filters are local-only and never create execution, recommendation, or account actions.":
    "复盘各研究台如何形成或修订研究视角。筛选仅在本地生效，永不创建执行、建议或账户动作。",
  "State changes": "状态变化",
  "What changed in view": "当前视图中的变化",
  "State change": "状态变化",
  "No replay events match this filter set. Clear filters to return to the full research day.":
    "没有回放事件匹配当前筛选。清除筛选可回到完整研究日。",
  "No matching state changes.": "没有匹配的状态变化。",
  "What must be answered": "必须回答的问题",
  "System posture": "系统状态",
  "Open system posture": "打开系统状态",
  "Desk filter": "研究台筛选",
  "DESK FILTER": "研究台筛选",
  "DESK": "研究台",
  "Desk": "研究台",
  "All desks": "全部研究台",
  "all desks": "全部研究台",
  "Macro Desk": "宏观研究台",
  "Equity Desk": "股票研究台",
  "Options Desk": "期权研究台",
  "Risk Desk": "风险研究台",
  "News Desk": "新闻研究台",
  "Crypto Desk": "数字资产研究台",
  "Evidence Desk": "证据研究台",
  "Instrument / theme": "标的 / 主题",
  "Instrument": "标的",
  "Thesis": "观点",
  "Confidence": "置信度",
  "Evidence": "证据",
  "Gate": "门禁",
  "Horizon": "周期",
  "Updated": "更新时间",
  "Blocker": "阻塞点",
  "Source health": "来源健康",
  "Source quality": "来源质量",
  "Signal history": "信号历史",
  "Evidence timeline": "证据时间线",
  "Risk flags": "风险标记",
  "Posture": "状态",
  "Research boundary": "研究边界",
  "Persistent guardrails for every tab and row.": "每个标签页和每一行都保留固定护栏。",
  "Blocked actions": "已禁用动作",
  "No trading controls": "没有交易控制",
  "No broker write": "不写入券商",
  "No account data": "不展示账户数据",
  "No orders": "不创建订单",
  "Order placement": "下单",
  "Broker write": "券商写入",
  "Paper submit": "纸面提交",
  "Live submit": "实盘提交",
  "Replace or cancel order": "替换或取消订单",
  "Auto-promote phase": "自动推进阶段",
  "Phase auto-promotion": "阶段自动推进",
  "Recommendation workflow": "推荐工作流",
  "unavailable": "不可用",
  "Filtered replay": "已筛选回放",
  "Full replay": "完整回放",
  "Started research packet": "启动研究包",
  "Lowered confidence": "降低置信度",
  "Kept execution disabled": "保持执行禁用",
  "Added blocker": "添加阻塞点",
  "Moved to options scenario": "移入期权情景",
  "Queued review question": "排入审核问题",
  "Held confidence level": "保持置信度等级",
  "No strategy execution": "不执行策略",
  "No strategy button": "无策略执行按钮",
  "Owner-only research": "仅限本人研究",
  "Research artifact": "研究成果",
  "Instrument-level research pages show signal history, evidence state, source quality, and risk flags. They never expose accounts, positions, order tickets, or execution controls.":
    "标的级研究页展示信号历史、证据状态、来源质量和风险标记。它们永不暴露账户、仓位、订单票据或执行控制。",
  "Instrument research pages": "标的研究页",
  "Instrument pages can organize research and blockers only. They do not create orders, recommendations, account actions, or execution states.":
    "标的页只能组织研究和阻塞点。它们不会创建订单、建议、账户动作或执行状态。",
  "No instrument research packets are available in this owner-only mock session. Research boundaries and blocked actions remain unchanged.":
    "当前仅本人可见的模拟会话中没有可用的标的研究包。研究边界和禁用动作保持不变。",
  "Scenario notes for volatility research only. No strategy execution, no order ticket, and no account context.":
    "仅用于波动率研究的情景笔记。不执行策略，不生成订单票据，也不包含账户上下文。",
  "Research artifact availability": "研究成果可用性",
  "Source health model": "来源健康模型",
  "Execution boundary": "执行边界",
  "This cockpit can prepare evidence and questions only. It cannot place, submit, replace, cancel, or produce trading recommendations.":
    "这个驾驶舱只能准备证据和问题。它不能下单、提交、替换、取消，也不能生成交易建议。",
  "No public summary yet": "暂不生成公开摘要",
  "Evidence attached": "证据已附加",
  "Counter-evidence required": "需要反证",
  "Counter-evidence visible": "反证可见",
  "All instruments": "全部标的",
  "All evidence": "全部证据",
  "events shown": "条事件已显示",
  "evidence packets shown": "个证据包已显示",
  "open blockers": "个开放阻塞点",
  "A private posture room for Doraemon and the MiniDoras: service status, review gates, boundary checks, and known gaps without turning diagnostics into an operations console.":
    "Doraemon 和 MiniDoras 的私密状态室：展示服务状态、审核门禁、边界检查和已知缺口，但不把诊断变成运维控制台。",
  "Boundaries currently held": "当前边界保持成立",

  "Login": "登录",
  "Private Owner Area": "私密区域",
  "Owner-only access for Weiyu Dang.": "Weiyu Dang 的私密访问入口。",
  "Back to public site": "返回公开站",
  "Private owner area": "私密区域",
  "This gate protects owner-only routes. Private app content is not rendered until the owner session is valid.":
    "这个入口保护私密路由。只有会话有效后，私密 app 内容才会渲染。",
  "Access token": "访问令牌",
  "Access token did not match.": "访问令牌不匹配。",
  "APP_ACCESS_TOKEN is missing in this environment.": "当前环境缺少 APP_ACCESS_TOKEN。",
  "Enter private token": "输入私密令牌",
  "Enter app": "进入 app",
  "Local development accepts demo-access when APP_ACCESS_TOKEN is not set.":
    "本地开发中，如果未设置 APP_ACCESS_TOKEN，可使用 demo-access。",
  "Production access requires a configured owner token.": "生产访问需要配置私密访问令牌。",
  "The session cookie is HttpOnly and scoped to `/app`.": "会话 cookie 为 HttpOnly，作用域限定在 `/app`。",
  "Owner access": "私密访问",
  "Password": "密码",
  "Continue": "继续",
  "Protected area": "受保护区域"
} as const satisfies Record<string, string>;

const phraseZhTranslations = [
  ["Owner-only", "仅限本人"],
  ["Public-safe", "公开安全"],
  ["public-safe", "公开安全"],
  ["Research-only", "仅研究"],
  ["Read-only", "只读"],
  ["read-only", "只读"],
  ["Display-only", "仅展示"],
  ["Owner review", "人工审核"],
  ["Owner area", "私密区"],
  ["Owner Cockpit", "私密驾驶舱"],
  ["Private Area", "私密区域"],
  ["Public Window", "公开窗口"],
  ["Public window", "公开窗口"],
  ["Public health", "公开健康"],
  ["Health rail", "健康栏"],
  ["public checks", "项公开检查"],
  ["Public relay", "公开中继"],
  ["public profiles", "公开档案"],
  ["SIGNAL", "信号"],
  ["Closed allowlist", "封闭白名单"],
  ["Live relay", "实时中继"],
  ["Demo replay", "演示回放"],
  ["MiniDoras", "MiniDoras"],
  ["MiniDora", "MiniDora"],
  ["Doraemon Office", "Doraemon Office"],
  ["Personal OS", "Personal OS"],
  ["System Health", "系统健康"],
  ["Knowledge Vault", "知识库"],
  ["Trading Team", "交易研究团队"],
  ["Review Queue", "审核队列"],
  ["Research Team", "研究团队"],
  ["Agents", "智能体"],
  ["Agent", "智能体"],
  ["agent", "智能体"],
  ["sources need review", "个来源需要复核"],
  ["gates unavailable", "个门禁不可用"],
  ["open blockers", "个开放阻塞点"],
  ["evidence packets shown", "个证据包已显示"],
  ["events shown", "条事件已显示"],
  ["All desks", "全部研究台"],
  ["Macro Desk", "宏观研究台"],
  ["Equity Desk", "股票研究台"],
  ["Options Desk", "期权研究台"],
  ["Risk Desk", "风险研究台"],
  ["News Desk", "新闻研究台"],
  ["Crypto Desk", "数字资产研究台"],
  ["Evidence Desk", "证据研究台"],
  ["Order placement", "下单"],
  ["Broker write", "券商写入"],
  ["Paper submit", "纸面提交"],
  ["Live submit", "实盘提交"],
  ["Replace or cancel order", "替换或取消订单"],
  ["Auto-promote phase", "自动推进阶段"],
  ["Recommendation workflow", "推荐工作流"],
  ["unavailable", "不可用"],
  ["desks", "研究台"],
  ["counter", "反证"],
  ["required", "需要处理"],
  ["Owner Today", "今日驾驶舱"],
  ["Owner checkpoints of", "审核检查点，共"],
  ["High-pressure windows of", "高压力窗口，共"],
  ["Current focus", "当前重点"],
  ["Private status", "私密状态"],
  ["Next review", "下次审核"],
  ["Priority lanes", "优先级通道"],
  ["Waiting approvals", "等待审批"],
  ["Schedule pressure", "日程压力"],
  ["Boundary locks", "边界锁"],
  ["Research mode", "研究模式"],
  ["Signal quality", "信号质量"],
  ["Gate posture", "门禁状态"],
  ["Data source", "数据源"],
  ["Trading execution", "交易执行"],
  ["Private writes", "私密写入"],
  ["Projects", "项目"],
  ["Research", "研究"],
  ["Journal", "日志"],
  ["Contact", "联系"],
  ["Schedules", "日程"],
  ["Tasks", "任务"],
  ["Activity", "活动"],
  ["System", "系统"],
  ["Private", "私密"],
  ["Public", "公开"],
  ["Safe", "安全"],
  ["Working", "工作中"],
  ["Completed", "已完成"],
  ["Planning", "规划中"],
  ["Attention", "注意"],
  ["Handoff", "交接"],
  ["Tool call", "工具调用"],
  ["Open", "打开"],
  ["Enter", "进入"],
  ["Explore", "探索"],
  ["View", "查看"],
  ["All", "全部"],
  ["Latest", "最新"],
  ["Selected", "精选"],
  ["curated artifacts", "精选成果"],
  ["Today", "今日"],
  ["Monday", "星期一"],
  ["Tuesday", "星期二"],
  ["Wednesday", "星期三"],
  ["Thursday", "星期四"],
  ["Friday", "星期五"],
  ["Saturday", "星期六"],
  ["Sunday", "星期日"],
  ["Jan", "1月"],
  ["Feb", "2月"],
  ["Mar", "3月"],
  ["Apr", "4月"],
  ["May", "5月"],
  ["Jun", "6月"],
  ["Jul", "7月"],
  ["Aug", "8月"],
  ["Sep", "9月"],
  ["Oct", "10月"],
  ["Nov", "11月"],
  ["Dec", "12月"],
  ["Asia/Shanghai", "亚洲/上海"],
  ["checkpoints", "检查点"],
  ["Notes", "笔记"],
  ["Tools", "工具"],
  ["Evidence", "证据"],
  ["Boundary", "边界"],
  ["Status", "状态"],
  ["Mode", "模式"]
] as const;

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

const englishMonthNumbers = {
  Jan: 1,
  January: 1,
  Feb: 2,
  February: 2,
  Mar: 3,
  March: 3,
  Apr: 4,
  April: 4,
  May: 5,
  Jun: 6,
  June: 6,
  Jul: 7,
  July: 7,
  Aug: 8,
  August: 8,
  Sep: 9,
  Sept: 9,
  September: 9,
  Oct: 10,
  October: 10,
  Nov: 11,
  November: 11,
  Dec: 12,
  December: 12
} as const satisfies Record<string, number>;

function translateEnglishDateToZh(value: string) {
  const match = value.match(/^([A-Z][a-z]+)\.?\s+(\d{1,2}),\s+(\d{4})$/);
  if (!match) return null;

  const [, monthName, day, year] = match;
  const month = englishMonthNumbers[monthName as keyof typeof englishMonthNumbers];
  if (!month) return null;

  return `${year}年${month}月${Number(day)}日`;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replacePhrase(value: string, source: string, target: string) {
  if (/^[A-Za-z]+$/.test(source)) {
    return value.replace(new RegExp(`\\b${escapeRegExp(source)}\\b`, "g"), target);
  }

  return value.split(source).join(target);
}

export function translateToZh(value: string) {
  const normalized = normalizeText(value);
  if (!normalized) return null;

  const exact = exactZhTranslations[normalized as keyof typeof exactZhTranslations];
  if (exact) return exact;

  const date = translateEnglishDateToZh(normalized);
  if (date) return date;

  let translated = normalized;
  for (const [source, target] of phraseZhTranslations) {
    translated = replacePhrase(translated, source, target);
  }

  return translated === normalized ? null : translated;
}
