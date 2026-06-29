'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '../../../../../../lib/supabase/supabase'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select'

const districtMap: Record<string, string[]> = {
  'Koshi': ['Taplejung', 'Panchthar', 'Ilam', 'Jhapa', 'Morang', 'Sunsari'],
  'Madhesh': ['Saptari', 'Siraha', 'Dhanusa', 'Mahottari', 'Sarlahi'],
  'Bagmati': ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Chitwan', 'Makwanpur'],
  'Gandaki': ['Kaski', 'Gorkha', 'Lamjung', 'Tanahu', 'Syangja'],
  'Lumbini': ['Rupandehi', 'Kapilvastu', 'Dang', 'Banke', 'Bardiya'],
  'Karnali': ['Surkhet', 'Dailekh', 'Jumla', 'Dolpa', 'Humla'],
  'Sudurpashchim': ['Kailali', 'Kanchanpur', 'Doti', 'Achham', 'Bajura'],
}

export default function CreateProjectPage() {
  const router = useRouter()
  const supabase = getSupabaseClient()

  const [form, setForm] = useState({
    title: '', description: '', category: '',
    province: '', district: '', tole: '',
    start_date: '', end_date: '',
    target_budget: '', actual_budget: '',
    target_beneficiaries: '', organizer: '',
    status: 'Draft',
  })
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }))

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(prev => {
      const merged = [...prev, ...files].slice(0, 8)
      return merged
    })
    setPreviews(prev => {
      const newPreviews = files.map(f => URL.createObjectURL(f))
      return [...prev, ...newPreviews].slice(0, 8)
    })
  }

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx))
    setPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const validate = () => {
    const err: Record<string, string> = {}
    if (!form.title) err.title = 'Title is required'
    if (!form.category) err.category = 'Category is required'
    if (!form.start_date) err.start_date = 'Start date required'
    if (!form.end_date) err.end_date = 'End date required'
    if (form.start_date && form.end_date && form.end_date <= form.start_date)
      err.end_date = 'End date must be after start date'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const sanitizeFileName = (name: string) => {
    const dot = name.lastIndexOf('.')
    const base = (dot >= 0 ? name.slice(0, dot) : name)
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'image'
    const ext = dot >= 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '') : 'jpg'
    return `${base}.${ext}`
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
        const { error: uploadErr } = await supabase.storage.from('project_gallery').upload(path, file, {
          cacheControl: '3600', upsert: false, contentType: file.type || 'image/jpeg',
        })
        if (uploadErr) throw new Error(`Image upload failed: ${uploadErr.message}`)
        uploadedPaths.push(path)
        const { data: urlData } = supabase.storage.from('project_gallery').getPublicUrl(path)
        if (!urlData?.publicUrl) throw new Error('Could not resolve public URL')
        imageUrls.push(urlData.publicUrl)
      }

      const { data: loc, error: locErr } = await supabase
        .from('project_location')
        .insert({ province: form.province, district: form.district, municipality: form.tole })
        .select().single()
      if (locErr) throw new Error(`Location insert failed: ${locErr.message}`)

      const { data: project, error: projErr } = await supabase
        .from('project')
        .insert({
          project_title: form.title, description: form.description, category: form.category,
          location_id: loc?.id, start_date: form.start_date, end_date: form.end_date,
          target_budget: Number(form.target_budget) || null,
          actual_budget: Number(form.actual_budget) || null,
          target_beneficiaries: Number(form.target_beneficiaries) || null,
          project_organizer: form.organizer, cover_image_url: imageUrls[0] || null,
          status: form.status,
        })
        .select().single()
      if (projErr) throw new Error(`Project insert failed: ${projErr.message}`)

      if (imageUrls.length > 0 && project?.id) {
        const { error: galErr } = await supabase.from('project_gallery').insert(
          imageUrls.map((url, idx) => ({ project_id: project.id, image_url: url, is_cover: idx === 0 }))
        )
        if (galErr) console.error('Gallery insert failed:', galErr.message)
      }

      router.push('/dashboard/project')
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to create project.'
      console.error('Create project error:', e)
      if (uploadedPaths.length > 0) await supabase.storage.from('project_gallery').remove(uploadedPaths)
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-8">
      <h2 className="text-xl font-semibold text-center mb-7">Create Project</h2>

      {/* Title */}
      <Field label="Title" error={errors.title}>
        <Input
          placeholder="Write your project agenda"
          value={form.title}
          onChange={e => set('title', e.target.value)}
        />
      </Field>

      {/* Description */}
      <Field label="Description">
        <Textarea
          rows={4}
          placeholder="Describe the project goals and impact..."
          value={form.description}
          onChange={e => set('description', e.target.value)}
        />
      </Field>

      {/* Category */}
      <Field label="Category" error={errors.category}>
        <Select onValueChange={v => set('category', v)}>
          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>
            {['Education', 'Health', 'Environment', 'Social', 'Other'].map(c =>
              <SelectItem key={c} value={c}>{c}</SelectItem>
            )}
          </SelectContent>
        </Select>
      </Field>

      {/* <Field label="Current Status">
        <Select onValueChange={v => set('status', v)} defaultValue={form.status}>
          <SelectTrigger><SelectValue placeholder="Select current status" /></SelectTrigger>
          <SelectContent>
            {['Draft', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'].map(c =>
              <SelectItem key={c} value={c}>{c}</SelectItem>
            )}
          </SelectContent>
        </Select>
      </Field> */}

      {/* Location */}
      <Field label="Location">
        <div className="grid grid-cols-3 gap-2">
          <Select onValueChange={v => { set('province', v); set('district', '') }}>
            <SelectTrigger><SelectValue placeholder="Province" /></SelectTrigger>
            <SelectContent>
              {Object.keys(districtMap).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select onValueChange={v => set('district', v)} disabled={!form.province}>
            <SelectTrigger><SelectValue placeholder="District" /></SelectTrigger>
            <SelectContent>
              {(districtMap[form.province] || []).map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input placeholder="Tole / Street" value={form.tole} onChange={e => set('tole', e.target.value)} />
        </div>
      </Field>

      {/* Timeline */}
      <Field label="Timeline">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Start Date</p>
            <Input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} />
            {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">End Date</p>
            <Input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} />
            {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
          </div>
        </div>
      </Field>

      {/* Budget */}
      <Field label="Budget">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Target Budget</p>
            <Input type="number" placeholder="रू" value={form.target_budget} onChange={e => set('target_budget', e.target.value)} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Actual Budget</p>
            <Input type="number" placeholder="रू" value={form.actual_budget} onChange={e => set('actual_budget', e.target.value)} />
          </div>
        </div>
      </Field>

      {/* Beneficiaries + Organizer */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Field label="Target Beneficiaries">
          <Input type="number" placeholder="e.g. 500" value={form.target_beneficiaries} onChange={e => set('target_beneficiaries', e.target.value)} />
        </Field>
        <Field label="Organizer">
          <Input placeholder="Organizer name" value={form.organizer} onChange={e => set('organizer', e.target.value)} />
        </Field>
      </div>

      {/* Images */}
      <div className="mb-7">
        <label className="text-sm font-medium mb-2 block">
          Project Images
          <span className="text-muted-foreground font-normal ml-1">({previews.length}/8)</span>
        </label>

        {/* Upload button */}
        <label
          htmlFor="img-upload"
          className={`flex items-center justify-center gap-2 w-full border border-dashed rounded-lg py-3 px-4 cursor-pointer transition-colors text-sm
            ${previews.length >= 8
              ? 'opacity-50 cursor-not-allowed border-muted text-muted-foreground'
              : 'border-input hover:border-green-700 hover:bg-green-50 text-muted-foreground hover:text-green-800'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          {previews.length === 0 ? 'Click to upload images' : 'Add more images'}
        </label>
        <input
          id="img-upload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          disabled={previews.length >= 8}
          onChange={handleImages}
        />

        {/* Previews — only show if images uploaded */}
        {previews.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {previews.map((src, i) => (
              <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
                <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                {/* Cover badge */}
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-[9px] bg-green-800 text-white px-1.5 py-0.5 rounded font-medium">
                    Cover
                  </span>
                )}
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {previews.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">First image will be used as the cover. Hover over an image to remove it.</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          className="flex-1 bg-green-800 hover:bg-green-700"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Project'}
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

/* Small helper wrapper for consistent field spacing */
function Field({
  label, error, children
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-5">
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}