"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getSupabaseClient } from "@/lib/supabase/supabase"
import { bodyFont } from "@/lib/site-fonts"

type HeroSlide = {
  id: string
  image_url: string
  title?: string
  auto_slide_duration?: number | null
}

const DEFAULT_SLIDE_DURATION_SEC = 1

const FALLBACK_SLIDES: HeroSlide[] = [
  { id: "fallback-1", image_url: "/hero.jpg" },
  { id: "fallback-2", image_url: "/ourteam.jpg" },
]

const DEFAULT_TITLE = "LAKSHYADEEP"
const DEFAULT_SUBTITLE =
  "Changing lives across Nepal through education, community support, and lasting impact."

function HeroImage({ src, active }: { src: string; active: boolean }) {
  const isLocal = src.startsWith("/") || src.includes(".supabase.co/storage/")

  if (isLocal) {
    return (
      <Image
        src={src}
        alt=""
        fill
        priority={active}
        sizes="100vw"
        className={`object-cover object-center transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`}
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`}
    />
  )
}

export function VideoHeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>(FALLBACK_SLIDES)
  const [current, setCurrent] = useState(0)
  const [title, setTitle] = useState(DEFAULT_TITLE)

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const supabase = getSupabaseClient()
        const [carouselRes
          // , settingsRes
        ] = await Promise.all([
          supabase
            .from("carousel_slides")
            .select("id, title, image_url, display_order, auto_slide_duration")
            .eq("is_active", true)
            .order("display_order", { ascending: true }),
          // supabase
          //   .from("hero_settings")
          //   .select("title, subtitle")
          //   .eq("is_active", true)
          //   .maybeSingle(),
        ])

        // if (settingsRes.data?.title) setTitle(settingsRes.data.title.toUpperCase())

        const carouselSlides: HeroSlide[] = (carouselRes.data ?? []).map((s) => ({
          id: s.id,
          image_url: s.image_url,
          title: s.title,
          auto_slide_duration: s.auto_slide_duration,
        }))

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

  useEffect(() => {
    if (slides.length <= 1) return
    const durationSec = slides[current]?.auto_slide_duration ?? DEFAULT_SLIDE_DURATION_SEC
    const timer = setTimeout(advance, Math.max(1, durationSec) * 1000)
    return () => clearTimeout(timer)
  }, [current, slides, advance])

  const slideTitle = slides[current]?.title

  return (
    <section
      id="hero"
      className="hero-bottom-angle relative h-[100dvh] min-h-[600px] w-full overflow-hidden bg-black"
      aria-label="Homepage hero"
    >
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div key={slide.id} className="absolute inset-0">
            <HeroImage src={slide.image_url} active={i === current} />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/55" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/55" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-end px-4 pb-[14vh] pt-20 text-center sm:px-6 sm:pb-[16vh] sm:pt-24">
        <h1
          className={`${bodyFont.className} max-w-4xl text-3xl font-bold uppercase leading-tight tracking-[0.12em] text-white sm:text-5xl md:text-6xl lg:text-7xl`}
        >
          {title}
        </h1>

        {slideTitle && (
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand sm:text-sm">
            {/* {slideTitle} */}
          </p>
        )}

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

        {slides.length > 1 && (
          <div className="absolute bottom-[8vh] left-0 right-0 flex justify-center gap-2 sm:bottom-[7vh]">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-brand" : "w-2 bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
