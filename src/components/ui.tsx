import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

export function Section({
  id,
  index,
  eyebrow,
  title,
  lede,
  children,
}: {
  id: string;
  index: number;
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-muted uppercase">
          <span className="text-accent">{String(index).padStart(2, "0")}</span>
          {eyebrow ? <span> · {eyebrow}</span> : null}
        </p>
        <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          {title}
        </h2>
        {lede ? (
          <p className="mt-5 max-w-2xl text-lg text-muted text-pretty sm:text-xl">
            {lede}
          </p>
        ) : null}
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

/**
 * A numbered part within a Section, e.g. "4.1". Use `nested` for a part
 * inside another Subsection, e.g. "2.1.1", which gets a smaller heading.
 */
export function Subsection({
  id,
  number,
  title,
  lede,
  nested = false,
  children,
}: {
  id?: string;
  number: string;
  title: ReactNode;
  lede?: ReactNode;
  nested?: boolean;
  children?: ReactNode;
}) {
  const Heading = nested ? "h4" : "h3";
  return (
    <div
      id={id}
      className={
        nested
          ? "[&:not(:first-child)]:mt-16"
          : "border-t border-line pt-14 first:border-t-0 first:pt-0 [&:not(:first-child)]:mt-20"
      }
    >
      <p className="mb-3 font-mono text-sm text-accent">{number}</p>
      <Heading
        className={`font-bold tracking-tight text-balance ${
          nested ? "text-2xl" : "text-3xl"
        }`}
      >
        {title}
      </Heading>
      {lede ? (
        <p
          className={`mt-4 max-w-2xl text-muted text-pretty ${
            nested ? "text-base" : "text-lg"
          }`}
        >
          {lede}
        </p>
      ) : null}
      <div className={nested ? "mt-8" : "mt-10"}>{children}</div>
    </div>
  );
}

export function Figure({
  src,
  alt,
  caption,
  className = "",
  sizes = "(min-width: 1024px) 33vw, 100vw",
}: {
  src: StaticImageData;
  alt: string;
  caption?: ReactNode;
  className?: string;
  sizes?: string;
}) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <Image
          src={src}
          alt={alt}
          placeholder="blur"
          sizes={sizes}
          className="h-auto w-full"
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-center text-base font-medium">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export type Tip = { title: string; body: string };

/** A grid of tip cards. */
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
          className="rounded-2xl border border-line bg-surface p-5"
        >
          <p className="text-lg font-semibold">{tip.title}</p>
          <p className="mt-2 text-muted">{tip.body}</p>
        </li>
      ))}
    </ul>
  );
}
