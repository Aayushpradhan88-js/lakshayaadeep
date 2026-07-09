import Footer from "@/components/shared-component/footer/page"
import { VideoHeroSection } from "@/components/homepage/HeroSection/content"
import AboutSection from "@/components/homepage/About/hero"
import MissionVisionSection from "@/components/homepage/MissionVision/MissionVisionSection"
import ThematicAreasSection from "@/components/homepage/ThematicAreas/ThematicAreasSection"
import ImpactStatsSection from "@/components/homepage/ImpactSection/ImpactStatsSection"
import StakeholderTestimonialsSection from "@/components/homepage/Testimonials/StakeholderTestimonialsSection"
import BoardMessageSection from "@/components/homepage/BoardMessage/BoardMessageSection"
import SupportingInstitutionsSection from "@/components/homepage/Partners/SupportingInstitutionsSection"
import StoriesSection from "@/components/homepage/Story/StoriesSection"
import Header from "@/components/homepage/Header/header"
import DonateSection from "@/components/homepage/Donation/donation-form"
import { bodyFont } from "@/lib/site-fonts"
import NoticePopup from "@/components/shared-component/NoticePopup"
import OngoingProjects from "@/components/homepage/Project/Project"
import UpcomingProjects from "@/components/homepage/Project/UpCommingProjects"
import OngoingEvents from "@/components/homepage/Event/Events"
import UpcomingEvents from "@/components/homepage/Event/UpCommingEvents"
import ProjectLogosSection from "@/components/homepage/Partners/ProjectLogosSection"

export default function Home() {
  return (
    <div className={`min-h-screen ${bodyFont.className} bg-white text-slate-700`}>
      <NoticePopup />

      {/* Image 1 layout: full-screen hero image + translucent header + V into white */}
      <div className="relative bg-white">
        <Header overlay />
        <VideoHeroSection />
      </div>

      <div className="animate-reveal-up animate-delay-100">
        <AboutSection />
      </div>

      <div className="animate-reveal-up animate-delay-100">
        <MissionVisionSection />
      </div>

      <div className="animate-reveal-up animate-delay-200">
        <ThematicAreasSection />
      </div>

      <div className="animate-reveal-up animate-delay-200">
        <ImpactStatsSection />
      </div>

      <div className="h-10 bg-white md:h-14" aria-hidden />

      <div className="animate-reveal-up animate-delay-300">
        <StakeholderTestimonialsSection />
      </div>

      <div className="h-10 bg-white md:h-14" aria-hidden />

      <div className="animate-reveal-up">
        <BoardMessageSection />
      </div>

      <div className="animate-reveal-up">
        <SupportingInstitutionsSection />
      </div>

      <div className="animate-reveal-up">
        <ProjectLogosSection />
      </div>

      {/* <section className="animate-reveal-up bg-gradient-to-b from-white to-slate-50/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              Ongoing & Upcoming <span className="font-light text-brand">Highlights</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-500">
              Witness the direct impact of our work through our current initiatives and stay informed about what&apos;s coming next.
            </p>
          </div>

          <div className="space-y-24">
            <div className="space-y-16">
              <h2 className="text-2xl font-bold text-brand-accent">Projects</h2>
              <OngoingProjects hideHeader={true} />
              <UpcomingProjects hideHeader={true} />
            </div>

            <div className="space-y-16">
              <h2 className="text-2xl font-bold text-brand-accent">Events</h2>
              <OngoingEvents hideHeader={true} />
              <UpcomingEvents hideHeader={true} />
            </div>
          </div>
        </div>
      </section>

      <div className="animate-reveal-up">
        <DonateSection />
      </div>

      <div className="animate-reveal-up">
        <StoriesSection />
      </div> */}

      <Footer />
    </div>
  )
}
