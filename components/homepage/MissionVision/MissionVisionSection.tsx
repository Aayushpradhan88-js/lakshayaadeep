import Image from "next/image"
import { Eye, Target, TreePine, type LucideIcon } from "lucide-react"

type Pillar = {
  id: number
  title: string
  body?: string
  items?: string[]
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

const pillars: Pillar[] = [
  {
    id: 1,
    title: "Our Mission",
    body: "To empower and mobilize youth by equipping them with knowledge and skills to drive innovation for a youth-friendly Nation.",
    icon: Target,
    iconBg: "bg-orange-100",
    iconColor: "text-brand",
  },
  {
    id: 2,
    title: "Our Vision",
    body: "Lakshyadeep envisions a youth friendly society.",
    icon: Eye,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    id: 3,
    title: "Our Objectives",
    items: [
      "Provide skill-based, practical, and life-useful training to youth and adolescents to enhance their capacity and leadership for social transformation.",
      "Foster intergenerational dialogue to promote youth participation in decision-making.",
      "Organize programs to promote self-reliance, youth entrepreneurship, financial literacy, and personal financial development.",
    ],
    icon: TreePine,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
]

export default function MissionVisionSection() {
  return (
    <section id="mission-vision" className="w-full bg-slate-50 py-16 md:py-20">
      <div className="mx-auto mb-10 max-w-6xl px-4 text-center md:mb-12 md:px-8">
        <h2 className="text-4xl font-bold tracking-tight text-grey-900 sm:text-5xl lg:text-6xl">
          Mission, Vision <span className="font-light text-brand">&amp; Objectives</span>
        </h2>
      </div>

      <div className="relative w-full">
        <div className="relative min-h-[420px] w-full sm:min-h-[480px] md:min-h-[560px] lg:min-h-[620px]">
          <Image
            src="/mission-vision.jpeg"
            alt="Lakshyadeep team at Chia Manthan"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={false}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"
            aria-hidden
          />

          <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-6 pt-16 sm:px-6 sm:pb-8 md:px-8 md:pb-10">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-3 md:gap-5 lg:gap-6">
              {pillars.map((p) => {
                const Icon = p.icon
                return (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-white/20 bg-white/95 p-5 shadow-xl backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white md:p-6"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${p.iconBg}`}
                      >
                        <Icon className={`h-5 w-5 ${p.iconColor}`} aria-hidden />
                      </div>
                      <h3 className="text-base font-bold text-black md:text-lg">{p.title}</h3>
                    </div>
                    {p.body ? (
                      <p className="text-sm leading-relaxed text-black/90">{p.body}</p>
                    ) : null}
                    {p.items ? (
                      <ul className="space-y-2.5 text-sm leading-relaxed text-black/90">
                        {p.items.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                              aria-hidden
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
