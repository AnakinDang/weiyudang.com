# Astryx：Codex 与 Claude Code 接入

记录日期：2026-11-10。用户已授权安装和Notion记录；官网发布仍待后续明确指令。

## 已完成的安装

- 官方包：@astryxdesign/cli，固定0.7.11；实际CLI和其Core均返回0.7.11。
- 命令位置：/opt/homebrew/bin/astryx。Node25.8.1，npm11.11.0。
- 执行官方用户级初始化：astryx init --user --json，无警告。
- Codex共享技能：/Users/weiyudang/.agents/skills/astryx/SKILL.md。
- Claude Code技能：/Users/weiyudang/.claude/skills/astryx，指向上述共享目录的相对符号链接；两端读取同一份指南。
- 官方初始化也维护了已有Xcode ClaudeAgentConfig下的技能链接；本次只核对Codex与Claude Code的实际接入。
- 原/Users/weiyudang/.codex/AGENTS.md和/Users/weiyudang/.claude/CLAUDE.md内容哈希保持不变，没有改写用户全局约定。

实际安装命令如下；--ignore-scripts避免安装阶段运行依赖脚本，后续已直接执行CLI验证：

```sh
npm install --global @astryxdesign/cli@0.7.11 --ignore-scripts --no-audit --no-fund
astryx init --user --json
```

这是全局CLI与用户技能接入，不是MCP服务。新Codex／Claude Code会话可发现共享技能；没有宣称正在运行的会话已热加载，也未为验证启动额外模型调用。

## 日常使用

可在新会话中说：“使用Astryx查询适合这个界面的组件和规范。”先查候选，再读组件的真实参数与用法：

```sh
astryx search "chat" --limit 3
astryx component Collapsible --dense
astryx docs spacing --dense
astryx docs motion --dense
```

上述组件查询和文档命令均已实际返回结果；也验证了astryx --version、init --help和docs global --dense。项目安装了自己的Astryx时优先使用项目版本，不因为全局工具而自动升级项目。

全局技能包含以Astryx组件、模板构建UI的默认建议。当前用户约定和具体项目要求优先；既有官网本轮仅吸收间距、阅读层级、状态反馈与动效原则，没有为了工具接入重写原生网站或加入运行时依赖。未来项目按实际界面需要选用组件。

## 官网本轮应用与验收

统一4px间距基准与动效变量，改善桌面16px辅助正文；图形暂停入口为96×44px。导航标示当前章节，六类原生方案折叠渐进式展开410ms、退出175ms，减少动画时立即切换。不支持高度插值的浏览器保留原生折叠行为。

最终生产构建、HTTP回归、五个导航与六个场景键盘展开通过；360／768／1280宽度核对无横向溢出，减少动画展开与收起计算时长均0s。完整范围与证据见EVIDENCE.md。http://127.0.0.1:3079/仅为本机预览，未发布到weiyudang.com。

## 回退

需要移除时执行，当前未执行：

```sh
astryx init --user --remove-agents
npm uninstall --global @astryxdesign/cli
```

第一步移除官方管理的共享技能与记录的链接，第二步移除全局命令；不删除原有Codex或Claude个人规则。

## 记录与来源

Notion记录追加在[13｜技术建设与交付计划](https://app.notion.com/p/40aacaf349d9812e8e27c994e675062d?pvs=204)的“官网优化与Astryx开发工具接入记录”，不修改原计划的负责人、预算和行动状态。

[官方仓库](https://github.com/meta/astryx) · [CLI文档](https://astryx.atmeta.com/docs/cli) · [主题文档](https://astryx.atmeta.com/docs/theme)。Astryx当前为Beta、MIT许可。没有新增账号、API密钥、付费调用或外部消息。
