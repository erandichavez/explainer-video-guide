"use client";

import { useState } from "react";

type Mode = "technical" | "plain";

const EXAMPLES = [
  {
    move: "Translate the term",
    technical:
      "VLBI correlates signals from radio telescopes across the globe to synthesize an Earth-sized aperture.",
    plain:
      "We link radio telescopes all around the world so they work together like one telescope the size of Earth.",
  },
  {
    move: "Use a comparison",
    technical:
      "The ring around M87* has an angular diameter of roughly 42 microarcseconds.",
    plain:
      "From Earth, the black hole looks tiny: about as big as an orange sitting on the Moon would look to us.",
  },
  {
    move: "Cut to the core idea",
    technical:
      "Plasma in the accretion flow is heated by turbulent and viscous dissipation, emitting synchrotron radiation at millimetre wavelengths.",
    plain:
      "Gas swirling around the black hole gets extremely hot, and it glows brightly in radio waves.",
  },
];

export default function JargonTranslator() {
  const [mode, setMode] = useState<Mode>("technical");

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Wording">
        {(
          [
            ["technical", "Jargon"],
            ["plain", "Plain-language"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              mode === id
                ? "border-accent bg-accent text-black"
                : "border-line text-muted hover:border-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid gap-4 lg:grid-cols-3" aria-live="polite">
        {EXAMPLES.map((ex) => (
          <li
            key={ex.move}
            className={`flex flex-col rounded-2xl border p-6 transition-colors duration-300 ${
              mode === "plain" ? "border-accent bg-accent/5" : "border-line bg-surface"
            }`}
          >
            <p
              className={`font-mono text-xs tracking-[0.2em] uppercase transition-colors ${
                mode === "plain" ? "text-accent" : "text-muted"
              }`}
            >
              {mode === "plain" ? ex.move : "Jargon-heavy"}
            </p>
            <p className="mt-4 text-lg text-pretty">
              “{mode === "plain" ? ex.plain : ex.technical}”
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
