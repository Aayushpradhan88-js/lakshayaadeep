"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { THEMATIC_AREAS } from "@/components/homepage/home-content"

export default function ThematicAreasSection() {
  const [showAll, setShowAll] = useState(false)
  const priorityAreas = THEMATIC_AREAS.filter((a) => a.priority)
  const visibleAreas = showAll ? THEMATIC_AREAS : priorityAreas
  const hasMore = THEMATIC_AREAS.length > priorityAreas.length

  return (
    <section id="thematic-areas" className="w-full bg-white px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          {/* <h2 className="text-3xl font-bold text-gray-900 md:text-4xl"> */}
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-grey-900 sm:text-5xl lg:text-6xl">
            Our Thematic <span className="font-light text-brand">Working Areas</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-black md:text-base">
            {/* Focused programs across environment, education, and community — with room to grow into health and clean energy. */}
          </p>
          {/* {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-accent transition hover:text-brand-accent-hover"
            >
              {showAll ? "Show priority areas" : "View all areas"}
              <ChevronRight className={`h-4 w-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
            </button>
          )} */}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleAreas.map((area) => (
            <Link
              key={area.id}
              href={area.link}
              className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition hover:shadow-lg"
            >
              <div className="relative h-48 w-full">
                <Image src={area.image} alt={area.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/30 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h3 className="mb-2 text-lg font-bold">{area.title}</h3>
                {/* <p className="text-sm leading-relaxed text-white/85">{area.description}</p> */}
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-brand">
                  Learn more <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* <div className="mt-10 text-center">
          <Link
            href="/mission"
            className="inline-flex items-center justify-center rounded-md border border-brand-accent px-8 py-3 text-sm font-bold uppercase tracking-wider text-brand-accent transition hover:bg-brand-accent-light"
          >
            Explore all programs
          </Link>
        </div> */}
      </div>
    </section>
  )
}
