"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { publicPath } from "@/lib/paths";

// Chapter starts (in seconds), found from the props on screen.
const CHAPTERS = [
  { t: 0, title: "Imaging a black hole" },
  { t: 46, title: "Glowing plasma" },
  { t: 70, title: "M87*: a supermassive black hole" },
  { t: 131, title: "How big does it look from Earth?" },
  { t: 181, title: "An Earth-sized telescope" },
  { t: 202, title: "VLBI: linking telescopes" },
  { t: 289, title: "The Event Horizon Telescope" },
  { t: 326, title: "Putting it together" },
];

const stamp = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** The example video with a clickable chapter list beside it. */
export default function ExampleVideo({ children }: { children?: ReactNode }) {
  const video = useRef<HTMLVideoElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const onTime = () => {
      let i = 0;
      while (i + 1 < CHAPTERS.length && v.currentTime >= CHAPTERS[i + 1].t) i++;
      setCurrent(i);
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, []);

  const jump = (i: number) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = CHAPTERS[i].t;
    setCurrent(i);
    v.play().catch(() => {});
  };

  return (
    // DOM order is video → chapters → children, so phones get the chapters
    // right under the video; on wide screens the chapters move to the side.
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="lg:col-start-1 lg:row-start-1">
        <video
          ref={video}
          controls
          playsInline
          preload="metadata"
          poster={publicPath("/videos/astro98-resource-poster.jpg")}
          className="aspect-video w-full rounded-2xl border border-line bg-surface"
        >
          <source
            src={publicPath("/videos/astro98-resource.mp4")}
            type="video/mp4"
          />
          Your browser doesn’t support embedded video.
        </video>
      </div>

      <nav
        aria-label="Video chapters"
        className="rounded-2xl border border-line bg-surface p-4 sm:p-5 lg:col-start-2 lg:row-span-2 lg:row-start-1"
      >
        <p className="px-2 font-mono text-xs tracking-[0.2em] text-accent uppercase">
          Chapters
        </p>
        <ol className="mt-3 space-y-1">
          {CHAPTERS.map((c, i) => (
            <li key={c.t}>
              <button
                type="button"
                onClick={() => jump(i)}
                aria-current={current === i ? "true" : undefined}
                className={`flex w-full items-baseline gap-3 rounded-xl px-2 py-2 text-left transition-colors ${
                  current === i
                    ? "bg-accent/15 text-foreground"
                    : "text-muted hover:bg-surface-2 hover:text-foreground"
                }`}
              >
                <span
                  className={`w-10 shrink-0 font-mono text-sm tabular-nums ${
                    current === i ? "text-accent" : ""
                  }`}
                >
                  {stamp(c.t)}
                </span>
                <span className="text-pretty">{c.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {children ? (
        <div className="lg:col-start-1 lg:row-start-2">{children}</div>
      ) : null}
    </div>
  );
}
