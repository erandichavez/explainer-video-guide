"use client";

import { useEffect, useRef, useState } from "react";
import { publicPath } from "@/lib/paths";

type Row = { id: number; script: string; visual: string };

const STORAGE_KEY = "video-planner-rows";

// Illustrative rows built from the props in this guide; students replace them.
const EXAMPLE: Omit<Row, "id">[] = [
  {
    script: "M87 has a supermassive black hole at its centre",
    visual: "Paper black hole on the table + “supermassive” card (physical)",
  },
  {
    script: "It's surrounded by glowing plasma",
    visual: "Add the red plasma ring around the black hole (physical)",
  },
  {
    script: "Telescopes around the world work together (VLBI)",
    visual: "Paper Earth → telescope patches → lines added in the edit (both)",
  },
];

// The starting rows use fixed ids so the server and browser render the same
// markup; rows created later (always in the browser) take ids from 100 up.
const INITIAL_ROWS: Row[] = [1, 2, 3, 4, 5].map((id) => ({
  id,
  script: "",
  visual: "",
}));
let nextId = 100;
const blankRows = (n: number): Row[] =>
  Array.from({ length: n }, () => ({ id: nextId++, script: "", visual: "" }));
const withIds = (rows: Omit<Row, "id">[]): Row[] =>
  rows.map((r) => ({ ...r, id: nextId++ }));

function GripIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      {[3, 8, 13].map((y) =>
        [5.5, 10.5].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" />
        )),
      )}
    </svg>
  );
}

export default function VideoPlanner() {
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);
  const [loaded, setLoaded] = useState(false);

  // Restore a saved draft after hydration (storage is per-browser only).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Omit<Row, "id">[];
        if (Array.isArray(parsed) && parsed.length) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setRows(withIds(parsed));
        }
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(rows.map(({ script, visual }) => ({ script, visual }))),
      );
    } catch {}
  }, [rows, loaded]);

  // Drag-to-reorder: rows snap into place as the pointer crosses the middle
  // of a neighbouring row. Works with mouse, touch and pen via pointer
  // events. Positions are read from the DOM so they always reflect the
  // current order, even between React renders.
  const [dragId, setDragId] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const moveTo = (id: number, index: number) =>
    setRows((rs) => {
      const from = rs.findIndex((r) => r.id === id);
      if (from < 0 || from === index) return rs;
      const next = [...rs];
      const [item] = next.splice(from, 1);
      next.splice(index, 0, item);
      return next;
    });

  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const domRows = () =>
    Array.from(tbodyRef.current?.children ?? []) as HTMLElement[];

  const startDrag = (e: React.PointerEvent, id: number) => {
    e.preventDefault();
    setDragId(id);

    // Listen on the window, not the handle: reordering moves the row's DOM
    // node, which would drop pointer capture partway through a drag.
    // Only follow the pointer that started the drag (ignores other fingers).
    const pointerId = e.pointerId;
    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      // If the release was missed (e.g. it happened outside the window),
      // a mouse moving with no button held means the drag is over.
      if (ev.pointerType === "mouse" && ev.buttons === 0) return end();
      const y = ev.clientY;
      // Target index = how many other rows have their midpoint above the pointer.
      let target = 0;
      for (const tr of domRows()) {
        if (Number(tr.dataset.rowId) === id) continue;
        const box = tr.getBoundingClientRect();
        if (y > box.top + box.height / 2) target++;
      }
      moveTo(id, target);
      // Nudge the page when dragging near the top or bottom edge.
      if (y < 80) window.scrollBy(0, -12);
      else if (y > window.innerHeight - 80) window.scrollBy(0, 12);
    };
    const end = (ev?: PointerEvent) => {
      if (ev && ev.pointerId !== pointerId) return;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      setDragId(null);
      const trs = domRows();
      const index = trs.findIndex((tr) => Number(tr.dataset.rowId) === id);
      setAnnouncement(`Row moved to position ${index + 1} of ${trs.length}.`);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  };

  const update = (id: number, field: "script" | "visual", value: string) =>
    setRows((rs) =>
      rs.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );

  const filled = rows.filter((r) => r.script.trim() || r.visual.trim()).length;

  return (
    <div className="planner-print">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-2xl font-semibold">Video Planner Sheet</h4>
          <p className="mt-1 text-sm text-muted print:hidden">
            Drag the{" "}
            <span className="inline-block translate-y-0.5">
              <GripIcon />
            </span>{" "}
            handle to try your ideas in a different order.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm print:hidden">
          <button
            onClick={() => setRows(withIds(EXAMPLE))}
            className="rounded-full border border-line px-4 py-2 hover:border-foreground"
          >
            Show example
          </button>
          <button
            onClick={() => {
              if (!filled || confirm("Clear every row in the planner?"))
                setRows(blankRows(5));
            }}
            className="rounded-full border border-line px-4 py-2 hover:border-foreground"
          >
            Clear
          </button>
          <button
            onClick={() => window.print()}
            className="rounded-full border border-line px-4 py-2 hover:border-foreground"
          >
            Print
          </button>
          <a
            href={publicPath("/downloads/video-planner-sheet.docx")}
            download
            className="rounded-full bg-accent px-4 py-2 font-medium text-black"
          >
            Download .docx
          </a>
        </div>
      </div>

      <p id="planner-reorder-help" className="sr-only">
        Drag to reorder, or press the up and down arrow keys.
      </p>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <table
        className={`w-full border-collapse overflow-hidden rounded-2xl border border-line text-left ${
          dragId !== null ? "select-none" : ""
        }`}
      >
        <thead className="hidden bg-surface-2 sm:table-header-group">
          <tr>
            <th className="w-20 border-b border-line p-3 text-sm font-medium text-muted">
              <span className="sr-only">Order</span>#
            </th>
            <th className="border-b border-line p-3 font-semibold">
              Script Bullet Points
            </th>
            <th className="border-b border-line p-3 font-semibold">
              Visuals accompanying
            </th>
            <th className="w-10 border-b border-line print:hidden">
              <span className="sr-only">Remove</span>
            </th>
          </tr>
        </thead>
        <tbody ref={tbodyRef}>
          {rows.map((r, i) => (
            <tr
              key={r.id}
              data-row-id={r.id}
              className={`block border-b border-line transition-colors last:border-b-0 sm:table-row ${
                dragId === r.id ? "bg-accent/10" : ""
              }`}
            >
              <td className="block px-3 pt-3 align-top sm:table-cell sm:p-3">
                <div className="flex items-center gap-1.5 text-sm text-muted">
                  <button
                    type="button"
                    aria-label={`Reorder row ${i + 1}`}
                    aria-describedby="planner-reorder-help"
                    onPointerDown={(e) => startDrag(e, r.id)}
                    onKeyDown={(e) => {
                      const to =
                        e.key === "ArrowUp"
                          ? i - 1
                          : e.key === "ArrowDown"
                            ? i + 1
                            : -1;
                      if (to < 0 || to >= rows.length) return;
                      e.preventDefault();
                      moveTo(r.id, to);
                      setAnnouncement(
                        `Row moved to position ${to + 1} of ${rows.length}.`,
                      );
                    }}
                    className={`touch-none rounded-md p-1.5 hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent print:hidden ${
                      dragId === r.id
                        ? "cursor-grabbing text-accent"
                        : "cursor-grab"
                    }`}
                  >
                    <GripIcon />
                  </button>
                  <span>
                    <span className="sm:hidden">Row </span>
                    {i + 1}
                  </span>
                </div>
              </td>
              <td className="block p-3 align-top sm:table-cell sm:border-r sm:border-line">
                <label className="mb-1 block text-xs text-muted sm:hidden">
                  Script bullet point
                </label>
                <textarea
                  value={r.script}
                  onChange={(e) => update(r.id, "script", e.target.value)}
                  aria-label={`Script bullet point ${i + 1}`}
                  placeholder="What you'll say…"
                  rows={2}
                  className="field-sizing-content min-h-12 w-full resize-none rounded-lg bg-transparent p-2 outline-none placeholder:text-muted/50 focus:bg-surface"
                />
              </td>
              <td className="block p-3 align-top sm:table-cell">
                <label className="mb-1 block text-xs text-muted sm:hidden">
                  Visual accompanying
                </label>
                <textarea
                  value={r.visual}
                  onChange={(e) => update(r.id, "visual", e.target.value)}
                  aria-label={`Visual for bullet point ${i + 1}`}
                  placeholder="What the viewer sees: prop, figure, your face…"
                  rows={2}
                  className="field-sizing-content min-h-12 w-full resize-none rounded-lg bg-transparent p-2 outline-none placeholder:text-muted/50 focus:bg-surface"
                />
              </td>
              <td className="block px-3 pb-3 text-right align-top sm:table-cell sm:p-3 print:hidden">
                <button
                  onClick={() =>
                    setRows((rs) =>
                      rs.length > 1 ? rs.filter((x) => x.id !== r.id) : rs,
                    )
                  }
                  aria-label={`Remove row ${i + 1}`}
                  className="text-muted hover:text-foreground"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-between gap-4 text-sm text-muted print:hidden">
        <button
          onClick={() => setRows((rs) => [...rs, ...blankRows(1)])}
          className="rounded-full border border-line px-4 py-2 text-foreground hover:border-foreground"
        >
          + Add row
        </button>
        <span>Saved in this browser only</span>
      </div>
    </div>
  );
}
