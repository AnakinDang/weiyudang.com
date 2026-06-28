import Link from "next/link";
import {
  ArrowRight,
  Ban,
  CheckCircle2,
  Clock3,
  FileSearch,
  GitCompareArrows,
  LineChart,
  LockKeyhole,
  ShieldCheck
} from "lucide-react";
import { tradingConsoleHref, tradingResearchDisclaimer, type TradingView } from "@/lib/trading-team";

const desks = [
  {
    name: "Macro Desk",
    focus: "Rates, index context, breadth, calendar risk",
    state: "Market context",
    detail: "Frames the market backdrop and marks where source confirmation is still thin."
  },
  {
    name: "Equity Desk",
    focus: "Company and sector evidence packets",
    state: "Evidence",
    detail: "Keeps company-level context separate from momentum claims and public summaries."
  },
  {
    name: "Options Desk",
    focus: "Volatility scenarios, skew, liquidity",
    state: "Scenario",
    detail: "Turns volatility notes into research artifacts without suggesting strategy execution."
  },
  {
    name: "Risk Desk",
    focus: "Gates, missing evidence, forbidden actions",
    state: "Gate",
    detail: "Stops weak packets from becoming conclusions when sources degrade or evidence is missing."
  },
  {
    name: "News Desk",
    focus: "Catalyst watch, source freshness, event windows",
    state: "Watch",
    detail: "Separates event context from urgency so public examples do not imply live private signals."
  },
  {
    name: "Crypto Desk",
    focus: "Digital asset samples, regime context, liquidity checks",
    state: "Research sample",
    detail: "Keeps crypto research in the same evidence-first lane without account or wallet context."
  },
  {
    name: "Evidence Desk",
    focus: "Provenance, blockers, replay trace",
    state: "Evidence trace",
    detail: "Links every important claim to a packet, a missing proof item, or a counter-evidence note."
  }
] as const;

const signalFlow = [
  {
    step: "Observe",
    title: "Market context enters as a question",
    detail: "A signal starts as a research prompt, not as a trade idea."
  },
  {
    step: "Attach",
    title: "Evidence and counter-evidence are named",
    detail: "The useful part is the visible proof, the contradiction, and what is still missing."
  },
  {
    step: "Review",
    title: "Desks disagree before confidence rises",
    detail: "Macro, equity, options, news, and risk lenses can disagree in public-safe sample form."
  },
  {
    step: "Hold",
    title: "Owner review stays the gate",
    detail: "The public page describes the workflow; the private console remains owner-only."
  }
] as const;

const evidenceExamples = [
  {
    label: "Evidence packet",
    example: "Breadth sample plus second-source calendar check",
    state: "Partial",
    note: "Useful context, not enough for promotion."
  },
  {
    label: "Counter-evidence",
    example: "Valuation, source quality, or event-window contradiction",
    state: "Required",
    note: "A strong claim needs explicit contradiction before owner review."
  },
  {
    label: "Source health",
    example: "Pending, degraded, partial, or verified",
    state: "Visible",
    note: "Missing or weak sources stay visible instead of hiding behind a score."
  }
] as const;

const replaySteps = [
  "A desk opens a research packet.",
  "Evidence Desk marks missing proof.",
  "Risk Desk keeps execution disabled.",
  "Owner reviews the packet in the private cockpit."
] as const;

const consolePreview = [
  {
    view: "Today",
    detail: "Owner review needs, source health, open questions",
    state: "Private"
  },
  {
    view: "Signals",
    detail: "Thesis, confidence band, evidence and counter-evidence counts",
    state: "Research"
  },
  {
    view: "Desks",
    detail: "Macro, equity, options, risk, news, crypto, evidence disagreement",
    state: "Compare"
  },
  {
    view: "Instruments",
    detail: "Instrument-level summaries, history, source quality, risk flags",
    state: "Gated"
  },
  {
    view: "Options Lab",
    detail: "Volatility and scenario notes without strategy execution",
    state: "Scenario"
  },
  {
    view: "Evidence",
    detail: "Gate status, missing proof, provenance, blockers",
    state: "Evidence trace"
  },
  {
    view: "Replay",
    detail: "How desks formed or revised a research view",
    state: "Audit"
  },
  {
    view: "System",
    detail: "Data freshness, run health, degraded-mode explanation",
    state: "Run health"
  }
] as const satisfies readonly {
  view: TradingView;
  detail: string;
  state: string;
}[];

const publicPrivateRows = [
  {
    publicText: "Desk roles, method, sample workflow",
    privateText: "Accounts, positions, orders, PnL"
  },
  {
    publicText: "Evidence shapes and blocker language",
    privateText: "Private watchlists or live private signals"
  },
  {
    publicText: "Research-only safety boundary",
    privateText: "Broker, paper, live, or order controls"
  }
] as const;

export function TradingProjectShowcase() {
  return (
    <section className="trading-project-showcase" aria-labelledby="trading-project-showcase-title">
      <div className="trading-project-showcase__intro">
        <div>
          <h2 id="trading-project-showcase-title">Research desk, not trading terminal</h2>
          <p>
            MiniDora Trading is a public-safe view of a private research workflow. It explains how desks form questions,
            attach evidence, expose uncertainty, and hold decisions for owner review.
          </p>
        </div>
        <aside className="trading-project-boundary" role="note" aria-label="Research-only disclaimer">
          <ShieldCheck size={20} aria-hidden />
          <strong>{tradingResearchDisclaimer}</strong>
        </aside>
      </div>

      <section className="trading-project-workflow" aria-labelledby="trading-desks-title">
        <div className="trading-project-section-heading">
          <GitCompareArrows size={22} aria-hidden />
          <div>
            <h2 id="trading-desks-title">Meet the desks</h2>
            <p>Specialized research desks compare context, evidence, scenarios, and risk gates.</p>
          </div>
        </div>
        <div className="trading-project-desk-grid">
          {desks.map((desk) => (
            <article key={desk.name} className="trading-project-desk-card">
              <div>
                <span>{desk.state}</span>
                <h3>{desk.name}</h3>
              </div>
              <p className="trading-project-desk-card__focus">{desk.focus}</p>
              <p>{desk.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="trading-project-workflow" aria-labelledby="trading-signal-flow-title">
        <div className="trading-project-section-heading">
          <LineChart size={22} aria-hidden />
          <div>
            <h2 id="trading-signal-flow-title">How a signal forms</h2>
            <p>Signals are treated as review packets with blockers, not executable instructions.</p>
          </div>
        </div>
        <div className="trading-project-flow">
          {signalFlow.map((item, index) => (
            <article key={item.step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.step}</strong>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="trading-project-evidence-grid" aria-label="Evidence and counter-evidence">
        <article className="trading-project-panel">
          <div className="trading-project-section-heading">
            <FileSearch size={22} aria-hidden />
            <div>
              <h2>Evidence and counter-evidence</h2>
              <p>Public examples show the shape of research without exposing private source artifacts.</p>
            </div>
          </div>
          <div className="trading-project-evidence-list">
            {evidenceExamples.map((item) => (
              <div key={item.label}>
                <span>{item.state}</span>
                <strong>{item.label}</strong>
                <p>{item.example}</p>
                <small>{item.note}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="trading-project-panel trading-project-panel--dark">
          <div className="trading-project-section-heading">
            <GitCompareArrows size={22} aria-hidden />
            <div>
              <h2>Replay and review</h2>
              <p>A research day can be reconstructed without publishing private logs.</p>
            </div>
          </div>
          <ol className="trading-project-replay">
            {replaySteps.map((step) => (
              <li key={step}>
                <Clock3 size={15} aria-hidden />
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </article>
      </section>

      <section className="trading-project-boundary-table" aria-labelledby="trading-public-private-title">
        <div className="trading-project-section-heading">
          <Ban size={22} aria-hidden />
          <div>
            <h2 id="trading-public-private-title">Safety boundary</h2>
            <p>The public page demonstrates methodology. The private console remains authenticated and read-only.</p>
          </div>
        </div>
        <div className="trading-project-boundary-table__rows">
          <div className="trading-project-boundary-table__head">
            <span>Public page can show</span>
            <span>Never shown here</span>
          </div>
          {publicPrivateRows.map((row) => (
            <div key={row.publicText}>
              <span>
                <CheckCircle2 size={16} aria-hidden />
                {row.publicText}
              </span>
              <span>
                <LockKeyhole size={16} aria-hidden />
                {row.privateText}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="trading-project-console-preview" aria-labelledby="trading-private-console-title">
        <div className="trading-project-console-preview__copy">
          <div>
            <h2 id="trading-private-console-title">Private console preview</h2>
            <p>
              The owner cockpit organizes sample signals, desks, evidence gates, options scenarios, replay, and source
              health. Access is gated by the private owner session.
            </p>
          </div>
          <div className="trading-project-console-preview__guardrail" aria-label="Private console guardrails">
            {["Read-only", "Owner-gated", "No execution"].map((item) => (
              <span key={item}>
                <CheckCircle2 size={14} aria-hidden />
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="trading-project-console-map" aria-label="Private trading console view map">
          {consolePreview.map((item) => (
            <Link
              key={item.view}
              href={tradingConsoleHref(item.view)}
              prefetch={false}
              className="link-focus"
            >
              <span>{item.state}</span>
              <strong>{item.view}</strong>
              <p>{item.detail}</p>
            </Link>
          ))}
        </div>
        <Link href={tradingConsoleHref()} prefetch={false} className="link-focus">
          <LockKeyhole size={16} aria-hidden />
          Open read-only dashboard
          <ArrowRight size={16} aria-hidden />
        </Link>
      </section>
    </section>
  );
}
