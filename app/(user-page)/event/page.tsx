"use client";

import { useEffect, useState } from "react";
import { fetchProgramGalleryImages } from "@/lib/gallery";
import Footer from "@/components/shared-component/footer/page";
import Header from "@/components/homepage/Header/header";
import PageImageHeroSection from "@/components/shared-component/page-image-hero-section";
import { PAGE_HERO_CONTENT } from "@/components/shared-component/page-hero-content";
import UpcomingEvents from "@/components/homepage/Event/UpCommingEvents";
// import OngoingEvents from "@/components/homepage/Event/Events";
import CompletedEvents from "@/components/homepage/Event/CompletedEvents";
import TestimonialsCarousel from "@/components/shared-component/testimonials-carousel";
import ProgramGallerySection, { type GalleryImage } from "@/components/shared-component/program-gallery-section";
import { EVENT_TESTIMONIALS } from "@/components/homepage/programs-content";

export default function EventsPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await fetchProgramGalleryImages({ limit: 12, source: "event" });
        setGalleryImages(data);
      } catch (err) {
        console.error("Error fetching event gallery:", err);
        setGalleryImages([]);
      } finally {
        setGalleryLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white font-sans animate-reveal-up">
        <PageImageHeroSection {...PAGE_HERO_CONTENT.events} />

        <div className="mx-auto max-w-7xl space-y-20 px-4 py-12 sm:px-6 md:space-y-24 md:py-16 lg:px-8">
          {/* <OngoingEvents /> */}
          <UpcomingEvents />
          <CompletedEvents />
        </div>

        <TestimonialsCarousel
          id="event-testimonials"
          title="Voices from"
          titleAccent="Our Events"
          subtitle="Volunteers, participants, and community leaders reflect on the events that brought people together."
          items={EVENT_TESTIMONIALS}
        />

        <ProgramGallerySection
          id="event-gallery"
          title="Event"
          titleAccent="Gallery"
          subtitle="Highlights from plantation drives, health camps, workshops, and community gatherings."
          images={galleryImages}
          loading={galleryLoading}
          emptyMessage="Event photos will appear here as activities are documented."
          viewAllHref="/gallery"
        />
      </main>

      <Footer />
    </>
  );
}