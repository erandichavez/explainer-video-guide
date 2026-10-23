import type { ReactNode } from "react";

// Small inline illustrations for the Basics section. Colours come from the
// theme tokens so they match the rest of the page.

export function ConceptTile({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <figure className="flex flex-col items-center rounded-2xl border border-line bg-surface p-4 pb-3">
      <div className="flex aspect-[3/2] w-full items-center justify-center">
        {children}
      </div>
      <figcaption className="mt-2 text-sm font-semibold tracking-wide text-accent">
        {label}
      </figcaption>
    </figure>
  );
}

const svgProps = {
  viewBox: "0 0 120 80",
  className: "h-full w-full",
  "aria-hidden": true,
} as const;

/** A screen showing a black hole: what the viewer sees. */
export function VisualsGraphic() {
  return (
    <svg {...svgProps}>
      <rect
        x="18"
        y="10"
        width="84"
        height="52"
        rx="6"
        fill="var(--surface-2)"
        stroke="var(--muted)"
        strokeWidth="2"
      />
      <circle
        cx="60"
        cy="36"
        r="15"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="6"
        opacity="0.9"
      />
      <circle cx="60" cy="36" r="10" fill="#000" />
      <path d="M52 62v8M68 62v8M44 71h32" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** A waveform: what the viewer hears. */
export function AudioGraphic() {
  const heights = [14, 26, 40, 22, 50, 34, 44, 20, 30, 12];
  return (
    <svg {...svgProps}>
      {heights.map((h, i) => (
        <rect
          key={i}
          x={13 + i * 10}
          y={40 - h / 2}
          width="5"
          height={h}
          rx="2.5"
          fill="var(--accent)"
        />
      ))}
    </svg>
  );
}

/** A → B → C: the order ideas arrive in. */
export function NarrativeGraphic() {
  return (
    <svg {...svgProps}>
      {["A", "B", "C"].map((l, i) => {
        const x = 6 + i * 40;
        return (
          <g key={l}>
            <rect
              x={x}
              y="26"
              width="28"
              height="28"
              rx="6"
              fill="var(--foreground)"
            />
            <text
              x={x + 14}
              y="45"
              textAnchor="middle"
              fontSize="14"
              fontWeight="600"
              fill="var(--background)"
            >
              {l}
            </text>
            {i < 2 ? (
              <path
                d={`M${x + 31} 40h6m-3-3 3 3-3 3`}
                stroke="var(--muted)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

/** One idea growing into a connected network: simple to complex. */
export function PedagogyGraphic() {
  const stages: { nodes: [number, number][]; edges: [number, number][] }[] = [
    { nodes: [[0, 0]], edges: [] },
    {
      nodes: [
        [0, -9],
        [-8, 6],
        [8, 6],
      ],
      edges: [
        [0, 1],
        [1, 2],
        [2, 0],
      ],
    },
    {
      nodes: [
        [0, -14],
        [-13, -5],
        [13, -5],
        [-9, 11],
        [9, 11],
        [0, 1],
      ],
      edges: [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 4],
        [3, 4],
        [5, 0],
        [5, 3],
        [5, 4],
        [1, 5],
        [2, 5],
      ],
    },
  ];
  const centres = [16, 52, 96];
  return (
    <svg {...svgProps}>
      {stages.map((s, i) => {
        const cx = centres[i];
        return (
          <g key={i} transform={`translate(${cx} 40)`}>
            {s.edges.map(([a, b], j) => (
              <line
                key={j}
                x1={s.nodes[a][0]}
                y1={s.nodes[a][1]}
                x2={s.nodes[b][0]}
                y2={s.nodes[b][1]}
                stroke="var(--muted)"
                strokeWidth="1.5"
              />
            ))}
            {s.nodes.map(([x, y], j) => (
              <circle key={j} cx={x} cy={y} r="3.5" fill="var(--accent)" />
            ))}
          </g>
        );
      })}
      <path
        d="M27 40h8m-3-3 3 3-3 3M68 40h8m-3-3 3 3-3 3"
        stroke="var(--muted)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
