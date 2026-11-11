# 莫比乌斯公司官网

`weiyudang.com` 的公司官网。公司暂称「未命名」，项目名「莫比乌斯」。主叙事为「让 AI，重塑世界的运行方式」。2026-11-10，创始人在确认本地优化版后明确指令「发布一下吧」，已授权将该版本发布到现有正式域名；取代此前暂缓发布的决定。

业务范围参考 Distyl 官网的企业 AI 生命周期，使用自己的中文说明和宇宙／粒子莫比乌斯视觉，不使用其客户、投资人、研究成果、产品商标或业绩数字。量子感仅为视觉概念，不声称提供量子计算产品。

## 本地使用

```sh
npm ci
npm run check:workflows
npm run build
npm start -- --hostname 127.0.0.1 --port 3079
npm run check:company-site -- http://127.0.0.1:3079
```

没有新增外部服务、表单后端、模型调用或运行时密钥。创始人于 2026-11-10 指定合作咨询邮箱 `dangweiyu0516@gmail.com`，已替换原站未查到 MX 记录的地址。本地检查验证 mailto 链接，不发送测试邮件。

## 页面与下线范围

- `/`：原首屏、知识／协作／行动／反馈连续粒子叙事、四项交互演示、八个技术方向、交付和联系。
- `/work`：演示目录；`/work/custom-agent`、`/work/finance`、`/work/video`、`/work/supply-chain`：四个独立演示页。
- `/technology/platform`、`/technology/agents`、`/technology/knowledge`、`/technology/semantics`、`/technology/voice`、`/technology/personalization`、`/technology/capture`、`/technology/improvement`：八个完整中文业务方向页。
- `/contact`：308 转至首页联系区。
- `/about`、`/projects/**`、`/journal/**`、`/lab/**`、`/dora/**`、`/app/**`、`/login/**`、`/api/**`、`/visuals/**`：410 与 noindex；旧登录 POST 也停用。
- `/mobius` 和 `/mobius-lab`：保留既有公司演示，不加入官网导航，返回 noindex。
- `/robots.txt`、`/sitemap.xml`：引导至公司首页、八个技术方向和五个演示路径，共14页。

原个人站入口的页面代码从本分支的 app 路由树移除。旧组件、资料和样式保留为非运行源码；个人图像也不包含在新的 Vercel 上传中。

## 恢复与发布边界

原始可恢复版本：`2a1a6ae020c6e238e82e396d375db9be7905a1a6`，已在 GitHub `AnakinDang/weiyudang.com` 主分支与 Vercel 2026-11-04 生产部署中核实。原工作目录 `/Users/weiyudang/Workspace/active/weiyudang_web` 未被改写；候选在独立 worktree。

本次沿用 GitHub `AnakinDang/weiyudang.com` 的 `main` 分支和原 Vercel 项目 `weiyudang-web`（`prj_SAcL5r8biRp8snfKWjKYCRxFleCy`），发布到 `weiyudang.com` 与既有 `www` 域名。上一线上基线为 `2674fe2`。后续四演示版本继续使用相同发布范围。发布状态以 Vercel READY、正式域名及发布后记录为准；实际提交、部署编号和只读验收保存在项目 output/company-site-work-demos-20261110 和既有 Notion 技术计划。

独立的 `dora.weiyudang.com` 和 `relay.weiyudang.com` 不属于这个 Vercel 路由树，当前仍有独立服务。本分支不声称它们已下线；需要单独撤下其公开域名入口，并评估内部依赖，不能用停止主站冒充已经停止这些子域名。

四个演示只处理内置合成资料：财务核对、库存规划、原生HTML剪辑预演和企业群聊模拟。Excel／CSV／JSON／SRT下载包含实际计算结果；不接入真实企业微信、客户系统或模型服务。ExcelJS只在群聊读取及导出时动态加载；模拟群内只接受预置XLSX，不能将其当作任意文件上传工具。

视觉约定见 DESIGN.md，交互合同与当前验证见 docs/company-website/WORK-DEMO-DESIGN.md 和 EVIDENCE.md，内容依据见 docs/company-website/SOURCES.md。
