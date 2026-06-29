"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const navItems = [
  { href: "/about", label: "About Us" },
  { href: "/our-team", label: "Our Team" },
  { href: "/media", label: "Media" },
  { href: "/events", label: "Events" },
  { href: "/#mission", label: "Mission" },
  { href: "/#impact", label: "Impact" },
  { href: "/#story", label: "Stories" },
] as const;

export function PublicNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll(); // Initialize on mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const transparent = isHome && !isScrolled;

  const navLinkClass = transparent
    ? "text-white/95 hover:text-white"
    : "text-slate-700 hover:text-emerald-900";

  const barBg = transparent ? "bg-transparent" : "bg-white/95 shadow-sm backdrop-blur-sm";

  return (
    <>
      <nav className={`fixed top-0 z-50 w-full bg-white text-black duration-300`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className={`shrink-0 text-lg font-bold tracking-tight ${
              transparent ? "text-white" : "text-emerald-900"
            }`}
          >
            Lakshyadeep
            लक्ष्यदीप
          </Link>

          <div className="hidden items-center gap-1 xl:flex xl:gap-0.5 2xl:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium transition-colors ${navLinkClass}`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#donate"
              className={`ml-2 whitespace-nowrap rounded-2xl border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                transparent
                  ? "border-white text-white hover:bg-white/10"
                  : "border-emerald-900 text-emerald-900 hover:bg-emerald-900 hover:text-white"
              }`}
            >
             Login
            </Link>
          </div>

          <div className="hidden items-center gap-1 xl:flex ">
            <Link
              href="/#donate"
              className={`ml-2 whitespace-nowrap rounded-2xl border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                transparent
                  ? "border-white text-white hover:bg-white/10"
                  : "border-emerald-900 text-emerald-900 hover:bg-emerald-900 hover:text-white"
              }`}
            >
              Mission/Service
            </Link>
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <Link
              href="/#donate"
              className={`rounded-2xl border-2 px-3 py-1.5 text-xs font-semibold sm:px-4 sm:text-sm ${
                transparent
                  ? "border-white text-white hover:bg-white/10"
                  : "border-emerald-900 text-emerald-900"
              }`}
            >
              Donate
            </Link>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={`rounded-lg p-2 ${transparent ? "text-white" : "text-emerald-900"}`}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 xl:hidden"
          aria-hidden
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div
        className={`fixed right-0 top-16 z-[45] h-[calc(100dvh-4rem)] w-full max-w-sm overflow-y-auto border-l border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-out xl:hidden ${
          menuOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-1 p-4 pb-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-3 text-base font-medium text-slate-800 hover:bg-emerald-50 hover:text-emerald-900"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#donate"
            className="mt-2 rounded-2xl border-2 border-emerald-900 bg-emerald-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Donate Now
          </Link>
        </div>
      </div>
    </>
  );
}
