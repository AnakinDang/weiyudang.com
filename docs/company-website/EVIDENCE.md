# 公司官网候选验证与交接

日期：2026-11-10。当前为八方向粒子动效及六类解决方案的本地候选，本次基于提交1d283e5。未推送、合并、发布或修改 DNS。

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

### 本次：粒子动效与具体系统方案

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

最新证据在仓库之外的 company-website/motion-solutions/，完整父路径与下方截图相同。包含desktop-solutions.jpg、desktop-video.jpg、desktop-motion.jpg、mobile-finance.jpg、mobile-content.jpg、mobile-motion.jpg、tablet-solutions.jpg、reduced-motion.jpg、checks.json与motion-pixel-check.json。particle-motion.gif为实际浏览器录屏生成的5.1秒、960×540动画，非概念动画；原录屏50帧和时间戳位于frames/与recording.json。

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
