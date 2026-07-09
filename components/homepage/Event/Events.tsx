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

function OngoingEvents({ hideHeader = false }: { hideHeader?: boolean }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
          .order("created_at", { ascending: false });

        if (error) throw error;

        const ongoing = (data || [])
          .filter((e) => e.status === "Ongoing" || e.status === "published" || e.status === "publish")
          .slice(0, 5);

        setEvents(ongoing);
      } catch (error) {
        console.error("Error fetching ongoing events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ProgramListingSection
      title="Ongoing"
      accent="Events"
      viewAllHref="/event"
      hideHeader={hideHeader}
      loading={loading}
      isEmpty={events.length === 0}
      emptyMessage="No ongoing events at this time."
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

export default OngoingEvents;
