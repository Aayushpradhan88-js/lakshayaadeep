"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback, type ReactNode } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/supabase";
import { headingFont } from "@/lib/site-fonts";

interface CarouselSlide {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  button_text?: string;
  button_link?: string;
  display_order: number;
  auto_slide_duration?: number;
}

const FALLBACK: CarouselSlide = {
  id: "fallback",
  title: "Together We Build ",
  subtitle:
    "Lakshyadeep exists to uplift humanity through education, compassion, and action—one community, one project, one life at a time.",
  image_url: "/hero.jpg",
  display_order: 1,
  auto_slide_duration: 5,
};

function isOptimizable(url: string) {
  return url.startsWith("/") || url.includes(".supabase.co/storage/");
}

type Props = {
  /** Page-specific CTAs (e.g. Donate + Learn More vs Apply + Explore). */
  children: ReactNode;
  /** Home uses a taller hero; volunteer uses the compact variant. */
  variant?: "home" | "volunteer";
};

export function CarouselHeroSection({ children, variant = "home" }: Props) {
  const [slides, setSlides] = useState<CarouselSlide[]>([FALLBACK]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // Fetch active slides from DB
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let cancelled = false;
    (async () => {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("carousel_slides")
          .select("id, title, subtitle, image_url, button_text, button_link, display_order, auto_slide_duration")
          .eq("is_active", true)
          .order("display_order", { ascending: true });
        if (cancelled || error || !data?.length) return;
        setSlides(data as CarouselSlide[]);
        setCurrent(0);
    })();
    return () => { cancelled = true; };
  }, []);

  // Auto-advance
  const advance = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const duration = (slides[current]?.auto_slide_duration ?? 5) * 1000;
    const t = setTimeout(advance, duration);
    return () => clearTimeout(t);
  }, [current, paused, slides, advance]);

  const slide = slides[current];

  const heightClass =
    variant === "home"
      ? "min-h-[min(92vh,900px)]"
      : "min-h-[min(70vh,720px)]";

  return (
    <section
      className={`relative overflow-hidden ${heightClass}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Hero carousel"
    >
      {/* Background image with crossfade */}
      <div className={`absolute inset-0 ${heightClass}`}>
        {/* {isOptimizable(slide.image_url) ? (
          <Image
            key={slide.id}
            src={slide.image_url}
            alt=""
            fill
            priority
            className="object-cover object-center transition-opacity duration-700"
            sizes="100vw"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={slide.id}
            src={slide.image_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          /> */}
        {/* )} */}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" aria-hidden />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 mx-auto flex ${heightClass} max-w-5xl flex-col items-center justify-center px-4 pt-20 pb-16 text-center sm:px-6`}
      >
        <h1
          className={`${headingFont.className} mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl`}
        >
          {slide.title}
          {/* If title ends without accent text, just render as-is */}
        </h1>
        {slide.subtitle && (
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
            {slide.subtitle}
          </p>
        )}
        {/* Page-specific CTAs passed from parent */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          {children}
        </div>
        {/* Slide CTA button (from DB) if defined */}
        {slide.button_text && slide.button_link && (
          <Link
            href={slide.button_link}
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-orange-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-orange-600"
          >
            {slide.button_text}
          </Link>
        )}
      </div>

      {/* Dot indicators */}
      {/* {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setCurrent(i); setPaused(false); }}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/75"
                }`}
            />
          ))}
        </div>
      )} */}

      {/* Arrow navigation
      {slides.length > 1 && (
        <>
          <button
            onClick={() => { setCurrent((c) => (c - 1 + slides.length) % slides.length); }}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-3 text-white backdrop-blur-sm hover:bg-black/50 transition"
          >
            ‹
          </button>
          <button
            onClick={() => { setCurrent((c) => (c + 1) % slides.length); }}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-3 text-white backdrop-blur-sm hover:bg-black/50 transition"
          >
            ›
          </button>
        </>
      )} */}
    </section>
  );
}
