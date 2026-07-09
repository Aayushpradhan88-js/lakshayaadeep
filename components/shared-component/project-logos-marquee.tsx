"use client"

import Image from "next/image"
import type { ProjectLogo } from "@/lib/project-logos"

type ProjectLogosMarqueeProps = {
  logos: ProjectLogo[]
}

export default function ProjectLogosMarquee({ logos }: ProjectLogosMarqueeProps) {
  if (logos.length === 0) {
    return null
  }

  const trackLogos = [...logos, ...logos]

  return (
    <section className="w-full border-b border-gray-100 bg-white py-10 md:py-12">
      <style>{`
        @keyframes projectLogosMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .project-logos-track {
          display: flex;
          width: max-content;
          gap: 1.25rem;
          animation: projectLogosMarquee 35s linear infinite;
        }
        .project-logos-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-7 px-4 sm:gap-9 md:flex-row md:gap-12 lg:px-8">
        <div className="shrink-0 text-center md:min-w-[160px] md:text-left">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-black md:text-4xl">
            Our
            <br />
            Partners
          </h2>
        </div>

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-16"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-16"
            aria-hidden
          />

          <div className="project-logos-track py-1">
            {trackLogos.map((logo, index) => (
              <div
                key={`${logo.src}-${index}`}
                className="flex h-[84px] w-[140px] shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:h-24 sm:w-[160px]"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={140}
                  height={84}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
