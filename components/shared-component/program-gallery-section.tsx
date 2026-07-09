"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import { FastLoading } from "@/components/shared-component/fast-loading"

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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!activeImage) return

    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = "hidden"
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveImage(null)
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [activeImage])

  return (
    <section id={id} className="w-full bg-white px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center md:mb-14">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {title} <span className="font-light text-brand">{titleAccent}</span>
          </h2>
          {subtitle ? (
            <p className="mx-auto mt-4 max-w-2xl text-sm text-black md:text-base">{subtitle}</p>
          ) : null}
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <FastLoading size="md" />
          </div>
        ) : images.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-slate-50 px-6 py-16 text-center text-black">
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

      {activeImage && mounted
        ? createPortal(
            <div
              className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden overscroll-none bg-black/80 p-4 backdrop-blur-sm"
              onClick={() => setActiveImage(null)}
            >
              <div
                className="relative w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative mx-auto h-[min(80vh,720px)] w-full overflow-hidden rounded-lg">
                  <button
                    type="button"
                    aria-label="Close image"
                    onClick={() => setActiveImage(null)}
                    className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <Image
                    src={activeImage.url}
                    alt={activeImage.alt ?? "Gallery image"}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    draggable={false}
                  />
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </section>
  )
}
