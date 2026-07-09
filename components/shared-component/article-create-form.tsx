"use client"

import { useState, type FormEvent } from "react"
import { FaSave, FaUpload } from "react-icons/fa"
import { getSupabaseClient } from "@/lib/supabase/supabase"
import { FastLoading } from "@/components/shared-component/fast-loading"
import type { Article } from "@/lib/database/types"

type ArticleCreateFormProps = {
  onSuccess: (article: Article) => void
  onCancel: () => void
  showToast: (message: string, type: "success" | "error") => void
}

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"

export function ArticleCreateForm({ onSuccess, onCancel, showToast }: ArticleCreateFormProps) {
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("draft")
  const [publishedAt, setPublishedAt] = useState("")
  const [readTime, setReadTime] = useState(0)
  const [articleNo, setArticleNo] = useState(1)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const uploadImage = async (file: File) => {
    const supabase = getSupabaseClient()
    const filePath = `articles/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from("ab_images")
      .upload(filePath, file, { cacheControl: "3600", upsert: false })
    if (uploadError) throw uploadError
    const { data } = supabase.storage.from("ab_images").getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!title.trim()) nextErrors.title = "Title is required"
    if (!author.trim()) nextErrors.author = "Author is required"
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const supabase = getSupabaseClient()
      let imageUrl: string | null = null
      if (imageFile) imageUrl = await uploadImage(imageFile)

      const values = {
        title: title.trim(),
        excerpt,
        content,
        author: author.trim(),
        category,
        tags: [],
        status,
        published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
        read_time: readTime || null,
        article_no: articleNo,
        article_image_url: imageUrl,
      }

      const { data, error: insertError } = await supabase.from("articles").insert(values).select().single()
      if (insertError) throw insertError

      showToast("Article created successfully", "success")
      onSuccess(data as Article)
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Failed to create article."
      showToast(message, "error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Author
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className={inputClass} />
          {errors.author && <p className="mt-1 text-xs text-red-500">{errors.author}</p>}
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Article No.
          <input type="number" min={1} value={articleNo} onChange={(e) => setArticleNo(Number(e.target.value))} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Category
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Read time (min)
          <input type="number" min={0} value={readTime} onChange={(e) => setReadTime(Number(e.target.value))} className={inputClass} />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Published at
          <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className={inputClass} />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Excerpt
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className={inputClass} />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Content
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} className={inputClass} />
      </label>

      <div>
        <span className="text-sm font-medium text-slate-700">Article Image</span>
        <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-600 hover:border-emerald-500">
          <FaUpload className="h-4 w-4" />
          <span>{imageFile ? imageFile.name : "Choose an image to upload"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
        </label>
      </div>

      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-300">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
          {submitting ? <FastLoading size="sm" variant="light" /> : <><FaSave className="h-4 w-4" /> Create Article</>}
        </button>
      </div>
    </form>
  )
}
