"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type ImageFadeCarouselSlide = {
  id: string;
  src: string;
  alt?: string;
};

type ImageFadeCarouselProps = {
  slides: ImageFadeCarouselSlide[];
  /** Auto-advance interval in seconds. Defaults to 5. */
  autoPlaySec?: number;
  className?: string;
};

function CarouselImage({
  src,
  alt,
  active,
  sizes,
}: {
  src: string;
  alt: string;
  active: boolean;
  sizes: string;
}) {
  const isOptimizable = src.startsWith("/") || src.includes(".supabase.co/storage/");

  if (isOptimizable) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={active}
        sizes={sizes}
        className={cn(
          "object-cover object-center transition-opacity duration-[1200ms] ease-in-out",
          active ? "opacity-100" : "opacity-0",
        )}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn(
        "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1200ms] ease-in-out",
        active ? "opacity-100" : "opacity-0",
      )}
    />
  );
}

export function ImageFadeCarousel({
  slides,
  autoPlaySec = 5,
  className,
}: ImageFadeCarouselProps) {
  const [current, setCurrent] = useState(0);

  const count = slides.length;
  const canLoop = count > 1;
  const activeIndex = count > 0 ? current % count : 0;

  const advance = useCallback(() => {
    setCurrent((c) => (c + 1) % count);
  }, [count]);

  useEffect(() => {
    if (!canLoop) return;
    const timer = setTimeout(advance, Math.max(1, autoPlaySec) * 1000);
    return () => clearTimeout(timer);
  }, [current, canLoop, autoPlaySec, advance]);

  if (count === 0) return null;

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      aria-roledescription="carousel"
      aria-label="Image gallery"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0"
          aria-hidden={i !== activeIndex}
        >
          <CarouselImage
            src={slide.src}
            alt={slide.alt ?? "Gallery slide"}
            active={i === activeIndex}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      ))}
    </div>
  );
}
