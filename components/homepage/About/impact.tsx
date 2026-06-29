"use client";

import Image from "next/image";

const impacts = [
  {
    id: 1,
    stat: "1200+",
    label: "Lives Impact",
    description: "We've helped improve the lives of individuals and families in need",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80",
  },
  {
    id: 2,
    stat: "1200+",
    label: "Lives Impact",
    description: "We've helped improve the lives of individuals and families in need",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80",
  },
  {
    id: 3,
    stat: "1200+",
    label: "Lives Impact",
    description: "We've helped improve the lives of individuals and families in need",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80",
  },
  {
    id: 4,
    stat: "1200+",
    label: "Lives Impact",
    description: "We've helped improve the lives of individuals and families in need",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80",
  },
];

function OurImpactSection() {
  return (
    <section className="w-full bg-white px-6 py-16">
      {/* Heading */}
      <div className="mb-10 text-center">
        <div className="mb-2 flex items-center justify-center gap-3">
          <div className="h-0.5 w-8 bg-cyan-300" />
          <span className="text-sm font-semibold text-cyan-400">Our Impact</span>
          <div className="h-0.5 w-8 bg-cyan-300" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900">Creating Real Change Together</h2>
      </div>

      {/* Grid */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Large left image */}
        <div className="relative overflow-hidden rounded-2xl lg:row-span-2 min-h-[400px]">
          <Image
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"
            alt="Impact"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* 4 impact cards */}
        {impacts.map((item) => (
          <div
            key={item.id}
            className="flex overflow-hidden rounded-2xl bg-gray-100"
          >
            {/* Text */}
            <div className="flex flex-1 flex-col justify-center p-5">
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-cyan-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-bold text-gray-800">{item.stat}</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              </div>
              <div className="mb-2 h-0.5 w-8 bg-cyan-300" />
              <p className="text-xs leading-relaxed text-gray-600">{item.description}</p>
            </div>

            {/* Image */}
            <div className="relative w-32 flex-shrink-0 overflow-hidden rounded-r-2xl">
              <Image
                src={item.image}
                alt={item.label}
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OurImpactSection