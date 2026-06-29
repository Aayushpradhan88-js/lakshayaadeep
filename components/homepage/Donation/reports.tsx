"use client";

import { useState } from "react";
import Image from "next/image";

const reports = [
  {
    id: 1,
    title: "Education Drive 2024",
    date: "March 2024",
    raised: "Rs. 1,25,000",
    beneficiaries: 340,
    category: "Education",
    summary:
      "Distributed school supplies, uniforms, and books to 340 children across 5 rural districts in Nepal.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80",
    tag: "Completed",
    tagColor: "bg-green-100 text-green-700",
  },
  {
    id: 2,
    title: "Clean Water Initiative",
    date: "January 2024",
    raised: "Rs. 2,80,000",
    beneficiaries: 620,
    category: "Clean Water",
    summary:
      "Installed 12 water purification units in Sindhupalchok and Dolakha districts, providing clean drinking water.",
    image: "https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=600&q=80",
    tag: "Completed",
    tagColor: "bg-green-100 text-green-700",
  },
  {
    id: 3,
    title: "Healthcare Camp — Humla",
    date: "February 2024",
    raised: "Rs. 95,500",
    beneficiaries: 210,
    category: "Healthcare",
    summary:
      "Free medical check-ups, medicine distribution, and maternal health support for 210 residents of Humla.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
    tag: "Completed",
    tagColor: "bg-green-100 text-green-700",
  },
  {
    id: 4,
    title: "Community Livelihood Program",
    date: "April 2024",
    raised: "Rs. 3,40,000",
    beneficiaries: 155,
    category: "Livelihood",
    summary:
      "Vocational training and micro-loan support for 155 women entrepreneurs across Kaski and Lamjung.",
    image: "https://images.unsplash.com/photo-1593113616828-6f22bca04804?w=600&q=80",
    tag: "Ongoing",
    tagColor: "bg-orange-100 text-brand",
  },
  {
    id: 5,
    title: "Disaster Relief — Flood 2023",
    date: "October 2023",
    raised: "Rs. 5,10,000",
    beneficiaries: 890,
    category: "Relief",
    summary:
      "Emergency food kits, tarpaulins, and hygiene packages delivered to 890 flood-affected families in Terai.",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80",
    tag: "Completed",
    tagColor: "bg-green-100 text-green-700",
  },
  {
    id: 6,
    title: "Youth Leadership Summit",
    date: "December 2023",
    raised: "Rs. 68,000",
    beneficiaries: 120,
    category: "Education",
    summary:
      "3-day leadership workshop for 120 youth from 10 districts, focused on civic engagement and entrepreneurship.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    tag: "Completed",
    tagColor: "bg-green-100 text-green-700",
  },
];

export default function DonorReportsModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<(typeof reports)[0] | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Impact Reports</h2>
            <p className="text-xs text-gray-400">
              Transparency in every rupee donated
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Report list */}
          <div
            className={`overflow-y-auto ${selected ? "hidden md:flex md:w-2/5 md:flex-col" : "w-full"} border-r border-gray-100`}
          >
            {reports.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50 ${
                  selected?.id === r.id ? "bg-cyan-50 border-l-4 border-cyan-400" : "border-l-4 border-transparent"
                }`}
              >
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
                  <Image src={r.image} alt={r.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-800">{r.title}</p>
                  <p className="text-xs text-gray-400">{r.date} · {r.category}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.tagColor}`}>
                      {r.tag}
                    </span>
                    <span className="text-xs font-semibold text-cyan-500">{r.raised}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="flex-1 overflow-y-auto">
              {/* Back on mobile */}
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-1 px-4 pt-4 text-xs font-medium text-gray-500 hover:text-gray-800 md:hidden"
              >
                ← Back
              </button>

              {/* Image */}
              <div className="relative h-52 w-full">
                <Image
                  src={selected.image}
                  alt={selected.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-5">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${selected.tagColor}`}>
                    {selected.tag}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="mb-1 text-xs text-gray-400">{selected.date} · {selected.category}</p>
                <h3 className="mb-3 text-xl font-bold text-gray-800">{selected.title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-gray-600">{selected.summary}</p>

                {/* Stats */}
                <div className="mb-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-cyan-50 p-4 text-center">
                    <p className="text-xl font-bold text-cyan-500">{selected.raised}</p>
                    <p className="mt-1 text-xs text-gray-500">Total Raised</p>
                  </div>
                  <div className="rounded-xl bg-orange-50 p-4 text-center">
                    <p className="text-xl font-bold text-brand">{selected.beneficiaries}+</p>
                    <p className="mt-1 text-xs text-gray-500">Beneficiaries</p>
                  </div>
                </div>

                {/* Progress bar */}
                <p className="mb-1 text-xs font-semibold text-gray-500">Fund Utilization</p>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-cyan-400" style={{ width: "88%" }} />
                </div>
                <p className="mt-1 text-right text-xs text-gray-400">88% directly to programs</p>

                <button className="mt-5 w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-600 transition">
                  Donate to This Cause
                </button>
              </div>
            </div>
          )}

          {/* Empty state on desktop when nothing selected */}
          {!selected && (
            <div className="hidden flex-1 items-center justify-center md:flex">
              <p className="text-sm text-gray-400">Select a report to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}