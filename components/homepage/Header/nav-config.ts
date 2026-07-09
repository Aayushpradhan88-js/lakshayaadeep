export type NavLink = {
  label: string
  href: string
}

export const PROJECTS_EVENTS_HUB = "/projects-events"

export const PROJECTS_EVENTS_ITEMS: NavLink[] = [
  { label: "Projects", href: "/project" },
  { label: "Events", href: "/event" },
]

export const PROJECTS_EVENTS_CARDS = [
  {
    label: "Projects",
    href: "/project",
    description: "Explore our ongoing, upcoming, and completed community initiatives across Nepal.",
    image: "/banner/project/project-card.jpg",
  },
  {
    label: "Events",
    href: "/event",
    description: "Join tree plantation drives, health camps, and community gatherings near you.",
    image: "/banner/event/event-card.jpg",
  },
] as const

export const PUBLICATIONS_ITEMS: NavLink[] = [
  { label: "Blog", href: "/blog" },
  { label: "Articles", href: "/article" },
]

export const MORE_ITEMS: NavLink[] = [
  { label: "FAQs", href: "/about#faqs" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
]

export const FOOTER_QUICK_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Projects", href: PROJECTS_EVENTS_HUB },
  { label: "Events", href: "/event" },
  { label: "Gallery", href: "/gallery" },
]

export const FOOTER_GET_INVOLVED_LINKS: NavLink[] = [
  { label: "Volunteer", href: "/volunteer" },
  { label: "Donate", href: "/donation" },
  { label: "Blog", href: "/blog" },
  { label: "Articles", href: "/article" },
]

export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
]

export function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  if (href.includes("#")) return pathname === href.split("#")[0]
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function isGroupActive(pathname: string, items: NavLink[]) {
  return items.some((item) => isNavActive(pathname, item.href))
}

export function isProjectsNavActive(pathname: string) {
  return isNavActive(pathname, PROJECTS_EVENTS_HUB) || isGroupActive(pathname, PROJECTS_EVENTS_ITEMS)
}
