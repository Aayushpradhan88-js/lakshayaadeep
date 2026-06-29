import FAQSection from "@/components/homepage/About/faq";
import AboutSection from "@/components/homepage/About/hero";
import OurImpactSection from "@/components/homepage/About/impact";
import OurStorySection from "@/components/homepage/About/ourstory";
import Header from "@/components/homepage/Header/header";
import Footer from "@/components/shared-component/footer/page";

export default function AboutPage() {
  return (
    <>
    <Header />
    <div className="animate-reveal-up">
      <AboutSection />
      <OurStorySection/>
      <OurImpactSection/>
      <FAQSection/>
    </div>
      <Footer />
    </>
  )
}
