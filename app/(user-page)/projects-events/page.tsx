import Header from "@/components/homepage/Header/header"
import Footer from "@/components/shared-component/footer/page"
import ProjectsEventsHubCards from "@/components/shared-component/projects-events-hub-cards"
import { bodyFont, headingFont } from "@/lib/site-fonts"

export default function ProjectsEventsPage() {
  return (
    <>
      <Header />
      <div className={`min-h-screen ${bodyFont.className} bg-white text-slate-700`}>
        <main className="animate-reveal-up pt-16">
          <section className="bg-brand-header px-4 py-16 text-white sm:px-6 md:py-20">
            <div className="mx-auto max-w-6xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                Get Involved
              </p>
              <h1
                className={`${headingFont.className} mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl`}
              >
                Projects <span className="font-light text-brand">&amp; Events</span>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                Choose how you want to engage with Lakshyadeep — explore our long-term community
                projects or join upcoming events across Nepal.
              </p>
            </div>
          </section>

          <section className="px-4 py-16 sm:px-6 md:py-20">
            <div className="mx-auto max-w-6xl">
              <ProjectsEventsHubCards />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
