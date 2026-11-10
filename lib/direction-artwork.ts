import type { CompanyDirection } from "./company-content";

type Artwork = { src: string; alt: string; caption: string };

export const directionArtwork: Record<CompanyDirection["id"], Artwork> = {
  platform: {
    src: "/company/knowledge-orbits-v3.webp",
    alt: "相互连接的四层粒子轨道，表现企业 AI 的共同运行基础",
    caption: "连接知识、应用与治理，形成共同的运行基础。"
  },
  agents: {
    src: "/company/directions/agents-v4.webp",
    alt: "多股粒子光丝交织，汇入同一条协作轨迹",
    caption: "模型、工具与流程，在同一项任务中协作。"
  },
  knowledge: {
    src: "/company/directions/knowledge-v4.webp",
    alt: "相互连接的粒子星群构成共享知识网络",
    caption: "不同来源的知识，在共同的上下文中连接。"
  },
  semantics: {
    src: "/company/directions/semantics-v4.webp",
    alt: "由光点与细线构成分层的业务关系晶格",
    caption: "用对象、关系和约束，组织业务世界。"
  },
  voice: {
    src: "/company/directions/voice-v4.webp",
    alt: "流动的光丝波形穿过粒子轨道",
    caption: "从自然的对话，连接理解与行动。"
  },
  personalization: {
    src: "/company/directions/personalization-v4.webp",
    alt: "中心星群与多个服务触点沿轨道连接",
    caption: "同一段关系，在不同服务触点之间延续。"
  },
  capture: {
    src: "/company/directions/capture-v4.webp",
    alt: "分散的粒子逐渐汇聚为清晰的知识轨迹",
    caption: "将实践中的经验，汇入可复用的组织知识。"
  },
  improvement: {
    src: "/company/directions/improvement-v4.webp",
    alt: "粒子与光丝组成闭合的反馈回路",
    caption: "以真实反馈，连接下一轮评测与改进。"
  }
};
