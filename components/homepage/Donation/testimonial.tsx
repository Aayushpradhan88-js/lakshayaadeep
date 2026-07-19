"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote:
      "Supporting Lakshyadeep has been one of the most meaningful decisions I've made. Every update shows how my contribution directly reaches communities — from tree plantation drives to school support programs. Their transparency and local-first approach made giving easy and rewarding.",
    name: "Ankita Shrestha",
    role: "Volunteer & Donor",
    image: "/clearn-forest.jpg",
  },
  {
    id: 2,
    quote:
      "I've donated to several organizations, but Lakshyadeep stands out for how deeply they engage with communities. The health camp they organized in our area reached families who had never seen a doctor. Knowing my donation made that possible keeps me committed.",
    name: "Bikash Rai",
    role: "Community Partner, Morang",
    image: "/mission-vision.jpeg",
  },
  {
    id: 3,
    quote:
      "What impressed me most was seeing the impact firsthand. After contributing to their education initiative, I visited the school and met students who now have desks, books, and a brighter future. Lakshyadeep doesn't just ask for support — they show you the change.",
    name: "Rajesh Karki",
    role: "School Coordinator & Donor",
    image: "/banner/project/project-card.jpg",
  },
  {
    id: 4,
    quote:
      "Their reforestation project transformed barren land in our ward into a green belt. As a donor, I received regular updates and was invited to the plantation drive. It felt like being part of something bigger than a transaction — a real community movement.",
    name: "Sunita Sharma",
    role: "Community Leader, Sunsari",
    image: "/banner/About/about-img.jpg",
  },
];

const AUTO_SCROLL_MS = 6000;

export default function DonorTestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [timerKey, setTimerKey] = useState(0);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, AUTO_SCROLL_MS);
    return () => clearInterval(timer);
  }, [goNext, timerKey]);

  const handleManual = (direction: "prev" | "next") => {
    if (direction === "prev") goPrev();
    else goNext();
    setTimerKey((k) => k + 1);
  };

  const active = testimonials[current];

  return (
    <section className="w-full bg-slate-100 px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center md:mb-16">
          <p className="text-xs font-semibold uppercase  text-brand md:text-sm">
            What Our Donors Say
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold uppercase tracking-[0.08em] text-brand-dark sm:text-4xl md:text-5xl">
            Donor Testimonials
          </h2>
        </div>

        <div className="relative flex items-center gap-4 md:gap-8">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => handleManual("prev")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-300/70 text-white transition hover:bg-gray-400/80 md:h-14 md:w-14"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.5] md:h-8 md:w-8" />
          </button>

          <div className="min-w-0 flex-1 overflow-hidden">
            <div
              key={active.id}
              className="grid animate-in fade-in duration-500 grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16"
            >
              <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden bg-white shadow-sm md:max-w-none">
                <Image
                  src={active.image}
                  alt={active.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 80vw, 40vw"
                  priority
                />
              </div>

              <div className="flex flex-col justify-center px-2 md:px-0">
                <p className="font-serif text-base leading-relaxed text-gray-900 md:text-lg lg:text-xl">
                  &ldquo;{active.quote}&rdquo;
                </p>
                <p className="mt-8 text-sm font-bold uppercase  text-brand md:text-base">
                  {active.name}
                </p>
                <p className="mt-2 text-sm font-bold uppercase  text-brand-dark md:text-base">
                  {active.role}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => handleManual("next")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-300/70 text-white transition hover:bg-gray-400/80 md:h-14 md:w-14"
          >
            <ChevronRight className="h-6 w-6 stroke-[2.5] md:h-8 md:w-8" />
          </button>
        </div>

        <div className="mt-10 flex justify-center gap-2">
          {testimonials.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Go to testimonial ${index + 1}`}
              onClick={() => {
                setCurrent(index);
                setTimerKey((k) => k + 1);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${index === current ? "w-8 bg-brand" : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
