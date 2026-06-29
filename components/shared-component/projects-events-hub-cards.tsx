import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { PROJECTS_EVENTS_CARDS } from "@/components/homepage/Header/nav-config"

export default function ProjectsEventsHubCards() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {PROJECTS_EVENTS_CARDS.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="relative h-64 w-full sm:h-72">
            <Image
              src={card.image}
              alt={card.label}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-header via-brand-header/50 to-brand-header/10" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
            <h2 className="text-2xl font-bold sm:text-3xl">{card.label}</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
              {card.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-brand">
              Explore {card.label.toLowerCase()}
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
