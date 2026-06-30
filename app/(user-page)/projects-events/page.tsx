import Header from "@/components/homepage/Header/header";
import Footer from "@/components/shared-component/footer/page";
import PageImageHeroSection from "@/components/shared-component/page-image-hero-section";
import { PAGE_HERO_CONTENT } from "@/components/shared-component/page-hero-content";
import ProjectsEventsHubCards from "@/components/shared-component/projects-events-hub-cards";

export default function ProjectsEventsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-slate-700">
        <main className="animate-reveal-up">
          <PageImageHeroSection {...PAGE_HERO_CONTENT.projectsEvents} />

          <section className="px-4 py-16 sm:px-6 md:py-20">
            <div className="mx-auto max-w-6xl">
              <ProjectsEventsHubCards />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
