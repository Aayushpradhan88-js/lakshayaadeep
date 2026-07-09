"use client"

import { useState } from "react"
import { getSupabaseClient } from "@/lib/supabase/supabase"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FastLoading } from "@/components/shared-component/fast-loading"
import { NEPAL_DISTRICT_MAP } from "@/components/shared-component/nepal-district-map"
import type { EventRecord } from "@/components/shared-component/event-detail-edit-modal"

type EventCreateFormProps = {
  onSuccess: (event: EventRecord) => void
  onCancel: () => void
  showToast: (message: string, type: "success" | "error") => void
}

const sanitizeFileName = (name: string) => {
  const dot = name.lastIndexOf(".")
  const base =
    (dot >= 0 ? name.slice(0, dot) : name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image"
  const ext = dot >= 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "jpg"
  return `${base}.${ext}`
}

export function EventCreateForm({ onSuccess, onCancel, showToast }: EventCreateFormProps) {
  const supabase = getSupabaseClient()
  const [form, setForm] = useState({
    title: "",
    description: "",
    province: "",
    district: "",
    tole: "",
    start_date: "",
    end_date: "",
    organizer: "",
  })
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }))

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages((prev) => [...prev, ...files].slice(0, 8))
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))].slice(0, 8))
  }

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
    setPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const validate = () => {
    const err: Record<string, string> = {}
    if (!form.title) err.title = "Title is required"
    if (!form.start_date) err.start_date = "Start date required"
    if (form.start_date && form.end_date && form.end_date < form.start_date) {
      err.end_date = "End date cannot be before start date"
    }
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const onSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    const uploadedPaths: string[] = []
    try {
      const folder = `events/${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      let coverImageUrl: string | null = null

      if (images.length > 0) {
        const coverFile = images[0]
        const coverPath = `${folder}/${Date.now()}-${sanitizeFileName(coverFile.name)}`
        const { error: coverErr } = await supabase.storage.from("event_cover_image_url").upload(coverPath, coverFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: coverFile.type || "image/jpeg",
        })
        if (coverErr) throw new Error(`Cover image upload failed: ${coverErr.message}`)
        uploadedPaths.push(coverPath)
        const { data: coverUrlData } = supabase.storage.from("event_cover_image_url").getPublicUrl(coverPath)
        if (!coverUrlData?.publicUrl) throw new Error("Could not resolve cover image URL")
        coverImageUrl = coverUrlData.publicUrl
      }

      const galleryImageUrls: string[] = []
      for (let i = 1; i < images.length; i++) {
        const file = images[i]
        const path = `${folder}/${Date.now()}-${i}-${sanitizeFileName(file.name)}`
        const { error: uploadErr } = await supabase.storage.from("event_gallery").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "image/jpeg",
        })
        if (uploadErr) throw new Error(`Gallery image upload failed: ${uploadErr.message}`)
        uploadedPaths.push(path)
        const { data: urlData } = supabase.storage.from("event_gallery").getPublicUrl(path)
        if (!urlData?.publicUrl) throw new Error("Could not resolve gallery image URL")
        galleryImageUrls.push(urlData.publicUrl)
      }

      const { data: loc, error: locErr } = await supabase
        .from("event_location")
        .insert({ province: form.province, district: form.district, municipality: form.tole })
        .select()
        .single()
      if (locErr) throw new Error(`Location insert failed: ${locErr.message}`)

      const { data: event, error: projErr } = await supabase
        .from("event")
        .insert({
          event_title: form.title,
          description: form.description,
          location: loc?.id,
          start_date: form.start_date,
          end_date: form.end_date || null,
          organizer: form.organizer,
          cover_event_image_url: coverImageUrl,
        })
        .select(`
          *,
          event_location (province, district, municipality)
        `)
        .single()
      if (projErr) throw new Error(`Event insert failed: ${projErr.message}`)

      if (event?.id) {
        const galleryEntries = []
        if (coverImageUrl) galleryEntries.push({ event_id: event.id, image_url: coverImageUrl })
        galleryEntries.push(...galleryImageUrls.map((url) => ({ event_id: event.id, image_url: url })))
        if (galleryEntries.length > 0) {
          const { error: galErr } = await supabase.from("event_gallery").insert(galleryEntries)
          if (galErr) console.error("Gallery insert failed:", galErr.message)
        }
      }

      showToast("Event created successfully", "success")
      onSuccess(event as EventRecord)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to create event."
      showToast(message, "error")
      if (uploadedPaths.length > 0) await supabase.storage.from("event_gallery").remove(uploadedPaths)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Field label="Title" error={errors.title}>
        <Input placeholder="Write your event agenda" value={form.title} onChange={(e) => set("title", e.target.value)} />
      </Field>

      <Field label="Description">
        <Textarea rows={3} placeholder="Describe the event..." value={form.description} onChange={(e) => set("description", e.target.value)} />
      </Field>

      <Field label="Location">
        <div className="grid grid-cols-3 gap-2">
          <Select onValueChange={(v) => { set("province", v); set("district", "") }}>
            <SelectTrigger><SelectValue placeholder="Province" /></SelectTrigger>
            <SelectContent>
              {Object.keys(NEPAL_DISTRICT_MAP).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={form.district} onValueChange={(v) => set("district", v)} disabled={!form.province}>
            <SelectTrigger><SelectValue placeholder="District" /></SelectTrigger>
            <SelectContent>
              {(NEPAL_DISTRICT_MAP[form.province] || []).map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input placeholder="Tole / Street" value={form.tole} onChange={(e) => set("tole", e.target.value)} />
        </div>
      </Field>

      <Field label="Timeline">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Start Date</p>
            <Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
            {errors.start_date && <p className="mt-1 text-xs text-red-500">{errors.start_date}</p>}
          </div>
          <div>
            <p className="mb-1 text-xs text-muted-foreground">End Date (optional)</p>
            <Input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} />
            {errors.end_date && <p className="mt-1 text-xs text-red-500">{errors.end_date}</p>}
          </div>
        </div>
      </Field>

      <Field label="Organizer">
        <Input placeholder="Organizer name" value={form.organizer} onChange={(e) => set("organizer", e.target.value)} />
      </Field>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Event Images <span className="font-normal text-muted-foreground">({previews.length}/8)</span>
        </label>
        <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-3 text-sm hover:border-emerald-500 hover:bg-emerald-50">
          {previews.length === 0 ? "Click to upload images" : "Add more images"}
          <input type="file" multiple accept="image/*" className="hidden" disabled={previews.length >= 8} onChange={handleImages} />
        </label>
        {previews.length > 0 && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {previews.map((src, i) => (
              <div key={src} className="group relative aspect-square overflow-hidden rounded-lg border">
                <img src={src} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
                {i === 0 && <span className="absolute bottom-1 left-1 rounded bg-emerald-800 px-1.5 py-0.5 text-[9px] text-white">Cover</span>}
                <button type="button" onClick={() => removeImage(i)} className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-xs text-white opacity-0 group-hover:opacity-100">×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button className="flex-1 bg-emerald-700 hover:bg-emerald-600" onClick={onSubmit} disabled={loading}>
          {loading ? <FastLoading size="sm" variant="light" /> : "Create Event"}
        </Button>
      </div>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
