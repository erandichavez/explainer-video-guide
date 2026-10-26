"use client";

import { useState } from "react";

type View = "prep" | "lab";

const VIEWS: { id: View; label: string; note: string }[] = [
  {
    id: "prep",
    label: "Before the Learning Lab",
    note: "Write your script, then plan your physical props and gather your digital assets. Everything else builds on the script.",
  },
  {
    id: "lab",
    label: "At the Learning Lab",
    note: "Build your props, record and film, then bring it all together in the edit. All of this can be done in the Learning Lab!",
  },
];

function Step({
  children,
  active,
}: {
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <div
      className={`flex min-h-20 w-full items-center justify-center rounded-2xl border px-3 py-3 text-center text-base font-medium text-balance transition-all duration-300 ${
        active
          ? "border-accent bg-accent/10 text-foreground"
          : "border-line text-muted"
      }`}
    >
      {children}
    </div>
  );
}

/** Horizontal connector; fills its grid cell and centres vertically. */
function Line({
  arrow = false,
  className = "",
}: {
  arrow?: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`flex items-center ${className}`}>
      <span className="h-0.5 flex-1 bg-muted" />
      {arrow ? (
        <span className="-ml-px h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-muted" />
      ) : null}
    </div>
  );
}

function DownArrow() {
  return (
    <div aria-hidden="true" className="flex flex-col items-center py-1">
      <span className="h-4 w-0.5 bg-muted" />
      <span className="h-0 w-0 border-x-[6px] border-t-[9px] border-x-transparent border-t-muted" />
    </div>
  );
}

/** Arrowhead at the right edge of a cell, centred on its own height. */
function Head({ className }: { className: string }) {
  return (
    <span
      className={`absolute right-0 h-0 w-0 -translate-y-1/2 border-y-[6px] border-l-[9px] border-y-transparent border-l-muted ${className}`}
    />
  );
}

function ScriptStep({ active }: { active: boolean }) {
  return (
    <Step active={active}>
      <span>
        Script
        {active ? (
          <span className="mt-1 block text-sm font-normal text-accent">
            Start here
          </span>
        ) : null}
      </span>
    </Step>
  );
}

/** Stacked layout: a labelled box around one stage. */
function Stage({
  label,
  active,
  children,
}: {
  label: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-3xl border-2 p-4 transition-colors duration-300 sm:p-5 ${
        active ? "border-accent bg-accent/5" : "border-dashed border-line"
      }`}
    >
      <p
        className={`mb-4 font-mono text-xs tracking-[0.2em] uppercase ${
          active ? "text-accent" : "text-muted"
        }`}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

/** Wide layout: a stage's box, placed behind its grid columns. */
function StagePanel({
  label,
  active,
  className,
}: {
  label: string;
  active: boolean;
  className: string;
}) {
  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none row-start-1 row-end-4 -m-4 rounded-3xl border-2 transition-colors duration-300 ${className} ${
          active ? "border-accent bg-accent/5" : "border-dashed border-line"
        }`}
      />
      <p
        className={`row-start-1 font-mono text-xs tracking-[0.2em] uppercase ${className} ${
          active ? "text-accent" : "text-muted"
        }`}
      >
        {label}
      </p>
    </>
  );
}

export default function WorkshopFlow() {
  const [view, setView] = useState<View>("prep");
  const prep = view === "prep";
  const lab = view === "lab";

  return (
    <div>
      <div role="tablist" className="flex flex-wrap gap-2">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={view === v.id}
            onClick={() => setView(v.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              view === v.id
                ? "border-accent bg-accent text-black"
                : "border-line text-muted hover:border-foreground hover:text-foreground"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <p className="mt-5 text-muted" aria-live="polite">
        {VIEWS.find((v) => v.id === view)?.note}
      </p>

      {/* Phones and tablets: the two stages stacked */}
      <div className="mt-10 lg:hidden">
        <Stage label="Before the Learning Lab" active={prep}>
          <ScriptStep active={prep} />
          {/* Split from Script into both columns */}
          <div aria-hidden="true" className="relative h-4">
            <span className="absolute top-0 left-1/2 h-1/2 w-0.5 -translate-x-1/2 bg-muted" />
            <span className="absolute top-1/2 right-[calc(25%-0.1875rem)] bottom-0 left-[calc(25%-0.1875rem)] rounded-t-lg border-x-2 border-t-2 border-muted" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <DownArrow />
            <DownArrow />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Step active={prep}>Plan physical props</Step>
            <Step active={prep}>Curate digital assets</Step>
          </div>
        </Stage>
        {/* Inset to match the stage padding + border so arrows sit on the column centres */}
        <div className="grid grid-cols-2 gap-3 px-[calc(1rem+2px)] sm:px-[calc(1.25rem+2px)]">
          <DownArrow />
          <DownArrow />
        </div>
        <Stage label="At the Learning Lab" active={lab}>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-stretch">
              <Step active={lab}>Create physical props</Step>
              <DownArrow />
              <Step active={lab}>Record audio &amp; film</Step>
            </div>
            <div className="flex flex-col items-center">
              <span aria-hidden="true" className="w-0.5 flex-1 bg-muted" />
            </div>
          </div>
          {/* Join both columns, then one arrow into Edit */}
          <div aria-hidden="true" className="relative h-3">
            <span className="absolute inset-y-0 right-[calc(25%-0.1875rem)] left-[calc(25%-0.1875rem)] rounded-b-lg border-x-2 border-b-2 border-muted" />
          </div>
          <DownArrow />
          <Step active={lab}>Edit</Step>
        </Stage>
      </div>

      {/* Wide screens: one grid, so the physical row and the digital row
          line up across both stages. Rows 2 and 3 are equal height with a
          1rem gap, so each row's centre sits at 25% − 0.25rem of the pair. */}
      <div className="mt-10 hidden p-4 lg:block">
        <div className="grid grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1.1fr)_3rem_minmax(0,1.1fr)_2.5rem_minmax(0,1fr)_3rem_minmax(0,0.8fr)] grid-rows-[auto_1fr_1fr] gap-y-4">
          {/* Stage panels, drawn behind the steps */}
          <StagePanel
            className="col-start-1 col-end-4"
            label="Before the Learning Lab"
            active={prep}
          />
          <StagePanel
            className="col-start-5 col-end-10"
            label="At the Learning Lab"
            active={lab}
          />

          {/* Script, splitting into the physical and digital rows */}
          <div className="col-start-1 row-span-2 row-start-2 flex items-center">
            <ScriptStep active={prep} />
          </div>
          <div
            aria-hidden="true"
            className="relative col-start-2 row-span-2 row-start-2"
          >
            <span className="absolute top-1/2 right-1/2 left-0 h-0.5 -translate-y-1/2 bg-muted" />
            <span className="absolute top-[calc(25%-0.25rem-1px)] right-0 bottom-1/2 left-1/2 rounded-tl-lg border-t-2 border-l-2 border-muted" />
            <span className="absolute top-1/2 right-0 bottom-[calc(25%-0.25rem-1px)] left-1/2 rounded-bl-lg border-b-2 border-l-2 border-muted" />
            <Head className="top-[calc(25%-0.25rem)]" />
            <Head className="top-[calc(75%+0.25rem)]" />
          </div>

          {/* Physical row */}
          <div className="col-start-3 row-start-2 flex">
            <Step active={prep}>Plan physical props</Step>
          </div>
          <Line arrow className="col-start-4 row-start-2" />
          <div className="col-start-5 row-start-2 flex">
            <Step active={lab}>Create physical props</Step>
          </div>
          <Line arrow className="col-start-6 row-start-2" />
          <div className="col-start-7 row-start-2 flex">
            <Step active={lab}>Record audio &amp; film</Step>
          </div>

          {/* Digital row: assets carry straight through to the edit */}
          <div className="col-start-3 row-start-3 flex">
            <Step active={prep}>Curate digital assets</Step>
          </div>
          <Line className="col-span-4 col-start-4 row-start-3" />

          {/* Both rows merge into Edit */}
          <div
            aria-hidden="true"
            className="relative col-start-8 row-span-2 row-start-2"
          >
            <span className="absolute top-[calc(25%-0.25rem-1px)] right-1/2 bottom-1/2 left-0 rounded-tr-lg border-t-2 border-r-2 border-muted" />
            <span className="absolute top-1/2 right-1/2 bottom-[calc(25%-0.25rem-1px)] left-0 rounded-br-lg border-r-2 border-b-2 border-muted" />
            <span className="absolute top-1/2 right-0 left-1/2 -translate-y-1/2">
              <Line arrow />
            </span>
          </div>
          <div className="col-start-9 row-span-2 row-start-2 flex items-center">
            <Step active={lab}>Edit</Step>
          </div>
        </div>
      </div>
    </div>
  );
}
