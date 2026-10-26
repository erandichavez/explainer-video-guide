"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 16; // seconds of pretend timeline

// The same four-part explanation is used in every version; only the timing
// of narration relative to visuals changes. This mirrors the comparison in
// Mayer's temporal contiguity research: simultaneous vs. successive.
const IDEAS = [
  {
    id: "bh",
    say: "“M87 has a black hole at its centre.”",
    show: "Black hole prop",
  },
  {
    id: "plasma",
    say: "“Glowing plasma swirls around it.”",
    show: "Add plasma ring",
  },
  {
    id: "vlbi",
    say: "“Telescopes around the world link up…”",
    show: "Paper Earth + telescopes",
  },
  {
    id: "eht",
    say: "“…into one Earth-sized telescope.”",
    show: "EHT network map",
  },
];

type Clip = { id: string; start: number; end: number; label: string };

/** Lay the four ideas end to end, starting at `from`, each `each` seconds long. */
const lay = (from: number, each: number, field: "say" | "show"): Clip[] =>
  IDEAS.map((idea, i) => ({
    id: idea.id,
    start: from + i * each,
    end: from + (i + 1) * each,
    label: idea[field],
  }));

type Version = {
  id: string;
  tab: string;
  note: string;
  speech: Clip[];
  visuals: Clip[];
};

const VERSIONS: Version[] = [
  {
    id: "together",
    tab: "Together",
    note: "Each visual appears while you describe it, so viewers connect the words and the picture as they go.",
    speech: lay(0, 4, "say"),
    visuals: lay(0, 4, "show"),
  },
  {
    id: "narration-first",
    tab: "Narration first",
    note: "The whole explanation is heard first, then the visuals play in silence. Viewers have to hold the words in memory until the matching picture arrives.",
    speech: lay(0, 2, "say"),
    visuals: lay(8, 2, "show"),
  },
  {
    id: "visuals-first",
    tab: "Visuals first",
    note: "The visuals play first, then the narration. Viewers see each picture before they know what it shows, and have to remember it until the explanation catches up.",
    speech: lay(8, 2, "say"),
    visuals: lay(0, 2, "show"),
  },
];

const at = (clips: Clip[], t: number) =>
  clips.find((c) => t >= c.start && t < c.end);

const secs = (n: number) => {
  const r = Math.max(1, Math.round(n));
  return `${r} second${r === 1 ? "" : "s"}`;
};

/** What the viewer is left juggling when words and picture are apart. */
function gapNote(version: Version, t: number, hearing?: Clip, seeing?: Clip) {
  if (hearing && seeing && hearing.id === seeing.id) return null;
  if (seeing) {
    const words = version.speech.find((c) => c.id === seeing.id)!;
    return words.end <= t
      ? `To make sense of this picture, the viewer has to recall words they heard ${secs(t - words.start)} ago.`
      : `The viewer won’t hear what this picture shows for another ${secs(words.start - t)}.`;
  }
  if (hearing) {
    const picture = version.visuals.find((c) => c.id === hearing.id)!;
    return picture.end <= t
      ? `The matching picture was on screen ${secs(t - picture.start)} ago; the viewer has to recall it.`
      : `The matching picture won’t appear for another ${secs(picture.start - t)}; the viewer has to hold these words until then.`;
  }
  return null;
}

function Track({
  name,
  clips,
  current,
  together,
  tone,
}: {
  name: string;
  clips: Clip[];
  current?: Clip;
  together: boolean;
  tone: "audio" | "visual";
}) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr] items-center gap-3 sm:grid-cols-[6rem_1fr]">
      <span className="text-xs font-medium tracking-wide text-muted uppercase">
        {name}
      </span>
      <div className="relative h-14 rounded-lg bg-surface-2">
        {clips.map((c) => {
          const active = current === c;
          const color = !active
            ? "border-line bg-surface text-muted"
            : !together
              ? "border-warn bg-warn/15 text-foreground"
              : tone === "audio"
                ? "border-foreground bg-foreground/15 text-foreground"
                : "border-accent bg-accent/20 text-foreground";
          return (
            <div
              key={`${c.start}-${c.label}`}
              className={`absolute inset-y-1 flex items-center overflow-hidden rounded-md border px-2 text-xs leading-tight transition-colors duration-300 sm:text-sm ${color}`}
              style={{
                left: `calc(${(c.start / DURATION) * 100}% + 2px)`,
                width: `calc(${((c.end - c.start) / DURATION) * 100}% - 4px)`,
              }}
            >
              <span className="line-clamp-2">{c.label}</span>
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
  const together = !!hearing && !!seeing && hearing.id === seeing.id;
  const label = together
    ? "Heard and seen together"
    : hearing
      ? "Heard, but not seen"
      : "Seen, but not heard";
  const note = gapNote(version, t, hearing, seeing);

  return (
    <div>
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
            together={together}
            tone="audio"
          />
          <Track
            name="Visuals"
            clips={version.visuals}
            current={seeing}
            together={together}
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
              together ? "bg-accent text-black" : "bg-warn/20 text-warn"
            }`}
          >
            {label}
          </span>
          {note ? (
            <p className="text-sm text-warn sm:col-span-3">{note}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
