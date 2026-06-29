"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"
import {
  PROJECTS_EVENTS_HUB,
  PUBLICATIONS_ITEMS,
  MORE_ITEMS,
  isNavActive,
  isProjectsNavActive,
} from "../nav-config"

type MobileNavProps = {
  onClose: () => void
  overlay?: boolean
  onSearchOpen?: () => void
}

function MobileNavLink({
  href,
  label,
  onClose,
  active,
}: {
  href: string
  label: string
  onClose: () => void
  active?: boolean
}) {
  const pathname = usePathname()
  const isActive = active ?? isNavActive(pathname, href)

  return (
    <Link
      href={href}
      onClick={onClose}
      className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
        isActive ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/10 hover:text-white"
      }`}
    >
      {label}
    </Link>
  )
}

const MobileNav = ({ onClose, overlay, onSearchOpen }: MobileNavProps) => {
  const pathname = usePathname()

  return (
    <div className={`border-t lg:hidden border-white/10 bg-brand-header`}>
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-4">
        {onSearchOpen && (
          <button
            type="button"
            onClick={() => {
              onSearchOpen()
              onClose()
            }}
            className="flex w-full items-center gap-3 rounded-lg border border-white/20 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/40">
              <Search className="h-4 w-4" />
            </span>
            Search projects, events, blog…
          </button>
        )}
        <MobileNavLink href="/" label="Home" onClose={onClose} />

        <MobileNavLink
          href={PROJECTS_EVENTS_HUB}
          label="Projects"
          onClose={onClose}
          active={isProjectsNavActive(pathname)}
        />

        <MobileNavLink href="/about" label="About" onClose={onClose} />

        <MobileNavLink href="/our-team" label="Our Team" onClose={onClose} />

        <div>
          <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-widest text-white/60">Publications</p>
          <div className="space-y-0.5">
            {PUBLICATIONS_ITEMS.map((item) => (
              <MobileNavLink key={item.href} href={item.href} label={item.label} onClose={onClose} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-widest text-white/60">More</p>
          <div className="space-y-0.5">
            {MORE_ITEMS.map((item) => (
              <MobileNavLink key={item.href} href={item.href} label={item.label} onClose={onClose} />
            ))}
          </div>
        </div>

        <div className="flex gap-2 border-t border-white/20 pt-3">
          <Link href="/volunteer" onClick={onClose} className="flex-1 rounded-md border border-white py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/10">
            Volunteer
          </Link>
          <Link href="/donation" onClick={onClose} className="flex-1 rounded-md bg-brand py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-hover">
            Donate
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MobileNav
