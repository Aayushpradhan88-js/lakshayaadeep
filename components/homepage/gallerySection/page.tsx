"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { fetchProgramGalleryImages } from "@/lib/gallery"
import type { GalleryImage } from "@/components/shared-component/program-gallery-section"

const HOMEPAGE_GALLERY_LIMIT = 8

export default function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await fetchProgramGalleryImages({ limit: HOMEPAGE_GALLERY_LIMIT })
        setImages(data)
      } catch (error) {
        console.error("Error fetching gallery images:", error)
        setImages([])
      } finally {
        setLoading(false)
      }
    }

    loadGallery()
  }, [])

  if (loading || images.length === 0) return null

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Glimpses of Hope</h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-black">
            Take a look at our recent activities and the impact we&apos;re making together.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-xl bg-slate-200 shadow-sm"
            >
              <Image
                src={img.url}
                alt={img.alt ?? "Gallery image"}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-emerald-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-700 md:px-10 md:py-4 md:text-lg"
          >
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  )
}
