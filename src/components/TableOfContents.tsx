"use client";

import { useEffect, useState } from "react";

type Entry = { id: string; number?: string; label: string; depth: 0 | 1 | 2 };

const ENTRIES: Entry[] = [
  { id: "basics", number: "1", label: "Explainer Video Basics", depth: 0 },
  { id: "example", number: "2", label: "Explainer Video Example", depth: 0 },
  { id: "visuals", number: "2.1", label: "Visuals", depth: 1 },
  { id: "graphics", number: "2.1.1", label: "Graphical Representations", depth: 2 },
  { id: "technical", number: "2.1.2", label: "Technical Graphics", depth: 2 },
  { id: "physical-digital", number: "2.1.3", label: "Physical vs Digital", depth: 2 },
  { id: "audio", number: "2.2", label: "Audio", depth: 1 },
  { id: "narration", number: "2.2.1", label: "Simplifying Your Narration", depth: 2 },
  { id: "jargon", number: "2.2.2", label: "Jargon to Plain Language", depth: 2 },
  { id: "sync", number: "2.3", label: "Syncing Visuals & Audio", depth: 1 },
  { id: "timing", number: "2.3.1", label: "Show and Tell", depth: 2 },
  { id: "sync-tips", number: "2.3.2", label: "Tips for Syncing", depth: 2 },
  { id: "flow", number: "3", label: "Workshop Flow", depth: 0 },
  { id: "before-lab", number: "4", label: "Before the Learning Lab", depth: 0 },
  { id: "script", number: "4.1", label: "Scripting Your Video", depth: 1 },
  { id: "plan-props", number: "4.2", label: "Planning Physical Props", depth: 1 },
  { id: "digital-assets", number: "4.3", label: "Curating Digital Assets", depth: 1 },
  { id: "at-lab", number: "5", label: "At the Learning Lab", depth: 0 },
  { id: "build-props", number: "5.1", label: "Creating Physical Props", depth: 1 },
  { id: "recording-audio", number: "5.2", label: "Recording Audio", depth: 1 },
  { id: "filming", number: "5.3", label: "Filming", depth: 1 },
  { id: "editing", number: "5.4", label: "Editing", depth: 1 },
];

/** Tracks which entry the reader is in: the last one whose top has scrolled past. */
function useActiveId() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = ENTRIES.map((e) => document.getElementById(e.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.25;
      let current: string | null = null;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return active;
}

function Links({
  active,
  onNavigate,
}: {
  active: string | null;
  onNavigate?: () => void;
}) {
  // Highlight the active entry and, more softly, the sections that contain it.
  const activeIndex = ENTRIES.findIndex((e) => e.id === active);
  const ancestors = new Set<string>();
  if (activeIndex >= 0) {
    let depth = ENTRIES[activeIndex].depth;
    for (let i = activeIndex - 1; i >= 0 && depth > 0; i--) {
      if (ENTRIES[i].depth < depth) {
        ancestors.add(ENTRIES[i].id);
        depth = ENTRIES[i].depth;
      }
    }
  }

  return (
    <ol className="space-y-0.5">
      <li>
        <a
          href="#top"
          onClick={onNavigate}
          className="mb-3 block rounded-lg px-2 py-1.5 font-semibold text-foreground hover:text-accent"
        >
          Making an Explainer Video
        </a>
      </li>
      {ENTRIES.map((e) => {
        const isActive = e.id === active;
        const isAncestor = ancestors.has(e.id);
        return (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              onClick={onNavigate}
              aria-current={isActive ? "location" : undefined}
              className={`flex gap-2 rounded-lg px-2 py-1.5 leading-snug transition-colors ${
                e.depth === 0 ? "mt-3 font-medium" : ""
              } ${e.depth === 1 ? "pl-5" : ""} ${e.depth === 2 ? "pl-8 text-[13px]" : ""} ${
                isActive
                  ? "bg-accent/15 text-foreground"
                  : isAncestor
                    ? "text-foreground"
                    : "text-muted hover:bg-surface hover:text-foreground"
              }`}
            >
              <span
                className={`shrink-0 font-mono text-xs leading-[inherit] tabular-nums ${
                  isActive || isAncestor ? "text-accent" : ""
                }`}
              >
                {e.number}
              </span>
              <span>{e.label}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Table of contents: a fixed sidebar on wide screens, and a "Contents"
 * button that opens the same list as a panel on smaller screens.
 */
export default function TableOfContents() {
  const active = useActiveId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <nav
        aria-label="Table of contents"
        className="fixed inset-y-0 left-0 z-20 hidden w-72 overflow-y-auto border-r border-line bg-background px-4 py-8 text-sm xl:block"
      >
        <p className="mb-4 px-2 font-mono text-xs tracking-[0.2em] text-muted uppercase">
          Contents
        </p>
        <Links active={active} />
      </nav>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="toc-panel"
        className="fixed top-4 right-4 z-30 flex items-center gap-2 rounded-full border border-line bg-surface/90 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur hover:border-accent xl:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
        Contents
      </button>

      {open ? (
        <div className="fixed inset-0 z-40 xl:hidden">
          <button
            type="button"
            aria-label="Close contents"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <nav
            id="toc-panel"
            aria-label="Table of contents"
            className="absolute inset-y-0 left-0 w-[min(20rem,85vw)] overflow-y-auto border-r border-line bg-background px-4 py-6 text-sm"
          >
            <div className="mb-4 flex items-center justify-between px-2">
              <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
                Contents
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close contents"
                className="rounded-full p-1 text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <Links active={active} onNavigate={() => setOpen(false)} />
          </nav>
        </div>
      ) : null}
    </>
  );
}
