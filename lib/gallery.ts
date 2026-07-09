import { getSupabaseClient } from "@/lib/supabase/supabase"
import type { GalleryImage } from "@/components/shared-component/program-gallery-section"

type GalleryRow = {
  id: string
  image_url: string
  created_at: string
}

type FetchProgramGalleryOptions = {
  limit?: number
  source?: "all" | "project" | "event"
}

export async function fetchProgramGalleryImages(
  options: FetchProgramGalleryOptions = {}
): Promise<GalleryImage[]> {
  const { limit, source = "all" } = options
  const supabase = getSupabaseClient()

  const requests: Promise<GalleryImage[]>[] = []

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

  const images = results
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
    .map(({ id, url, alt }) => ({ id, url, alt }))

  return typeof limit === "number" ? images.slice(0, limit) : images
}
