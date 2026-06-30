import Image from "next/image";
import { typography } from "@/lib/typography";
import type { PageHeroContent } from "./page-hero-content";

type PageImageHeroSectionProps = PageHeroContent & {
  id?: string;
};

export default function PageImageHeroSection({
  id,
  images,
  overline,
  titlePrefix,
  titleAccent,
  headlineAccent,
  headlineRest,
  description,
  stats,
  showIntro = true,
}: PageImageHeroSectionProps) {
  const bannerImages = images.slice(0, 3);
  const sectionHeight = showIntro
    ? "min-h-[32rem] sm:min-h-[36rem] lg:min-h-[40rem]"
    : "min-h-56 sm:min-h-72 md:min-h-80 lg:min-h-96";

  return (
    <section id={id} className={`relative w-full overflow-hidden ${sectionHeight}`}>
      <div className="absolute inset-0">
        {bannerImages.length === 1 ? (
          <Image
            src={bannerImages[0]}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : (
          <div className="grid h-full grid-cols-3">
            {bannerImages.map((src, index) => (
              <div key={`${src}-${index}`} className="relative h-full w-full">
                <Image
                  src={src}
                  alt=""
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  sizes="33vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-black/45" aria-hidden />

      <div
        className={`relative z-10 mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-6 py-10 text-center sm:py-12 ${sectionHeight}`}
      >
        {overline ? (
          <p className={`mb-4 ${typography.overline} text-white/90`}>{overline}</p>
        ) : null}

        <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {titlePrefix}
          <span className="text-brand">{titleAccent}</span>
        </h1>

        {showIntro ? (
          <div className="mt-6 sm:mt-8">
            <p className="text-base font-bold leading-snug text-white sm:text-lg">
              <span className="text-brand">{headlineAccent}</span>{" "}
              <span>{headlineRest}</span>
            </p>
            <p className={`mx-auto mt-3 max-w-xl ${typography.bodySm} text-white/80`}>
              {description}
            </p>

            {stats && stats.length > 0 ? (
              <div className="mt-8 flex flex-wrap justify-center gap-10 sm:gap-14">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-3xl font-bold text-brand-accent sm:text-4xl">
                      {stat.value}
                    </div>
                    <div className={`mt-1 ${typography.caption} text-white/75`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
