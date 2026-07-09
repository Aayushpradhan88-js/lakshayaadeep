import Image from "next/image";
import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import TestimonialsCarousel from "@/components/shared-component/testimonials-carousel";
import ProgramGallerySection from "@/components/shared-component/program-gallery-section";
import { PROJECT_TESTIMONIALS } from "@/components/homepage/programs-content";
import Breadcrumbs from "@/components/shared-component/breadcrumbs";
import DetailMetaChips from "@/components/shared-component/detail-meta-chips";
import DetailFactsSidebar from "@/components/shared-component/detail-facts-sidebar";
import ContentProse from "@/components/shared-component/content-prose";
import RelatedItemsList from "@/components/shared-component/related-items-list";
import { PROJECTS_EVENTS_HUB } from "@/components/homepage/Header/nav-config";

type ProjectDetail = {
    id: string;
    project_title: string;
    description?: string;
    category?: string;
    project_organizer?: string;
    location?: string;
    project_location?: {
        province: string;
        district: string;
        municipality: string;
    };
    cover_image_url?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
};

type ProjectGalleryImage = {
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

function formatLocation(project: ProjectDetail) {
    if (project.project_location) {
        const { municipality, district, province } = project.project_location;
        return `${municipality}, ${district}, ${province}`;
    }
    return project.location ?? "";
}

async function getProjectById(id: string): Promise<ProjectDetail | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("project")
        .select(`
            *,
            project_location (
                province,
                district,
                municipality
            )
        `)
        .not("status", "ilike", "draft")
        .eq("id", id)
        .single();

    if (error || !data) return null;
    return data;
}

async function getProjectGallery(id: string): Promise<ProjectGalleryImage[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("project_gallery")
        .select("id, image_url")
        .eq("project_id", id)
        .order("created_at", { ascending: true });

    return error ? [] : data ?? [];
}

async function getOtherProjects(id: string): Promise<ProjectDetail[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("project")
        .select("id, project_title, cover_image_url, category, status")
        .neq("id", id)
        .not("status", "ilike", "draft")
        .order("created_at", { ascending: false })
        .limit(3);

    return error ? [] : data ?? [];
}

async function PerProject({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await getProjectById(id);
    if (!project) {
        notFound();
    }

    const gallery = await getProjectGallery(id);
    const otherProjects = await getOtherProjects(id);
    const heroImage = project.cover_image_url ?? gallery[0]?.image_url;
    const galleryImages = gallery.map((item) => ({
      id: item.id,
      url: item.image_url,
      alt: `${project.project_title} gallery image`,
    }));

    const startDate = formatDate(project.start_date);
    const endDate = formatDate(project.end_date);
    const locationLabel = formatLocation(project);
    const dateRange = startDate ? `${startDate}${endDate ? ` – ${endDate}` : ""}` : "";

    const metaChips = [
        project.status ? { label: project.status, variant: "status" as const } : null,
        dateRange ? { label: dateRange } : null,
        locationLabel ? { label: locationLabel } : null,
        project.category ? { label: project.category } : null,
    ].filter(Boolean) as { label: string; variant?: "default" | "status" }[];

    const facts = [
        { label: "Category", value: project.category ?? "Community Project" },
        project.status ? { label: "Status", value: project.status } : null,
        dateRange ? { label: "Timeline", value: dateRange } : null,
        project.project_organizer ? { label: "Organizer", value: project.project_organizer } : null,
        locationLabel ? { label: "Location", value: locationLabel } : null,
    ].filter(Boolean) as { label: string; value: string }[];

    return (
        <main className="min-h-screen bg-white font-sans">
            <div className="mx-auto max-w-5xl px-4 pt-6">
                <Breadcrumbs
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Projects", href: PROJECTS_EVENTS_HUB },
                        { label: project.project_title },
                    ]}
                />
            </div>

            <section className="relative mt-4 h-[26rem] overflow-hidden sm:h-[32rem]">
                {heroImage ? (
                    <Image
                        src={heroImage}
                        alt={project.project_title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
                        No project banner available
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-8 left-6 right-6 text-white">
                    <h1 className="text-4xl font-bold leading-tight">{project.project_title}</h1>
                    <DetailMetaChips chips={metaChips} className="mt-4" />
                </div>
            </section>

            <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
                <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                    <ContentProse
                        content={project.description}
                        emptyMessage="No description available."
                    />

                    <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                        <DetailFactsSidebar facts={facts} />
                        <RelatedItemsList
                            title="Other projects"
                            items={otherProjects.map((item) => ({
                                id: item.id,
                                title: item.project_title,
                                subtitle: item.category ?? "Community Project",
                                href: `/project/${item.id}`,
                            }))}
                        />
                    </div>
                </section>
            </div>

            <ProgramGallerySection
                id="project-detail-gallery"
                title="Project"
                titleAccent="Gallery"
                subtitle={`Photos from ${project.project_title} and its impact in the community.`}
                images={galleryImages}
                emptyMessage="Gallery images for this project will be added soon."
            />

            <TestimonialsCarousel
                id="project-detail-testimonials"
                title="Voices from"
                titleAccent="Our Projects"
                subtitle="Community members and partners share their experience with Lakshyadeep projects."
                items={PROJECT_TESTIMONIALS}
            />
        </main>
    );
}

export default PerProject;
