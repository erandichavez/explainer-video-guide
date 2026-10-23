"use client";

import { useState } from "react";

type View = "prep" | "lab";

const VIEWS: { id: View; label: string; note: string }[] = [
  {
    id: "prep",
    label: "Before the Learning Lab",
    note: "Start with the script. Everything else builds on it.",
  },
  {
    id: "lab",
    label: "At the Learning Lab",
    note: "Making materials, filming and editing can all be done in the Learning Lab.",
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
      className={`flex min-h-20 w-full items-center justify-center rounded-2xl border px-5 py-4 text-center text-lg font-medium transition-all duration-300 ${
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

      <div className="mt-10 flex flex-col items-stretch gap-1 lg:flex-row lg:items-center lg:gap-0">
        <div className="lg:w-44">
          <Step active={prep}>
            <span>
              Script
              {prep ? (
                <span className="mt-1 block text-sm font-normal text-accent">
                  Start here
                </span>
              ) : null}
            </span>
          </Step>
        </div>

        <div className="lg:hidden">
          <DownArrow />
        </div>
        <Line arrow className="hidden w-12 lg:flex" />

        <div
          className={`relative flex-1 rounded-3xl border-2 p-5 transition-colors duration-300 sm:p-6 ${
            lab ? "border-accent" : "border-dashed border-line"
          }`}
        >
          {/* Phone: physical and digital side by side, both feeding Edit */}
          <div className="sm:hidden">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-stretch">
                <Step active={lab}>Make physical materials</Step>
                <DownArrow />
                <Step active={lab}>Film</Step>
              </div>
              <div className="flex flex-col items-center">
                <Step active={lab}>Make digital materials</Step>
                <span aria-hidden="true" className="w-0.5 flex-1 bg-muted" />
              </div>
            </div>
            {/* Join both columns, then one arrow into Edit */}
            <div aria-hidden="true" className="relative h-3">
              <span className="absolute inset-y-0 right-[calc(25%-0.1875rem)] left-[calc(25%-0.1875rem)] rounded-b-lg border-x-2 border-b-2 border-muted" />
            </div>
            <DownArrow />
            <Step active={lab}>Edit</Step>
          </div>

          {/* Wider screens: two equal rows that merge into Edit */}
          <div className="hidden auto-rows-fr grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)_3rem_minmax(0,1fr)] gap-y-4 sm:grid">
            <div className="col-start-1 row-start-1 flex">
              <Step active={lab}>Make physical materials</Step>
            </div>
            <Line arrow className="col-start-2 row-start-1" />
            <div className="col-start-3 row-start-1 flex">
              <Step active={lab}>Film</Step>
            </div>

            <div className="col-start-1 row-start-2 flex">
              <Step active={lab}>Make digital materials</Step>
            </div>
            <Line className="col-span-2 col-start-2 row-start-2" />

            {/* Bracket joining both rows, then one arrow into Edit */}
            <div
              aria-hidden="true"
              className="relative col-start-4 row-span-2 row-start-1"
            >
              <span className="absolute top-[calc(25%-0.25rem-1px)] right-1/2 bottom-1/2 left-0 rounded-tr-lg border-t-2 border-r-2 border-muted" />
              <span className="absolute top-1/2 right-1/2 bottom-[calc(25%-0.25rem-1px)] left-0 rounded-br-lg border-r-2 border-b-2 border-muted" />
              <span className="absolute top-1/2 right-0 left-1/2 -translate-y-1/2">
                <Line arrow />
              </span>
            </div>

            <div className="col-start-5 row-span-2 row-start-1 flex items-center">
              <div className="flex w-full">
                <Step active={lab}>Edit</Step>
              </div>
            </div>
          </div>
          {lab ? (
            <p className="mt-6 text-center font-medium text-accent">
              All this can be done in the Learning Lab!
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
