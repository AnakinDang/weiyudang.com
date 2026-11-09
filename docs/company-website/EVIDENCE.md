# 候选版验证与交接

日期：2026-11-10。此记录仅证明本地候选；未推送、合并、发布或修改 DNS。

本轮根据用户“先不急，参考 Distyl 和苹果官网的设计理念以及动画”继续修订。基于首版本地提交 33257449aa8cfc304f87ff4429f2fc626abfd3bc，新增实时粒子场景和滚动叙事，重新编排冷白业务章节。用户当前要求先不发布。

## 基线与保留

- 原站：Vercel weiyudang-web，2026-11-04 生产版本 2a1a6ae020c6e238e82e396d375db9be7905a1a6。
- 原目录：/Users/weiyudang/Workspace/active/weiyudang_web，最终复查仍干净。
- 独立候选目录：/Users/weiyudang/.codex/worktrees/company-site-20261109/weiyudang_web。
- 分支：codex/company-site-20261109。
- 预览：http://127.0.0.1:3079/，运行生产构建，已保留浏览器预览标签。

## 已验证

| 检查 | 证据与结果 |
| --- | --- |
| 生产构建及类型检查 | npm run build 通过，Next.js 16.2.6；路由树仅含首页、联系重定向、图标和搜索元数据 |
| HTTP 回归 | npm run check:company-site -- http://127.0.0.1:3079 通过 |
| 原入口下线 | 16 个旧页面／深层地址／旧图片地址返回 410 + noindex；旧登录和登出 POST 也返回 410 |
| 公司内容 | 公司暂称未命名；项目莫比乌斯；8 个业务／技术方向；公开内容无 Personal OS／Doraemon／个人旧页文案 |
| 联系入口 | 用户指定 dangweiyu0516@gmail.com；主导航到联系区，mailto 地址及主题正确；手机上完整显示 |
| 原型保留 | /mobius、/mobius-lab 保留 200，设置 noindex，未加入营销导航 |
| 搜索入口 | canonical 指向 weiyudang.com；robots.txt 与仅含公司首页的 sitemap.xml 返回 200 |
| 桌面渲染 | 内置浏览器 1440×1000，非空、无框架错误页；实时 Canvas 的 renderer=webgl、motion=ready，横向无溢出 |
| 手机渲染 | 内置浏览器 390×844 与窄屏 360×780；主标题、导航、业务关系图和完整邮箱无横向溢出；窄屏邮箱边界在可用宽度内 |
| 窗口变化 | 桌面与手机尺寸来回切换后，实时粒子保持完整；绘制密度随当前宽度切换，避免沿用首次加载尺寸。恢复实际预览 778×853，motion=ready、renderer=webgl、无横向溢出 |
| 内容交互 | 八个 tab 全部点击并核对标题；Home 和 ArrowDown 键切换通过；手机语音交互 tab 通过 |
| 滚动叙事 | 桌面在 progress≈0.65 时主标题透明且 inert，第二幕完全可见，粒子与正文分列；手机粒子保持下方，文字在上方换幕 |
| 动效偏好 | prefers-reduced-motion 下 motion=reduced、canvas=none、stage=relative、story opacity=1、轨道追踪点隐藏；手机文字边界完整 |
| 无 JavaScript | 浏览器禁用页面脚本后，显示静态粒子；主张与第二幕按顺序排版，8 段业务描述可用，隐藏不可操作的 tab；文字没有裁切 |
| 控制台 | 最终 error/warn 列表为空 |
| 补丁检查 | git diff --check 通过 |

## 视觉对照

本轮在真实浏览器中查看 Distyl 首页及其下一章节、Apple 中国首页与 iPhone 18 Pro 产品页的主视觉和滚动章节，随后生成三个布局参考：居中主视觉、冷白业务章节、左粒子／右陈述的第二幕。参考网址与观察、本站应用记录在 SOURCES.md，不能把我们归纳的方式写成品牌官方准则。

1. 原生中文大标题与单一主动作；紧凑页头与大面积留白，手机保留业务和联系入口。
2. 实时 WebGL 冷白／冰蓝粒子环代替悬浮图片，呈现点状光场和半扭转带；没有金属材质。静态粒子图仅用于后备阅读。
3. 一段随原生滚动的场景完成主张到持续进化的叙事；不劫持滚轮。调整粒子的位置和缩放，使第二幕文字区有清晰空间；缩短交叉渐隐区间。
4. 业务章节改成冷白背景、轻线关系图和八项原生方向导航；取消重复粒子图。手机采用独立 SVG 排列以保留标签字号。
5. 交付章节保留细线四步循环与慢速轨迹，取消宽幅粒子图的重复；商业阶段仍不添加未经验证的价格和收益。
6. 减少动画与无 JavaScript 都提供顺序阅读。浏览器验证发现后备版相对定位可能裁切手机说明文字，已修正边距并复查实际边界。

实现与概念的有意差异：生成方案用于空间、明暗和层级；真实版本使用本地中文字体、原生关系图和持续运动的三维点场，不把生成画面作为整页截图铺在页面上。第二幕的粒子左侧有意超出屏幕，正文有独立空间。

最终截图（仓库之外）：
/Users/weiyudang/.codex/visualizations/2026/11/09/01a1c0ee-56d7-75f2-b825-834b1d54185e/company-website/premium/
包含 desktop-hero.jpg、desktop-story.jpg、desktop-technology.jpg、desktop-delivery.jpg、mobile-hero.jpg、mobile-story.jpg、mobile-technology.jpg、mobile-contact.jpg、reduced-motion-mobile.jpg 和 no-javascript-mobile.jpg。上一版截图保留在父目录，不充当本轮效果证据。

## 未验证与发布待办

- 尚未发布到 Vercel，正式域名仍是原站。推送／合并／发布按用户工作约定需明确批准。
- 独立 dora.weiyudang.com 与 relay.weiyudang.com 不受此 Vercel 主站路由控制。当前工作机没有找到本地 Cloudflare ingress 配置；需要单独核对它们的公开路由和内部依赖后撤下，不能声称本候选已经让它们下线。
- 未发送邮件验证 Gmail 收件，未做真实设备、Safari／Android 浏览器或中国大陆多地网络验收。
- 未将内置浏览器的观测帧率当作真实手机性能验收；未模拟 GPU 驱动／显存故障，GPU 初始化失败和上下文丢失的后备处理只经代码复查。减少动画及无 JavaScript 的静态后备已在浏览器中实际验证。
- 该站为业务展示，不代表八个方向都已有自研产品、生产案例、客户订单或验收。没有新增数据后端或模型服务。
