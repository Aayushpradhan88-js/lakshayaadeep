"use client";

import Image from "next/image";

const values = [
  {
    id: 1,
    title: "Sustain the Planet",
    description:
      "Our environment program restore ecosystem, promote clean energy access, community we serve",
  },
  {
    id: 2,
    title: "Sustain the Planet",
    description:
      "Our environment program restore ecosystem, promote clean energy access, community we serve",
  },
  {
    id: 3,
    title: "Sustain the Planet",
    description:
      "Our environment program restore ecosystem, promote clean energy access, community we serve",
  },
  {
    id: 4,
    title: "Sustain the Planet",
    description:
      "Our environment program restore ecosystem, promote clean energy access, community we serve",
  },
  {
    id: 5,
    title: "Sustain the Planet",
    description:
      "Our environment program restore ecosystem, promote clean energy access, community we serve",
  },
  {
    id: 6,
    title: "Sustain the Planet",
    description:
      "Our environment program restore ecosystem, promote clean energy access, community we serve",
  },
];

export default function ValuesSection() {
  return (
    <section className="w-full bg-white px-6 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2">

        {/* Left Column */}
        <div className="flex flex-col justify-between">
          {/* Text */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand ">
              What We Stand For
            </p>
            <h2 className="text-4xl font-bold leading-tight text-gray-900">
              Values That Unite
            </h2>
            <h2 className="text-4xl font-bold text-brand">
              Our Global Team
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-black">
              Across every office, every time zone, and every cultural content—
              these six values guide how we work, lead and serve
            </p>
          </div>

          {/* Two images side by side */}
          <div className="mt-10 flex gap-4">
            <div className="relative h-52 w-1/2 overflow-hidden rounded-2xl">
              <Image
                src="/ourteams.png"
                alt="Team working"
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="relative h-52 w-1/2 overflow-hidden rounded-2xl">
              <Image
                src="/team3.jpg"
                alt="Team together"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Right Column — Values Grid */}
        <div className="rounded-3xl border border-slate-100 bg-slate-50/60 p-6">
          <div className="grid grid-cols-2 gap-6">
            {values.map((value) => (
              <div key={value.id} className="flex flex-col gap-2">
                {/* Icon */}
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-cyan-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-black">
                  {value.title}
                </h3>
                <p className="text-xs leading-relaxed text-black">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}