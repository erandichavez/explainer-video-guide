"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 12; // seconds of pretend timeline

type Level = 1 | 2 | 3;
type SpeechClip = {
  start: number;
  end: number;
  idea: string;
  level: Level;
  label: string;
};
type VisualClip = {
  start: number;
  end: number;
  shows: string[]; // ideas this visual illustrates
  level: Level;
  label: string;
};
type Version = {
  id: string;
  tab: string;
  note: string;
  speech: SpeechClip[];
  visuals: VisualClip[];
};

const GOOD_VISUALS: VisualClip[] = [
  { start: 0, end: 3, shows: ["bh"], level: 1, label: "Black hole prop" },
  {
    start: 3,
    end: 6,
    shows: ["bh", "plasma"],
    level: 1,
    label: "Add plasma ring",
  },
  {
    start: 6,
    end: 9,
    shows: ["vlbi"],
    level: 2,
    label: "Paper Earth + telescopes",
  },
  {
    start: 9,
    end: 12,
    shows: ["vlbi", "eht"],
    level: 3,
    label: "EHT network map",
  },
];

const VERSIONS: Version[] = [
  {
    id: "good",
    tab: "Complementary",
    note: "Every new idea gets a visual, and the visuals get more detailed as the narration does.",
    speech: [
      {
        start: 0,
        end: 3,
        idea: "bh",
        level: 1,
        label: "“M87 has a black hole at its centre.”",
      },
      {
        start: 3,
        end: 6,
        idea: "plasma",
        level: 1,
        label: "“Glowing plasma swirls around it.”",
      },
      {
        start: 6,
        end: 9,
        idea: "vlbi",
        level: 2,
        label: "“Telescopes around the world link up…”",
      },
      {
        start: 9,
        end: 12,
        idea: "eht",
        level: 3,
        label: "“…into one Earth-sized telescope: the EHT.”",
      },
    ],
    visuals: GOOD_VISUALS,
  },
  {
    id: "crowded",
    tab: "Too many ideas",
    note: "Six ideas, two visuals. Most of the narration has nothing on screen to anchor it.",
    speech: [
      {
        start: 0,
        end: 2,
        idea: "bh",
        level: 1,
        label: "“M87 has a black hole…”",
      },
      {
        start: 2,
        end: 4,
        idea: "plasma",
        level: 1,
        label: "“…ringed by plasma…”",
      },
      {
        start: 4,
        end: 6,
        idea: "mass",
        level: 2,
        label: "“…6.5 billion Suns in mass…”",
      },
      {
        start: 6,
        end: 8,
        idea: "distance",
        level: 2,
        label: "“…55 million light-years away.”",
      },
      {
        start: 8,
        end: 10,
        idea: "vlbi",
        level: 2,
        label: "“Telescopes link up…”",
      },
      { start: 10, end: 12, idea: "eht", level: 3, label: "“…as the EHT.”" },
    ],
    visuals: [
      { start: 0, end: 6, shows: ["bh"], level: 1, label: "Black hole prop" },
      {
        start: 6,
        end: 12,
        shows: ["vlbi"],
        level: 2,
        label: "Paper Earth + telescopes",
      },
    ],
  },
  {
    id: "outgrown",
    tab: "Speech outgrows the visual",
    note: "The narration turns technical, but the screen still shows the simple prop from the start.",
    speech: [
      {
        start: 0,
        end: 3,
        idea: "bh",
        level: 1,
        label: "“M87 has a black hole at its centre.”",
      },
      {
        start: 3,
        end: 6,
        idea: "plasma",
        level: 1,
        label: "“Glowing plasma swirls around it.”",
      },
      {
        start: 6,
        end: 9,
        idea: "bh",
        level: 3,
        label: "“Gravity bends its light into a photon ring…”",
      },
      {
        start: 9,
        end: 12,
        idea: "bh",
        level: 3,
        label: "“…sized as relativity predicts for a spinning black hole.”",
      },
    ],
    visuals: [
      { start: 0, end: 3, shows: ["bh"], level: 1, label: "Black hole prop" },
      {
        start: 3,
        end: 12,
        shows: ["bh", "plasma"],
        level: 1,
        label: "Plasma ring prop",
      },
    ],
  },
];

type Status = "match" | "no-visual" | "too-complex";

const STATUS: Record<Status, { label: string; good: boolean }> = {
  match: { label: "Complementary", good: true },
  "no-visual": { label: "No visual for this idea", good: false },
  "too-complex": { label: "Speech outgrows the visual", good: false },
};

function statusOf(speech?: SpeechClip, visual?: VisualClip): Status {
  if (!speech || !visual || !visual.shows.includes(speech.idea))
    return "no-visual";
  return speech.level > visual.level ? "too-complex" : "match";
}

const at = <T extends { start: number; end: number }>(clips: T[], t: number) =>
  clips.find((c) => t >= c.start && t < c.end);

function Dots({ level, large = false }: { level: Level; large?: boolean }) {
  return (
    <span
      className={`flex ${large ? "gap-1" : "gap-0.5"}`}
      aria-label={`Complexity ${level} of 3`}
    >
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`rounded-full ${large ? "h-2.5 w-2.5" : "h-1.5 w-1.5"} ${n <= level ? "bg-current" : "bg-current opacity-25"}`}
        />
      ))}
    </span>
  );
}

const LEVELS: {
  level: Level;
  name: string;
  speech: string;
  visual: string;
  example: string;
}[] = [
  {
    level: 1,
    name: "Simple",
    speech: "One everyday idea in plain words, with no jargon.",
    visual: "A single prop or shape, with nothing extra.",
    example: "“M87 has a black hole” over the black hole prop.",
  },
  {
    level: 2,
    name: "Added detail",
    speech:
      "Builds on what’s already shown: a new term, a number or a connection.",
    visual: "More parts, labels or connections added to what’s on screen.",
    example: "“Telescopes link up” over the paper Earth with telescopes.",
  },
  {
    level: 3,
    name: "Technical",
    speech: "The full scientific picture, with precise terms and quantities.",
    visual: "A real scientific figure, map or data.",
    example: "“The EHT” over the EHT network map.",
  },
];

function ComplexityKey() {
  return (
    <div className="mb-8">
      <h4 className="text-xl font-semibold">Reading the dots</h4>
      <p className="mt-2 max-w-3xl text-muted">
        Every clip on the timeline below, whether narration or visual, has a row
        of three dots. The number of filled dots shows how complex that piece
        is.
      </p>
      <ol className="mt-5 grid gap-4 md:grid-cols-3">
        {LEVELS.map((l) => (
          <li
            key={l.level}
            className="rounded-2xl border border-line bg-surface p-5"
          >
            <div className="flex items-center gap-3 text-accent">
              <Dots level={l.level} large />
              <span className="font-semibold text-foreground">{l.name}</span>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-xs tracking-wide text-muted uppercase">
                  Narration
                </dt>
                <dd>{l.speech}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-muted uppercase">
                  Visual
                </dt>
                <dd>{l.visual}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-muted uppercase">
                  Example
                </dt>
                <dd className="text-muted">{l.example}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
      <p className="mt-5 max-w-3xl rounded-2xl border-l-2 border-accent bg-surface-2 px-5 py-4">
        <span className="font-semibold">The rule:</span> a visual should have at
        least as many dots as the narration playing over it. When the narration
        has more dots than the visual, add detail to the visual, or simplify the
        sentence.
      </p>
    </div>
  );
}

function Track({
  name,
  clips,
  current,
  flagged,
  tone,
}: {
  name: string;
  clips: (SpeechClip | VisualClip)[];
  current?: SpeechClip | VisualClip;
  flagged?: boolean;
  tone: "audio" | "visual";
}) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr] items-center gap-3 sm:grid-cols-[6rem_1fr]">
      <span className="text-xs font-medium tracking-wide text-muted uppercase">
        {name}
      </span>
      <div className="relative h-16 rounded-lg bg-surface-2">
        {clips.map((c) => {
          const active = current === c;
          const color = !active
            ? "border-line bg-surface text-muted"
            : flagged
              ? "border-warn bg-warn/15 text-foreground"
              : tone === "audio"
                ? "border-foreground bg-foreground/15 text-foreground"
                : "border-accent bg-accent/20 text-foreground";
          return (
            <div
              key={`${c.start}-${c.label}`}
              className={`absolute inset-y-1 flex flex-col justify-between overflow-hidden rounded-md border px-2 py-1.5 text-xs leading-tight transition-colors duration-300 sm:text-sm ${color}`}
              style={{
                left: `calc(${(c.start / DURATION) * 100}% + 2px)`,
                width: `calc(${((c.end - c.start) / DURATION) * 100}% - 4px)`,
              }}
            >
              <span className="line-clamp-2">{c.label}</span>
              <Dots level={c.level} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const iconProps = {
  viewBox: "0 0 24 24",
  className: "h-3.5 w-3.5 shrink-0",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function EarIcon() {
  return (
    <svg {...iconProps}>
      <path d="M6 9a6 6 0 1 1 12 0c0 5-5 5.5-5 9.5a3.5 3.5 0 0 1-7 0" />
      <path d="M15 9a3 3 0 0 0-6 0v1a2 2 0 1 1 0 4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg {...iconProps}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function SyncTimeline() {
  const [versionId, setVersionId] = useState(VERSIONS[0].id);
  const [t, setT] = useState(1);
  const [playing, setPlaying] = useState(false);
  const last = useRef<number | null>(null);

  // Autoplay unless the viewer prefers reduced motion.
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlaying(true);
    }
  }, []);

  useEffect(() => {
    if (!playing) {
      last.current = null;
      return;
    }
    let frame = 0;
    const tick = (now: number) => {
      if (last.current !== null) {
        // Cap the step so returning to a background tab doesn't jump ahead.
        const dt = Math.min((now - last.current) / 1000, 0.1);
        setT((prev) => (prev + dt) % DURATION);
      }
      last.current = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const version = VERSIONS.find((v) => v.id === versionId)!;
  const hearing = at(version.speech, t);
  const seeing = at(version.visuals, t);
  const status = statusOf(hearing, seeing);
  const { label, good } = STATUS[status];

  return (
    <div>
      <ComplexityKey />
      <div className="rounded-3xl border border-line bg-surface p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="Version"
            className="flex flex-wrap gap-2"
          >
            {VERSIONS.map((v) => (
              <button
                key={v.id}
                role="tab"
                aria-selected={versionId === v.id}
                onClick={() => setVersionId(v.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  versionId === v.id
                    ? "border-accent bg-accent text-black"
                    : "border-line text-muted hover:border-foreground hover:text-foreground"
                }`}
              >
                {v.tab}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-full border border-line px-4 py-2 text-sm hover:border-foreground"
          >
            {playing ? "Pause" : "Play"}
          </button>
        </div>

        <p className="mt-4 text-muted">{version.note}</p>

        <div className="relative mt-6 space-y-3">
          <Track
            name="Narration"
            clips={version.speech}
            current={hearing}
            flagged={!good}
            tone="audio"
          />
          <Track
            name="Visuals"
            clips={version.visuals}
            current={seeing}
            flagged={!good}
            tone="visual"
          />
          {/* Playhead, drawn over the track area only */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 left-[calc(4.5rem+0.75rem)] sm:left-[calc(6rem+0.75rem)]"
          >
            <div
              className="absolute -inset-y-2 w-0.5 -translate-x-1/2 bg-foreground"
              style={{ left: `${(t / DURATION) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-[4.5rem_1fr] items-center gap-3 sm:grid-cols-[6rem_1fr]">
          <span />
          {/* The visible track and thumb are drawn here, positioned with the
              same percentage as the playhead, so the two can never drift.
              The real range input sits on top, transparent, for dragging and
              keyboard control. It is widened by half its 16px thumb on each
              side so the pointer maps to the same time as the drawn thumb. */}
          <div className="relative h-5">
            <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line" />
            <div
              className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-accent"
              style={{ width: `${(t / DURATION) * 100}%` }}
            />
            <input
              type="range"
              min={0}
              max={DURATION}
              step="any"
              value={t}
              onChange={(e) => {
                setPlaying(false);
                setT(Number(e.target.value));
              }}
              aria-label="Scrub the timeline"
              className="timeline-range peer absolute top-0 -left-2 w-[calc(100%+1rem)] opacity-0"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent peer-focus-visible:ring-4 peer-focus-visible:ring-accent/40"
              style={{ left: `${(t / DURATION) * 100}%` }}
            />
          </div>
        </div>

        <div
          className="mt-6 grid gap-3 rounded-2xl bg-surface-2 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center"
          aria-live="polite"
        >
          <p className="text-sm">
            <span className="flex items-center gap-1.5 text-xs tracking-wide text-muted uppercase">
              <EarIcon />
              Viewer hears
            </span>
            {hearing?.label ?? "—"}
          </p>
          <p className="text-sm">
            <span className="flex items-center gap-1.5 text-xs tracking-wide text-muted uppercase">
              <EyeIcon />
              Viewer sees
            </span>
            {seeing?.label ?? "—"}
          </p>
          <span
            className={`justify-self-start rounded-full px-3 py-1 text-sm font-semibold sm:justify-self-end ${
              good ? "bg-accent text-black" : "bg-warn/20 text-warn"
            }`}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
