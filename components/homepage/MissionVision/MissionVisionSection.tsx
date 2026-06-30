// import { MISSION_VISION_OBJECTIVES } from "@/components/homepage/home-content"
"use client"

import { Eye, Target, TreePine, type LucideIcon } from "lucide-react"
export default function MissionVisionSection() {


  const pillars: {
    id: number
    title: string
    body: string
    icon: LucideIcon
    iconBg: string
    iconColor: string
  }[] = [
      {
        id: 1,
        title: "Our Mission",
        body: "To empower communities and individuals through education, health and sustainable development",
        icon: Target,
        iconBg: "bg-orange-100",
        iconColor: "text-brand",
      },
      {
        id: 2,
        title: "Our Vision",
        body: "A world where everyone has equal opportunities to thrive in a safe, health and inclusive society",
        icon: Eye,
        iconBg: "bg-cyan-100",
        iconColor: "text-cyan-600",
      },
      {
        id: 3,
        title: "Our Objectives",
        body: "Restore ecosystems, raise environmental awareness, strengthen local partnerships, and deliver transparent programs communities own and sustain.",
        icon: TreePine,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },
    ]
  return (
    <section id="mission-vision" className="w-full bg-slate-50 px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          {/* <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand">Who We Are</p> */}
          {/* <h2 className="text-3xl font-bold text-gray-900 md:text-4xl"> */}
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-grey-900 sm:text-5xl lg:text-6xl">
            Mission, Vision <span className="font-light text-brand">&amp; Objectives</span>
          </h2>
          {/* <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-black md:text-base">
            Our purpose guides every project, event, and partnership — from classrooms to villages across Nepal.
          </p> */}
        </div>

        {/* <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {MISSION_VISION_OBJECTIVES.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light">
                <span className="text-sm font-bold text-brand">{item.title.charAt(0)}</span>
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">{item.title}</h3>
              <p className="text-sm leading-relaxed text-black">{item.body}</p>
            </div>
          ))}
        </div> */}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:gap-8">
          {pillars.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.id}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-7 md:p-8"
              >
                <div className="mb-5 flex items-center gap-4">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${p.iconBg}`}>
                    <Icon className={`h-6 w-6 ${p.iconColor}`} aria-hidden />
                  </div>
                  <h3 className="text-lg font-bold text-black md:text-xl">{p.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-black md:text-base">{p.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
