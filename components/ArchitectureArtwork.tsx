import Image from "next/image";
import { QuantumArtwork } from "./QuantumArtwork";

export function ArchitectureArtwork() {
  return (
    <figure className="architecture-artwork" data-direction-artwork="platform" aria-label="企业 AI 的四层运行基础">
      <div className="architecture-media"><QuantumArtwork direction="platform" src="/company/knowledge-orbits-v3.webp"><Image src="/company/knowledge-orbits-v3.webp" width={1254} height={1254} unoptimized loading="eager" alt="" /></QuantumArtwork></div>
      <ul className="architecture-labels">
        {["业务应用", "智能体与工作流", "企业知识", "权限与评测"].map((label, index) => <li key={label} style={{ top: [22,42,60,78][index] + "%" }}><i aria-hidden="true" />{label}</li>)}
      </ul>
    </figure>
  );
}
