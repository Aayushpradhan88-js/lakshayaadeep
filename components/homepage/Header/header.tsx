"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import MobileNav from "./Nav-Bar/Mobile-Nav"
import TopBar from "./TopBar/Top-Bar"
import { SiteSearch } from "@/components/shared-component/site-search"

type HeaderProps = {
  overlay?: boolean
}

export default function Header({ overlay }: HeaderProps) {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const isOverlay = overlay ?? isHome

  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <header
        className={
          isOverlay
            ? "fixed inset-x-0 top-0 z-50 w-full border-b border-white/10 bg-brand-header"
            : "sticky top-0 z-50 w-full border-b border-white/10 bg-brand-header shadow-sm"
        }
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <TopBar
            mobileOpen={mobileOpen}
            onMobileToggle={() => setMobileOpen((p) => !p)}
            onSearchOpen={() => setSearchOpen(true)}
            overlay={isOverlay}
          />
        </div>
        {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} overlay={isOverlay} onSearchOpen={() => setSearchOpen(true)} />}
      </header>
      <SiteSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
