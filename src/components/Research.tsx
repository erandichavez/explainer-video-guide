import {
  MAYER_2014,
  PRINCIPLES,
  principle,
  type Goal,
  type PrincipleId,
} from "@/lib/research";

/** Small tags linking a piece of advice to the research behind it. */
export function Evidence({
  ids,
  className = "",
}: {
  ids: readonly PrincipleId[];
  className?: string;
}) {
  if (!ids.length) return null;
  return (
    <p className={`flex flex-wrap gap-1.5 ${className}`}>
      {ids.map((id) => {
        const p = principle(id);
        return (
          <a
            key={id}
            href={`#principle-${id}`}
            title={`${p.name} principle (Mayer, 2014): ${p.summary}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-xs text-muted transition-colors hover:border-accent hover:text-foreground"
          >
            <BookIcon />
            {p.name}
            <span className="text-accent">d&nbsp;=&nbsp;{p.d.toFixed(2)}</span>
          </a>
        );
      })}
    </p>
  );
}

function BookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3 w-3 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2Z" />
      <path d="M8 7h8" />
    </svg>
  );
}

export type Tip = {
  title: string;
  body: string;
  cite?: readonly PrincipleId[];
};

/** A grid of tip cards, each optionally tagged with supporting research. */
export function TipGrid({
  tips,
  className = "",
}: {
  tips: readonly Tip[];
  className?: string;
}) {
  return (
    <ul className={`grid gap-4 ${className}`}>
      {tips.map((tip) => (
        <li
          key={tip.title}
          className="flex flex-col rounded-2xl border border-line bg-surface p-5"
        >
          <p className="text-lg font-semibold">{tip.title}</p>
          <p className="mt-2 flex-1 text-muted">{tip.body}</p>
          <Evidence ids={tip.cite ?? []} className="mt-4" />
        </li>
      ))}
    </ul>
  );
}

const GOALS: { goal: Goal; note: string }[] = [
  {
    goal: "Foundation",
    note: "Why explainer videos work at all.",
  },
  {
    goal: "Reduce distraction",
    note: "Cut processing that doesn’t help the viewer understand.",
  },
  {
    goal: "Manage complexity",
    note: "Help viewers take in material that is genuinely hard.",
  },
  {
    goal: "Encourage effort",
    note: "Use social cues so viewers want to make sense of it.",
  },
];

/** The references section: theory, every principle, and the citation. */
export function ResearchOverview() {
  return (
    <div className="space-y-14">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          [
            "Two channels",
            "People take in pictures and spoken words through separate channels, so a video can use both at once.",
          ],
          [
            "Limited capacity",
            "Each channel can only handle a little at a time, so anything extra competes with the explanation.",
          ],
          [
            "Active processing",
            "Understanding comes from selecting what matters, organizing it, and connecting it to what viewers already know.",
          ],
        ].map(([title, body]) => (
          <div
            key={title}
            className="rounded-2xl border border-line bg-surface p-5"
          >
            <p className="text-lg font-semibold">{title}</p>
            <p className="mt-2 text-muted">{body}</p>
          </div>
        ))}
      </div>

      {GOALS.map(({ goal, note }) => (
        <div key={goal}>
          <h3 className="text-2xl font-semibold">{goal}</h3>
          <p className="mt-1 text-muted">{note}</p>
          <ul className="mt-5 divide-y divide-line overflow-hidden rounded-2xl border border-line">
            {PRINCIPLES.filter((p) => p.goal === goal).map((p) => (
              <li
                key={p.id}
                id={`principle-${p.id}`}
                className="grid scroll-mt-24 gap-3 p-5 target:bg-accent/10 md:grid-cols-[12rem_minmax(0,1fr)_10rem] md:gap-6"
              >
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="mt-1 text-sm text-accent">
                    d = {p.d.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p>{p.summary}</p>
                  {p.usedIn.length ? (
                    <p className="mt-2 text-sm text-muted">
                      Used in{" "}
                      {p.usedIn.map((u, i) => (
                        <span key={u.href}>
                          {i > 0 ? " · " : null}
                          <a
                            href={u.href}
                            className="underline underline-offset-2 hover:text-foreground"
                          >
                            {u.label}
                          </a>
                        </span>
                      ))}
                    </p>
                  ) : null}
                </div>
                <p className="text-sm text-muted md:text-right">{p.evidence}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="rounded-2xl border-l-2 border-accent bg-surface-2 px-5 py-4 text-sm text-muted">
        <p>
          <span className="font-semibold text-foreground">Reading the numbers:</span>{" "}
          d is the median effect size across the experiments for each principle.
          Following Hattie (2009), Mayer treats effects above d = 0.40 as
          educationally important. Most of the studies are short laboratory
          experiments, so the size of each effect may differ in a real
          classroom.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-semibold">Reference</h3>
        <p className="mt-4 max-w-3xl pl-8 -indent-8 text-pretty">
          {MAYER_2014.authors} ({MAYER_2014.year}). {MAYER_2014.title}. In{" "}
          {MAYER_2014.editors} (Eds.),{" "}
          <a
            href={MAYER_2014.url}
            className="italic underline underline-offset-2 hover:text-accent"
          >
            {MAYER_2014.book}
          </a>
          . {MAYER_2014.publisher}.
        </p>
      </div>
    </div>
  );
}
