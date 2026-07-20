"use client";

import { useEffect, useState } from "react";
import { Globe2, HandHeart, Users } from "lucide-react";
import {
  ImageFadeCarousel,
  type ImageFadeCarouselSlide,
} from "@/components/shared-component/image-fade-carousel";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/supabase";
import { typography } from "@/lib/typography";

const FALLBACK_STORY_SLIDES: ImageFadeCarouselSlide[] = [
  {
    id: "about-fellowship",
    src: "/banner/About/about-img.jpg",
    alt: "Lakshyadeep fellowship and welcome program",
  },
  {
    id: "our-team",
    src: "/banner/Our-team/main.jpg",
    alt: "Lakshyadeep team members",
  },
  {
    id: "community-event",
    src: "/banner/event/event-img.jpg",
    alt: "Community event and outreach",
  },
  {
    id: "project-impact",
    src: "/banner/project/project-img.JPG",
    alt: "Project work in the community",
  },
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
  const [slides, setSlides] = useState<ImageFadeCarouselSlide[]>(FALLBACK_STORY_SLIDES);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let cancelled = false;

    (async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("story_images")
          .select("id, image_url, alt_text, display_order")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (cancelled || error || !data?.length) return;

        setSlides(
          data.map((slide) => ({
            id: slide.id,
            src: slide.image_url,
            alt: slide.alt_text ?? "Lakshyadeep story",
          })),
        );
      } catch (err) {
        console.error("Error fetching our story slides:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="w-full bg-white px-6 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Our <span className="font-light text-brand">Story</span>
          </h2>

          <p className={`mb-6 ${typography.body} text-text-body`}>
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
                <p className={`mt-1 ${typography.caption} text-text-body`}>{item.label}</p>
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
                    <p className={`mt-0.5 ${typography.bodySm} text-text-body`}>{item.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>

        </div>

        <ImageFadeCarousel
          slides={slides}
          autoPlaySec={5}
          className="mx-auto aspect-[4/3] w-full min-h-[320px] rounded-2xl border border-gray-100 bg-white shadow-lg sm:min-h-[400px] lg:ml-auto lg:min-h-[520px] lg:max-w-none"
        />
      </div>
    </section>
  );
}

export default OurStorySection;
