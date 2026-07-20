import { getSupabaseClient } from "@/lib/supabase/supabase";
import { fetchProgramGalleryImages, pickRandomGalleryUrls } from "@/lib/gallery";

export type ImpactCardRecord = {
  id: string;
  stat_value: string;
  label: string;
  tag: string | null;
  image_url: string | null;
  is_featured: boolean;
  display_order: number;
};

export type ImpactCardView = {
  id: string;
  stat: string;
  label: string;
  tag?: string;
  imageSrc: string;
  isFeatured: boolean;
};

const FALLBACK_IMPACT_CARDS: Omit<ImpactCardView, "imageSrc">[] = [
  { id: "fallback-0", stat: "1200+", label: "Lives changed through your support", isFeatured: true },
  { id: "fallback-1", stat: "1200+", label: "Lives Impacted", tag: "Education", isFeatured: false },
  { id: "fallback-2", stat: "85+", label: "Active Volunteers", tag: "Community", isFeatured: false },
  { id: "fallback-3", stat: "48", label: "Health Camps", tag: "Healthcare", isFeatured: false },
  { id: "fallback-4", stat: "120", label: "Green Initiatives", tag: "Sustainability", isFeatured: false },
];

export async function fetchImpactCardsForDisplay(): Promise<ImpactCardView[]> {
  let rows: ImpactCardRecord[] = [];

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("impact_cards")
      .select("id, stat_value, label, tag, image_url, is_featured, display_order")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (!error && data?.length) {
      rows = data as ImpactCardRecord[];
    }
  } catch (err) {
    console.error("Error fetching impact cards:", err);
  }

  const base =
    rows.length > 0
      ? rows.map((row) => ({
          id: row.id,
          stat: row.stat_value,
          label: row.label,
          tag: row.tag ?? undefined,
          isFeatured: row.is_featured,
          customImage: row.image_url,
        }))
      : FALLBACK_IMPACT_CARDS.map((c) => ({
          id: c.id,
          stat: c.stat,
          label: c.label,
          tag: c.tag,
          isFeatured: c.isFeatured,
          customImage: null as string | null,
        }));

  const gallery = await fetchProgramGalleryImages({ limit: 40 }).catch(() => []);
  const randomUrls = pickRandomGalleryUrls(gallery, base.length);
  let galleryIndex = 0;

  return base.map((card) => {
    let imageSrc = card.customImage?.trim() || "";
    if (!imageSrc) {
      imageSrc = randomUrls[galleryIndex] ?? randomUrls[0];
      galleryIndex += 1;
    }
    return {
      id: card.id,
      stat: card.stat,
      label: card.label,
      tag: card.tag,
      imageSrc,
      isFeatured: card.isFeatured,
    };
  });
}
