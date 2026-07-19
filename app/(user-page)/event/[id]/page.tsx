import Image from "next/image";
import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import Footer from "@/components/shared-component/footer/page";
import Header from "@/components/homepage/Header/header";
import TestimonialsCarousel from "@/components/shared-component/testimonials-carousel";
import ProgramGallerySection from "@/components/shared-component/program-gallery-section";
import { EVENT_TESTIMONIALS } from "@/components/homepage/programs-content";
import Breadcrumbs from "@/components/shared-component/breadcrumbs";
import DetailMetaChips from "@/components/shared-component/detail-meta-chips";
import DetailFactsSidebar from "@/components/shared-component/detail-facts-sidebar";
import ContentProse from "@/components/shared-component/content-prose";
import RelatedItemsList from "@/components/shared-component/related-items-list";
import { PROJECTS_EVENTS_HUB } from "@/components/homepage/Header/nav-config";

type EventDetail = {
    id: string;
    event_title: string;
    description?: string;
    organizer?: string;
    location?: string;
    event_location?: {
        province: string;
        district: string;
        municipality: string;
    };
    start_date?: string;
    end_date?: string;
    cover_event_image_url?: string;
    category?: string;
    status?: string;
};

type EventGalleryImage = {
    id: string;
    image_url: string;
};

function formatDate(value?: string) {
    if (!value) return null;
    return new Date(value).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function formatLocation(event: EventDetail) {
    if (event.event_location) {
        const { municipality, district, province } = event.event_location;
        return `${municipality}, ${district}, ${province}`;
    }
    return event.location ?? "";
}

async function getEventById(id: string): Promise<EventDetail | null> {
    const supabase = getSupabaseServerClient();
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
        .eq("id", id)
        .in("status", ["Ongoing", "Upcoming", "Completed", "publish", "published"])
        .single();

    if (error || !data) return null;
    return data;
}

async function getEventGallery(id: string): Promise<EventGalleryImage[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("event_gallery")
        .select("id, image_url")
        .eq("event_id", id)
        .order("created_at", { ascending: true });

    return error ? [] : data ?? [];
}

async function getOtherEvents(id: string): Promise<EventDetail[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("event")
        .select("id, event_title, cover_event_image_url, start_date, category")
        .neq("id", id)
        .in("status", ["Ongoing", "Upcoming", "Completed", "publish", "published"])
        .order("start_date", { ascending: true })
        .limit(3);

    return error ? [] : data ?? [];
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getEventById(id);
    if (!event) {
        notFound();
    }

    const gallery = await getEventGallery(id);
    const otherEvents = await getOtherEvents(id);
    const galleryImages = gallery.map((item) => ({
        id: item.id,
        url: item.image_url,
        alt: `${event.event_title} gallery image`,
    }));

    const startDate = formatDate(event.start_date);
    const endDate = formatDate(event.end_date);
    const locationLabel = formatLocation(event);
    const dateRange = startDate ? `${startDate}${endDate ? ` – ${endDate}` : ""}` : "";

    const metaChips = [
        event.status ? { label: event.status, variant: "status" as const } : null,
        dateRange ? { label: dateRange } : null,
        locationLabel ? { label: locationLabel } : null,
        event.category ? { label: event.category } : null,
    ].filter(Boolean) as { label: string; variant?: "default" | "status" }[];

    const facts = [
        { label: "Category", value: event.category ?? "General" },
        { label: "Status", value: event.status ?? "Published" },
        dateRange ? { label: "Timeline", value: dateRange } : null,
        event.organizer ? { label: "Organizer", value: event.organizer } : null,
        locationLabel ? { label: "Location", value: locationLabel } : null,
    ].filter(Boolean) as { label: string; value: string }[];

    return (
        <>
            <Header />
            <main className="min-h-screen animate-reveal-up bg-white font-sans">
                <div className="mx-auto max-w-5xl px-4 pt-6">
                    <Breadcrumbs
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Events", href: PROJECTS_EVENTS_HUB },
                            { label: event.event_title },
                        ]}
                    />
                </div>

                <section className="relative mt-4 h-[26rem] overflow-hidden sm:h-[32rem]">
                    {event.cover_event_image_url ? (
                        <Image
                            src={event.cover_event_image_url}
                            alt={event.event_title}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
                            No event banner available
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                    <div className="absolute bottom-8 left-6 right-6 text-white">
                        <h1 className="text-4xl font-bold leading-tight">{event.event_title}</h1>
                        <DetailMetaChips chips={metaChips} className="mt-4" />
                    </div>
                </section>

                <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
                    <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                        <ContentProse
                            content={event.description}
                            emptyMessage="No description provided."
                        />

                        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                            <DetailFactsSidebar facts={facts} />
                            <RelatedItemsList
                                title="Other events"
                                items={otherEvents.map((item) => ({
                                    id: item.id,
                                    title: item.event_title,
                                    subtitle: item.category ?? "General",
                                    href: `/event/${item.id}`,
                                }))}
                            />
                        </div>
                    </section>
                </div>

                <ProgramGallerySection
                    id="event-detail-gallery"
                    title="Event"
                    titleAccent="Gallery"
                    subtitle={`Photos from ${event.event_title} and moments shared by participants.`}
                    images={galleryImages}
                    emptyMessage="Gallery images for this event will be added soon."
                />

                <TestimonialsCarousel
                    id="event-detail-testimonials"
                    title="Voices from"
                    titleAccent="Our Events"
                    subtitle="Volunteers and community members reflect on Lakshyadeep events."
                    items={EVENT_TESTIMONIALS}
                />
            </main>
            <Footer />
        </>
    );
}
