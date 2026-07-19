import { getSupabaseClient } from "@/lib/supabase/supabase"
import type { GalleryImage } from "@/components/shared-component/program-gallery-section"

type GalleryRow = {
  id: string
  image_url: string
  created_at: string
}

type GalleryCandidate = GalleryImage & {
  created_at?: string
}

type FetchProgramGalleryOptions = {
  limit?: number
  source?: "all" | "project" | "event"
}

const IMAGE_CHECK_TIMEOUT_MS = 8000

function loadImageInBrowser(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    const timer = window.setTimeout(() => {
      img.src = ""
      resolve(false)
    }, IMAGE_CHECK_TIMEOUT_MS)

    img.onload = () => {
      window.clearTimeout(timer)
      resolve(true)
    }
    img.onerror = () => {
      window.clearTimeout(timer)
      resolve(false)
    }
    img.src = url
  })
}

async function isAccessibleImageUrl(url: string): Promise<boolean> {
  const trimmed = url.trim()
  if (!trimmed) return false
  if (trimmed.startsWith("/")) return true

  try {
    const response = await fetch(trimmed, { method: "HEAD", cache: "no-store" })
    if (response.ok) return true
    if (response.status === 405) {
      const ranged = await fetch(trimmed, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
        cache: "no-store",
      })
      return ranged.ok || ranged.status === 206
    }
    return false
  } catch {
    if (typeof window !== "undefined") {
      return loadImageInBrowser(trimmed)
    }
    return false
  }
}

async function filterAccessibleImages(images: GalleryCandidate[]): Promise<GalleryImage[]> {
  const checks = await Promise.all(
    images.map(async (image) => ({
      image,
      accessible: await isAccessibleImageUrl(image.url),
    }))
  )

  return checks.filter(({ accessible }) => accessible).map(({ image }) => ({
    id: image.id,
    url: image.url,
    alt: image.alt,
  }))
}

export async function fetchProgramGalleryImages(
  options: FetchProgramGalleryOptions = {}
): Promise<GalleryImage[]> {
  const { limit, source = "all" } = options
  const supabase = getSupabaseClient()

  const requests: Promise<GalleryCandidate[]>[] = []

  if (source === "all" || source === "project") {
    requests.push(
      supabase
        .from("project_gallery")
        .select("id, image_url, created_at")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (error) throw error
          return (data as GalleryRow[] | null)?.map((item) => ({
            id: `project-${item.id}`,
            url: item.image_url,
            alt: "Project gallery image",
            created_at: item.created_at,
          })) ?? []
        })
    )
  }

  if (source === "all" || source === "event") {
    requests.push(
      supabase
        .from("event_gallery")
        .select("id, image_url, created_at")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (error) throw error
          return (data as GalleryRow[] | null)?.map((item) => ({
            id: `event-${item.id}`,
            url: item.image_url,
            alt: "Event gallery image",
            created_at: item.created_at,
          })) ?? []
        })
    )
  }

  const results = await Promise.all(requests)
  const seen = new Set<string>()

  const candidates = results
    .flat()
    .filter((item) => {
      if (!item.url || seen.has(item.url)) return false
      seen.add(item.url)
      return true
    })
    .sort(
      (a, b) =>
        new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
    )

  const accessibleImages = await filterAccessibleImages(candidates)

  return typeof limit === "number" ? accessibleImages.slice(0, limit) : accessibleImages
}
