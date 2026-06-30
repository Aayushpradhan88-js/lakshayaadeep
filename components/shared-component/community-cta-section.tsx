"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pointer } from "lucide-react";
import { typography } from "@/lib/typography";
import { shouldShowCommunityCta } from "./community-cta-paths";

function CtaButton({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 rounded-full px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition hover:brightness-110 sm:px-8 sm:py-3 sm:text-base ${className}`}
    >
      {label}
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/25 sm:h-10 sm:w-10">
        <Pointer className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
      </span>
    </Link>
  );
}

export default function CommunityCtaSection() {
  const pathname = usePathname();

  if (!shouldShowCommunityCta(pathname)) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative min-h-[22rem] sm:min-h-[26rem] lg:min-h-[30rem]">
        <Image
          src="/lakshaydeepimg1.jpeg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20"
          aria-hidden
        />

        <div className="relative z-10 flex min-h-[22rem] flex-col items-center justify-center px-6 py-14 text-center sm:min-h-[26rem] sm:py-16 lg:min-h-[30rem]">
          <h2 className={`max-w-3xl ${typography.h2} text-white sm:text-4xl md:text-5xl`}>
            Give today and join our community of world changers
          </h2>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row sm:gap-5">
            <CtaButton href="/donation" label="Donate" className="bg-brand hover:bg-brand-hover" />
            <CtaButton
              href="/volunteer"
              label="Take Action"
              className="bg-brand-accent hover:bg-brand-accent-hover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
