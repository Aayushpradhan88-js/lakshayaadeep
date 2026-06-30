export const COMMUNITY_CTA_PATH_PREFIXES = [
  "/project",
  "/projects-events",
  "/event",
  "/about",
  "/our-team",
  "/blog",
  "/article",
  "/gallery",
  "/contact",
] as const;

export function shouldShowCommunityCta(pathname: string): boolean {
  return COMMUNITY_CTA_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
