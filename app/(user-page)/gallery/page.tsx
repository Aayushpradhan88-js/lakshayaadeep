"use client"

import React, { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/supabase'
import Image from 'next/image'
import Footer from '@/components/shared-component/footer/page'
import Header from '@/components/homepage/Header/header'

const GalleryPage = () => {
  const [images, setImages] = useState<{ name: string; url: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const supabase = getSupabaseClient()

      // List all files in the 'gallery' bucket
      const { data, error } = await supabase.storage
        .from('gallery')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        })

      if (error) {
        console.error('Error fetching gallery images:', error)
        return
      }

      if (data) {
        // Filter out any hidden files or empty folders
        const validFiles = data.filter(file => !file.name.startsWith('.'))

        const imageUrls = validFiles.map((file) => {
          const { data: { publicUrl } } = supabase.storage
            .from('gallery')
            .getPublicUrl(file.name)

          return {
            name: file.name,
            url: publicUrl
          }
        })

        setImages(imageUrls)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-reveal-up">
      <Header />
      <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Our Gallery</h1>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
              Explore moments of impact and hope from our various initiatives.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center text-slate-500 py-12 bg-white rounded-xl shadow-sm border border-slate-200">
              <p className="text-lg">No images found in the gallery.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((img) => (
                <div key={img.name} className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-square bg-slate-200">
                  <Image
                    src={img.url}
                    alt={img.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default GalleryPage