"use client"

import { useState } from "react"
import { getSupabaseClient } from "@/lib/supabase/supabase"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FastLoading } from "@/components/shared-component/fast-loading"
import { NEPAL_DISTRICT_MAP } from "@/components/shared-component/nepal-district-map"
import type { ProjectRecord } from "@/components/shared-component/project-detail-edit-modal"

type ProjectCreateFormProps = {
  onSuccess: (project: ProjectRecord) => void
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

export function ProjectCreateForm({ onSuccess, onCancel, showToast }: ProjectCreateFormProps) {
  const supabase = getSupabaseClient()
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    province: "",
    district: "",
    tole: "",
    start_date: "",
    end_date: "",
    target_beneficiaries: "",
    organizer: "",
    status: "Draft",
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
    if (!form.category) err.category = "Category is required"
    if (!form.start_date) err.start_date = "Start date required"
    if (!form.end_date) err.end_date = "End date required"
    if (form.start_date && form.end_date && form.end_date <= form.start_date) {
      err.end_date = "End date must be after start date"
    }
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const onSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    const uploadedPaths: string[] = []
    try {
      const imageUrls: string[] = []
      const folder = `projects/${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

      for (const file of images) {
        const path = `${folder}/${Date.now()}-${sanitizeFileName(file.name)}`
        const { error: uploadErr } = await supabase.storage.from("project_gallery").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "image/jpeg",
        })
        if (uploadErr) throw new Error(`Image upload failed: ${uploadErr.message}`)
        uploadedPaths.push(path)
        const { data: urlData } = supabase.storage.from("project_gallery").getPublicUrl(path)
        if (!urlData?.publicUrl) throw new Error("Could not resolve public URL")
        imageUrls.push(urlData.publicUrl)
      }

      const { data: loc, error: locErr } = await supabase
        .from("project_location")
        .insert({ province: form.province, district: form.district, municipality: form.tole })
        .select()
        .single()
      if (locErr) throw new Error(`Location insert failed: ${locErr.message}`)

      const { data: project, error: projErr } = await supabase
        .from("project")
        .insert({
          project_title: form.title,
          description: form.description,
          category: form.category,
          location_id: loc?.id,
          start_date: form.start_date,
          end_date: form.end_date,
          target_beneficiaries: Number(form.target_beneficiaries) || null,
          project_organizer: form.organizer,
          cover_image_url: imageUrls[0] || null,
          status: form.status,
        })
        .select(`
          *,
          project_location (province, district, municipality)
        `)
        .single()
      if (projErr) throw new Error(`Project insert failed: ${projErr.message}`)

      if (imageUrls.length > 0 && project?.id) {
        const { error: galErr } = await supabase.from("project_gallery").insert(
          imageUrls.map((url) => ({ project_id: project.id, image_url: url }))
        )
        if (galErr) console.error("Gallery insert failed:", galErr.message)
      }

      showToast("Project created successfully", "success")
      onSuccess(project as ProjectRecord)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to create project."
      showToast(message, "error")
      if (uploadedPaths.length > 0) await supabase.storage.from("project_gallery").remove(uploadedPaths)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Field label="Title" error={errors.title}>
        <Input placeholder="Write your project agenda" value={form.title} onChange={(e) => set("title", e.target.value)} />
      </Field>

      <Field label="Description">
        <Textarea rows={3} placeholder="Describe the project..." value={form.description} onChange={(e) => set("description", e.target.value)} />
      </Field>

      <Field label="Category" error={errors.category}>
        <Select onValueChange={(v) => set("category", v)}>
          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>
            {["Education", "Health", "Environment", "Social", "Other"].map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            <p className="mb-1 text-xs text-muted-foreground">End Date</p>
            <Input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} />
            {errors.end_date && <p className="mt-1 text-xs text-red-500">{errors.end_date}</p>}
          </div>
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Target Beneficiaries">
          <Input type="number" placeholder="e.g. 500" value={form.target_beneficiaries} onChange={(e) => set("target_beneficiaries", e.target.value)} />
        </Field>
        <Field label="Organizer">
          <Input placeholder="Organizer name" value={form.organizer} onChange={(e) => set("organizer", e.target.value)} />
        </Field>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Project Images <span className="font-normal text-muted-foreground">({previews.length}/8)</span>
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
          {loading ? <FastLoading size="sm" variant="light" /> : "Create Project"}
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
