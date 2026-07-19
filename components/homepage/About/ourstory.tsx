"use client";

import Image from "next/image";
import { BookOpen, Globe2, HandHeart, Users } from "lucide-react";
import { typography } from "@/lib/typography";

const photos = [
  { src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80", alt: "Aid work", className: "row-span-2" },
  { src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80", alt: "Community hands" },
  { src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80", alt: "Healthcare" },
  { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80", alt: "Volunteers" },
];

const milestones = [
  { value: "2003", label: "Founded with one mission" },
  { value: "32+", label: "Communities reached" },
  { value: "2.4M+", label: "Lives touched" },
];

const highlights = [
  {
    icon: HandHeart,
    title: "Listen first",
    text: "We partner with local leaders to co-design programs that communities own.",
  },
  {
    icon: Globe2,
    title: "Rooted in Nepal",
    text: "Context-grounded work across education, health, and sustainable development.",
  },
  {
    icon: Users,
    title: "Youth-led change",
    text: "A passionate team building dignity, opportunity, and hope together.",
  },
];

function OurStorySection() {
  return (
    <section className="w-full bg-white px-6 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <p className={`mb-4 ${typography.overline} text-brand-accent`}>Our Story</p>

          <p className={`mb-6 ${typography.body} text-black`}>
            Lakshyadeep was born from a simple conviction — that every person deserves dignity,
            opportunity, and the chance to flourish.
          </p>

          <div className="mb-8 grid grid-cols-3 gap-3">
            {milestones.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-brand-accent/15 bg-brand-accent-light/40 px-3 py-4 text-center"
              >
                <p className="text-xl font-bold text-brand-accent sm:text-2xl">{item.value}</p>
                <p className={`mt-1 ${typography.caption} text-black`}>{item.label}</p>
              </div>
            ))}
          </div>

          <ul className="mb-8 space-y-4">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className={`mt-0.5 ${typography.bodySm} text-black`}>{item.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
            <BookOpen className="h-4 w-4" aria-hidden />
            Read Our Story
          </button>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-3">
          <div className="relative row-span-2 min-h-[280px] overflow-hidden rounded-2xl">
            <Image
              src={photos[0].src}
              alt={photos[0].alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>
          <div className="relative h-[134px] overflow-hidden rounded-2xl">
            <Image
              src={photos[1].src}
              alt={photos[1].alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative h-[134px] overflow-hidden rounded-2xl">
              <Image
                src={photos[2].src}
                alt={photos[2].alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 25vw, 12vw"
              />
            </div>
            <div className="relative h-[134px] overflow-hidden rounded-2xl">
              <Image
                src={photos[3].src}
                alt={photos[3].alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 25vw, 12vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurStorySection;
