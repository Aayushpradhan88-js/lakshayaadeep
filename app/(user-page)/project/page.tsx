"use client";

import { useEffect, useState } from "react";
import { fetchProgramGalleryImages } from "@/lib/gallery";
import Footer from "@/components/shared-component/footer/page";
import Header from "@/components/homepage/Header/header";
import PageImageHeroSection from "@/components/shared-component/page-image-hero-section";
import { PAGE_HERO_CONTENT } from "@/components/shared-component/page-hero-content";
import UpcomingProjects from "@/components/homepage/Project/UpCommingProjects";
import CompletedProjects from "@/components/homepage/Project/CompletedProjects";
// import OngoingProjects from "@/components/homepage/Project/Project";
import TestimonialsCarousel from "@/components/shared-component/testimonials-carousel";
import ProgramGallerySection, { type GalleryImage } from "@/components/shared-component/program-gallery-section";
import { PROJECT_TESTIMONIALS } from "@/components/homepage/programs-content";

export default function ProjectPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await fetchProgramGalleryImages({ limit: 12, source: "project" });
        setGalleryImages(data);
      } catch (err) {
        console.error("Error fetching project gallery:", err);
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
        <PageImageHeroSection {...PAGE_HERO_CONTENT.projects} />

        <div className="mx-auto max-w-7xl space-y-20 px-4 py-12 sm:px-6 md:space-y-24 md:py-16 lg:px-8">
          {/* <OngoingProjects /> */}
          <UpcomingProjects />
          <CompletedProjects />
        </div>

        <TestimonialsCarousel
          id="project-testimonials"
          title="Voices from"
          titleAccent="Our Projects"
          subtitle="Partners and community members share how our projects create lasting change across Nepal."
          items={PROJECT_TESTIMONIALS}
        />

        <ProgramGallerySection
          id="project-gallery"
          title="Project"
          titleAccent="Gallery"
          subtitle="Moments captured from our community projects — from planning to impact on the ground."
          images={galleryImages}
          loading={galleryLoading}
          emptyMessage="Project photos will appear here as initiatives are documented."
          viewAllHref="/gallery"
        />
      </main>

      <Footer />
    </>
  );
}
