"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchImpactCardsForDisplay, type ImpactCardView } from "@/lib/impact-cards";
import { typography } from "@/lib/typography";

function isOptimizableSrc(src: string) {
  return src.startsWith("/") || src.includes(".supabase.co/storage/");
}

function ImpactPhoto({ src, alt }: { src: string; alt: string }) {
  if (isOptimizableSrc(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-center"
        sizes="(max-width: 1024px) 100vw, 33vw"
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover object-center" />
  );
}

function ImpactOverlayCard({
  card,
  className,
}: {
  card: ImpactCardView;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-md ${className ?? ""}`}>
      <ImpactPhoto src={card.imageSrc} alt={card.label} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" aria-hidden />
      {card.tag ? (
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text-body shadow-sm">
          {card.tag}
        </span>
      ) : null}
      <div className="absolute bottom-0 left-0 p-5 sm:p-6">
        <p className="text-2xl font-bold text-white sm:text-3xl">{card.stat}</p>
        <p className="mt-1 text-sm text-white/90 sm:text-base">{card.label}</p>
      </div>
    </div>
  );
}

function OurImpactSection() {
  const [cards, setCards] = useState<ImpactCardView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchImpactCardsForDisplay();
        if (!cancelled) setCards(data);
      } catch (err) {
        console.error("Error loading impact section:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const featured = cards.find((c) => c.isFeatured) ?? cards[0];
  const rest = cards.filter((c) => c.id !== featured?.id);

  return (
    <section className="w-full bg-white px-4 py-16 md:px-6 md:py-20">
      <div className="mb-12 text-center">
        <p className={`mb-3 ${typography.overline} text-brand-accent`}>Our Impact</p>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
          Creating Real Change Together
        </h2>
      </div>

      {loading && cards.length === 0 ? (
        <div className="mx-auto grid max-w-6xl animate-pulse grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <div className="min-h-[320px] rounded-2xl bg-slate-200 lg:row-span-2" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-h-[220px] rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3 lg:grid-rows-2">
          {featured ? (
            <ImpactOverlayCard
              card={featured}
              className="min-h-[320px] sm:min-h-[380px] lg:row-span-2 lg:min-h-0 lg:h-full"
            />
          ) : null}

          {rest.map((item) => (
            <ImpactOverlayCard
              key={item.id}
              card={item}
              className="min-h-[220px] sm:min-h-[240px]"
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default OurImpactSection;
