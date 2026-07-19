"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/supabase"
import { bodyFont } from "@/lib/site-fonts"

type HeroSlide = {
  id: string
  image_url: string
  title?: string
  href?: string
  auto_slide_duration?: number | null
}

const DEFAULT_SLIDE_DURATION_SEC = 7

const FALLBACK_SLIDES: HeroSlide[] = [
  { id: "fallback-1", image_url: "/banner/About/about-img.jpg" },
  { id: "fallback-2", image_url: "/banner/Our-team/main.jpg" },
]

const DEFAULT_TITLE = "LAKSHYADEEP"

function HeroImage({ src, alt, active }: { src: string; alt: string; active: boolean }) {
  const isLocal = src.startsWith("/") || src.includes(".supabase.co/storage/")

  if (isLocal) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={active}
        sizes="100vw"
        className={`object-cover object-center transition-opacity duration-[1200ms] ease-in-out ${active ? "opacity-100" : "opacity-0"}`}
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1200ms] ease-in-out ${active ? "opacity-100" : "opacity-0"}`}
    />
  )
}

// Future: loop latest project photos in the hero (client PDF requirement).
// const MAX_PROJECT_SLIDES = 8
//
// async function fetchLatestProjectSlides(supabase: ReturnType<typeof getSupabaseClient>): Promise<HeroSlide[]> {
//   const { data: projects, error } = await supabase
//     .from("project")
//     .select("id, project_title, cover_image_url, created_at")
//     .not("status", "ilike", "draft")
//     .order("created_at", { ascending: false })
//     .limit(MAX_PROJECT_SLIDES)
//
//   if (error || !projects?.length) return []
//
//   const slides: HeroSlide[] = []
//   const missingCoverIds: string[] = []
//
//   for (const project of projects) {
//     if (project.cover_image_url) {
//       slides.push({
//         id: project.id,
//         image_url: project.cover_image_url,
//         title: project.project_title,
//         href: `/project/${project.id}`,
//       })
//     } else {
//       missingCoverIds.push(project.id)
//     }
//   }
//
//   if (missingCoverIds.length > 0) {
//     const { data: gallery } = await supabase
//       .from("project_gallery")
//       .select("project_id, image_url, created_at")
//       .in("project_id", missingCoverIds)
//       .order("created_at", { ascending: false })
//
//     const galleryByProject = new Map<string, string>()
//     for (const item of gallery ?? []) {
//       if (!galleryByProject.has(item.project_id)) {
//         galleryByProject.set(item.project_id, item.image_url)
//       }
//     }
//
//     for (const project of projects) {
//       if (slides.some((slide) => slide.id === project.id)) continue
//       const imageUrl = galleryByProject.get(project.id)
//       if (!imageUrl) continue
//       slides.push({
//         id: project.id,
//         image_url: imageUrl,
//         title: project.project_title,
//         href: `/project/${project.id}`,
//       })
//     }
//   }
//
//   return slides.slice(0, MAX_PROJECT_SLIDES)
// }

async function fetchCarouselSlides(supabase: ReturnType<typeof getSupabaseClient>): Promise<HeroSlide[]> {
  const { data } = await supabase
    .from("carousel_slides")
    .select("id, title, image_url, display_order, auto_slide_duration")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  return (data ?? []).map((slide) => ({
    id: slide.id,
    image_url: slide.image_url,
    title: slide.title,
    auto_slide_duration: slide.auto_slide_duration,
  }))
}

export function VideoHeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>(FALLBACK_SLIDES)
  const [current, setCurrent] = useState(0)
  const [title] = useState(DEFAULT_TITLE)

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const supabase = getSupabaseClient()

        // Future: prefer latest project photos, then fall back to admin carousel.
        // const projectSlides = await fetchLatestProjectSlides(supabase)
        // if (projectSlides.length > 0) {
        //   setSlides(projectSlides)
        //   setCurrent(0)
        //   return
        // }

        const carouselSlides = await fetchCarouselSlides(supabase)
        if (carouselSlides.length > 0) {
          setSlides(carouselSlides)
          setCurrent(0)
        }
      } catch (err) {
        console.error("Error fetching hero slides:", err)
      }
    }

    fetchHero()
  }, [])

  const advance = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
  }, [slides.length])

  const goPrev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return
    const durationSec = slides[current]?.auto_slide_duration ?? DEFAULT_SLIDE_DURATION_SEC
    const timer = setTimeout(advance, Math.max(1, durationSec) * 1000)
    return () => clearTimeout(timer)
  }, [current, slides, advance])

  const slideTitle = slides[current]?.title
  const showNav = slides.length > 1

  return (
    <section
      id="hero"
      className="relative h-[100dvh] min-h-[600px] w-full overflow-hidden bg-black"
      aria-label="Homepage hero"
    >
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div key={slide.id} className="absolute inset-0">
            <HeroImage
              src={slide.image_url}
              alt={slide.title ?? "Lakshyadeep hero slide"}
              active={i === current}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/55" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/55" aria-hidden />
      </div>

      {showNav ? (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-accent shadow-lg transition hover:bg-white/95 sm:left-6 sm:h-12 sm:w-12 md:left-8 md:h-14 md:w-14"
          >
            <ChevronLeft className="h-7 w-7 stroke-[2.5] sm:h-8 sm:w-8 md:h-10 md:w-10" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={advance}
            className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-accent shadow-lg transition hover:bg-white/95 sm:right-6 sm:h-12 sm:w-12 md:right-8 md:h-14 md:w-14"
          >
            <ChevronRight className="h-7 w-7 stroke-[2.5] sm:h-8 sm:w-8 md:h-10 md:w-10" />
          </button>
        </>
      ) : null}

      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-end px-4 pb-20 pt-20 text-center sm:px-6 sm:pb-24 sm:pt-24">
        <h1
          className={`${bodyFont.className} max-w-4xl text-3xl font-bold uppercase leading-tight tracking-[0.12em] text-white sm:text-5xl md:text-6xl lg:text-7xl`}
        >
          {title}
        </h1>

        {slideTitle ? (
          <p className="mt-4 text-xs font-semibold uppercase  text-brand sm:text-sm">
            {slideTitle}
          </p>
        ) : null}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/donation"
            className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-brand px-10 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-brand-hover"
          >
            Donate Now
          </Link>
          <Link
            href="/project"
            className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-brand px-10 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-brand-hover"
          >
            Our Projects
          </Link>
        </div>

        {showNav && (
          <div className="mt-10 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-500 ease-in-out ${i === current ? "w-8 bg-brand" : "w-2 bg-white/50 hover:bg-white/75"
                  }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
