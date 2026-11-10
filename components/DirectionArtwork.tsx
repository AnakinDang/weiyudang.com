import Image from "next/image";
import type { CompanyDirection } from "@/lib/company-content";
import { directionArtwork } from "@/lib/direction-artwork";
import { ArchitectureArtwork } from "./ArchitectureArtwork";

export function DirectionArtwork({ direction }: { direction: CompanyDirection }) {
  if (direction.id === "platform") return <ArchitectureArtwork />;
  const artwork = directionArtwork[direction.id];
  return (
    <figure className="direction-artwork" data-direction-artwork={direction.id}>
      <div className="direction-artwork-media">
        <Image src={artwork.src} width={1254} height={1254} unoptimized loading="eager" alt={artwork.alt} />
      </div>
      <figcaption>{artwork.caption}</figcaption>
    </figure>
  );
}
