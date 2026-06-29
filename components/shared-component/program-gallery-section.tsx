"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"

export type GalleryImage = {
  id: string
  url: string
  alt?: string
}

type ProgramGallerySectionProps = {
  id?: string
  title: string
  titleAccent: string
  subtitle?: string
  images: GalleryImage[]
  loading?: boolean
  emptyMessage?: string
  viewAllHref?: string
  viewAllLabel?: string
}

export default function ProgramGallerySection({
  id = "gallery",
  title,
  titleAccent,
  subtitle,
  images,
  loading = false,
  emptyMessage = "No gallery images available yet.",
  viewAllHref,
  viewAllLabel = "View full gallery",
}: ProgramGallerySectionProps) {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null)

  return (
    <section id={id} className="w-full bg-white px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center md:mb-14">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {title} <span className="font-light text-brand">{titleAccent}</span>
          </h2>
          {subtitle ? (
            <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-500 md:text-base">{subtitle}</p>
          ) : null}
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          </div>
        ) : images.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-slate-50 px-6 py-16 text-center text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveImage(img)}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? "Gallery image"}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
              </button>
            ))}
          </div>
        )}

        {viewAllHref && images.length > 0 ? (
          <div className="mt-10 text-center">
            <Link
              href={viewAllHref}
              className="inline-flex items-center justify-center rounded-md border border-brand-accent px-8 py-3 text-sm font-bold uppercase tracking-wider text-brand-accent transition hover:bg-brand-accent-light"
            >
              {viewAllLabel}
            </Link>
          </div>
        ) : null}
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            aria-label="Close image"
            onClick={() => setActiveImage(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative h-[min(80vh,720px)] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage.url}
              alt={activeImage.alt ?? "Gallery image"}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      ) : null}
    </section>
  )
}
