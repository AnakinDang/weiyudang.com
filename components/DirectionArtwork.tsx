import Image from "next/image";
import type { CompanyDirection } from "@/lib/company-content";
import { directionArtwork } from "@/lib/direction-artwork";
import { ArchitectureArtwork } from "./ArchitectureArtwork";
import { QuantumArtwork } from "./QuantumArtwork";

export function DirectionArtwork({ direction }: { direction: CompanyDirection }) {
  if (direction.id === "platform") return <ArchitectureArtwork />;
  const artwork = directionArtwork[direction.id];
  return (
    <figure className="direction-artwork" data-direction-artwork={direction.id}>
      <div className="direction-artwork-media">
        <QuantumArtwork direction={direction.id} src={artwork.src}><Image src={artwork.src} width={1254} height={1254} unoptimized loading="eager" alt={artwork.alt} /></QuantumArtwork>
      </div>
      <figcaption>{artwork.caption}</figcaption>
    </figure>
  );
}
