"use client";

import Image from "next/image";

const breakdown = [
  { label: "Direct Programs", percent: 60, color: "#E05A3A" },
  { label: "Education Support", percent: 20, color: "#4A7C59" },
  { label: "Community Outreach", percent: 12, color: "#D4A96A" },
  { label: "Admin & Operations", percent: 8, color: "#E8DFC8" },
];

const photos = [
  { src: "https://images.unsplash.com/photo-1593113616828-6f22bca04804?w=600&q=80", alt: "Aid distribution", className: "row-span-2" },
  { src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80", alt: "Team unity" },
  { src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80", alt: "Healthcare" },
  { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80", alt: "Volunteers" },
];

function MoneyGoesSection() {
  return (
    <section className="w-full bg-white px-6 py-16">
      {/* Heading */}
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold">
          <span className="text-brand">Where Your Money</span>{" "}
          <span className="text-cyan-400">Goes</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-black leading-relaxed">
          We believe in complete transparency. Every rupee donated is tracked,
          reported, and used for maximum impact.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left — Legend */}
        <div className="flex items-center gap-8">
          {/* Big % */}
          <span className="text-5xl font-black text-black">88%</span>

          {/* Breakdown list */}
          <div className="flex flex-col gap-5 flex-1">
            {breakdown.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span
                  className="h-8 w-8 flex-shrink-0 rounded-md"
                  style={{ background: item.color }}
                />
                <span className="flex-1 text-sm text-gray-700">{item.label}</span>
                <span className="text-sm font-semibold text-gray-700">{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Photo grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3">
          {/* Large left image spanning 2 rows */}
          <div className="relative row-span-2 overflow-hidden rounded-2xl">
            <Image
              src={photos[0].src}
              alt={photos[0].alt}
              fill
              className="object-cover"
            />
          </div>
          {/* Top right */}
          <div className="relative h-40 overflow-hidden rounded-2xl">
            <Image src={photos[1].src} alt={photos[1].alt} fill className="object-cover" />
          </div>
          {/* Bottom right — split into 2 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative h-40 overflow-hidden rounded-2xl">
              <Image src={photos[2].src} alt={photos[2].alt} fill className="object-cover" />
            </div>
            <div className="relative h-40 overflow-hidden rounded-2xl">
              <Image src={photos[3].src} alt={photos[3].alt} fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MoneyGoesSection
