"use client";

import Image from "next/image";
import { useState } from "react";
import grmhd from "@/assets/grmhd-simulation.jpg";
import grmhdSimplified from "@/assets/grmhd-simplified.jpg";
import paperBlackHole from "@/assets/paper-black-hole.jpg";

const STEPS = [
  {
    label: "Start technical",
    note: "A simulated image of M87 at 230 GHz: axes, units, a colour bar. Accurate, but a lot to take in at once.",
  },
  {
    label: "Strip it down",
    note: "Drop the axes and labels. What's left is the shape the viewer actually needs to notice.",
  },
  {
    label: "Point & rebuild",
    note: "Point at the two features that matter, then rebuild them as a simple paper prop: a black hole surrounded by plasma.",
  },
];

export default function SimplifyStepper() {
  const [step, setStep] = useState(0);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Simplification steps"
        className="flex flex-wrap gap-2"
      >
        {STEPS.map((s, i) => (
          <button
            key={s.label}
            role="tab"
            aria-selected={step === i}
            onClick={() => setStep(i)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              step === i
                ? "border-accent bg-accent text-black"
                : "border-line text-muted hover:border-foreground hover:text-foreground"
            }`}
          >
            <span className="mr-2 opacity-60">{i + 1}</span>
            {s.label}
          </button>
        ))}
      </div>

      <p className="mt-5 max-w-2xl text-muted" aria-live="polite">
        {STEPS[step].note}
      </p>

      <div className="mt-8 grid items-center gap-8 md:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <Image
            src={grmhd}
            alt="GRMHD simulation of M87 at 230 GHz, with axes and colour bar"
            placeholder="blur"
            sizes="(min-width: 768px) 28rem, 100vw"
            className={`absolute inset-0 h-full w-full rounded-xl bg-white object-contain transition-opacity duration-500 ${
              step === 0 ? "opacity-100" : "opacity-0"
            }`}
          />
          <Image
            src={grmhdSimplified}
            alt="The same simulation with the axes removed"
            placeholder="blur"
            sizes="(min-width: 768px) 28rem, 100vw"
            className={`absolute inset-[8%] h-[84%] w-[84%] rounded-xl object-cover transition-opacity duration-500 ${
              step === 0 ? "opacity-0" : "opacity-100"
            }`}
          />
          <svg
            viewBox="0 0 100 100"
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 h-full w-full text-accent transition-opacity duration-500 ${
              step === 2 ? "opacity-100" : "opacity-0"
            }`}
          >
            <defs>
              <marker
                id="head"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M0 0 10 5 0 10z" fill="currentColor" />
              </marker>
            </defs>
            <line
              x1="0"
              y1="50"
              x2="44"
              y2="50"
              stroke="currentColor"
              strokeWidth="2"
              markerEnd="url(#head)"
            />
            <line
              x1="50"
              y1="100"
              x2="50"
              y2="80"
              stroke="currentColor"
              strokeWidth="2"
              markerEnd="url(#head)"
            />
          </svg>
        </div>

        <div
          className={`transition-all duration-500 ${
            step === 2
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          }`}
          aria-hidden={step !== 2}
        >
          <Image
            src={paperBlackHole}
            alt="Paper prop: a black circle labelled 'black hole' inside a red ring labelled 'plasma'"
            placeholder="blur"
            sizes="(min-width: 768px) 28rem, 100vw"
            className="mx-auto h-auto w-full max-w-sm rounded-xl"
          />
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-30"
        >
          ← Back
        </button>
        <button
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
