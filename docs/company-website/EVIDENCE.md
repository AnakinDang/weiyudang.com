# 当前更新：AI Native 文案体系

2026-11-11，基于线上12c4404统一官网展示文案：智能／人工智能改为AI，智能体改为Agent；主叙事为“让 AI，重塑世界的运行方式”。八方向使用AI Native平台、Agent构建、Context工程、业务Ontology、Voice AI、个性化体验、专家经验沉淀、Evals与优化；正文以具体中文说明Context Engineering、Workflow、Evals和Human-in-the-loop。标题、说明、读屏标签、搜索／分享摘要和Excel导出称呼同步。原有路径不变。

- check:workflows、Next16.4.6生产构建与类型检查通过；本地HTTP回归通过，14个可索引页面均不包含旧“智能”字样。
- 浏览器桌面首页和Context页核对混排；360×780逐页核对八个技术详情，页面及主标题均无横向溢出；768×1024的八项导航和平台图注无文字溢出。
- 定制Agent界面名称、加入群聊、三份Excel整理、8行有效／3项异常／5303元结果通过。检查时发现手机最终报表撑宽页面，补充min-width:0后修复，页面无溢出，表格保留自身横向滚动。
- v4本地宋体子集754字符、135348字节，补足拉丁字母与新标题。使用新资源地址，旧v3及来源记录保留。
- 浏览器检查警告／错误为空；临时视口已恢复。未进行真实设备或Safari验收，没有新增模型、群聊后台或客户能力声明。

截图与浏览器证据：/Users/weiyudang/.codex/visualizations/2026/11/09/01a1c0ee-56d7-75f2-b825-834b1d54185e/company-website/ai-native-copy-20261111/。正式部署状态以该版本的Vercel记录和域名复查为准。

# 上一版本验证

# 当前实现与验证：四项演示

日期：2026-11-10。基于上一线上版本2674fe2，新增定制群聊智能体、财务核对、HTML剪辑模拟和供应链规划，以及首页连续四阶段叙事。下方旧候选内容保留为历史记录，其“仅本地、尚未发布、Next16.2.6、9页地图”等描述不代表当前版本。正式上线状态以独立发布记录、Vercel和实际域名为准。

| 检查 | 结果 |
| --- | --- |
| 构建 | Next16.4.6生产构建与类型检查通过；四个详情静态生成 |
| 域名无关的规则检查 | check:workflows通过：精确金额、财务异常／正常、库存压力与MOQ、CSV转义、镜头编排与SRT、真实XLSX读取／四工作表往返 |
| HTTP回归 | 本地14个可索引页面、八方向图、三份XLSX、字体、联系、未知路径404、原16入口410及noindex通过；旧登录POST只在本地测试 |
| 群聊完整流程 | 浏览器改名“星河助理”并加入模拟群，添加三份真实XLSX，@后实际读取11行、汇总8行、排除3行，总额5303；没有@时不触发；按商品汇总得到3069／1343／891；更新为保留重复订单后旧结果清空，重算5935；重置恢复未加入状态 |
| Excel下载 | 浏览器实际下载mobius-agent-report.xlsx，Node重新打开：经营汇总5行、异常4行、来源9行、说明8行，合计单元格5303。报表标签支持左右方向键 |
| 财务 | 异常样本4项需复核，FP002金额差800；人工复核保留差异，CSV内容正确；无效金额使结果失效；正常样本6项一致 |
| 供应链 | 基础3项补货／2项交期风险；芯片模组4.5天、建议500。实际选择一项并下载CSV；需求增长50%、交期延长7天后清空旧草案，重算5项补货／4项交期风险 |
| HTML剪辑 | 页面没有video元素；播放时计时推进，暂停后停止；镜头定位和进度键盘操作正常。改18秒、协作优先并改字幕，实际下载JSON与SRT；三段为0–6、6–12、12–18秒，文件与界面一致；空字幕禁用导出；重置生效 |
| 连续叙事 | 单一webgl-story-morph画面，四阶段轨迹随滚动混合；暂停／恢复、四个章节定位通过；减少动画时reduced、canvas隐藏、对应静态图显示。手机反馈章节实际stage3，标题位于图形下方 |
| 响应式 | 原生浏览器360×780与768×1024检查目录及四详情；1280×720桌面操作；修复目录预览的最小宽度后均无页面横向溢出。视口与动效偏好恢复 |
| 依赖 | 既有Next升级16.4.6，postcss8.5.32，新增ExcelJS4.4.0，uuid覆盖11.1.1；安装未执行依赖脚本。npm audit当前返回0项，不等于完整安全审计 |
| 视觉 | 叙事、财务概念与实际截图经view_image核对；差异表见WORK-DEMO-DESIGN。HTML预演的变化来自用户明确要求 |

证据目录：/Users/weiyudang/.codex/visualizations/2026/11/09/01a1c0ee-56d7-75f2-b825-834b1d54185e/company-website/work-demos-v1/。包含实际页面截图及agent-report.xlsx、finance-report.csv、supply-report.csv、editing-plan.json、editing-subtitles.srt。

范围限制：模拟群不连接真实企业微信；示例规则不调用模型或客户后台；剪辑不生成视频文件；只读取内置合成XLSX，不提供任意文件上传。没有客户实际收益、真实设备／Safari、多地区网络、GPU硬件故障验收。未知静态slug会在本地服务写入NoFallbackError，实际404与公司自定义页面已核对。

# 历史候选验证

# 公司官网候选验证与交接

日期：2026-11-10。当前为 Astryx 原则优化后的本地候选，本次基于提交7500b6b，延续八方向粒子动效及六类解决方案。未推送、合并、发布或修改 DNS。

## 当前成果与基线

- 用户最新要求：继续研究参考站的完成度；完整展开中文 AI 业务；去掉地域定位，采用改变世界的全球性叙事；粒子、量子感，不用金属莫比乌斯环。
- 当前主张：让智能，重塑世界的运行方式。
- 网站：中文首页和八个业务详情页；每个详情包含业务问题、建设思路、能力组成、系统关系和交付范围。
- 独立目录：/Users/weiyudang/.codex/worktrees/company-site-20261109/weiyudang_web。
- 分支：codex/company-site-20261109。
- 预览：http://127.0.0.1:3079/，运行生产构建。主预览标签已保留。
- 原目录：/Users/weiyudang/Workspace/active/weiyudang_web，保持原始工作区。
- 旧版本和原个人站源代码可经 Git 历史恢复；本轮未碰原工作区、远端分支或生产部署。

## 已验证

### 本次：Astryx 原则、阅读与交互优化

本次改动集中于CompanyHeader和company.css：补齐间距与动效变量，调大桌面辅助正文，统一图形动效按钮；原生方案折叠加入渐进式高度动画；导航标示当前章节。品牌、正文、图像与粒子渲染逻辑未改动，网站未引入Astryx运行时依赖。工具安装记录另见ASTRYX-SETUP.md。

| 检查 | 本次结果 |
| --- | --- |
| 最终构建与HTTP回归 | npm run build及npm run check:company-site -- http://127.0.0.1:3079均通过，包含六类场景、八详情、字体和16个停用入口 |
| 当前章节与键盘导航 | 五个导航逐项通过Enter前往，对应hash与aria-current一致，包含相邻的关于我们／联系合作；没有横向溢出 |
| 六类场景 | 桌面六项逐项通过Enter展开，同一时间只有一项打开，展开计算时长0.41s，流程正文16px |
| 减少动画 | 最终浏览器计算的展开／收起时长均0s，图形state=reduced；已恢复媒体偏好 |
| 手机宽度 | 360×780浏览器中六场景逐项展开均无横向溢出，流程正文15px；知识详情图形running，业务导航标示正确，暂停按钮96×44px |
| 平板与桌面 | 768×1024无横向溢出且流程正文16px；桌面1280×720核对布局与展开交互 |
| 控制台 | 最终浏览器warn/error为空，无框架错误覆盖层 |
| 视觉核对 | 实际桌面、手机截图与既有方案分区概念通过view_image核对；仍为开放行、细分隔、宋体层级、三阶段光线和自身品牌配色 |

本次证据目录：

/Users/weiyudang/.codex/visualizations/2026/11/09/01a1c0ee-56d7-75f2-b825-834b1d54185e/company-website/astryx-polish/

包含desktop-solutions.jpg、mobile-solutions.jpg、mobile-artwork.jpg、tablet-solutions.jpg与checks.json。checks.json保存五导航、桌面及手机六场景、手机图形按钮和减少动画的测量。未重新做真实设备、Safari、GPU故障或无JavaScript交互验收；以下更早结果保留各自原验证范围，不冒充本次重测。

### 上一候选：粒子动效与具体系统方案

验证流程：首页业务切换或详情页 → 对应粒子场运行 → 暂停/继续与减少动画 → 首页六类场景展开 → 阅读具体工作流程与联系入口。

| 检查 | 本次结果 |
| --- | --- |
| 生产构建/HTTP | 最终npm run build及check:company-site均通过，类型检查正常；新增六类场景、原生折叠内容、动效层、暂停入口和v2字体均进入回归 |
| 八方向总览与详情 | 八个tab逐项点击；八个详情逐页打开，均为webgl-particles、running，图像正常加载，无横向溢出 |
| 实际帧变化 | 同一粒子画面运行时23238个颜色通道变化超过2/255；暂停后的两个画面全部一致。motion-pixel-check.json保留测量，不把它当作帧率测试 |
| 动效控制 | 暂停后state=paused、aria-pressed=true；继续播放恢复。系统减少动画时state=reduced、canvas display=none、原图opacity=1；已恢复媒体设置 |
| 离屏 | 手机详情滚离图形后state=offscreen，渲染循环暂停 |
| 场景介绍 | 零售、财务、供应链、品牌与短视频、企业运营、客户服务六项均能独立展开，每项三个具体流程阶段；同一时间只展开一项；财务项通过Enter展开 |
| 联系入口 | 每个场景均为指定Gmail的独立主题mailto，未发送邮件 |
| 响应式 | 桌面1280×720；六场景390×844逐项展开；八详情360×780逐项检查；768×1024平板检查导航、分类名称和布局，均无横向溢出。长分类名称保持单行，手机动效按钮83×44px |
| 控制台与框架 | 最终浏览器warn/error为空，未出现框架错误覆盖层 |
| 图形轨迹 | 八类所有轨迹采样均有限且在0至1范围，闭合路径首尾一致 |
| 视觉核对 | 生成的解决方案分区概念、实际桌面和手机截图经view_image核对，参见REFINEMENT中的六点对照；新方案没有修改首屏主张、正文和CTA，仅导航增加解决方案入口与手机短标签 |

上一候选证据在仓库之外的 company-website/motion-solutions/，完整父路径与下方截图相同。包含desktop-solutions.jpg、desktop-video.jpg、desktop-motion.jpg、mobile-finance.jpg、mobile-content.jpg、mobile-motion.jpg、tablet-solutions.jpg、reduced-motion.jpg、checks.json与motion-pixel-check.json。particle-motion.gif为实际浏览器录屏生成的5.1秒、960×540动画，非概念动画；原录屏50帧和时间戳位于frames/与recording.json。

本次未重新做真实设备、GPU硬件故障或禁用JavaScript的浏览器交互测试；原图与六个原生details内容有服务器HTML证据。未声称这些场景背后已有可直接使用的财务、视频或其他AI业务后台。

### 前一候选的保留验证

上一轮图形修正已完成生产构建与HTTP回归，并在独立浏览器标签核对八个总览选项、八个详情页和390×844窄屏下的八页图形。每项均对应自己的素材，图像complete=true、naturalWidth=1254，页面无横向溢出；最终浏览器warn/error列表为空。总览与详情共用同一组件，已移除旧通用流程图。下表中无JavaScript、对比度等项目为前一候选的验证范围，未将其作为本次新增交互的实测结论。

| 检查 | 结果 |
| --- | --- |
| 生产构建、类型检查 | npm run build 通过，Next.js16.2.6；八个技术路径静态生成 |
| HTTP回归 | npm run check:company-site -- http://127.0.0.1:3079 通过 |
| 全球叙事 | 首页和八个详情的HTML/元数据排除陕西等旧定位；没有厂商95%、150M、F500、专有产品名或旧个人文案 |
| 中文内容 | 八个详情HTTP200，各有问题、三项能力和交付等五个主要小节；独立canonical，均进入九页sitemap |
| 未知路径 | /technology/unknown-direction 为404，实际正文为公司的自定义未找到页面 |
| 原个人入口 | 16个旧入口/深层地址/旧图地址410 + noindex，旧登录及登出POST停用 |
| 原型与资源 | /mobius、/mobius-lab保留200与既有noindex；新图像、字体、OFL许可、图标均200 |
| 联系 | Gmail的mailto与主题正确；360×780窄屏邮箱右边界299.69px，可用宽度345px，完整显示且无横向溢出；未发送邮件 |
| 桌面 | 1440×1000与1440×1200检查首屏、业务总览、中文详情、交付和愿景；Canvas为webgl、motion=ready，无横向溢出 |
| 八项总览交互 | 8个tab逐项点击，均选中并显示对应完整主张；Home、ArrowRight切换通过；详情链接可打开对应页面 |
| 手机 | 首页390×844；8个详情逐页360×780检查，全部无横向溢出、无地域文案；每页5个主要小节；主标题2或3行 |
| 动效偏好 | 手机浏览器减少动画模式下motion=reduced，canvas为none，poster opacity=1；正文和联系动作可读 |
| 无JavaScript | 首页静态画面可读；8个方向摘要和8个原生详情链接出现，不可操作tab隐藏；详情另有静态HTML回归证据 |
| 可读性 | 深色正文18.08:1，深色辅助10.51:1，浅色正文16.87:1，浅色辅助6.16:1，浅色链接7.25:1 |
| 浏览器控制台 | 正常候选检查最终error/warn列表为空 |
| 临时浏览器设置 | 页面脚本执行与媒体偏好已恢复；调用视口reset；保留主预览，临时参考和独立QA标签不作为交付 |
| 补丁 | git diff --check通过 |

## 视觉核对

四个分区概念和实际浏览器截图通过view_image逐对查看。正式图像是根据概念重新生成的独立素材，保留粒子、光丝与景深；不再用均匀散点近似高质量画面。所有标题、导航、业务说明、图注和动作均为原生网页元素，粒子图形为独立图片素材。

宏大叙事与八页正文扩展来自生成概念之后的用户明确指令，因此主标题、段落、地区字样和局部纵向密度与早期概念有授权变化。没有把生成的整页图当作网页铺底。

八方向图形修正后的实际截图与逐项测量目录（仓库之外）：

/Users/weiyudang/.codex/visualizations/2026/11/09/01a1c0ee-56d7-75f2-b825-834b1d54185e/company-website/direction-artwork-v4/

本次交付截图为 desktop-knowledge.jpg、overview-agents.jpg、overview-improvement.jpg、mobile-knowledge.jpg、mobile-improvement.jpg；checks.json记录八项总览、八页桌面及八页手机宽度检查。原始知识星群图与实际桌面、手机截图经view_image核对，确认正式素材确实出现在页面中。窄屏是浏览器模拟，未作为真机证据。

前一候选的首屏、交付、联系和降级截图仍保留在：

/Users/weiyudang/.codex/visualizations/2026/11/09/01a1c0ee-56d7-75f2-b825-834b1d54185e/company-website/refinement-2/

包括 desktop-hero.jpg、desktop-delivery-contact.jpg、mobile-hero.jpg、mobile-contact.jpg、reduced-motion-mobile.jpg、no-javascript-mobile.jpg，以及前一候选测量 mobile-detail-checks.json。该目录中的总览与知识详情截图已由本次图形截图替代。更早截图位于父目录与premium目录。

## 限制与后续发布边界

- 只有本地候选证据，没有Vercel或正式域名验收。用户要求先不发布，后续推送/发布仍需明确授权。
- 未做真实手机、Safari/Android或中国大陆多地区网络验收；没有将内置浏览器表现当作真机帧率承诺。
- 无JavaScript的自动化详情点击被浏览器控制接口的Runtime.evaluate超时限制；没有记为点击通过。已核对静态链接、摘要和完整服务器HTML，并恢复脚本设置。
- 测试未知静态slug时，Next16.2.6会在服务日志输出NoFallbackError。HTTP404及自定义正文已核对，没有把该字符串暴露到页面；未升级或修改框架。
- GPU驱动/显存丢失仅有后备代码复查，未做真实硬件故障验证。静态图、减少动画和无JavaScript呈现已观察。
- 八个方向是业务与技术建设范围，不代表已有八个成熟自研产品、客户案例、收入、监管认证或已验收交付。
- 独立dora.weiyudang.com与relay.weiyudang.com不受该Vercel路由树控制。本轮不声称它们已下线；需要另行核对公开入口与内部依赖。

内容依据和边界见SOURCES.md；设计、生成方式、正式素材路径及提示词见REFINEMENT-2026-11-10.md。
