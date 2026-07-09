"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export type TestimonialItem = {
  id: number
  quote: string
  name: string
  role: string
  image: string
}

type TestimonialsCarouselProps = {
  id?: string
  title: string
  titleAccent: string
  subtitle?: string
  overline?: string
  variant?: "default" | "speakers"
  items: readonly TestimonialItem[]
}

const AUTO_SCROLL_MS = 5000
const TRANSITION_MS = 500

function getSlidesPerView(width: number) {
  if (width < 768) return 1
  if (width < 1024) return 2
  return 3
}

export default function TestimonialsCarousel({
  id = "testimonials",
  title,
  titleAccent,
  subtitle,
  overline,
  variant = "default",
  items,
}: TestimonialsCarouselProps) {
  const total = items.length

  const [slidesPerView, setSlidesPerView] = useState(3)
  const [current, setCurrent] = useState(3)
  const [enableTransition, setEnableTransition] = useState(true)
  const [timerKey, setTimerKey] = useState(0)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const extendedSlides = useMemo(() => {
    const head = items.slice(-slidesPerView)
    const tail = items.slice(0, slidesPerView)
    return [...head, ...items, ...tail]
  }, [items, slidesPerView])

  const dotCount = Math.max(1, total - slidesPerView + 1)
  const activeDot = ((current - slidesPerView) % total + total) % total
  const activeDotClamped = Math.min(activeDot, dotCount - 1)

  useEffect(() => {
    const update = () => {
      const spv = getSlidesPerView(window.innerWidth)
      setSlidesPerView(spv)
      setEnableTransition(false)
      setCurrent(spv)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setEnableTransition(true))
      })
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const jumpWithoutTransition = useCallback((index: number) => {
    setEnableTransition(false)
    setCurrent(index)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setEnableTransition(true))
    })
  }, [])

  useEffect(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current)

    if (current >= slidesPerView + total) {
      resetTimerRef.current = setTimeout(() => jumpWithoutTransition(slidesPerView), TRANSITION_MS)
    } else if (current < slidesPerView) {
      resetTimerRef.current = setTimeout(() => jumpWithoutTransition(total), TRANSITION_MS)
    }

    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    }
  }, [current, slidesPerView, total, jumpWithoutTransition])

  const goNext = useCallback(() => {
    setCurrent((c) => c + 1)
  }, [])

  const goPrev = useCallback(() => {
    setCurrent((c) => c - 1)
  }, [])

  useEffect(() => {
    if (total === 0) return
    const timer = setInterval(goNext, AUTO_SCROLL_MS)
    return () => clearInterval(timer)
  }, [goNext, timerKey, total])

  const handleManual = (direction: "prev" | "next") => {
    if (direction === "prev") goPrev()
    else goNext()
    setTimerKey((k) => k + 1)
  }

  const goToDot = (index: number) => {
    setCurrent(slidesPerView + index)
    setTimerKey((k) => k + 1)
  }

  if (total === 0) return null

  const slideWidth = 100 / slidesPerView
  const isSpeakers = variant === "speakers"

  const navButtonClass =
    "flex h-12 w-12 shrink-0 items-center justify-center self-center rounded-full bg-white text-brand shadow-md transition hover:bg-gray-50 md:h-14 md:w-14"

  const navIconClass = isSpeakers ? "h-10 w-10 stroke-[2.5] md:h-12 md:w-12" : "h-8 w-8 stroke-[3] md:h-10 md:w-10"

  return (
    <section
      id={id}
      className={
        isSpeakers
          ? "w-full bg-brand-dark px-4 py-20 md:px-8 md:py-28"
          : "w-full bg-slate-50 px-4 py-20 md:px-8 md:py-28"
      }
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center md:mb-16">
          {isSpeakers && (overline || subtitle) ? (
            <p className="mb-3 text-sm font-semibold uppercase  text-brand md:text-base">
              {overline ?? subtitle}
            </p>
          ) : null}
          <h2
            className={
              isSpeakers
                ? "text-3xl font-bold uppercase tracking-[0.12em] text-white sm:text-4xl md:text-5xl"
                : "text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
            }
          >
            {isSpeakers ? (
              <>
                {title} {titleAccent}
              </>
            ) : (
              <>
                {title} <span className="font-light text-brand">{titleAccent}</span>
              </>
            )}
          </h2>
          {!isSpeakers && subtitle ? (
            <p className="mx-auto mt-4 max-w-2xl text-base text-black md:text-lg">{subtitle}</p>
          ) : null}
        </div>

        <div className="relative flex items-stretch gap-3 md:gap-6">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => handleManual("prev")}
            className={navButtonClass}
          >
            <ChevronLeft className={navIconClass} />
          </button>

          <div className="min-w-0 flex-1 overflow-hidden">
            <div
              className={`flex ${enableTransition ? "transition-transform duration-500 ease-in-out" : ""}`}
              style={{ transform: `translateX(-${current * slideWidth}%)` }}
            >
              {extendedSlides.map((item, index) => (
                <article
                  key={`${item.id}-${index}`}
                  className="flex shrink-0 flex-col px-2 md:px-3"
                  style={{ width: `${slideWidth}%` }}
                >
                  {isSpeakers ? (
                    <div className="flex h-full flex-col items-center rounded-xl bg-white px-5 py-8 text-center shadow-lg md:px-6 md:py-10">
                      <p className="mb-6 line-clamp-5 text-sm leading-relaxed text-black/90 md:text-[15px]">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                      <div className="relative mb-5 h-28 w-24 overflow-hidden md:h-32 md:w-28">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover object-top"
                          sizes="112px"
                        />
                      </div>
                      <p className="text-sm font-bold uppercase tracking-wide text-brand md:text-base">
                        {item.name}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-black/75 md:text-sm">{item.role}</p>
                    </div>
                  ) : (
                    <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-md md:p-10">
                      <p className="flex-1 text-base leading-relaxed text-black md:text-lg">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                      <div className="mt-8 flex items-center gap-4 border-t border-gray-100 pt-6">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-brand-light md:h-20 md:w-20">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-base font-bold text-gray-900 md:text-lg">{item.name}</p>
                          <p className="text-sm text-black md:text-base">{item.role}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => handleManual("next")}
            className={navButtonClass}
          >
            <ChevronRight className={navIconClass} />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goToDot(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === activeDotClamped
                  ? "w-8 bg-brand"
                  : isSpeakers
                    ? "w-2 bg-white/35 hover:bg-white/55"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
