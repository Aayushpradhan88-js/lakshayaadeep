"use client"

import Image from "next/image"
// import { Eye, HeartHandshake, Target, type LucideIcon } from "lucide-react"

// const pillars: {
//   id: number
//   title: string
//   body: string
//   icon: LucideIcon
//   iconBg: string
//   iconColor: string
// }[] = [
//   {
//     id: 1,
//     title: "Our Mission",
//     body: "To empower communities and individuals through education, health and sustainable development",
//     icon: Target,
//     iconBg: "bg-orange-100",
//     iconColor: "text-brand",
//   },
//   {
//     id: 2,
//     title: "Our Vision",
//     body: "A world where everyone has equal opportunities to thrive in a safe, health and inclusive society",
//     icon: Eye,
//     iconBg: "bg-cyan-100",
//     iconColor: "text-cyan-600",
//   },
//   {
//     id: 3,
//     title: "Our Values",
//     body: "Compassion, Integrity, Transparency, Inclusivity and Accountability in everything we do",
//     icon: HeartHandshake,
//     iconBg: "bg-emerald-100",
//     iconColor: "text-emerald-600",
//   },
// ]

function AboutSection() {
  return (
    <section id="about" className="w-full bg-white px-6 pb-16 pt-10 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center md:mb-12">
          {/* <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand">About Us</p> */}
          {/* <h1 className="text-3xl font-bold text-gray-900 md:text-4xl"> */}
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-grey-900 sm:text-5xl lg:text-6xl">
            About <span className="font-light text-brand">Lakshyadeep</span>
          </h2>
        </div>

        {/* Top — text + image */}
        <div className="mb-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Left */}
          <div>
            <h3 className="text-4xl font-bold leading-tight">
              <span className="text-brand">We Are Here</span>
              <br />
              <span className="text-gray-800">to Make a Difference</span>
            </h3>
            {/* <div className="mt-3 h-0.5 w-12 bg-orange-400" /> */}
            <p className="mt-5 max-w-md text-sm leading-relaxed text-gray-500">
              Lakshyadeep is a non-profit organization working towards building
              a better, fairer and sustainable Nepal. We believe every individual
              deserves the opportunity to live with dignity and hope.
            </p>
            {/* <button className="mt-8 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition">
              Learn More About Us
            </button> */}
          </div>

          {/* Right — image */}
          <div className="relative h-72 w-full overflow-hidden rounded-2xl lg:h-80">
            <Image
              src="/team3.jpg"
              alt="We need your help"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Bottom — 3 pillar cards */}
        {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:gap-8">
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
                <h3 className="text-lg font-bold text-gray-800 md:text-xl">{p.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-500 md:text-base">{p.body}</p>
            </div>
            )
          })}
        </div> */}
      </div>
    </section>
  )
}

export default AboutSection