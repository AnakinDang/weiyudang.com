import Image from "next/image";

export function ArchitectureArtwork() {
  return (
    <figure className="architecture-artwork" aria-label="企业 AI 的四层运行基础">
      <Image src="/company/knowledge-orbits-v3.webp" width={1254} height={1254} sizes="(max-width: 900px) 90vw, 45vw" alt="" />
      <ul className="architecture-labels">
        {["业务应用", "智能体与工作流", "企业知识", "权限与评测"].map((label, index) => <li key={label} style={{ top: [22,42,60,78][index] + "%" }}><i aria-hidden="true" />{label}</li>)}
      </ul>
      <svg className="architecture-trace" viewBox="0 0 600 600" fill="none" aria-hidden="true">
        <path id="architecture-path" d="M302 164C195 185 151 225 302 272S440 322 302 369S160 432 302 466" />
        <circle r="2.5"><animateMotion dur="14s" repeatCount="indefinite"><mpath href="#architecture-path" /></animateMotion></circle>
      </svg>
    </figure>
  );
}
