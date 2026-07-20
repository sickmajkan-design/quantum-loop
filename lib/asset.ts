/**
 * Prefix a public asset path with the deployment base path.
 *
 * Under a normal root deployment `NEXT_PUBLIC_BASE_PATH` is empty and this is a
 * no-op. On a GitHub Pages *project* site the app is served from a subpath
 * (e.g. `/quantum-loop`), and Next only auto-prefixes `next/image`, `<Link>`
 * and metadata — raw `<video src>` / `<img src>` strings are NOT rewritten, so
 * those must go through `asset()` to resolve correctly.
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(
  /\/$/,
  "",
);

export const asset = (path: string) => `${BASE_PATH}${path}`;
