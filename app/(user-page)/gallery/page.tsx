"use client"

import { useEffect, useState } from "react"
import Footer from "@/components/shared-component/footer/page"
import Header from "@/components/homepage/Header/header"
import ProgramGallerySection, {
  type GalleryImage,
} from "@/components/shared-component/program-gallery-section"
import { fetchProgramGalleryImages } from "@/lib/gallery"

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await fetchProgramGalleryImages()
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

  return (
    <div className="animate-reveal-up">
      <Header />
      <ProgramGallerySection
        id="gallery"
        title="Our"
        titleAccent="Gallery"
        subtitle="Explore moments of impact and hope from our projects and events across Nepal."
        images={images}
        loading={loading}
        emptyMessage="Gallery photos will appear here as projects and events are documented."
      />
      <Footer />
    </div>
  )
}
