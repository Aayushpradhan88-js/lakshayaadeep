"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { THEMATIC_AREAS } from "@/components/homepage/home-content"

type ThematicArea = (typeof THEMATIC_AREAS)[number]

function ThematicAreaCard({
  area,
  size = "default",
}: {
  area: ThematicArea
  size?: "default" | "large"
}) {
  const imageHeight =
    size === "large" ? "h-64 sm:h-72 md:h-80 lg:h-[22rem]" : "h-56 sm:h-64 md:h-72"

  return (
    <Link
      href={area.link}
      className="group relative block overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition hover:shadow-lg"
    >
      <div className={`relative w-full ${imageHeight}`}>
        <Image
          src={area.image}
          alt={area.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes={size === "large" ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/35 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
        <h3 className={`mb-2 font-bold ${size === "large" ? "text-xl md:text-2xl" : "text-lg md:text-xl"}`}>
          {area.title}
        </h3>
        {"description" in area && area.description ? (
          <p className={`leading-relaxed text-white/90 ${size === "large" ? "text-sm md:text-base" : "text-sm"}`}>
            {area.description}
          </p>
        ) : null}
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-brand md:text-sm">
          Learn more <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

export default function ThematicAreasSection() {
  const [showAll, setShowAll] = useState(false)
  const priorityAreas = THEMATIC_AREAS.filter((a) => a.priority)
  const extraAreas = THEMATIC_AREAS.filter((a) => !a.priority)
  const hasMore = extraAreas.length > 0

  return (
    <section id="thematic-areas" className="w-full bg-white px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-grey-900 sm:text-5xl lg:text-6xl">
            Our Thematic <span className="font-light text-brand">Working Areas</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-black md:text-base">
            Focused programs across environment, education, and community — with room to grow into health and clean energy.
          </p>
          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-accent transition hover:text-brand-accent-hover"
            >
              {showAll ? "Show priority areas" : "View all areas"}
              <ChevronRight className={`h-4 w-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {priorityAreas.map((area) => (
            <ThematicAreaCard key={area.id} area={area} />
          ))}
        </div>

        {showAll && extraAreas.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {extraAreas.map((area) => (
              <ThematicAreaCard key={area.id} area={area} size="large" />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
