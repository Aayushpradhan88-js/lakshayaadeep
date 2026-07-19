"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { getSupabaseClient } from "@/lib/supabase/supabase"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FastLoading } from "@/components/shared-component/fast-loading"
import { AdminDetailModal } from "@/components/shared-component/admin-detail-modal"
import { AdminImageUpload } from "@/components/shared-component/admin-image-upload"
import { NEPAL_DISTRICT_MAP } from "@/components/shared-component/nepal-district-map"

export type EventRecord = {
  id: string
  event_title: string
  description: string
  category: string
  location: string
  event_location?: {
    province: string
    district: string
    municipality: string
  }
  start_date: string
  end_date: string
  organizer: string
  cover_event_image_url: string
  status: string
  created_at: string
}

type GalleryItem = { id: string; image_url: string }

type EventDetailEditModalProps = {
  event: EventRecord
  onClose: () => void
  onSaved: (event: EventRecord) => void
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

const toDateInput = (value?: string) => (value ? value.split("T")[0] : "")

export function EventDetailEditModal({ event, onClose, onSaved, showToast }: EventDetailEditModalProps) {
  const [form, setForm] = useState({
    title: event.event_title || "",
    description: event.description || "",
    organizer: event.organizer || "",
    status: event.status || "Draft",
    province: event.event_location?.province || "",
    district: event.event_location?.district || "",
    tole: event.event_location?.municipality || "",
    start_date: toDateInput(event.start_date),
    end_date: toDateInput(event.end_date),
  })
  const [coverUrl, setCoverUrl] = useState(event.cover_event_image_url || "")
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [removedGalleryIds, setRemovedGalleryIds] = useState<string[]>([])
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([])
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([])
  const [loadingGallery, setLoadingGallery] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (key: string, val: string) => setForm((prev) => ({ ...prev, [key]: val }))

  useEffect(() => {
    const fetchGallery = async () => {
      setLoadingGallery(true)
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from("event_gallery")
          .select("id, image_url")
          .eq("event_id", event.id)

        if (error) throw error
        setGallery(data || [])
      } catch (error) {
        console.error("Error fetching event gallery:", error)
        setGallery([])
      } finally {
        setLoadingGallery(false)
      }
    }

    fetchGallery()
  }, [event.id])

  const handleCoverChange = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverUrl(URL.createObjectURL(file))
  }

  const handleGalleryAdd = (files: FileList | null) => {
    if (!files?.length) return
    const incoming = Array.from(files)
    const total = gallery.length - removedGalleryIds.length + newGalleryFiles.length + incoming.length
    if (total > 8) {
      setErrors((prev) => ({ ...prev, gallery: "Maximum 8 gallery images allowed" }))
      return
    }
    setErrors((prev) => ({ ...prev, gallery: "" }))
    setNewGalleryFiles((prev) => [...prev, ...incoming])
    setNewGalleryPreviews((prev) => [...prev, ...incoming.map((f) => URL.createObjectURL(f))])
  }

  const removeNewGalleryImage = (index: number) => {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index))
    setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingGalleryImage = (id: string) => {
    setRemovedGalleryIds((prev) => [...prev, id])
  }

  const validate = () => {
    const err: Record<string, string> = {}
    if (!form.title.trim()) err.title = "Title is required"
    if (!form.start_date) err.start_date = "Start date is required"
    if (form.start_date && form.end_date && form.end_date < form.start_date) {
      err.end_date = "End date cannot be before start date"
    }
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)

    try {
      const supabase = getSupabaseClient()
      let nextCoverUrl = coverUrl

      if (coverFile) {
        const folder = `events/${event.id}/${Date.now()}`
        const path = `${folder}/${sanitizeFileName(coverFile.name)}`
        const { error: uploadErr } = await supabase.storage
          .from("event_cover_image_url")
          .upload(path, coverFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: coverFile.type || "image/jpeg",
          })
        if (uploadErr) throw new Error(`Cover upload failed: ${uploadErr.message}`)
        const { data: urlData } = supabase.storage.from("event_cover_image_url").getPublicUrl(path)
        if (!urlData?.publicUrl) throw new Error("Could not resolve cover image URL")
        nextCoverUrl = urlData.publicUrl
      }

      if (event.location) {
        const { error: locErr } = await supabase
          .from("event_location")
          .update({
            province: form.province,
            district: form.district,
            municipality: form.tole,
          })
          .eq("id", event.location)
        if (locErr) throw new Error(`Location update failed: ${locErr.message}`)
      } else if (form.province || form.district || form.tole) {
        const { data: loc, error: locErr } = await supabase
          .from("event_location")
          .insert({
            province: form.province,
            district: form.district,
            municipality: form.tole,
          })
          .select()
          .single()
        if (locErr) throw new Error(`Location insert failed: ${locErr.message}`)
        await supabase.from("event").update({ location: loc.id }).eq("id", event.id)
      }

      if (removedGalleryIds.length > 0) {
        const { error: delErr } = await supabase.from("event_gallery").delete().in("id", removedGalleryIds)
        if (delErr) throw new Error(`Gallery delete failed: ${delErr.message}`)
      }

      const newGalleryUrls: string[] = []
      if (newGalleryFiles.length > 0) {
        const folder = `events/${event.id}/gallery/${Date.now()}`
        for (let i = 0; i < newGalleryFiles.length; i++) {
          const file = newGalleryFiles[i]
          const path = `${folder}/${i}-${sanitizeFileName(file.name)}`
          const { error: uploadErr } = await supabase.storage.from("event_gallery").upload(path, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type || "image/jpeg",
          })
          if (uploadErr) throw new Error(`Gallery upload failed: ${uploadErr.message}`)
          const { data: urlData } = supabase.storage.from("event_gallery").getPublicUrl(path)
          if (!urlData?.publicUrl) throw new Error("Could not resolve gallery image URL")
          newGalleryUrls.push(urlData.publicUrl)
        }

        const { error: galErr } = await supabase.from("event_gallery").insert(
          newGalleryUrls.map((url) => ({ event_id: event.id, image_url: url }))
        )
        if (galErr) throw new Error(`Gallery insert failed: ${galErr.message}`)
      }

      const { data: updated, error: updateErr } = await supabase
        .from("event")
        .update({
          event_title: form.title.trim(),
          description: form.description.trim(),
          organizer: form.organizer.trim(),
          status: form.status,
          start_date: form.start_date,
          end_date: form.end_date || null,
          cover_event_image_url: nextCoverUrl || null,
        })
        .eq("id", event.id)
        .select(`
          *,
          event_location (
            province,
            district,
            municipality
          )
        `)
        .single()

      if (updateErr) throw new Error(`Event update failed: ${updateErr.message}`)

      showToast("Event updated successfully", "success")
      onSaved(updated as EventRecord)
      onClose()
    } catch (error) {
      console.error("Error saving event:", error)
      showToast(error instanceof Error ? error.message : "Failed to update event", "error")
    } finally {
      setSaving(false)
    }
  }

  const visibleGallery = gallery.filter((item) => !removedGalleryIds.includes(item.id))

  return (
    <AdminDetailModal
      title="Edit Event"
      onClose={onClose}
      footer={
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex flex-1 items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? <FastLoading size="sm" variant="light" /> : "Save Changes"}
          </button>
        </div>
      }
    >
      <div className="rounded-lg bg-slate-50 p-3">
        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-black">
          Cover Image
        </label>
        {coverUrl ? (
          <div className="relative mb-2 h-32 w-full overflow-hidden rounded-lg border border-slate-200">
            <Image
              src={coverUrl}
              alt="Cover"
              fill
              className="object-cover"
              sizes="100vw"
              unoptimized
            />
          </div>
        ) : (
          <p className="mb-2 text-xs text-slate-500">No cover image</p>
        )}
        <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500 hover:border-emerald-500 hover:bg-emerald-50">
          Change cover image
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCoverChange(e.target.files)} />
        </label>
      </div>

      <Field label="Title" error={errors.title}>
        <Input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          className="h-9 text-sm"
        />
      </Field>

      <Field label="Description">
        <Textarea
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className="text-sm"
        />
      </Field>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Organizer">
          <Input
            value={form.organizer}
            onChange={(e) => set("organizer", e.target.value)}
            className="h-9 text-sm"
          />
        </Field>
        <Field label="Status">
          <Select value={form.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Draft", "Ongoing", "Upcoming", "Completed"].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Start Date" error={errors.start_date}>
          <Input
            type="date"
            value={form.start_date}
            onChange={(e) => set("start_date", e.target.value)}
            className="h-9 text-sm"
          />
        </Field>
        <Field label="End Date" error={errors.end_date}>
          <Input
            type="date"
            value={form.end_date}
            onChange={(e) => set("end_date", e.target.value)}
            className="h-9 text-sm"
          />
        </Field>
      </div>

      <Field label="Location">
        <div className="grid grid-cols-3 gap-1.5">
          <Select
            value={form.province}
            onValueChange={(v) => {
              set("province", v)
              set("district", "")
            }}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Province" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(NEPAL_DISTRICT_MAP).map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={form.district} onValueChange={(v) => set("district", v)} disabled={!form.province}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              {(NEPAL_DISTRICT_MAP[form.province] || []).map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Tole"
            value={form.tole}
            onChange={(e) => set("tole", e.target.value)}
            className="h-9 text-xs"
          />
        </div>
      </Field>

      <div className="rounded-lg bg-slate-50 p-3">
        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-black">
          Gallery Images
        </label>
        {loadingGallery ? (
          <p className="text-xs text-slate-500">Loading images...</p>
        ) : (
          <>
            {visibleGallery.length > 0 && (
              <div className="mb-2 grid grid-cols-4 gap-1.5">
                {visibleGallery.map((item) => (
                  <div key={item.id} className="group relative aspect-square overflow-hidden rounded-md border border-slate-200">
                    <Image
                      src={item.image_url}
                      alt="Gallery"
                      fill
                      className="object-cover"
                      sizes="25vw"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingGalleryImage(item.id)}
                      className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <AdminImageUpload
              label="Add gallery"
              previews={newGalleryPreviews}
              onAdd={handleGalleryAdd}
              onRemove={removeNewGalleryImage}
              coverLabel="New"
            />
            {errors.gallery && <p className="mt-1 text-xs text-red-500">{errors.gallery}</p>}
          </>
        )}
      </div>
    </AdminDetailModal>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-black">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
