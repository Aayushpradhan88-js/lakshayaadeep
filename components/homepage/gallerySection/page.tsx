"use client"

import React, { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/supabase'
import Image from 'next/image'
import Link from 'next/link'

const GallerySection = () => {
  const [images, setImages] = useState<{ name: string; url: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const supabase = getSupabaseClient()
      
      // List all files in the 'gallery' bucket, limit to 8 for the homepage
      const { data, error } = await supabase.storage
        .from('gallery')
        .list('', {
          limit: 8,
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

  if (loading || images.length === 0) return null; // Don't show the section if loading or empty

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Glimpses of Hope</h2>
          <p className="mt-4 max-w-2xl text-xl text-black mx-auto">
            Take a look at our recent activities and the impact we're making together.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.name} className="group relative rounded-xl overflow-hidden shadow-sm aspect-square bg-slate-200">
              <Image 
                src={img.url} 
                alt={img.name} 
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/gallery" 
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors md:py-4 md:text-lg md:px-10"
          >
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  )
}

export default GallerySection