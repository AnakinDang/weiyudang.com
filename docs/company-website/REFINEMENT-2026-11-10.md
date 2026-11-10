# 第二轮重做：品牌、内容与视觉

本轮交付是本地候选，不推送或发布。用户的最新品牌指令为「我们的目标是改变世界，宏大叙事」，取代早期官网的地域化定位。

## 研究与设计判断

实看 Distyl 首页、滚动陈述及 Context Mesh 技术页，结合八个技术方向的公开内容；实看 Apple 中国 iPhone 18 Pro 产品页的主视觉和下一章节。主要观察：

- Distyl 的首屏是明确的非对称构图。1440宽检查时，标题区域约616px、字级约65px，右侧实时图形约520px，字号、留白和图形完成度共同产生秩序。
- 技术页拥有八方向导航、独立主张、业务问题、能力说明与精细图形。上一版仅用同一组圆圈替换标签，内容与图形的表达都过浅。
- Apple 的检查首屏为大幅主体图形、下方左侧主张和独立动作区。图像的景深、光线和尺度是重要基础。部分延迟视频未稳定播放，未声称完成全部动画审计。
- 以上为页面观察。采用字体对比、图形质量、分区和节奏，不转用参考站的商标、媒体、产品成果或客户事实。

当前公开文案以「让智能，重塑世界的运行方式」开场，以组织、知识、行动和持续进化为主线。八个 AI 业务方向采用原创中文展开，具体建设与交付边界另行说明。

## 画面参考

本轮四张生成概念（仓库之外）为：

- 首屏：/Users/weiyudang/.codex/generated_images/01a1c0ee-56d7-75f2-b825-834b1d54185e/exec-9877f34f-7268-4f62-88d2-51b57e1d4264.png
- 业务总览：同目录 exec-77705894-ce45-4f56-ab52-440cfab3b065.png
- 交付与联系：同目录 exec-e0449ae9-276a-4582-a51f-07ff3c9828a5.png
- 中文详情模板：同目录 exec-3b2b1101-1b62-43a8-ac88-c69fa0cdfcaf.png

生成后，用户进一步明确了宏大叙事与去地域化。该指令授权了主标题、联系区文案和描述的变化；原概念中的地域表达不属于最终方案。补足八个详情页也增加了实际正文密度。

## 正式素材与来源

生成方式：内置 image_gen 工具，以本轮生成概念为本地参考。未使用外部模型API、密钥或CLI。下面两个结果经正常WebP压缩后存入项目，生成原图保留不覆盖。

| 素材 | 项目路径 | 大小 | 原生成文件 |
| --- | --- | --- | --- |
| 粒子与光丝莫比乌斯主视觉 | public/company/quantum-ribbon-v3.webp | 215614字节，1774×887 | exec-5de300ca-2765-423b-a1b5-5ddd1354065d.png |
| 四层概率轨道 | public/company/knowledge-orbits-v3.webp | 87418字节，1254×1254 | exec-9f1c4aa9-0a14-405f-8b7a-f7d3f3afdedd.png |

主视觉不是粗略点阵对概念的近似。正式页面以生成图像保留光丝、清晰与失焦粒子等细节，再由轻量WebGL纹理过程提供微小流动、光线与镜头响应。所有文字和操作仍是原生网页元素。

### 最终主视觉素材提示词

Create the standalone production ART ASSET from this website concept, faithfully preserve the exquisite quantum particle Möbius ribbon, its soft macro depth of field, thin flowing white-blue filaments, rich varying point size, light and probability-cloud material. Remove ALL typography, logo, UI, borders, labels and buttons. Output wide 2048x1536-ish landscape image, background solid near-black #07090e blending perfectly at every edge, no vignette frame. Make the ribbon occupy the RIGHT 63% of the image, allowing clean dark space at the left36% for native website text; match the concept's enormous dimensional flowing diagonal half-twisted loop and foreground tendrils toward lower-center, an open loop at upper-right. Preserve the original sophisticated nonmetal particle material. No continuous solid surface, no metal, no glass, no chrome. Keep no text of any kind. Crisp luminous strands and genuine optical depth, not a dense uniform speckled mathematical point chart. This is the final website hero asset, not another website screenshot.

### 最终轨道素材提示词

Create a standalone production illustration from the RIGHT-HAND DIAGRAM of the reference website concept. Preserve the elegant FOUR evenly spaced elliptical orbital probability-cloud planes in oblique perspective, each a softly luminous icy-blue disk with razor-fine orbital filaments and sparse particles, linked by ONE S-like luminous continuous path, exactly the same exquisite restrained 3D scientific illustration quality. Output square 1536x1536 asset. Background perfectly uniform pale cool #f6f7f8 up to all edges. Entire four-plane structure centered and fully visible with generous margins left10% right15%; planes aligned in a vertical stack spanning y15% to85%. No text, no labels, no leader lines, no UI, no title, no border, no watermark. The reference labels and all website controls are removed; native HTML will supply those separately. Absolutely no metallic material. Four planes only. This is a final clean image asset, not a website screenshot.

### 字体

本地 Noto Serif SC 500 WOFF2 显示字子集63240字节，374个字符，配合系统中文无衬线正文。完整许可与分发来源见 public/company/fonts/OFL.txt、SOURCE.json。未来修改显示字文案时应同步检查子集覆盖。

## 后续修正：让八个方向都使用正式图形

用户指出后面的页面没有落实设计图形。核对发现，上一候选仅首页的「企业 AI 平台」使用了轨道素材，其余七个总览选项和八个详情页仍复用通用流程图。本次删除该流程图，首页与详情页统一调用 DirectionArtwork，补齐七张同系列粒子光丝素材；平台详情同步使用已有四层轨道图。

| 业务方向 | 图形表达 | 正式路径 | 文件大小 |
| --- | --- | --- | --- |
| 企业 AI 平台 | 四层轨道与运行基础 | public/company/knowledge-orbits-v3.webp | 87418字节 |
| 智能体构建 | 多股光丝交织协作 | public/company/directions/agents-v4.webp | 101094字节 |
| 企业知识 | 连接的粒子星群 | public/company/directions/knowledge-v4.webp | 125772字节 |
| 业务语义 | 正交分层关系晶格 | public/company/directions/semantics-v4.webp | 80210字节 |
| 语音交互 | 波形穿过轨道 | public/company/directions/voice-v4.webp | 116608字节 |
| 个性化服务 | 中心星群与关系触点 | public/company/directions/personalization-v4.webp | 85206字节 |
| 专家经验采集 | 分散经验汇为有序轨迹 | public/company/directions/capture-v4.webp | 68616字节 |
| 持续评测与改进 | 闭合光丝反馈循环 | public/company/directions/improvement-v4.webp | 96140字节 |

七张新素材均为1254×1254。生成方式为内置 image_gen，以已有平台轨道图作材质与配色参考；原始生成文件保留，正式素材仅做WebP压缩。共享提示词、逐方向提示词及完整原图路径见 direction-artwork-v4.json。网页中的说明文字与操作为原生元素，图片只承载图形。首页主视觉、全球叙事和现有业务正文未改动。

## 粒子动效与六类业务场景

用户进一步要求八个图形实际流动，并介绍可构建的视频、财务等智能体。重新观察 [Distyl首页](https://www.distyl.ai/) 的实时Canvas主体和滚动陈述，以及 [Weave技术页](https://www.distyl.ai/technology/weave) 的分区与图像。实际观察到的是主页空间变化和滚动焦点节奏；技术页当时的主要插图为图片，不把所有页面描述成实时粒子模拟。莫比乌斯沿用自身的光丝、概率云与循环材质，不采用对方的金属主体或业务成果。

八个插图统一使用QuantumArtwork。底层保留正式生成素材，以WebGL进行细微光丝偏移和沿几何传播的亮度变化，再绘制288个独立光点。光点沿与图形对应的预计算轨迹运行，包含四层轨道、交织流、星群连接、正交晶格、波形、关系轨道、经验汇流与闭合循环。位置插值、独立速度、尺寸和深度漂移发生在渲染循环中，没有每帧React更新，也没有用整张图片的CSS旋转替代流动。

首页新增「让智能，走进真实的业务现场。」分区，六个原生折叠行展示零售、财务、供应链、品牌与短视频、企业运营、客户服务。每个场景有系统介绍、三阶段业务流程及独立主题的交流入口。内容来自用户指定范围，是原创的建设方案示例，未借用客户、已交付指标或“所有同行产品已实现”的断言。

### 分区概念与实现对照

生成方式：内置image_gen，ui-mockup；以此前总览实际截图为视觉体系参考。概念仅用于设计，不作为生产网页背景。概念路径：

/Users/weiyudang/.codex/generated_images/01a1c0ee-56d7-75f2-b825-834b1d54185e/exec-eca5e493-fd6e-418f-a9c0-74a19c0375e9.png

概念简报指定近黑底、冷白宋体标题、蓝灰正文、六行开放式场景列表，第一行展开为左侧介绍和右侧三个业务阶段，以细光线连接；禁止卡片阵列、虚构客户、指标与金属素材。标题、引导句、六个分类和每行主张均已在生成前指定，正式文字、操作与流程线为原生元素。

| 对照点 | 实现与核对 |
| --- | --- |
| 文字与层级 | 主标题、引导句、六行分类和主张保留；每个展开状态的三阶段正文按具体业务写清输入、协作与结果，未制造已交付案例 |
| 布局 | 保留开放行、细分隔、分类与主张双列、展开内容左右分区；分类列增至210px以容纳六字名称，修复意外换行 |
| 字体 | 延续既有本地中文宋体与系统无衬线；更新v2显示字子集为74404字节、435字符，覆盖新标题。原字体文件仍保留 |
| 配色与素材 | 原近黑、冷白、冰蓝体系未变；无文字渐变、金属材质、客户标识或新的假产品界面 |
| 动效 | 三阶段细线有传播光点；八个业务插图有真实帧变化。暂停后帧一致，减少动画恢复原图。录屏取自正式本地页面，不是生成概念 |
| 响应式与操作 | 原生details可点击、键盘展开且一次一项；手机将三阶段改为纵向光线，导航使用业务/方案/合作短标签。桌面默认视口1280×720仅显示长分区的一部分，已结合连续展开、手机与平板状态核对，不靠拉大视口容纳全图 |

最新实际截图与动画位于company-website/motion-solutions/。完整路径、互动和渲染检查见EVIDENCE.md。主视觉标题、正文与CTA未改变，导航新增解决方案入口属于本次新增内容的入口。

## 不属于本轮交付的事项

- 正式域名替换、Git推送、Vercel部署和独立子域名撤下。
- 将厂商客户、融资、基准结果、行业资质或论文写成莫比乌斯的事实。
- 真实客户接入、生产AI后台、表单收件服务或自动发信。
