import Image from "next/image"
import Link from "next/link"

type ProgramListingCardProps = {
  href: string
  imageSrc?: string
  imageAlt: string
  category: string
  categoryColorClass: string
  title: string
  description?: string
  locationLabel?: string
}

export default function ProgramListingCard({
  href,
  imageSrc,
  imageAlt,
  category,
  categoryColorClass,
  title,
  description,
  locationLabel,
}: ProgramListingCardProps) {
  return (
    <Link
      href={href}
      className="flex h-full min-h-[11rem] cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl sm:min-h-[12.5rem]"
    >
      <div className="relative w-[9.5rem] shrink-0 bg-slate-100 sm:w-[12rem] md:w-[14rem]">
        <Image
          src={imageSrc || "https://images.unsplash.com/photo-1584515933487-779824d29309?w=300&h=200&fit=crop"}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 152px, 224px"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center px-5 py-5 sm:px-6 sm:py-6">
        <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${categoryColorClass}`}>
          {category}
        </p>
        <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-snug text-gray-900 sm:text-xl">
          {title}
        </h3>
        {description ? (
          <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-slate-500 sm:text-base">
            {description}
          </p>
        ) : null}
        {locationLabel ? (
          <p className="flex items-center gap-1.5 text-xs text-slate-400 sm:text-sm">
            <svg className="h-3.5 w-3.5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {locationLabel}
          </p>
        ) : null}
      </div>
    </Link>
  )
}
