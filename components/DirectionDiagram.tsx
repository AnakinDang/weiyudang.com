import type { CompanyDirection } from "@/lib/company-content";

export function DirectionDiagram({ direction }: { direction: CompanyDirection }) {
  return (
    <figure className="direction-diagram" aria-label={direction.label + "能力结构"}>
      <svg viewBox="0 0 600 300" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <path d="M100 55V90H500V55M300 55V120M300 180V240M100 265V240H500V265" />
        {[100,300,500].map(x => <g key={x}><circle cx={x} cy="55" r="2.5" /><circle cx={x} cy="265" r="2.5" /></g>)}
      </svg>
      <ul className="diagram-inputs">{direction.inputs.map(label => <li key={label}>{label}</li>)}</ul>
      <div className="diagram-center">{direction.center}</div>
      <ul className="diagram-outputs">{direction.outputs.map(label => <li key={label}>{label}</li>)}</ul>
    </figure>
  );
}
