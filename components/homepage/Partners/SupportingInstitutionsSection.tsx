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
  return (
    <section id="partners" className="w-full border-t border-gray-100 bg-slate-50 px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-grey-900 sm:text-5xl lg:text-6xl">
            Supporting <span className="font-light text-brand">Institutions</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-500 md:text-base">
            We collaborate with municipalities, schools, volunteer networks, and allied organizations across Nepal.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {SUPPORTING_INSTITUTIONS.map((partner) => {
            const Icon = ICON_MAP[partner.icon]
            return (
              <div
                key={partner.id}
                className="flex min-h-[160px] flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:min-h-[180px] md:p-7"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${partner.iconBg} md:h-[72px] md:w-[72px]`}
                >
                  <Icon className={`h-8 w-8 md:h-9 md:w-9 ${partner.iconColor}`} aria-hidden />
                </div>
                <p className="text-sm font-medium leading-snug text-gray-700">{partner.name}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
