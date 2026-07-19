"use client"

import {
  GraduationCap,
  Handshake,
  Landmark,
  Leaf,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react"
import { SUPPORTING_INSTITUTIONS } from "@/components/homepage/home-content"

const ICON_MAP: Record<(typeof SUPPORTING_INSTITUTIONS)[number]["icon"], LucideIcon> = {
  landmark: Landmark,
  "graduation-cap": GraduationCap,
  leaf: Leaf,
  users: Users,
  handshake: Handshake,
  sprout: Sprout,
}

export default function SupportingInstitutionsSection() {
  const trackItems = [...SUPPORTING_INSTITUTIONS, ...SUPPORTING_INSTITUTIONS]

  return (
    <section id="partners" className="w-full border-t border-gray-100 bg-slate-50 px-4 py-16 md:px-8 md:py-20">
      <style>{`
        @keyframes supportingInstitutionsMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .supporting-institutions-track {
          display: flex;
          width: max-content;
          gap: 1.25rem;
          animation: supportingInstitutionsMarquee 30s linear infinite;
        }
        .supporting-institutions-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-black sm:text-5xl lg:text-6xl">
            Supporting <span className="font-light text-black">Institutions</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-black md:text-base">
            We collaborate with municipalities, schools, volunteer networks, and allied organizations across Nepal.
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-slate-50 to-transparent sm:w-16"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-slate-50 to-transparent sm:w-16"
            aria-hidden
          />

          <div className="supporting-institutions-track py-1">
            {trackItems.map((partner, index) => {
              const Icon = ICON_MAP[partner.icon]
              return (
                <div
                  key={`${partner.id}-${index}`}
                  className="flex w-[180px] shrink-0 flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:w-[200px] md:min-h-[180px] md:p-7"
                >
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${partner.iconBg} md:h-[72px] md:w-[72px]`}
                  >
                    <Icon className={`h-8 w-8 md:h-9 md:w-9 ${partner.iconColor}`} aria-hidden />
                  </div>
                  <p className="text-sm font-medium leading-snug text-black">{partner.name}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
