"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/supabase";
import Footer from "@/components/shared-component/footer/page";
import Header from "@/components/homepage/Header/header";
import PageImageHeroSection from "@/components/shared-component/page-image-hero-section";
import { PAGE_HERO_CONTENT } from "@/components/shared-component/page-hero-content";
import UpcomingProjects from "@/components/homepage/Project/UpCommingProjects";
import CompletedProjects from "@/components/homepage/Project/CompletedProjects";
import OngoingProjects from "@/components/homepage/Project/Project";
import TestimonialsCarousel from "@/components/shared-component/testimonials-carousel";
import ProgramGallerySection, { type GalleryImage } from "@/components/shared-component/program-gallery-section";
import { PROJECT_TESTIMONIALS } from "@/components/homepage/programs-content";

// Stat Card
function StatCard({ number, label }: { number: string | number; label: string }) {
  return (
    <div className="bg-[#fff8f2] border border-[#f0e0d0] rounded-2xl px-4 py-5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100 cursor-default">
      <p className="text-3xl font-bold text-gray-900 leading-none mb-1.5">
        {number}
      </p>
      <p className="text-[11px] font-medium text-black tracking-widest uppercase">
        {label}
      </p>
    </div>
  );
}

export default function ProjectPage() {
  const [stats, setStats] = useState({
    active: 0,
    upcoming: 0,
    completed: 0,
    total: 0
  });
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('project')
          .select('status');

        if (error) throw error;

        const active = data.filter(p => p.status === 'Ongoing').length;
        const upcoming = data.filter(p => p.status === 'Upcoming').length;
        const completed = data.filter(p => p.status === 'Completed').length;

        setStats({
          active,
          upcoming,
          completed,
          total: data.length
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("project_gallery")
          .select("id, image_url")
          .order("created_at", { ascending: false })
          .limit(12);

        if (error) throw error;

        setGalleryImages(
          (data ?? []).map((item) => ({
            id: item.id,
            url: item.image_url,
            alt: "Project gallery image",
          }))
        );
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

        <div className="max-w-5xl mx-auto px-4 py-10 space-y-16">
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard number={stats.active} label="Active Projects" />
            <StatCard number={stats.upcoming} label="Upcoming" />
            <StatCard number={stats.completed} label="Completed" />
            <StatCard number={stats.total} label="Total Projects" />
          </div>

          {/* Project Sections */}
          <OngoingProjects />
          <UpcomingProjects />
          <CompletedProjects />

          {/* CTA Banner */}
          <section className="bg-amber-50 border border-amber-100 rounded-3xl px-6 py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Want to follow our upcoming events?</p>
              <p className="text-xs text-black">Visit the event page to see the latest admin-created event listings.</p>
            </div>
            <Link
              href="/event"
              className="inline-flex items-center justify-center rounded-full bg-[#e8885a] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#d77749] shadow-sm"
            >
              Explore Events
            </Link>
          </section>
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
