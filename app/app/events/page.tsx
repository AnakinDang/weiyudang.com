import { Timeline } from "@/components/Timeline";

export default function EventsPage() {
  return (
    <section className="panel p-6">
      <p className="eyebrow">Event stream</p>
      <h2 className="mt-2 text-3xl font-semibold text-white">Mock agent event timeline</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
        This page is ready to be replaced by an authenticated event API once the local runtime or database feed exists.
      </p>
      <div className="mt-6">
        <Timeline />
      </div>
    </section>
  );
}
