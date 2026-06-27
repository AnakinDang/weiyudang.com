import { LockKeyhole } from "lucide-react";

export function UnavailableControlsPanel({
  eyebrow = "Unavailable until designed",
  title,
  items,
  note,
  unavailableLabel = "unavailable"
}: {
  eyebrow?: string;
  title: string;
  items: readonly string[];
  note?: string;
  unavailableLabel?: string;
}) {
  return (
    <section className="panel p-5">
      <div className="flex items-center gap-2 text-yellow-100">
        <LockKeyhole size={18} aria-hidden />
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-1 text-xl font-semibold text-white">{title}</h2>
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="rounded-[8px] border border-slate-700 bg-white/5 px-3 py-2 text-sm text-slate-300">
            {item}: {unavailableLabel}
          </div>
        ))}
      </div>
      {note ? <p className="mt-4 text-sm font-semibold leading-6 text-yellow-50">{note}</p> : null}
    </section>
  );
}
