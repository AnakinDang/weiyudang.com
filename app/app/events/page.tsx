import type { ReactNode } from "react";
import {
  AlertTriangle,
  ClipboardCheck,
  Clock3,
  FileSearch,
  GitBranch,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  Waypoints,
  XCircle
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { requireOwnerSession } from "@/lib/private/owner-session";
import { ownerReviewQueueData, type PrivateReviewQueueItem, type ReviewQueueTone } from "@/lib/private/review-queue";

export const dynamic = "force-dynamic";

const unavailableActions = ["Approve and execute", "Reject and run", "Public publish", "Runtime dispatch"] as const;

function LightStatusBadge({ children, tone }: { children: ReactNode; tone: ReviewQueueTone }) {
  const className = {
    normal: "border-emerald-200 bg-emerald-50 text-emerald-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    private: "border-slate-200 bg-slate-50 text-slate-700"
  }[tone];

  return (
    <span className={`inline-flex items-center rounded-[8px] border px-2.5 py-1 text-xs font-bold uppercase ${className}`}>
      {children}
    </span>
  );
}

function urgencyTone(urgency: string): ReviewQueueTone {
  if (urgency === "Now") {
    return "warning";
  }

  if (urgency === "Next") {
    return "info";
  }

  return "private";
}

function laneItemLabel(count: string) {
  return count === "1" ? "item" : "items";
}

function ReviewHero({ currentItem }: { currentItem: PrivateReviewQueueItem }) {
  return (
    <section
      className="overflow-hidden rounded-[8px] border border-white/70 bg-white text-slate-950 shadow-[0_34px_120px_rgba(15,23,42,0.18)]"
      aria-labelledby="review-queue-title"
    >
      <div className="grid min-h-[30rem] gap-0 xl:grid-cols-[minmax(0,1.08fr)_31rem]">
        <div className="relative overflow-hidden p-6 md:p-8">
          <div
            className="pointer-events-none absolute -right-28 -top-32 size-96 rounded-full bg-blue-500/12 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 left-1/2 h-44 w-[46rem] -translate-x-1/2 rounded-t-full border border-blue-100 bg-[radial-gradient(circle_at_50%_100%,rgba(37,99,235,0.14),transparent_62%)]"
            aria-hidden
          />

          <div className="relative flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase text-blue-800">
              <LockKeyhole size={14} aria-hidden />
              Owner-only
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase text-emerald-800">
              <FileSearch size={14} aria-hidden />
              Evidence-first
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase text-amber-800">
              <ShieldCheck size={14} aria-hidden />
              No auto-promotion
            </span>
          </div>

          <div className="relative mt-10 max-w-4xl">
            <p className="text-sm font-semibold text-blue-700">Authenticated owner decision register</p>
            <h2 id="review-queue-title" className="mt-3 max-w-4xl text-4xl font-semibold leading-[1.02] text-slate-950 md:text-5xl">
              Review decisions before anything moves.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              The Review Queue turns approvals, deferrals, blocked work, and owner notes into explicit decision packets.
              Evidence is visible, missing proof is named, and no page can silently promote review state into execution.
            </p>
          </div>

          <div className="relative mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {ownerReviewQueueData.metrics.map((metric) => (
              <div key={metric.label} className="rounded-[8px] border border-slate-200 bg-white/82 p-4 shadow-[0_18px_70px_rgba(37,99,235,0.08)] backdrop-blur">
                <p className="text-xs font-bold uppercase text-slate-500">{metric.label}</p>
                <strong className="mt-2 block text-3xl font-semibold text-slate-950">{metric.value}</strong>
                <p className="mt-2 text-sm leading-5 text-slate-600">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <section
          className="relative border-t border-slate-200 bg-[linear-gradient(180deg,#f7fbff,#edf5ff)] p-5 md:p-6 xl:border-l xl:border-t-0"
          aria-labelledby="current-review-title"
        >
          <div
            className="pointer-events-none absolute inset-x-6 top-6 h-48 rounded-full bg-blue-500/12 blur-3xl"
            aria-hidden
          />
          <div className="relative rounded-[8px] border border-white bg-white/78 p-5 shadow-[0_20px_80px_rgba(37,99,235,0.1)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Current packet</p>
                <h3 id="current-review-title" className="mt-1 text-2xl font-semibold text-slate-950">
                  {currentItem.title}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase text-blue-700">{currentItem.surface}</p>
              </div>
              <span className="flex size-12 items-center justify-center rounded-[8px] bg-blue-600 text-white">
                <ClipboardCheck size={23} aria-hidden />
              </span>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">{currentItem.requestedDecision}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <LightStatusBadge tone={currentItem.tone}>{currentItem.decision}</LightStatusBadge>
              <LightStatusBadge tone={urgencyTone(currentItem.urgency)}>{currentItem.urgency}</LightStatusBadge>
            </div>
          </div>

          <div className="relative mt-4 grid gap-3">
            <div className="rounded-[8px] border border-blue-100 bg-white/78 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">Recommended handling</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">{currentItem.recommendedHandling}</p>
            </div>
            <div className="rounded-[8px] border border-amber-100 bg-amber-50/80 p-4">
              <p className="text-xs font-bold uppercase text-amber-800">Allowed next</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">{currentItem.allowedNext}</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function DecisionLanes() {
  return (
    <section className="panel p-5" aria-labelledby="review-lanes-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Waypoints size={22} aria-hidden />
            <h2 id="review-lanes-title" className="text-2xl font-semibold text-white">
              Decision lanes
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Each lane says who owns the review, why the item exists, and whether the next step is current, deferred, or
            blocked.
          </p>
        </div>
        <StatusBadge tone="warning">Owner-gated</StatusBadge>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {ownerReviewQueueData.lanes.map((lane, index) => (
          <article key={lane.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <span
                className="flex size-9 items-center justify-center rounded-[8px] border border-sky-200/35 bg-sky-200/16 text-xs font-semibold text-white"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <StatusBadge tone={lane.tone}>{lane.state}</StatusBadge>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{lane.label}</h3>
            <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{lane.owner}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{lane.detail}</p>
            <p className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3 text-xs leading-5 text-slate-400">
              {lane.count} {laneItemLabel(lane.count)} in this lane
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReviewPacket({ item, index }: { item: PrivateReviewQueueItem; index: number }) {
  return (
    <article className="panel p-5" aria-labelledby={`review-item-${item.id}`}>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">
                {String(index + 1).padStart(2, "0")} - {item.lane}
              </p>
              <h3 id={`review-item-${item.id}`} className="mt-2 text-2xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-xs font-bold uppercase text-slate-400">
                {item.urgency} - {item.agent} - {item.surface}
              </p>
            </div>
            <StatusBadge tone={item.tone}>{item.decision}</StatusBadge>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Requested decision</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{item.requestedDecision}</p>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Recommended handling</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{item.recommendedHandling}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {item.evidenceCards.map((evidence) => (
              <div key={`${item.id}-${evidence.label}`} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase text-slate-400">{evidence.label}</p>
                  <StatusBadge tone={evidence.tone}>{evidence.state}</StatusBadge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{evidence.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 text-sky-100">
              <GitBranch size={17} aria-hidden />
              <p className="text-sm font-semibold">Checkpoints</p>
            </div>
            <div className="mt-3 grid gap-2">
              {item.checkpoints.map((checkpoint) => (
                <div key={`${item.id}-${checkpoint.label}`} className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-700 bg-[#07111f]/70 px-3 py-2">
                  <span className="text-xs font-semibold text-slate-300">{checkpoint.label}</span>
                  <StatusBadge tone={checkpoint.tone}>{checkpoint.state}</StatusBadge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 text-yellow-100">
              <AlertTriangle size={17} aria-hidden />
              <p className="text-sm font-semibold">Blockers</p>
            </div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
              {item.blockers.map((blocker) => (
                <li key={`${item.id}-${blocker}`} className="flex gap-2">
                  <XCircle className="mt-1 shrink-0 text-yellow-100" size={15} aria-hidden />
                  <span>{blocker}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <p className="text-xs font-bold uppercase text-slate-400">Allowed next</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{item.allowedNext}</p>
            <p className="mt-4 text-xs font-bold uppercase text-slate-400">Updated</p>
            <p className="mt-1 text-sm text-slate-300">{item.updated}</p>
          </div>
        </aside>
      </div>
    </article>
  );
}

function PolicyRail() {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="review-policy-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-100">
              <ShieldAlert size={22} aria-hidden />
              <h2 id="review-policy-title" className="text-2xl font-semibold text-white">
                Review rules
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              The queue represents decisions as states only. It can clarify what is allowed next, but it cannot perform
              the next step.
            </p>
          </div>
          <StatusBadge tone="private">Read-only</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {ownerReviewQueueData.policy.map((rule) => (
            <div key={rule} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
              {rule}
            </div>
          ))}
        </div>
      </section>

      <aside className="panel p-5" aria-labelledby="review-unavailable-title">
        <div className="flex items-center gap-2 text-yellow-100">
          <Clock3 size={20} aria-hidden />
          <h2 id="review-unavailable-title" className="text-2xl font-semibold text-white">
            Unavailable
          </h2>
        </div>
        <div className="mt-5 grid gap-2">
          {unavailableActions.map((item) => (
            <div key={item} className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] px-3 py-2 text-sm text-slate-300">
              <span>{item}</span>
              <StatusBadge tone="private">Unavailable</StatusBadge>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default async function EventsPage() {
  await requireOwnerSession("/app/events");
  const currentItem = ownerReviewQueueData.queue[0];

  if (!currentItem) {
    return null;
  }

  return (
    <div className="grid gap-5">
      <ReviewHero currentItem={currentItem} />
      <DecisionLanes />

      <section className="panel p-5" aria-labelledby="review-packets-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-100">
              <ClipboardCheck size={22} aria-hidden />
              <h2 id="review-packets-title" className="text-2xl font-semibold text-white">
                Decision packets
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Each packet keeps the requested decision, evidence, blockers, and allowed next step visible before any
              owner action happens elsewhere.
            </p>
          </div>
          <StatusBadge tone="private">Read-only packets</StatusBadge>
        </div>

        <div className="mt-5 grid gap-4">
          {ownerReviewQueueData.queue.map((item, index) => (
            <ReviewPacket key={item.id} item={item} index={index} />
          ))}
        </div>
      </section>

      <PolicyRail />
    </div>
  );
}
