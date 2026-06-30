import PageImageHeroSection from "@/components/shared-component/page-image-hero-section";
import { PAGE_HERO_CONTENT } from "@/components/shared-component/page-hero-content";

function AboutSection() {
  return <PageImageHeroSection id="about" {...PAGE_HERO_CONTENT.about} />;
}

export default AboutSection;
