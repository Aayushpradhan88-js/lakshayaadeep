"use client"

import { useEffect, useState } from "react"
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaUpload,
  FaImage,
} from "react-icons/fa"
import { FaSliders } from "react-icons/fa6"
import { getSupabaseClient } from "@/lib/supabase/supabase"

interface CarouselSlide {
  id: string
  title: string
  subtitle?: string | null
  image_url: string
  button_text?: string | null
  button_link?: string | null
  display_order: number
  is_active: boolean
  auto_slide_duration?: number | null
  updated_at?: string
}

const DEFAULT_FORM = {
  title: "",
  subtitle: "",
  image_url: "",
  button_text: "",
  button_link: "",
  display_order: 1,
  is_active: true,
  auto_slide_duration: 3,
}

export default function CarouselSlidesPage() {
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState(DEFAULT_FORM)

  const fetchSlides = async () => {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("carousel_slides")
        .select("*")
        .order("display_order", { ascending: true })

      if (error) throw error
      setSlides(data || [])
    } catch (err) {
      console.error("Failed to fetch carousel slides:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  const handleOpenModal = (slide: CarouselSlide | null = null) => {
    if (slide) {
      setEditingSlide(slide)
      setFormData({
        title: slide.title,
        subtitle: slide.subtitle || "",
        image_url: slide.image_url,
        button_text: slide.button_text || "",
        button_link: slide.button_link || "",
        display_order: slide.display_order,
        is_active: slide.is_active,
        auto_slide_duration: slide.auto_slide_duration ?? 3,
      })
    } else {
      setEditingSlide(null)
      const nextOrder = slides.length > 0 ? Math.max(...slides.map((s) => s.display_order)) + 1 : 1
      setFormData({ ...DEFAULT_FORM, display_order: nextOrder })
    }
    setIsModalOpen(true)
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const supabase = getSupabaseClient()
      const ext = file.name.split(".").pop()
      const path = `carousel-slides/${Date.now()}.${ext}`

      const { error: upErr } = await supabase.storage.from("media").upload(path, file, { upsert: true })
      if (upErr) throw upErr

      const { data } = supabase.storage.from("media").getPublicUrl(path)
      setFormData((p) => ({ ...p, image_url: data.publicUrl }))
    } catch (err) {
      console.error("Upload failed:", err)
      alert("Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const supabase = getSupabaseClient()
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        image_url: formData.image_url,
        button_text: formData.button_text || null,
        button_link: formData.button_link || null,
        display_order: formData.display_order,
        is_active: formData.is_active,
        auto_slide_duration: formData.auto_slide_duration,
        updated_at: new Date().toISOString(),
      }

      if (editingSlide) {
        const { error } = await supabase.from("carousel_slides").update(payload).eq("id", editingSlide.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("carousel_slides").insert([payload])
        if (error) throw error
      }

      setIsModalOpen(false)
      fetchSlides()
    } catch (err) {
      console.error("Failed to save slide:", err)
      alert("Error saving carousel slide")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from("carousel_slides")
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq("id", id)
      if (error) throw error
      fetchSlides()
    } catch (err) {
      console.error("Toggle active failed:", err)
      alert("Could not update slide status")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this carousel slide?")) return
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("carousel_slides").delete().eq("id", id)
      if (error) throw error
      fetchSlides()
    } catch (err) {
      console.error("Delete failed:", err)
      alert("Error deleting slide")
    }
  }

  const activeCount = slides.filter((s) => s.is_active).length

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
            <FaSliders size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Carousel Slides</h1>
            <p className="text-sm text-slate-500">
              Manage homepage hero slideshow. {activeCount} of {slides.length} slide{slides.length !== 1 ? "s" : ""} active.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700"
        >
          <FaPlus /> Add Slide
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <FaSliders className="mx-auto mb-2 h-8 w-8 animate-pulse text-slate-300" />
            Loading slides...
          </div>
        ) : slides.length === 0 ? (
          <div className="py-20 text-center text-slate-400">No carousel slides yet. Add your first slide.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Preview</th>
                  <th className="px-6 py-4">Content</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {slides.map((slide) => (
                  <tr key={slide.id} className={`transition hover:bg-slate-50 ${slide.is_active ? "bg-emerald-50/20" : ""}`}>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(slide.id, slide.is_active)}
                        className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold transition ${
                          slide.is_active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                        }`}
                      >
                        {slide.is_active ? <FaCheckCircle /> : <FaTimesCircle />}
                        {slide.is_active ? "ACTIVE" : "INACTIVE"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {slide.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={slide.image_url} alt="" className="h-12 w-20 rounded border border-slate-200 object-cover shadow-sm" />
                      ) : (
                        <div className="flex h-12 w-20 items-center justify-center rounded bg-slate-100 text-slate-300">
                          <FaImage size={12} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="line-clamp-1 font-bold text-slate-900">{slide.title}</p>
                      <p className="line-clamp-1 text-xs text-slate-500">{slide.subtitle || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                        #{slide.display_order}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">{slide.auto_slide_duration ?? 3}s</td>
                    <td className="space-x-2 px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(slide)}
                        className="rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(slide.id)}
                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-emerald-600 p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                {editingSlide ? <FaEdit /> : <FaPlus />}
                {editingSlide ? "Edit Carousel Slide" : "Add Carousel Slide"}
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-2xl font-light text-white/80 hover:text-white">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="max-h-[calc(90vh-80px)] space-y-5 overflow-y-auto p-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Title</label>
                    <input
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500"
                      placeholder="Slide title shown on hero"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Subtitle</label>
                    <textarea
                      rows={3}
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500"
                      placeholder="Optional subtitle"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Display order</label>
                      <input
                        type="number"
                        min={1}
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Slide duration (sec)</label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={formData.auto_slide_duration}
                        onChange={(e) => setFormData({ ...formData, auto_slide_duration: Number(e.target.value) })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-bold text-slate-700">Show on homepage (active)</span>
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Slide image</label>
                    <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-8 transition hover:border-emerald-400 hover:bg-emerald-50">
                      <FaUpload className={`mb-2 text-xl ${uploading ? "animate-bounce text-emerald-500" : "text-slate-400 group-hover:text-emerald-500"}`} />
                      <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-600">
                        {uploading ? "UPLOADING..." : "CLICK TO UPLOAD IMAGE"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                      />
                    </label>
                    {formData.image_url && (
                      <div className="relative mt-2 aspect-video overflow-hidden rounded-xl border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={formData.image_url} alt="" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <input
                      required
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-500 outline-none focus:border-emerald-500"
                      placeholder="Or paste image URL"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Button text (optional)</label>
                    <input
                      value={formData.button_text}
                      onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Button link (optional)</label>
                    <input
                      value={formData.button_link}
                      onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500"
                      placeholder="/project"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-2xl border border-slate-200 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="flex-1 rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
