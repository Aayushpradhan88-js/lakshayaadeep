"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import Logo from "./Logo"
import MainNav from "../Nav-Bar/MainNav"
import { SearchTrigger } from "@/components/shared-component/site-search"

type TopBarProps = {
  mobileOpen: boolean
  onMobileToggle: () => void
  onSearchOpen: () => void
  overlay?: boolean
}

const TopBar = ({ mobileOpen, onMobileToggle, onSearchOpen, overlay }: TopBarProps) => (
  <div className="flex w-full items-center justify-between gap-3 py-3">
    <div className="min-w-0 shrink">
      <Logo overlay={overlay} />
    </div>
    <MainNav overlay={overlay} />

    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      <SearchTrigger onClick={onSearchOpen} overlay={overlay} className="md:hidden" />
      <div className="hidden items-center gap-2 md:flex">

        {/* Search Trigger */}
        <SearchTrigger onClick={onSearchOpen} overlay={overlay} />

        {/* volunteer button */}
        {/* <Link
          href="/volunteer"
          className={
            overlay
              ? "rounded-md border border-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/10"
              : "rounded-full border border-brand px-5 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand-light"
          }
        >
          Volunteer
        </Link> */}

        {/* donate button */}
        <Link
          href="/donation"
          className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md"
        >
          Donate us
        </Link>

        <Link
          href="/login"
          className="rounded-md border border-white/60 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white"
        >
          Login
        </Link>
      </div>

      <button
        type="button"
        onClick={onMobileToggle}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
        className={`flex h-10 w-10 items-center justify-center rounded-lg lg:hidden text-white`}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </div>
  </div>
)

export default TopBar
