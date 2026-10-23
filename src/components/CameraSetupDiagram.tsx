// Side view of the Learning Lab two-camera setup, redrawn from the
// hand sketch: camera #1 films the presenter's face, camera #2 looks
// straight down at the props and hands on the desk.

const ink = "var(--foreground)";
const faint = "var(--muted)";
const accent = "var(--accent)";

function Camera({
  x,
  y,
  facing,
}: {
  x: number;
  y: number;
  facing: "right" | "down";
}) {
  // Body is 54×36; the lens sticks out on the facing side.
  const lens =
    facing === "right"
      ? `M${x + 54} ${y + 10} L${x + 68} ${y + 4} L${x + 68} ${y + 32} L${x + 54} ${y + 26} Z`
      : `M${x + 17} ${y + 36} L${x + 11} ${y + 50} L${x + 43} ${y + 50} L${x + 37} ${y + 36} Z`;
  return (
    <g stroke={ink} strokeWidth="2.5" strokeLinejoin="round">
      <rect x={x} y={y} width="54" height="36" rx="6" fill="var(--surface-2)" />
      <path d={lens} fill="var(--surface-2)" />
      <circle cx={x + 12} cy={y + 10} r="3" fill={accent} stroke="none" />
    </g>
  );
}

const NECK = "M380 178 L382 196";
const TORSO = "M383 202 L392 282";
const ARM = "M385 210 L351 236 L296 236";
const LEG = "M392 284 L346 288 L346 362 L332 362";

export default function CameraSetupDiagram() {
  return (
    <svg
      viewBox="0 0 480 400"
      role="img"
      aria-labelledby="setup-title setup-desc"
      className="h-auto w-full"
      fontFamily="var(--font-geist-sans), system-ui, sans-serif"
    >
      <title id="setup-title">The two-camera setup</title>
      <desc id="setup-desc">
        Side view of a person sitting at a desk with props under their hands.
        Camera 1, on a tripod to the left, points at the person&apos;s face.
        Camera 2 hangs above the desk and points straight down at the props and
        hands.
      </desc>

      {/* Fields of view */}
      <path d="M262 112 L196 245 L328 245 Z" fill={accent} opacity="0.1" />
      <path
        d="M262 112 L196 245 M262 112 L328 245"
        stroke={accent}
        strokeWidth="2"
        strokeDasharray="6 6"
        fill="none"
      />
      <path d="M110 190 L380 134 L380 220 Z" fill={accent} opacity="0.1" />
      <path
        d="M110 190 L380 134 M110 190 L380 220"
        stroke={accent}
        strokeWidth="2"
        strokeDasharray="6 6"
        fill="none"
      />

      {/* Floor */}
      <line x1="16" y1="368" x2="464" y2="368" stroke={faint} strokeWidth="2" />

      {/* Overhead mount + camera #2 */}
      <line x1="262" y1="0" x2="262" y2="62" stroke={faint} strokeWidth="3" />
      <Camera x={235} y={62} facing="down" />

      {/* Tripod + camera #1 */}
      <g stroke={faint} strokeWidth="2.5" strokeLinecap="round">
        <line x1="69" y1="208" x2="69" y2="290" />
        <line x1="69" y1="290" x2="40" y2="368" />
        <line x1="69" y1="290" x2="98" y2="368" />
        <line x1="69" y1="290" x2="69" y2="368" />
      </g>
      <Camera x={42} y={172} facing="right" />

      {/* Desk */}
      <g stroke={ink} strokeWidth="2.5" strokeLinecap="round">
        <rect
          x="187"
          y="245"
          width="150"
          height="10"
          rx="2"
          fill="var(--surface-2)"
        />
        <line x1="199" y1="255" x2="199" y2="368" />
        <line x1="325" y1="255" x2="325" y2="368" />
      </g>

      {/* Prop on the desk: the paper black hole */}
      <ellipse cx="262" cy="241" rx="30" ry="5" fill={accent} />
      <ellipse cx="262" cy="240" rx="15" ry="2.5" fill="#000" />

      {/* Chair */}
      <g stroke={faint} strokeWidth="2.5" strokeLinecap="round">
        <line x1="362" y1="296" x2="414" y2="296" />
        <line x1="414" y1="296" x2="418" y2="212" />
        <line x1="390" y1="296" x2="390" y2="368" />
      </g>

      {/* Presenter, seated and facing left. Each part is drawn twice, a
          wide ink stroke then a narrower fill stroke, so the body reads as
          one outlined silhouette like the cameras. */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g stroke={ink}>
          <circle cx="379" cy="167" r="22" fill={ink} stroke="none" />
          <path d={NECK} strokeWidth="13" />
          <path d={TORSO} strokeWidth="27" />
          <path d={LEG} strokeWidth="17" />
        </g>
        <g stroke="var(--surface-2)">
          <circle cx="379" cy="167" r="19" fill="var(--surface-2)" stroke="none" />
          <path d={NECK} strokeWidth="8" />
          <path d={TORSO} strokeWidth="22" />
          <path d={LEG} strokeWidth="12" />
        </g>
        {/* The near arm sits in front of the body, so it gets its own outline */}
        <path d={ARM} stroke={ink} strokeWidth="15" />
        <path d={ARM} stroke="var(--surface-2)" strokeWidth="10" />
      </g>

      {/* Labels */}
      <g fontSize="20">
        <text x="20" y="130" fill={ink} fontWeight="700">
          Camera #1
        </text>
        <text x="20" y="153" fill={accent}>
          films your face
        </text>
        <text x="304" y="64" fill={ink} fontWeight="700">
          Camera #2
        </text>
        <text x="304" y="87" fill={accent}>
          films your props
        </text>
        <text x="304" y="110" fill={accent}>
          + hands
        </text>
      </g>
    </svg>
  );
}
