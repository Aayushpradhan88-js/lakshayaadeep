"use client"



import Link from "next/link"

import { usePathname } from "next/navigation"

import { useState, useRef } from "react"

import { ChevronDown } from "lucide-react"

import {

  PROJECTS_EVENTS_HUB,

  PUBLICATIONS_ITEMS,

  MORE_ITEMS,

  isNavActive,

  isGroupActive,

  isProjectsNavActive,

} from "../nav-config"



type DropdownProps = {

  label: string

  items: { label: string; href: string }[]

  active: boolean

}



function NavDropdown({ label, items, active }: DropdownProps) {

  const pathname = usePathname()

  const [open, setOpen] = useState(false)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)



  const handleEnter = () => {

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    setOpen(true)

  }



  const handleLeave = () => {

    timeoutRef.current = setTimeout(() => setOpen(false), 150)

  }



  const btnClass =

    active || open

      ? "border border-white px-3 py-1 text-white"

      : "border border-transparent px-3 py-1 text-white/90 hover:border-white hover:text-white"



  return (

    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>

      <button

        type="button"

        onClick={() => setOpen((p) => !p)}

        className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-widest transition-colors ${btnClass}`}

      >

        {label}

        <ChevronDown className={`h-3.5 w-3.5 ${open ? "rotate-180" : ""}`} />

      </button>



      {open && (

        <div className="absolute left-1/2 top-full z-50 mt-3 min-w-[10rem] -translate-x-1/2 overflow-hidden rounded-md bg-white shadow-lg">

          {items.map((item) => {

            const isActive = isNavActive(pathname, item.href)

            return (

              <Link

                key={item.href}

                href={item.href}

                onClick={() => setOpen(false)}

                className={`block px-4 py-2 text-sm ${

                  isActive

                    ? "bg-brand-light font-medium text-brand"

                    : "text-gray-700"

                }`}

              >

                {item.label}

              </Link>

            )

          })}

        </div>

      )}

    </div>

  )

}



type MainNavProps = {

  overlay?: boolean

}



const MainNav = (_props: MainNavProps) => {

  const pathname = usePathname()



  const linkClass = (href: string, active?: boolean) => {

    const isActive = active ?? isNavActive(pathname, href)

    return `border px-3 py-1 text-xs font-semibold uppercase tracking-widest transition-colors ${

      isActive

        ? "border-white text-white"

        : "border-transparent text-white/90 hover:border-white hover:text-white"

    }`

  }



  return (

    <nav className="hidden items-center justify-center gap-4 md:flex lg:gap-6 xl:gap-7">

      <Link href="/" className={linkClass("/")}>Home</Link>

      <Link href={PROJECTS_EVENTS_HUB} className={linkClass(PROJECTS_EVENTS_HUB, isProjectsNavActive(pathname))}>

        Projects

      </Link>

      <Link href="/about" className={linkClass("/about")}>About</Link>

      <Link href="/our-team" className={linkClass("/our-team")}>Our Team</Link>

      <NavDropdown label="Publications" items={PUBLICATIONS_ITEMS} active={isGroupActive(pathname, PUBLICATIONS_ITEMS)} />

      <NavDropdown label="More" items={MORE_ITEMS} active={isGroupActive(pathname, MORE_ITEMS) || isNavActive(pathname, "/about")} />

    </nav>

  )

}



export default MainNav

