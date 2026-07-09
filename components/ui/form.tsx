'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '../../lib/supabase/supabase'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select'
import { FastLoading } from '@/components/shared-component/fast-loading'

const districtMap: Record<string, string[]> = {
  'Koshi': ['Taplejung', 'Panchthar', 'Ilam', 'Jhapa', 'Morang', 'Sunsari'],
  'Madhesh': ['Saptari', 'Siraha', 'Dhanusa', 'Mahottari', 'Sarlahi'],
  'Bagmati': ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Chitwan', 'Makwanpur'],
  'Gandaki': ['Kaski', 'Gorkha', 'Lamjung', 'Tanahu', 'Syangja'],
  'Lumbini': ['Rupandehi', 'Kapilvastu', 'Dang', 'Banke', 'Bardiya'],
  'Karnali': ['Surkhet', 'Dailekh', 'Jumla', 'Dolpa', 'Humla'],
  'Sudurpashchim': ['Kailali', 'Kanchanpur', 'Doti', 'Achham', 'Bajura'],
}

export function CreateProjectPage() {
  const router = useRouter()
  const supabase = getSupabaseClient()

  const [form, setForm] = useState({
    title: '', description: '', category: '',
    province: '', district: '', tole: '',
    start_date: '', end_date: '',
    target_beneficiaries: '', organizer: '',
  })
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }))

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
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

  const onSubmit = async () => {
    if (!validate()) return
    setLoading(true)

    try {
      // 1. Location insert
      const { data: loc } = await supabase
        .from('project_location')
        .insert({ province: form.province, district: form.district, municipality: form.tole })
        .select().single()

      // 2. Upload images → get URLs
      const imageUrls: string[] = []
      for (const file of images) {
        const fileName = `${Date.now()}-${file.name}`
        await supabase.storage.from('project_gallery').upload(fileName, file)
        const { data: urlData } = supabase.storage.from('project_gallery').getPublicUrl(fileName)
        imageUrls.push(urlData.publicUrl)
      }

      // 3. Project insert
      const { data: project } = await supabase.from('project').insert({
        project_title: form.title,
        description: form.description,
        category: form.category,
        location_id: loc?.id,
        start_date: form.start_date,
        end_date: form.end_date,
        target_beneficiaries: Number(form.target_beneficiaries) || null,
        project_organizer: form.organizer,
        cover_image_url: imageUrls[0] || null,  // first image = cover
      }).select().single()

      // 4. Gallery insert
      if (imageUrls.length > 0) {
        await supabase.from('project_gallery').insert(
          imageUrls.map(url => ({ project_id: project?.id, image_url: url }))
        )
      }

      router.push('/dashboard/project')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-center text-xl mb-6">Create Project</h2>

      {/* Title */}
      <div className="mb-4">
        <label className="text-sm text-muted-foreground mb-1 block">Title</label>
        <Input placeholder="Write your project agenda" value={form.title} onChange={e => set('title', e.target.value)} />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="text-sm text-muted-foreground mb-1 block">Description</label>
        <Textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="text-sm text-muted-foreground mb-1 block">Category</label>
        <Select onValueChange={v => set('category', v)}>
          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>
            {['Education','Health','Environment','Social','Other'].map(c =>
              <SelectItem key={c} value={c}>{c}</SelectItem>
            )}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="text-sm text-muted-foreground mb-1 block">Location</label>
        <div className="grid grid-cols-3 gap-2">
          <Select onValueChange={v => { set('province', v); set('district', '') }}>
            <SelectTrigger><SelectValue placeholder="Province" /></SelectTrigger>
            <SelectContent>
              {Object.keys(districtMap).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select onValueChange={v => set('district', v)}>
            <SelectTrigger><SelectValue placeholder="District" /></SelectTrigger>
            <SelectContent>
              {(districtMap[form.province] || []).map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>

          <Input placeholder="Tole/Street" value={form.tole} onChange={e => set('tole', e.target.value)} />
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-4">
        <label className="text-sm text-muted-foreground mb-1 block">Select Timeline</label>
        <div className="grid grid-cols-2 gap-2">
          <Input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} />
          <Input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} />
        </div>
        {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
      </div>

      {/* Beneficiaries + Organizer */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Target Beneficiaries</label>
          <Input type="number" placeholder="e.g. 500" value={form.target_beneficiaries} onChange={e => set('target_beneficiaries', e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Organizer</label>
          <Input placeholder="Organizer name" value={form.organizer} onChange={e => set('organizer', e.target.value)} />
        </div>
      </div>

      {/* Images */}
      <div className="mb-6">
        <label className="text-sm text-muted-foreground mb-2 block">Select Images</label>
        <div className="border border-dashed rounded-lg p-3 mb-2">
          <input type="file" multiple accept="image/*" className="hidden" id="img-upload" onChange={handleImages} />
          <label htmlFor="img-upload" className="cursor-pointer bg-secondary px-4 py-1.5 rounded text-sm">Upload</label>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-secondary border border-dashed overflow-hidden flex items-center justify-center">
              {previews[i]
                ? <img src={previews[i]} className="w-full h-full object-cover" />
                : <span className="text-xs text-muted-foreground">Empty</span>
              }
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button className="flex-1 bg-green-800 hover:bg-green-700" onClick={onSubmit} disabled={loading}>
          {loading ? <FastLoading size="sm" variant="light" /> : 'Create Project'}
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </div>
  )
}