import Image from "next/image"

const stats = [
  { id: 1, number: "5,000", label: "Lives impacted" },
  { id: 2, number: "850+", label: "Communities Served" },
  { id: 3, number: "20+", label: "Active Volunteers" },
  { id: 4, number: "98%", label: "Funds to event" },
] as const

export default function ImpactStatsSection() {
  return (
    <section id="impact" className="relative w-full min-h-[85vh] overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Image
          src="/banner/About/about-img.jpg"
          alt="Community background"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/80" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center text-white md:px-8 md:py-20">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Numbers That Tell <span className="font-light text-brand">Our Story</span>
        </h2>
        <p className="mt-4 max-w-3xl text-sm text-slate-200 sm:text-base">
          We measure impact through the lives touched, the communities served, and the volunteers who stand with us.
          Every number reflects a story of hope, dignity, and lasting change.
        </p>

        <div className="mt-12 grid w-full grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center text-center">
              <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{stat.number}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-200 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
