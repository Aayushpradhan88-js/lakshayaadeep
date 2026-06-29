"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/supabase";
import Footer from "@/components/shared-component/footer/page";
import Header from "@/components/homepage/Header/header";
import UpcomingEvents from "@/components/homepage/Event/UpCommingEvents";
import OngoingEvents from "@/components/homepage/Event/Events";
import CompletedEvents from "@/components/homepage/Event/CompletedEvents";
import TestimonialsCarousel from "@/components/shared-component/testimonials-carousel";
import ProgramGallerySection, { type GalleryImage } from "@/components/shared-component/program-gallery-section";
import { EVENT_TESTIMONIALS } from "@/components/homepage/programs-content";

// Stat Card
function StatCard({ number, label }: { number: string | number; label: string }) {
  return (
    <div className="bg-[#fff8f2] border border-[#f0e0d0] rounded-2xl px-4 py-5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100 cursor-default">
      <p className="text-3xl font-bold text-gray-900 leading-none mb-1.5">
        {number}
      </p>
      <p className="text-[11px] font-medium text-gray-400 tracking-widest uppercase">
        {label}
      </p>
    </div>
  );
}

export default function EventsPage() {
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
          .from('event')
          .select('status');

        if (error) throw error;

        const active = data.filter(e => e.status === 'Ongoing').length;
        const upcoming = data.filter(e => e.status === 'Upcoming').length;
        const completed = data.filter(e => e.status === 'Completed').length;

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
          .from("event_gallery")
          .select("id, image_url")
          .order("created_at", { ascending: false })
          .limit(12);

        if (error) throw error;

        setGalleryImages(
          (data ?? []).map((item) => ({
            id: item.id,
            url: item.image_url,
            alt: "Event gallery image",
          }))
        );
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
        {/* Hero Section */}
        <section className="relative h-52 overflow-hidden">
          <Image
            fill
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80"
            alt="Programs hero"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <p className="text-xs font-semibold text-teal-300 uppercase tracking-widest mb-1">
              Get Involved
            </p>
            <h1 className="text-3xl font-bold text-white">
              Lakshaydeep <span className="text-brand font-serif">Events</span>
            </h1>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-10 space-y-16">
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard number={stats.active} label="Active Events" />
            <StatCard number={stats.upcoming} label="Upcoming" />
            <StatCard number={stats.completed} label="Completed" />
            <StatCard number={stats.total} label="Total Events" />
          </div>

          {/* Event Sections */}
          <OngoingEvents />
          <UpcomingEvents />
          <CompletedEvents />

          {/* CTA Banner */}
          <section className="bg-amber-50 border border-amber-100 rounded-2xl px-6 py-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold text-gray-800">
                  Want to see our impact projects?
                </p>
                <p className="text-sm text-gray-500">
                  Explore our signature projects transforming communities worldwide
                </p>
              </div>
            </div>
            <Link
              href="/project"
              className="shrink-0 text-sm font-semibold bg-[#e8885a] hover:bg-[#d77749] text-white px-6 py-2.5 rounded-full transition-colors duration-200 whitespace-nowrap shadow-sm"
            >
              Explore Projects
            </Link>
          </section>
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