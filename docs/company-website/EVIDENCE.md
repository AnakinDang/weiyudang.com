# 候选版验证与交接

日期：2026-11-10。此记录仅证明本地候选；未推送、合并、发布或修改 DNS。

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
| 桌面渲染 | 内置浏览器 1440×1000，非空、无框架错误页；图片均加载，横向无溢出 |
| 手机渲染 | 内置浏览器 390×844；主标题、导航、内容区和完整邮箱无横向溢出；修正合作阶段短语中途换行 |
| 内容交互 | 八个 tab 全部点击并核对标题；Home 和 ArrowDown 键切换通过；手机语音交互 tab 通过 |
| 动效偏好 | prefers-reduced-motion 下动画名为 none、轨道追踪点隐藏，正文保持可见；测试后复原媒体与视口设置 |
| 控制台 | 最终 error/warn 列表为空 |
| 补丁检查 | git diff --check 通过 |

## 视觉对照

参考为生成的三个页面区域方案；创始人随后明确要求粒子／量子感、取消金属，粒子版首屏方案与独立粒子资产取代早期金属方案。最终用 view_image 对照粒子版方案和真实浏览器截图。

1. 页头保留项目名、四个导航入口及清晰联系动作，去除个人入口。
2. 原生中文双行主标题与说明、主次动作对照方案；实际字体使用本地中文无衬线，保持可读性与稳定换行。
3. 主视觉使用冷白／冰蓝概率云与光点环，没有金属资产；慢速呼吸与轨道表达时间循环。
4. 八项方向与共享详情区的结构、选中状态、原生文字及键盘操作对照方案；粒子图以 lighten 和柔边融合，消除矩形背景接缝。
5. 四步交付循环与宽幅粒子环延续同一视觉，商业阶段文字保留而不添加价格或假收益。
6. 手机按顺序堆叠内容，所有能力标签可见，联系邮箱不裁切。

最终截图（仓库之外）：
/Users/weiyudang/.codex/visualizations/2026/11/09/01a1c0ee-56d7-75f2-b825-834b1d54185e/company-website/
包含 desktop-hero.jpg、desktop-technology.jpg、desktop-delivery.jpg、desktop-full.jpg、mobile-hero.jpg、mobile-technology.jpg、mobile-contact.jpg 与 retired-personal-page.jpg。

## 未验证与发布待办

- 尚未发布到 Vercel，正式域名仍是原站。推送／合并／发布按用户工作约定需明确批准。
- 独立 dora.weiyudang.com 与 relay.weiyudang.com 不受此 Vercel 主站路由控制。当前工作机没有找到本地 Cloudflare ingress 配置；需要单独核对它们的公开路由和内部依赖后撤下，不能声称本候选已经让它们下线。
- 未发送邮件验证 Gmail 收件，未做真实设备、Safari／Android 浏览器或中国大陆多地网络验收。
- 该站为业务展示，不代表八个方向都已有自研产品、生产案例、客户订单或验收。没有新增数据后端或模型服务。
