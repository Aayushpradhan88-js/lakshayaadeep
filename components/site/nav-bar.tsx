"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import LoginButton from "../homepage/Header/TopBar/ActionButtons/LoginButton";
import MissionServiceButton from "../homepage/Header/TopBar/ActionButtons/MissionServiceButton";
import { BrandLogo } from "@/components/shared-component/brand-logo";

export function PublicNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ─── Top Navigation Bar ─── */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 shadow-md backdrop-blur-sm"
            : "bg-white"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo + Brand */}
          <BrandLogo priority imageClassName="h-10 max-w-[200px] sm:h-11 sm:max-w-[220px]" />

          {/* Right-side buttons — Desktop */}
          <div className="hidden cursor-pointer items-center gap-3 md:flex">
            <LoginButton/>
            <Link href="/mission">
            <MissionServiceButton/>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/auth/login"
              className="rounded-full bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-1.5 text-xs font-semibold text-white shadow"
            >
              Login
            </Link>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="rounded-lg p-2 text-slate-700"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Mobile Drawer ─── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-hidden
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div
        className={`fixed right-0 top-16 z-[45] h-[calc(100dvh-4rem)] w-full max-w-sm overflow-y-auto border-l border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-out md:hidden ${
          menuOpen
            ? "translate-x-0"
            : "pointer-events-none translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-1 p-4 pb-10">
          {[
            { href: "/#mission", label: "Mission" },
            { href: "/about", label: "About" },
            { href: "/events", label: "Event" },
            { href: "/blog", label: "Blog" },
            { href: "/contact", label: "Contact" },
            { href: "/#impact", label: "Impact" },
            { href: "/#donate", label: "Donate Now" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-3 text-base font-medium text-slate-800 hover:bg-orange-50 hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#mission"
            className="mt-2 rounded-full border-2 border-orange-400 px-4 py-3 text-center text-sm font-semibold text-brand hover:bg-orange-50"
          >
            Mission/Service
          </Link>
        </div>
      </div>
    </>
  );
}
