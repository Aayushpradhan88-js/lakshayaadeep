"use client";

import Image from "next/image";

const photos = [
  { src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80", alt: "Aid work", className: "row-span-2" },
  { src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80", alt: "Community hands" },
  { src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80", alt: "Healthcare" },
  { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80", alt: "Volunteers" },
];

function OurStorySection() {
  return (
    <section className="w-full bg-white px-6 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm font-semibold text-cyan-400">Our Story</span>
            <div className="h-0.5 w-6 bg-cyan-400" />
          </div>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            HopeForward was born in 2003 from a simple conviction — that every
            human being deserves dignity, opportunity, and the chance to flourish.
            Five people. One rented office in Manhattan. One relentless idea. Today
            we operate across 32 countries, touching over 2.4 million lives.
          </p>
          <p className="mb-8 text-sm leading-relaxed text-gray-600">
            We don't parachute in with pre-built solutions. We listen first. We
            partner with local communities and grassroots leaders to co-design
            programs that are contextually grounded and sustainably owned. Our model
            has been recognized by the UN and independently verified by GiveWell and
            Charity Navigator.
          </p>
          <button className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
            Read Our Story
          </button>
        </div>

        {/* Right — photo grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3">
          {/* Tall left image */}
          <div className="relative row-span-2 overflow-hidden rounded-2xl min-h-[280px]">
            <Image src={photos[0].src} alt={photos[0].alt} fill className="object-cover" />
          </div>
          {/* Top right */}
          <div className="relative h-[134px] overflow-hidden rounded-2xl">
            <Image src={photos[1].src} alt={photos[1].alt} fill className="object-cover" />
          </div>
          {/* Bottom right — 2 stacked */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative h-[134px] overflow-hidden rounded-2xl">
              <Image src={photos[2].src} alt={photos[2].alt} fill className="object-cover" />
            </div>
            <div className="relative h-[134px] overflow-hidden rounded-2xl">
              <Image src={photos[3].src} alt={photos[3].alt} fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


export default OurStorySection