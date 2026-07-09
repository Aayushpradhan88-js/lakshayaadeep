import Image from "next/image";
import PageImageHeroSection from "@/components/shared-component/page-image-hero-section";
import { PAGE_HERO_CONTENT } from "@/components/shared-component/page-hero-content";
import { typography } from "@/lib/typography";

type AboutSectionProps = {
  /** Home: split text + image. Page (/about): full-width banner like Projects & Events. */
  variant?: "home" | "page";
};

function AboutSection({ variant = "home" }: AboutSectionProps) {
  const {
    images,
    titlePrefix,
    titleAccent,
    headlineAccent,
    headlineRest,
    description,
  } = PAGE_HERO_CONTENT.about;

  // /about — full-width image hero (same style as Projects & Events page).
  if (variant === "page") {
    return <PageImageHeroSection id="about" {...PAGE_HERO_CONTENT.about} />;
  }

  // Homepage — split layout: text left, image right.
  // Previous full-width banner on all pages:
  // return <PageImageHeroSection id="about" {...PAGE_HERO_CONTENT.about} />;

  return (
    <section id="about" className="w-full bg-slate-50 px-4 py-12 md:px-8 md:py-16 lg:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {titlePrefix}
            <span className="font-light text-brand">{titleAccent}</span>
          </h2>

          <p className="mt-5 text-base font-bold leading-snug text-gray-900 sm:text-lg">
            <span className="text-brand">{headlineAccent}</span>{" "}
            <span>{headlineRest}</span>
          </p>

          <p className={`mx-auto mt-4 max-w-xl lg:mx-0 ${typography.bodySm} leading-relaxed text-black`}>
            {description}
          </p>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg lg:ml-auto lg:max-w-none">
            <Image
              src={images[0]}
              alt={`${titleAccent} team`}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 90vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
