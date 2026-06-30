import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PROJECTS_EVENTS_CARDS } from "@/components/homepage/Header/nav-config";
import { typography } from "@/lib/typography";

export default function ProjectsEventsHubCards() {
  return (
    <div>
      <div className="mb-10 max-w-2xl text-left">
        <p className={`mb-3 ${typography.overline} text-brand-accent`}>Choose Your Path</p>
        <h2 className={typography.h2}>Explore Projects &amp; Events</h2>
        <p className={`mt-3 ${typography.description}`}>
          Dive into long-term community work or join hands-on gatherings happening across Nepal.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {PROJECTS_EVENTS_CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group relative min-h-[20rem] overflow-hidden rounded-2xl shadow-md transition hover:-translate-y-1 hover:shadow-xl sm:min-h-[22rem]"
          >
            <Image
              src={card.image}
              alt={card.label}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15"
              aria-hidden
            />

            <div className="absolute inset-0 flex flex-col justify-end p-6 text-left sm:p-8">
              <h3 className="text-3xl font-bold text-white sm:text-4xl">{card.label}</h3>
              <p className={`mt-2 max-w-md ${typography.bodySm} text-white/85`}>
                {card.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-brand">
                Explore {card.label.toLowerCase()}
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
