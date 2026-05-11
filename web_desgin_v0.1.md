

------

# 1. 网站总定位

网站名称建议：

```text
Weiyu Dang
AI One-Person Company / Doraemon Agent System
```

首页主文案可以是：

```text
Weiyu Dang
Building an AI-augmented one-person company.

Doraemon coordinates. MiniDora executes. Weiyu decides.
```

中文版本：

```text
党炜昱
正在构建一个由 AI Agent 协作驱动的一人公司。

Doraemon 负责协调，MiniDora 负责执行，Weiyu 负责判断。
```

网站不应该做成传统“个人简历页”，而应该像一个 **个人操作系统入口**：

```text
weiyudang.com
  = personal identity
  + AI company portal
  + project index
  + Doraemon public interface
  + private command center
```

------

# 2. 最推荐的信息架构

## 一级导航

```text
Home
About
Projects
Doraemon
MiniDora Trading
Lab Notes
Media
Contact
```

但实际路由要分成公开和私有两套。

## 路由设计

| 路由                              | 类型      | 说明                                        |
| --------------------------------- | --------- | ------------------------------------------- |
| `/`                               | 公开      | 首页，总入口                                |
| `/about`                          | 公开      | 你是谁、你的背景、你的理念                  |
| `/projects`                       | 公开      | 所有项目索引                                |
| `/projects/weiyu-ai`              | 公开      | Weiyu AI 一人公司蓝图                       |
| `/projects/doraemon-agent-system` | 公开      | Doraemon Agent System 介绍                  |
| `/projects/minidora-trading`      | 公开      | MiniDora Trading 的公开说明，不暴露内部数据 |
| `/projects/games`                 | 公开      | 游戏/小程序项目                             |
| `/projects/media`                 | 公开      | AI 视频、内容生成、LEGO 风格内容等          |
| `/dora`                           | 公开/限流 | Doraemon 对外入口，类似项目问答/接待员      |
| `/lab`                            | 公开      | 实验日志、开发记录、思考文章                |
| `/contact`                        | 公开      | 联系方式、合作入口                          |
| `/app`                            | 私有      | 登录后的个人控制台                          |
| `/app/command`                    | 私有      | Doraemon Command Center                     |
| `/app/trading`                    | 私有      | MiniDora Trading WebUI                      |
| `/app/agents`                     | 私有      | MiniDora Agent 状态                         |
| `/app/events`                     | 私有      | Agent event stream / timeline               |
| `/app/settings`                   | 私有      | 设置、权限、API 状态                        |

我的建议是：**所有真正有操作价值的入口都放在 `/app/\*`，公开页只做展示和解释。**

------

# 3. 首页设计

首页要承担三个功能：

```text
1. 让别人快速知道你是谁
2. 让别人理解 Weiyu AI / Doraemon System 是什么
3. 让你自己快速进入内部系统
```

## 首页结构

### Hero 区

视觉：深蓝/白色/未来工作室背景，一个原创蓝色 AI 助手形象在中间偏右，旁边有项目卡片浮动。

文案：

```text
Weiyu Dang

Building an AI-augmented one-person company
powered by Doraemon Agent System.

One human sets the vision.
A team of AI agents helps execute.
```

按钮：

```text
Explore Projects
Enter Doraemon
Private Command Center
```

其中：

```text
Explore Projects → /projects
Enter Doraemon → /dora
Private Command Center → /app
```

### 第二屏：AI 一人公司

用三张卡说明：

```text
Human Vision
Weiyu defines direction, taste, judgment, and final approval.

Doraemon Orchestrator
Doraemon translates ideas into plans, tasks, and summaries.

MiniDora Agents
Specialized agents help with research, engineering, media, and trading research.
```

这一部分和你的一人公司蓝图高度一致：人类负责愿景、判断和创造力，AI 负责速度、执行和规模化能力。

### 第三屏：项目入口

做成四个大卡片：

```text
Doraemon Agent System
AI company operating system.

MiniDora Trading
Research desk for market analysis and local-paper evidence.

Games & Apps
Small games, apps, and lightweight software products.

AI Media Lab
AI-generated videos, visuals, experiments, and creative systems.
```

### 第四屏：Doraemon Studio Preview

这里可以放一个简化版“Agent Operating Room”的静态预览：

```text
Doraemon CEO Agent
  ├─ Research MiniDora
  ├─ Dev MiniDora
  ├─ Media MiniDora
  ├─ Finance MiniDora
  └─ Ops MiniDora
```

你之前的可视化方向本来就不是普通 dashboard，而是“AI 一人公司的常驻指挥舱 + Doraemon 数字伙伴动画屏”，所以官网也应该展示这个系统感。

### 第五屏：Latest Notes

展示最近 3–5 篇实验日志：

```text
Building Doraemon Agent System
MiniDora Trading Research Desk
AI-generated Media Workflow
One-Person Company Operating Model
```

### 第六屏：Contact / Collaboration

简洁即可：

```text
Interested in AI agents, one-person companies, creative systems, or research workflows?
Contact Weiyu.
```

------

# 4. 视觉设计方向

我建议整体风格是：

```text
温暖的未来感
蓝白科技感
个人实验室
Doraemon-inspired，但不要直接使用官方哆啦A梦素材
```

原因很重要：Doraemon 是有明确授权主体的角色。ShoPro 官方说明 Doraemon Division 负责 Doraemon 及藤子·F·不二雄其他角色在日本和国际上的授权业务，所以公开网站上不要直接使用官方哆啦A梦图片、名字组合、铃铛/口袋/角色高度相似造型作为商用品牌视觉。([小学館集英社プロダクション](https://www.shopro.co.jp/english/media/Doraemon.html))

## 公开站建议命名策略

你内部可以继续叫：

```text
Doraemon Agent System
MiniDora Trading
```

但对外视觉最好做成原创角色，例如：

```text
Dora AI
DoraCore
Pocket Agent
Blue Pocket Studio
Weiyu AI Companion
```

或者保持文字解释：

```text
Doraemon-inspired AI agent system
```

但不要在公开网页里放官方角色素材。

## 色彩方案

```text
Primary Blue:   #2563EB
Deep Navy:      #0B1220
Soft Sky:       #E0F2FE
Warm White:     #F8FAFC
Card Border:    #1E293B
Accent Yellow:  #FACC15
Success Green:  #22C55E
Alert Red:      #EF4444
```

## 字体建议

```text
英文：Inter / Geist Sans / system-ui
中文：Noto Sans SC / system-ui
代码：JetBrains Mono / Geist Mono
```

## UI 气质

不要做成冷冰冰的企业 SaaS，也不要做成过度赛博朋克。你的网站应该像：

```text
一个人的 AI 研究室
一个小型数字公司
一个持续成长的操作系统
```

关键词：

```text
calm
precise
warm
technical
experimental
agentic
```

------

# 5. Doraemon 对外入口设计

`/dora` 是你网站最有特色的页面，建议做成一个 **公开 AI 接待员**，但必须严格限制权限。

## `/dora` 页面功能

公开用户可以问：

```text
Weiyu 是谁？
Weiyu AI 是什么？
Doraemon Agent System 是什么？
有哪些项目？
MiniDora Trading 是做什么的？
如何联系你？
```

公开用户不应该能做：

```text
访问你的私有记忆
访问 trading 数据
触发内部 agent
查看内部日志
调用工具
写入数据库
读取邮件/日历/文件
```

## `/dora` 页面布局

```text
左侧：Dora / Blue Pocket AI 角色卡
中间：聊天窗口
右侧：推荐问题 / 项目卡片
底部：免责声明 + 联系按钮
```

示例推荐问题：

```text
What is Weiyu AI?
How does Doraemon Agent System work?
Show me Weiyu's projects.
What is the MiniDora Trading research desk?
How can I collaborate with Weiyu?
```

## 对外入口的角色设定

```text
You are Dora, the public-facing guide for Weiyu Dang's personal AI company website.
You can explain public projects, summarize public notes, and route visitors to contact.
You cannot access private systems, trading data, credentials, internal memory, or command center tools.
```

## 安全要求

```text
1. 只读取 public content index
2. 不接入内部 agent runtime
3. 不接入 trading event bus
4. 所有回答带来源链接或页面引用
5. 加 rate limit
6. 加 abuse detection
7. 对联系表单加 bot protection
```

如果你要放公开聊天入口，建议使用 Cloudflare Turnstile 或同类机制保护表单和公开 API；Cloudflare 文档说明 Turnstile 的流程是浏览器端生成 token，再由服务器验证 token 有效性。([Cloudflare Docs](https://developers.cloudflare.com/turnstile/get-started/?utm_source=chatgpt.com))

------

# 6. MiniDora Trading WebUI 设计

这个入口必须分成 **公开介绍页** 和 **私有操作页**。

## 公开页：`/projects/minidora-trading`

公开页只说明理念：

```text
MiniDora Trading is an AI-assisted trading research desk.

It observes, researches, validates, and records evidence.
It does not autonomously trade.
Weiyu keeps final approval.
```

这和你之前的架构判断一致：MiniDora Trading 后期应该是“常驻 trading research desk”，不是“常驻 trading bot”；MiniDora 只负责观察、挖掘、验证、报警、写 artifact，最终批准权仍保留给 Weiyu。

公开页可以展示：

```text
Research workflow
Risk philosophy
Evidence-first approach
Local-paper campaign concept
Architecture diagram
```

公开页不要展示：

```text
实时持仓
策略参数
交易信号
broker 状态
API 键
账户信息
实时 PnL
内部研究日志
```

## 私有页：`/app/trading`

私有 WebUI 才是你真正使用的入口。

### Trading WebUI 布局

```text
┌──────────────────────────────────────────────┐
│ MiniDora Trading Research Desk                │
│ Mode: Local Paper / Research Only             │
├──────────────────────────────────────────────┤
│ P0 Campaign Status       Risk State           │
│ 0/10 days, 0/30 trades   broker_write=false   │
├──────────────────────────────────────────────┤
│ Today’s Market Context                        │
│ MI / TA / Options Data / Social / FA          │
├──────────────────────────────────────────────┤
│ Candidate Research Queue                      │
│ candidate_seed → candidate_contract → quant   │
├──────────────────────────────────────────────┤
│ Evidence Timeline                             │
│ observations / alerts / artifacts / reviews   │
├──────────────────────────────────────────────┤
│ Owner Review Required                         │
└──────────────────────────────────────────────┘
```

### 关键卡片

```text
P0 Gate Card
- qualifying_days
- qualifying_trades
- campaign_id
- current_phase
- eligible_for_owner_review

Permission Card
- broker_write: false
- paper_submit: false
- live_submit: false
- phase_auto_promotion: false

Risk Card
- daily loss state
- duplicate signal state
- halt state
- forbidden action attempts

Evidence Card
- schema-valid artifacts
- failed validations
- missing evidence
- source quarantine warnings

Candidate Queue
- candidate_seed
- candidate_contract
- quant_verification_report
- strategy_spec_draft
```

### 非常重要的限制

`/app/trading` 的 MVP 里不要做任何“下单按钮”。

应该明确禁止：

```text
order submit
broker write
paper submit
live submit
phase promotion
risk limit modification
source tier modification
```

你的 trading 文件里已经强调，当前 P0 阶段 broker write、paper submit、live submit、phase auto-promotion 都应该关闭，所以 WebUI 的第一版应当是 **research/evidence dashboard**，不是交易终端。

------

# 7. Doraemon Command Center 设计

`/app/command` 是你自己的主控台，可以理解为网站的“驾驶舱”。

## 页面布局

```text
左侧：Agent list
中间：Doraemon focus task
右侧：current context / owner review
底部：event timeline
```

## 功能模块

```text
Current Mission
今天最重要的目标是什么

Doraemon Plan
Doraemon 拆出来的任务

MiniDora Status
每个 Agent 当前状态

Event Stream
最近的工具调用、handoff、artifact、错误

Owner Review
需要你确认的事项

Output Shelf
报告、代码、草稿、文件、研究结果
```

你之前的可视化方案已经建议用统一 event stream 驱动动画和时间线，而不是先做动画；这个原则应该直接延续到网站内部控制台。

## Agent 状态字段

```ts
type AgentState =
  | "idle"
  | "planning"
  | "researching"
  | "coding"
  | "writing"
  | "tool_call"
  | "handoff"
  | "waiting_user"
  | "error"
  | "done";
```

## Event 数据结构

```ts
type AgentEvent = {
  event_id: string;
  run_id: string;
  task_id: string;
  agent_id: string;
  agent_role: string;
  state: AgentState;
  tool_name?: string;
  message_short: string;
  started_at: string;
  ended_at?: string | null;
  parent_event_id?: string | null;
  cost_usd?: number;
  tokens?: number;
  severity: "normal" | "info" | "warning" | "error" | "critical";
};
```

前端只负责显示事件，不直接决定 agent 行为。

------

# 8. 技术架构建议

## 总体选择

我建议直接用：

```text
Next.js + TypeScript + Tailwind CSS + MDX + Auth + Postgres/SQLite
```

理由：你的网站不是纯内容站，它会有公开页、私有 dashboard、API routes、未来 AI 接口、event stream 和 WebUI。Next.js 官方定位就是用于构建 full-stack React web applications，适合这种公开内容和动态应用混合的场景。([Next.js](https://nextjs.org/docs))

Next.js 也可以用 Node.js server、Docker、static export 或平台 adapter 部署；如果你想先快后稳，第一版可以部署在 Vercel，之后再把内部服务拆到自托管或 Mac mini。([Next.js](https://nextjs.org/docs/pages/getting-started/deploying))

## 部署建议

### MVP

```text
Public website: Vercel
DNS / security: Cloudflare
Private app: Vercel protected route or private subdomain
Local agent runtime: Mac mini / local server
```

Vercel 官方文档说明，Next.js 部署到 Vercel 可以零配置，并且可以和 Git provider 集成，为 Pull Request 生成 preview URLs；这对你让 Codex 改代码、你再预览非常适合。([Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs))

Cloudflare 可以负责 DNS、反向代理、基础安全和表单防 bot。Cloudflare 文档说明 DNS records 用于让网站或应用对访问者可用，Cloudflare 也提供 DNS 管理能力。([Cloudflare Docs](https://developers.cloudflare.com/dns/manage-dns-records/?utm_source=chatgpt.com))

### 推荐域名结构

```text
weiyudang.com              公开主页
www.weiyudang.com          公开主页 alias
app.weiyudang.com          私有控制台
dora.weiyudang.com         Doraemon 对外入口，可选
status.weiyudang.com       系统状态，可选
api.weiyudang.com          API，可选
```

但第一版我建议先别拆太多子域名，先做：

```text
weiyudang.com
weiyudang.com/dora
weiyudang.com/app
```

等系统稳定后再拆成子域名。

------

# 9. 内容系统设计

你以后会不断增加项目、实验日志、系统说明，所以内容不要写死在页面里。

建议目录：

```text
/content
  /projects
    weiyu-ai.mdx
    doraemon-agent-system.mdx
    minidora-trading.mdx
    ai-media-lab.mdx
    games-and-apps.mdx

  /notes
    2026-05-website-launch.mdx
    2026-05-doraemon-agent-system.mdx

  /agents
    doraemon.json
    minidora-research.json
    minidora-dev.json
    minidora-media.json
    minidora-trading.json

  /roadmap
    weiyu-ai-roadmap.mdx
    minidora-trading-roadmap.mdx
```

每个 project 文件 frontmatter：

```yaml
title: "MiniDora Trading"
slug: "minidora-trading"
status: "private-alpha"
visibility: "public-summary"
category: "AI Trading Research"
summary: "An AI-assisted research desk for market observation, evidence generation, and local-paper validation."
cover: "/images/projects/minidora-trading.png"
links:
  - label: "Private WebUI"
    href: "/app/trading"
    private: true
```

如果你将来内容非常多，也可以参考 Astro 的 Content Collections 思路：Astro 文档说明 content collections 适合管理 blog posts、product descriptions、character profiles 等结构化内容，并提供类型安全和查询能力。([docs.astro.build](https://docs.astro.build/en/guides/content-collections/))
但你的场景有私有 WebUI 和动态 dashboard，所以主框架我仍然建议用 Next.js。

------

# 10. 页面组件设计

## 核心组件

```text
SiteHeader
SiteFooter
HeroSection
ProjectCard
AgentCard
StatusBadge
PortalCard
Timeline
EventRow
DoraChatPanel
CommandCard
TradingGateCard
EvidenceCard
RiskStateCard
OwnerReviewCard
LabNoteCard
```

## 首页组件结构

```tsx
<HomePage>
  <HeroSection />
  <CompanyModelSection />
  <ProjectPortalGrid />
  <DoraemonStudioPreview />
  <LatestNotes />
  <ContactCTA />
</HomePage>
```

## `/projects` 组件结构

```tsx
<ProjectsPage>
  <PageIntro />
  <ProjectFilter />
  <ProjectGrid />
  <RoadmapPreview />
</ProjectsPage>
```

## `/app/trading` 组件结构

```tsx
<TradingDashboard>
  <TradingHeader />
  <P0CampaignStatus />
  <PermissionBoundaryPanel />
  <RiskStatePanel />
  <MarketContextPanel />
  <CandidateQueue />
  <EvidenceTimeline />
  <OwnerReviewPanel />
</TradingDashboard>
```

------

# 11. 权限和安全边界

这个网站最重要的不是好看，而是 **边界清楚**。

## 三层权限

```text
Public
游客可见：主页、公开项目、公开日志、Dora public guide

Authenticated
只有你可见：/app、command center、trading dashboard、agent events

Local-only
只在 Mac mini / 本地网络：agent runtime、trading services、broker adapter、credentials
```

## 不允许公开暴露

```text
API keys
broker credentials
trading account info
live strategy parameters
private event stream
agent internal memory
filesystem paths
logs with secrets
email/calendar/file integrations
```

## Trading WebUI 安全原则

```text
MiniDora Trading WebUI 第一版只读
没有 order button
没有 broker write
没有 paper submit
没有 live submit
没有 phase auto-promotion
所有状态来自 event/artifact，不来自 LLM 即兴回答
```

------

# 12. 数据流设计

## 公开内容数据流

```text
MDX / JSON content
  → build-time render
  → public pages
```

## Dora public chat 数据流

```text
Visitor question
  → public content retriever
  → constrained Dora assistant
  → answer with project links
```

## 私有 dashboard 数据流

```text
Agent Runtime / Local Services
  → event stream
  → database / event store
  → authenticated API
  → /app dashboard
```

## Trading 数据流

```text
Monitor observation
  → alert_event
  → candidate_seed
  → candidate_contract
  → quant_verification_report
  → strategy_spec_draft
  → owner_review
```

注意：这里不进入 order execution chain。

------

# 13. MVP 版本应该先做什么

第一版不要贪多。建议 MVP 只完成：

```text
1. Next.js 项目初始化
2. weiyudang.com 首页
3. About 页面
4. Projects 页面
5. Doraemon Agent System 项目页
6. MiniDora Trading 公开说明页
7. /dora 静态版或 mock chat 入口
8. /app 登录保护壳
9. /app/trading mock dashboard
10. MDX/JSON 内容系统
```

第一版的 `/app/trading` 可以先用 mock 数据：

```ts
const tradingStatus = {
  campaign_id: "P0-LPC-20260427-001",
  phase: "P0 local-paper",
  qualifying_days: 0,
  required_days: 10,
  qualifying_trades: 0,
  required_trades: 30,
  broker_write: false,
  paper_submit: false,
  live_submit: false,
  phase_auto_promotion: false,
};
```

这能让你先把信息架构、页面和权限边界跑通。

------

# 14. 第二阶段再接真实系统

第二阶段再做：

```text
1. 接 agent event stream
2. 接 Doraemon visualizer
3. 接 MiniDora Trading artifact registry
4. 接 P0 campaign status
5. 接 evidence timeline
6. 接 owner review queue
7. 接 public Dora assistant
```

不要第一天就把交易系统、Agent runtime、公开聊天全部接上。先把壳和边界做对。

------

# 15. 给 Codex 的执行说明

你可以把下面这段直接交给 Codex。

```text
Build the initial version of weiyudang.com as a Next.js + TypeScript personal AI company portal.

Project goal:
Create a public personal website for Weiyu Dang that presents Weiyu AI, Doraemon Agent System, MiniDora Trading, AI media projects, games/apps, and lab notes. The site must also include a protected private app shell for future internal dashboards.

Core concept:
This is not a generic portfolio. It is the public portal for an AI-augmented one-person company. Doraemon is the orchestrator concept. MiniDora agents are specialized workers. Weiyu remains the final decision maker.

Important safety/legal constraints:
- Do not use official Doraemon artwork or copyrighted character assets.
- Use an original blue AI companion / pocket-agent visual style.
- Public Dora page must not access private memory, trading data, internal agent runtime, files, email, calendar, or credentials.
- MiniDora Trading public page must be a research/evidence explanation page only.
- /app/trading must be authenticated and read-only.
- No order buttons.
- No broker write.
- No paper submit.
- No live submit.
- No phase auto-promotion.

Tech stack:
- Next.js App Router
- TypeScript
- Tailwind CSS
- MDX or structured content files
- Protected /app route group
- Mock data for dashboard MVP
- Responsive design
- Dark mode first

Routes:
- /
- /about
- /projects
- /projects/weiyu-ai
- /projects/doraemon-agent-system
- /projects/minidora-trading
- /projects/media
- /projects/games
- /dora
- /lab
- /contact
- /app
- /app/command
- /app/trading
- /app/agents
- /app/events
- /app/settings

Homepage sections:
1. Hero
   Title: Weiyu Dang
   Subtitle: Building an AI-augmented one-person company powered by Doraemon Agent System.
   Buttons: Explore Projects, Enter Dora, Private Command Center

2. Company Model
   Three cards:
   - Human Vision
   - Doraemon Orchestrator
   - MiniDora Agents

3. Project Portals
   Cards:
   - Doraemon Agent System
   - MiniDora Trading
   - Games & Apps
   - AI Media Lab

4. Doraemon Studio Preview
   Show a non-copyrighted original AI command-room diagram.

5. Latest Lab Notes

6. Contact CTA

Design direction:
- Warm futuristic personal AI lab
- Deep navy background
- Blue/white cards
- Yellow accent
- Soft glowing borders
- Calm, precise, technical
- Avoid cyberpunk overload
- Avoid official Doraemon likeness

Content structure:
Create:
/content/projects/weiyu-ai.mdx
/content/projects/doraemon-agent-system.mdx
/content/projects/minidora-trading.mdx
/content/projects/media.mdx
/content/projects/games.mdx
/content/notes/example-note.mdx
/content/agents/doraemon.json
/content/agents/minidora-research.json
/content/agents/minidora-dev.json
/content/agents/minidora-media.json
/content/agents/minidora-trading.json

Components:
- SiteHeader
- SiteFooter
- HeroSection
- ProjectCard
- PortalCard
- AgentCard
- StatusBadge
- Timeline
- DoraChatMock
- CommandDashboardMock
- TradingDashboardMock
- P0CampaignStatus
- PermissionBoundaryPanel
- RiskStatePanel
- EvidenceTimeline
- OwnerReviewPanel

Mock trading status:
{
  campaign_id: "P0-LPC-20260427-001",
  phase: "P0 local-paper",
  qualifying_days: 0,
  required_days: 10,
  qualifying_trades: 0,
  required_trades: 30,
  broker_write: false,
  paper_submit: false,
  live_submit: false,
  phase_auto_promotion: false
}

Acceptance criteria:
- Site builds successfully.
- Public routes are accessible without login.
- /app routes are visually marked as private/protected.
- Trading dashboard is read-only.
- No copyrighted Doraemon assets are used.
- No real trading or broker integrations are included.
- Project pages are generated from structured content.
- Homepage clearly communicates Weiyu AI as an AI-augmented one-person company.
```

------

# 16. 最终推荐版本

我建议你第一版就按这个产品定义做：

```text
weiyudang.com
= Weiyu Dang 的个人 AI 公司门户

公开展示：
- 你是谁
- Weiyu AI 是什么
- Doraemon Agent System 是什么
- MiniDora Trading 是什么
- 你有哪些项目
- 你的实验日志和思考

私有入口：
- Doraemon Command Center
- MiniDora Trading WebUI
- Agent event timeline
- Internal project dashboard
```

最关键的一点是：
**公开页要有想象力，私有页要有边界感。**

Doraemon 可以成为网站的灵魂，但公开层最好使用原创化的“蓝色 AI 伙伴”视觉；MiniDora Trading 可以成为你最强的系统项目之一，但公开层必须只展示 research desk 和 evidence workflow，不展示任何会被误解成自动交易或投资建议的内容。