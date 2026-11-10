# 公司官网候选验证与交接

日期：2026-11-10。当前为第二轮重做后的本地候选，基于提交 c431317。未推送、合并、发布或修改 DNS。

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

四个分区概念和实际浏览器截图通过view_image逐对查看。正式图像是根据概念重新生成的独立素材，保留粒子、光丝与景深；不再用均匀散点近似高质量画面。所有标题、导航、业务说明、结构图和动作均为原生网页元素。

宏大叙事与八页正文扩展来自生成概念之后的用户明确指令，因此主标题、段落、地区字样和局部纵向密度与早期概念有授权变化。没有把生成的整页图当作网页铺底。

最新实际截图目录（仓库之外）：

/Users/weiyudang/.codex/visualizations/2026/11/09/01a1c0ee-56d7-75f2-b825-834b1d54185e/company-website/refinement-2/

包括 desktop-hero.jpg、desktop-technology.jpg、desktop-knowledge.jpg、desktop-delivery-contact.jpg、mobile-hero.jpg、mobile-knowledge.jpg、mobile-contact.jpg、reduced-motion-mobile.jpg、no-javascript-mobile.jpg，以及八页窄屏测量 mobile-detail-checks.json。历史截图位于父目录与premium目录，不作为当前候选的证据。

## 限制与后续发布边界

- 只有本地候选证据，没有Vercel或正式域名验收。用户要求先不发布，后续推送/发布仍需明确授权。
- 未做真实手机、Safari/Android或中国大陆多地区网络验收；没有将内置浏览器表现当作真机帧率承诺。
- 无JavaScript的自动化详情点击被浏览器控制接口的Runtime.evaluate超时限制；没有记为点击通过。已核对静态链接、摘要和完整服务器HTML，并恢复脚本设置。
- 测试未知静态slug时，Next16.2.6会在服务日志输出NoFallbackError。HTTP404及自定义正文已核对，没有把该字符串暴露到页面；未升级或修改框架。
- GPU驱动/显存丢失仅有后备代码复查，未做真实硬件故障验证。静态图、减少动画和无JavaScript呈现已观察。
- 八个方向是业务与技术建设范围，不代表已有八个成熟自研产品、客户案例、收入、监管认证或已验收交付。
- 独立dora.weiyudang.com与relay.weiyudang.com不受该Vercel路由树控制。本轮不声称它们已下线；需要另行核对公开入口与内部依赖。

内容依据和边界见SOURCES.md；设计、生成方式、正式素材路径及提示词见REFINEMENT-2026-11-10.md。
