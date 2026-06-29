"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
      "Installed 12 water purification units in Sindhupalchok and Dolakha, providing clean drinking water.",
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
      "Free medical check-ups, medicine distribution, and maternal health support for 210 residents.",
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
      "Emergency food kits, tarpaulins, and hygiene packages delivered to 890 flood-affected families.",
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
      "3-day leadership workshop for 120 youth from 10 districts on civic engagement and entrepreneurship.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    tag: "Completed",
    tagColor: "bg-green-100 text-green-700",
  },
];

type Report = (typeof reports)[0];

function DetailModal({ report, onClose }: { report: Report; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Image */}
        <div className="relative h-52 w-full">
          <Image src={report.image} alt={report.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-white/80 px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-white"
          >
            ✕
          </button>
          <span className={`absolute bottom-3 left-4 rounded-full px-3 py-1 text-xs font-semibold ${report.tagColor}`}>
            {report.tag}
          </span>
        </div>

        <div className="p-6">
          <p className="mb-1 text-xs text-gray-400">{report.date} · {report.category}</p>
          <h3 className="mb-2 text-xl font-bold text-gray-800">{report.title}</h3>
          <p className="mb-5 text-sm leading-relaxed text-gray-600">{report.summary}</p>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-cyan-50 p-4 text-center">
              <p className="text-lg font-bold text-cyan-500">{report.raised}</p>
              <p className="mt-0.5 text-xs text-gray-500">Total Raised</p>
            </div>
            <div className="rounded-xl bg-orange-50 p-4 text-center">
              <p className="text-lg font-bold text-brand">{report.beneficiaries}+</p>
              <p className="mt-0.5 text-xs text-gray-500">Beneficiaries</p>
            </div>
          </div>

          <p className="mb-1 text-xs font-semibold text-gray-500">Fund Utilization</p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-cyan-400" style={{ width: "88%" }} />
          </div>
          <p className="mt-1 text-right text-xs text-gray-400">88% directly to programs</p>
          
          <Link href="/donation">
            <button className="mt-5 w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-600 transition">
              Donate to This Cause
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function DonorReportsModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<Report | null>(null);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div className="relative flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Impact Reports</h2>
              <p className="text-xs text-gray-400">Transparency in every rupee donated</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 transition"
            >
              ✕
            </button>
          </div>

          {/* Cards grid */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition text-left"
                >
                  {/* Card image */}
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      className="object-cover transition group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className={`absolute bottom-2 left-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${r.tagColor}`}>
                      {r.tag}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    <p className="mb-0.5 text-xs text-gray-400">{r.date} · {r.category}</p>
                    <h3 className="mb-2 text-sm font-bold text-gray-800 line-clamp-1">{r.title}</h3>
                    <p className="mb-3 text-xs leading-relaxed text-gray-500 line-clamp-2">{r.summary}</p>

                    {/* Stats row */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">Raised</p>
                        <p className="text-sm font-bold text-cyan-500">{r.raised}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Beneficiaries</p>
                        <p className="text-sm font-bold text-brand">{r.beneficiaries}+</p>
                      </div>
                    </div>

                    {/* Mini progress */}
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-cyan-400" style={{ width: "88%" }} />
                    </div>
                    <p className="mt-0.5 text-right text-xs text-gray-400">88% to programs</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail modal on card click */}
      {selected && (
        <DetailModal report={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

export default DonorReportsModal