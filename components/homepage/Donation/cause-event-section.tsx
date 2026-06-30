"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getSupabaseClient } from "@/lib/supabase/supabase";

interface CauseEvent {
  id: string;
  event_title: string;
  description: string;
  cover_event_image_url: string | null;
  progress_percent?: number;
  status: string;
}

export default function CauseEventsSection() {
  const [events, setEvents] = useState<CauseEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("event")
          .select("id, event_title, description, cover_event_image_url, status")
          .neq("status", "draft")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setEvents(data as CauseEvent[]);
      } catch (error) {
        console.error("Error fetching cause events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="w-full bg-white py-16">
      <style>{`
        @keyframes causeMarquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .cause-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: causeMarquee 30s linear infinite;
        }
        .cause-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Heading */}
      <div className="mb-10 px-6 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
          Our Cause Event
        </p>
        <h2 className="text-4xl font-bold">
          <span className="text-brand">We popular To Provide</span>{" "}
          <span className="text-gray-900">Of Experience</span>
        </h2>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="flex gap-5 overflow-hidden px-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl bg-orange-50 overflow-hidden shrink-0"
              style={{ width: 300 }}
            >
              <div className="h-44 bg-orange-100" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-12 rounded bg-orange-200" />
                <div className="h-2 w-full rounded bg-orange-100" />
                <div className="h-4 w-3/4 rounded bg-orange-200" />
                <div className="h-3 w-full rounded bg-orange-100" />
                <div className="h-3 w-5/6 rounded bg-orange-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && events.length === 0 && (
        <p className="text-center text-sm text-black">No events found.</p>
      )}

      {/* Infinite slider */}
      {!loading && events.length > 0 && (
        /* overflow-hidden clips the scroll; no px here so cards reach the edges */
        <div style={{ overflow: "hidden", paddingTop: 8, paddingBottom: 16 }}>
          <div className="cause-track" style={{ paddingLeft: 24 }}>
            {[...events, ...events, ...events, ...events].map((event, index) => (
              <div
                key={`${event.id}-${index}`}
                style={{
                  width: 300,
                  flexShrink: 0,
                  borderRadius: 16,
                  overflow: "hidden",
                  backgroundColor: "#fff7ed",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", height: 176, width: "100%" }}>
                  {event.cover_event_image_url ? (
                    <Image
                      src={event.cover_event_image_url}
                      alt={event.event_title}
                      fill
                      style={{ objectFit: "cover", objectPosition: "center" }}
                      unoptimized
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        height: "100%",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#fed7aa",
                      }}
                    >
                      <span style={{ fontSize: 32 }}>📸</span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding: 16 }}>
                  {/* Progress */}
                  <p style={{ marginBottom: 4, fontSize: 13, fontWeight: 700, color: "#374151" }}>
                    {event.progress_percent ?? 0}%
                  </p>
                  <div
                    style={{
                      marginBottom: 12,
                      height: 4,
                      width: "100%",
                      borderRadius: 9999,
                      backgroundColor: "#fed7aa",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 9999,
                        backgroundColor: "#22d3ee",
                        width: `${event.progress_percent ?? 0}%`,
                      }}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      marginBottom: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      lineHeight: 1.4,
                      color: "#06b6d4",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: 36,
                    }}
                  >
                    {event.event_title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: 12,
                      lineHeight: 1.6,
                      color: "#6b7280",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: 48,
                    }}
                  >
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}