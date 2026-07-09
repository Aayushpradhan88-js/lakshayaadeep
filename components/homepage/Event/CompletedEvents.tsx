"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/supabase";
import ProgramListingCard from "@/components/shared-component/program-listing-card";
import { ProgramListingSection } from "@/components/shared-component/program-listing-layout";

interface Event {
  id: string;
  event_title: string;
  description: string;
  category: string;
  status: string;
  cover_event_image_url: string;
  event_location?: {
    province: string;
    district: string;
    municipality: string;
  };
}

const categoryColors: Record<string, string> = {
  health: "text-brand",
  education: "text-[#6080e0]",
  environment: "text-[#4ab870]",
  disaster_relief: "text-brand",
  community: "text-[#6080e0]",
  other: "text-black",
};

function CompletedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("event")
          .select(`
            *,
            event_location (
              province,
              district,
              municipality
            )
          `)
          .eq("status", "Completed")
          .limit(5);

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching completed events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompleted();
  }, []);

  return (
    <ProgramListingSection
      title="Completed"
      accent="Events"
      viewAllHref="/event"
      loading={loading}
      isEmpty={events.length === 0}
      emptyMessage="No completed events to display at the moment."
    >
      {events.map((event) => (
        <ProgramListingCard
          key={event.id}
          href={`/event/${event.id}`}
          imageSrc={event.cover_event_image_url}
          imageAlt={event.event_title}
          category={event.category || "General"}
          categoryColorClass={categoryColors[event.category?.toLowerCase()] || "text-brand"}
          title={event.event_title}
          description={event.description}
          locationLabel={
            event.event_location
              ? `${event.event_location.municipality}, ${event.event_location.district}`
              : undefined
          }
        />
      ))}
    </ProgramListingSection>
  );
}

export default CompletedEvents;
