"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/supabase";
import ProgramListingCard from "@/components/shared-component/program-listing-card";
import { ProgramListingSection } from "@/components/shared-component/program-listing-layout";

interface Project {
  id: string;
  project_title: string;
  description: string;
  category: string;
  status: string;
  cover_image_url: string;
  project_location?: {
    province: string;
    district: string;
    municipality: string;
  }[];
}

const categoryColors: Record<string, string> = {
  Healthcare: "text-brand",
  Education: "text-[#6080e0]",
  Nutrition: "text-[#4ab870]",
  Environment: "text-[#4ab870]",
  Social: "text-[#6080e0]",
  Other: "text-black",
};

function OngoingProjects({ hideHeader = false }: { hideHeader?: boolean }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("project")
          .select(`
            id, 
            project_title, 
            description, 
            category, 
            status, 
            cover_image_url,
            project_location (
              province,
              district,
              municipality
            )
          `)
          .eq("status", "Ongoing")
          .limit(5);

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error("Error fetching ongoing projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ProgramListingSection
      title="Ongoing"
      accent="Projects"
      viewAllHref="/project"
      hideHeader={hideHeader}
      loading={loading}
      isEmpty={projects.length === 0}
      emptyMessage="No ongoing projects at this time."
    >
      {projects.map((project) => (
        <ProgramListingCard
          key={project.id}
          href={`/project/${project.id}`}
          imageSrc={project.cover_image_url}
          imageAlt={project.project_title}
          category={project.category}
          categoryColorClass={categoryColors[project.category] || "text-brand"}
          title={project.project_title}
          description={project.description}
          locationLabel={
            project.project_location?.[0]
              ? `${project.project_location[0].municipality}, ${project.project_location[0].district}`
              : undefined
          }
        />
      ))}
    </ProgramListingSection>
  );
}

export default OngoingProjects;
