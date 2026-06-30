import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import Header from "@/components/homepage/Header/header";
import Footer from "@/components/shared-component/footer/page";
import { VolunteerApplicationForm } from "@/components/site/volunteer-application-form";
import { bodyFont, headingFont } from "@/lib/site-fonts";

const whyItems = [
  {
    title: "Empower communities",
    body: "Work alongside local teams on projects that create real, lasting change where it is needed most.",
  },
  {
    title: "Educate the future",
    body: "Support learning event that help young people build skills, confidence, and opportunity.",
  },
  {
    title: "Grow with purpose",
    body: "Develop leadership and teamwork in a values-driven, youth-led environment.",
  },
  {
    title: "Sustain impact",
    body: "Help initiatives stay transparent, accountable, and community-owned for the long run.",
  },
  {
    title: "Build networks",
    body: "Meet mentors, peers, and partners who care about Nepal’s social and environmental future.",
  },
  {
    title: "Give time that counts",
    body: "Every hour you contribute is directed toward measurable outcomes and shared learning.",
  },
];

const steps = [
  {
    title: "Submit your application",
    body: "Share your details and social links using the form below so we can get to know you.",
  },
  {
    title: "Short conversation",
    body: "Our team may reach out by phone or email to learn more about your interests and availability.",
  },
  {
    title: "Match with a role",
    body: "We align your skills with current event and onboarding needs.",
  },
  {
    title: "Start volunteering",
    body: "Join orientation and begin contributing with clear expectations and support.",
  },
];

/** Full volunteer story + application form (public /volunteer route). */
export function VolunteerLanding() {
  return (
    <div className={`min-h-screen ${bodyFont.className} bg-white text-slate-700`}>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[min(70vh,720px)]">
          <Image
            src="/hero.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" aria-hidden />
          <div className="relative z-10 mx-auto flex min-h-[min(70vh,720px)] max-w-4xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
            <h1 className={`${headingFont.className} text-4xl font-bold text-white sm:text-5xl md:text-6xl`}>
              Join Our <span className="text-brand">Mission</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/90 sm:text-xl">
              Become a volunteer and make a meaningful difference in our community today.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="#apply"
                className="inline-flex min-w-[200px] items-center justify-center rounded-2xl bg-brand px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-brand-hover"
              >
                Apply as volunteer
              </a>
              <a
                href="#why"
                className="inline-flex min-w-[200px] items-center justify-center rounded-2xl border-2 border-white px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Explore roles
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why volunteer */}
      <section id="why" className="scroll-mt-24 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-center text-sm font-semibold uppercase tracking-wide text-brand">
            Why volunteer
          </p>
          <h2 className="mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl">
            More Than <span className="text-brand">Just Giving Back</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-black">
            Volunteering with Lakshyadeep is a structured way to learn, lead, and lift others — with clear roles and
            real responsibility.
          </p>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyItems.map((item) => (
              <li
                key={item.title}
                className="rounded-[18px] border border-slate-100 bg-slate-50/80 p-6 shadow-sm ring-1 ring-slate-100"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
                  <FaCheckCircle className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quote */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-brand" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className={`${headingFont.className} text-2xl font-semibold text-white sm:text-3xl md:text-4xl`}>
            Every hour you <span className="text-brand-light">give</span> transforms more than you know.
          </p>
        </div>
      </section>

      {/* How it works + apply */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <h2 className="mb-8 text-3xl font-bold text-slate-900 sm:text-4xl">How it works</h2>
            <ol className="space-y-6">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-sm font-bold text-brand">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-1 text-black">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a
              href="#apply"
              className="mt-10 inline-flex rounded-2xl bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-hover"
            >
              Start your application
            </a>
          </div>
          <div className="space-y-4">
            <div className="relative aspect-4/5 overflow-hidden rounded-[18px] bg-slate-200">
              <Image src="/hero.jpg" alt="" fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <VolunteerApplicationForm heading="Apply now" id="apply" />
      </div>

      <Footer />
    </div>
  );
}
