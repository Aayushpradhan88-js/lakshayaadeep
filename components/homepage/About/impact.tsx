"use client";

import Image from "next/image";
import { GraduationCap, HeartPulse, Leaf, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { typography } from "@/lib/typography";

type ImpactItem = {
  id: number;
  stat: string;
  label: string;
  tag: string;
  icon: LucideIcon;
  accent: string;
  image: string;
};

const impacts: ImpactItem[] = [
  {
    id: 1,
    stat: "1200+",
    label: "Lives Impacted",
    tag: "Education",
    icon: GraduationCap,
    accent: "bg-cyan-100 text-cyan-600",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80",
  },
  {
    id: 2,
    stat: "85+",
    label: "Active Volunteers",
    tag: "Community",
    icon: Users,
    accent: "bg-orange-100 text-brand",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80",
  },
  {
    id: 3,
    stat: "48",
    label: "Health Camps",
    tag: "Healthcare",
    icon: HeartPulse,
    accent: "bg-rose-100 text-rose-600",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
  },
  {
    id: 4,
    stat: "120",
    label: "Green Initiatives",
    tag: "Sustainability",
    icon: Leaf,
    accent: "bg-emerald-100 text-emerald-600",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80",
  },
];

function OurImpactSection() {
  return (
    <section className="w-full bg-white px-6 py-16">
      <div className="mb-10 text-center">
        <p className={`mb-3 ${typography.overline} text-brand-accent`}>Our Impact</p>
        <h2 className={typography.h2}>Creating Real Change Together</h2>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="relative min-h-[400px] overflow-hidden rounded-2xl lg:row-span-2">
          <Image
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"
            alt="Community impact"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <p className="text-3xl font-bold">1200+</p>
            <p className="text-sm text-white/85">Lives changed through your support</p>
          </div>
        </div>

        {impacts.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm"
            >
              <div className="relative h-32 w-full">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-700 shadow-sm">
                  {item.tag}
                </span>
              </div>

              <div className="flex items-center gap-3 p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.accent}`}>
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{item.stat}</p>
                  <p className={`${typography.caption} text-black`}>{item.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default OurImpactSection;
