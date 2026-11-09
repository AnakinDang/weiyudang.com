# 莫比乌斯公司官网

`weiyudang.com` 的公司官网候选版。公司暂称「未命名」，项目名「莫比乌斯」，首发市场陕西。当前分支完成本地制作与验证后，才进入发布确认；修改本地文件不等于线上已经替换。

业务范围参考 Distyl 官网的企业 AI 生命周期，使用自己的中文说明和宇宙／粒子莫比乌斯视觉，不使用其客户、投资人、研究成果、产品商标或业绩数字。量子感仅为视觉概念，不声称提供量子计算产品。

## 本地使用

```sh
npm ci
npm run build
npm start -- --hostname 127.0.0.1 --port 3079
npm run check:company-site -- http://127.0.0.1:3079
```

没有新增外部服务、表单后端、模型调用或运行时密钥。创始人于 2026-11-10 指定合作咨询邮箱 `dangweiyu0516@gmail.com`，已替换原站未查到 MX 记录的地址。本地检查验证 mailto 链接，不发送测试邮件。

## 页面与下线范围

- `/`：公司业务、八个技术方向、交付循环、公司介绍和联系入口。
- `/contact`：308 转至首页联系区。
- `/about`、`/projects/**`、`/journal/**`、`/lab/**`、`/dora/**`、`/app/**`、`/login/**`、`/api/**`、`/visuals/**`：410 与 noindex；旧登录 POST 也停用。
- `/mobius` 和 `/mobius-lab`：保留既有公司演示，不加入官网导航，返回 noindex。
- `/robots.txt`、`/sitemap.xml`：只引导至新的公司首页。

原个人站入口的页面代码从本分支的 app 路由树移除。旧组件、资料和样式保留为非运行源码；个人图像也不包含在新的 Vercel 上传中。

## 恢复与发布边界

原始可恢复版本：`2a1a6ae020c6e238e82e396d375db9be7905a1a6`，已在 GitHub `AnakinDang/weiyudang.com` 主分支与 Vercel 2026-11-04 生产部署中核实。原工作目录 `/Users/weiyudang/Workspace/active/weiyudang_web` 未被改写；候选在独立 worktree。

发布前应确认最终页面，再将本候选发布到同一 Vercel 项目 `weiyudang-web`。不得把本地制作当作已获推送、合并或发布许可。

独立的 `dora.weiyudang.com` 和 `relay.weiyudang.com` 不属于这个 Vercel 路由树，当前仍有独立服务。本分支不声称它们已下线；需要单独撤下其公开域名入口，并评估内部依赖，不能用停止主站冒充已经停止这些子域名。

视觉约定见 DESIGN.md，内容依据见 docs/company-website/SOURCES.md。
