"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Search, X } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/supabase"

type SearchResult = {
  id: string
  title: string
  href: string
  type: string
}

type SiteSearchProps = {
  open: boolean
  onClose: () => void
}

export function SiteSearch({ open, onClose }: SiteSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery("")
      setResults([])
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const supabase = getSupabaseClient()
        const [projects, events, blogs, articles] = await Promise.all([
          supabase.from("project").select("id, project_title").not("status", "ilike", "draft").ilike("project_title", `%${q}%`).limit(5),
          supabase.from("event").select("id, event_title").not("status", "ilike", "draft").ilike("event_title", `%${q}%`).limit(5),
          supabase.from("blogs").select("id, title").ilike("title", `%${q}%`).limit(5),
          supabase.from("articles").select("id, title").ilike("title", `%${q}%`).limit(5),
        ])

        const merged: SearchResult[] = [
          ...(projects.data ?? []).map((p) => ({
            id: p.id,
            title: p.project_title,
            href: `/project/${p.id}`,
            type: "Project",
          })),
          ...(events.data ?? []).map((e) => ({
            id: e.id,
            title: e.event_title,
            href: `/event/${e.id}`,
            type: "Event",
          })),
          ...(blogs.data ?? []).map((b) => ({
            id: b.id,
            title: b.title,
            href: `/blog/${b.id}`,
            type: "Blog",
          })),
          ...(articles.data ?? []).map((a) => ({
            id: a.id,
            title: a.title,
            href: `/article/${a.id}`,
            type: "Article",
          })),
        ]

        setResults(merged)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 px-4 pt-24 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-border bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-brand" />
          <input
            ref={inputRef}
            type="text"
            role="searchbox"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, events, blog, articles…"
            autoComplete="off"
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="rounded-full p-1 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto p-2">
          {loading && <p className="px-3 py-4 text-sm text-muted-foreground">Searching…</p>}
          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <p className="px-3 py-4 text-sm text-muted-foreground">No results found.</p>
          )}
          {!loading && query.trim().length < 2 && (
            <p className="px-3 py-4 text-sm text-muted-foreground">Type at least 2 characters to search.</p>
          )}
          {results.map((item) => (
            <Link
              key={`${item.type}-${item.id}`}
              href={item.href}
              onClick={onClose}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-brand-light"
            >
              <span className="font-medium text-foreground">{item.title}</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-brand">{item.type}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SearchTrigger({
  onClick,
  overlay,
  className = "",
}: {
  onClick: () => void
  overlay?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Search"
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white/60 text-white ${className}`}
    >
      <Search className="h-4 w-4" />
    </button>
  )
}
