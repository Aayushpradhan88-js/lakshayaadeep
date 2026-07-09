"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaArrowLeft, FaUpload, FaSave } from "react-icons/fa"
import { getSupabaseClient } from "@/lib/supabase/supabase"
import { FastLoading } from "@/components/shared-component/fast-loading"

export default function CreateBlogPage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [excerpt, setExcerpt] = useState("")
    const [content, setContent] = useState("")
    const [author, setAuthor] = useState("")
    const [category, setCategory] = useState("")
    const [tags, setTags] = useState("")
    const [status, setStatus] = useState("draft")
    const [publishedAt, setPublishedAt] = useState("")
    const [readTime, setReadTime] = useState(0)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const uploadImage = async (file: File) => {
        const supabase = getSupabaseClient()
        const filePath = `blogs/${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage
            .from('ab_images')
            .upload(filePath, file, { cacheControl: '3600', upsert: false })

        if (uploadError) {
            throw uploadError
        }

        const { data } = supabase.storage.from('ab_images').getPublicUrl(filePath)
        return data.publicUrl
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            const supabase = getSupabaseClient()
            let imageUrl: string | null = null

            if (imageFile) {
                imageUrl = await uploadImage(imageFile)
            }

            const tagsArray = tags
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean)

            const values = {
                title,
                excerpt,
                content,
                author,
                category,
                tags: tagsArray,
                status,
                published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
                read_time: readTime || null,
                blog_image_url: imageUrl,
            }

            const { error: insertError } = await supabase.from('blogs').insert(values)
            if (insertError) {
                throw insertError
            }

            router.push('/dashboard/blog')
        } catch (submitError) {
            const message = submitError instanceof Error ? submitError.message : 'Failed to create blog post.'
            setError(message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Create Blog Post</h1>
                        <p className="text-black mt-2">Add a new blog post and publish it to the public marketing home page.</p>
                    </div>
                    <Link href="/dashboard/blog" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <FaArrowLeft /> Back to Blog List
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    {error && <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>}

                    <div className="grid gap-6 md:grid-cols-2">
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Title</span>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Author</span>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                            />
                        </label>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Category</span>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Tags (comma separated)</span>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="education, community"
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                            />
                        </label>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Status</span>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Published at</span>
                            <input
                                type="datetime-local"
                                value={publishedAt}
                                onChange={(e) => setPublishedAt(e.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Read time (min)</span>
                            <input
                                type="number"
                                min={0}
                                value={readTime}
                                onChange={(e) => setReadTime(Number(e.target.value))}
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                            />
                        </label>
                    </div>

                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Excerpt</span>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            rows={3}
                            className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Content</span>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={8}
                            className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                        />
                    </label>

                    <div>
                        <span className="text-sm font-medium text-slate-700">Blog Image</span>
                        <label className="mt-2 flex items-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-black cursor-pointer hover:border-cyan-500 hover:bg-slate-100">
                            <FaUpload className="h-4 w-4" />
                            <span>{imageFile ? imageFile.name : 'Choose an image to upload'}</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                    const file = event.target.files?.[0]
                                    if (file) setImageFile(file)
                                }}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500">Add a blog image to make the article visible on the marketing page.</p>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-200/30 transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
                        >
                            {submitting ? <FastLoading size="sm" variant="light" /> : (
                              <>
                                <FaSave className="h-4 w-4" />
                                Publish Blog
                              </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
