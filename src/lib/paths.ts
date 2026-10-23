/** Prefix a file in /public with the site's base path (set for GitHub Pages). */
export const publicPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
