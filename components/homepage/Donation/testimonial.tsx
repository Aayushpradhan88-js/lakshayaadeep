"use client";

import Image from "next/image";

const testimonials = [
  {
    id: 1,
    quote:
      "Always friendly, honest services. Comparable price and good advice. I appreciate the ride to work too and delivered to my work the same day it broke down",
    name: "Brandon Munson",
    role: "CTO, Design",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    position: "top-left",
  },
  {
    id: 2,
    quote:
      "We offer a variety of service to help you get back on the road and keep your life safer and provide easy care tips. Always friendly, honest service. Comparable price and good advice. I appreciate the ride to work too and delivered to my work the same day it broke down",
    name: "Brandon Munson",
    role: "CTO, Design",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    position: "center",
  },
  {
    id: 3,
    quote:
      "Always friendly, honest services. Comparable price and good advice. I appreciate the ride to work too and delivered to my work the same day it broke down",
    name: "Brandon Munson",
    role: "CTO, Design",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    position: "top-right",
  },
];

function TestimonialCard({
  quote,
  name,
  role,
  image,
  align = "left",
}: {
  quote: string;
  name: string;
  role: string;
  image: string;
  align?: "left" | "center" | "right";
}) {
  const isCenter = align === "center";

  return (
    <div className={`flex flex-col ${align === "right" ? "items-end" : align === "center" ? "items-center" : "items-start"}`}>
      {/* Quote bubble */}
      <div
        className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${
          isCenter ? "max-w-sm" : "max-w-xs"
        }`}
      >
        <p className={`leading-relaxed text-gray-600 ${isCenter ? "text-sm" : "text-xs"}`}>
          {quote}
        </p>
      </div>

      {/* Connector line */}
      <div className="h-8 w-px bg-gray-300" />

      {/* Avatar + name */}
      <div
        className={`flex items-end gap-3 ${
          align === "right" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-800">
            {name}
          </p>
          <p className="text-xs text-gray-400">{role}</p>
        </div>
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
      </div>
    </div>
  );
}

function DonorTestimonialsSection() {
  return (
    <section className="w-full bg-white px-6 py-16">
      <h2 className="mb-14 text-center text-2xl font-bold text-gray-800">
        Donor Testimonials
      </h2>

      {/* Desktop layout */}
      <div className="mx-auto hidden max-w-5xl grid-cols-3 items-start gap-8 lg:grid">
        {/* Top-left — starts high */}
        <div className="mt-0">
          <TestimonialCard
            quote={testimonials[0].quote}
            name={testimonials[0].name}
            role={testimonials[0].role}
            image={testimonials[0].image}
            align="left"
          />
        </div>

        {/* Center — starts lower */}
        <div className="mt-24">
          <TestimonialCard
            quote={testimonials[1].quote}
            name={testimonials[1].name}
            role={testimonials[1].role}
            image={testimonials[1].image}
            align="center"
          />
        </div>

        {/* Top-right — starts high */}
        <div className="mt-0">
          <TestimonialCard
            quote={testimonials[2].quote}
            name={testimonials[2].name}
            role={testimonials[2].role}
            image={testimonials[2].image}
            align="right"
          />
        </div>
      </div>

      {/* Mobile layout — stacked */}
      <div className="flex flex-col items-center gap-10 lg:hidden">
        {testimonials.map((t) => (
          <TestimonialCard
            key={t.id}
            quote={t.quote}
            name={t.name}
            role={t.role}
            image={t.image}
            align="center"
          />
        ))}
      </div>
    </section>
  );
}

export default DonorTestimonialsSection