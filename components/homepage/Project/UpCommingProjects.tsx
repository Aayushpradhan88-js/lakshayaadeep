"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/supabase";

interface Project {
  id: string;
  project_title: string;
  description: string;
  category: string;
  start_date: string;
  cover_image_url: string;
  project_location?: {
    province: string;
    district: string;
    municipality: string;
  }[];
}

const categoryColors: Record<string, string> = {
  'Healthcare': 'text-brand',
  'Education': 'text-[#6080e0]',
  'Nutrition': 'text-[#4ab870]',
  'Environment': 'text-[#4ab870]',
  'Social': 'text-[#6080e0]',
  'Other': 'text-black',
};

// Unified Project Card
function ProjectCard({ project }: { project: Project }) {
  const colorClass = categoryColors[project.category] || 'text-brand';

  return (
    <Link href={`/project/${project.id}`} className="flex rounded-2xl overflow-hidden bg-white border border-slate-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-pointer h-full">
      {/* Left — Image */}
      <div className="relative w-[120px] sm:w-[150px] shrink-0 bg-slate-100">
        <Image
          src={project.cover_image_url || "https://images.unsplash.com/photo-1584515933487-779824d29309?w=300&h=200&fit=crop"}
          alt={project.project_title}
          fill
          className="object-cover"
          sizes="150px"
        />
      </div>

      {/* Right — Content */}
      <div className="flex flex-col justify-center px-4 py-4 flex-1 min-w-0">
        <p className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${colorClass}`}>
          {project.category}
        </p>
        <h3 className="text-[16px] font-bold text-gray-900 leading-tight mb-1 line-clamp-1">
          {project.project_title}
        </h3>
        <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2 mb-2">
          {project.description}
        </p>
        {project.project_location && project.project_location.length > 0 && (
          <p className="text-[10px] text-slate-400 flex items-center gap-1">
            <svg className="w-3 h-3 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {project.project_location[0].municipality}, {project.project_location[0].district}
          </p>
        )}
      </div>
    </Link>
  );
}

function UpcomingProjects({ hideHeader = false }: { hideHeader?: boolean }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('project')
          .select(`
            id, 
            project_title, 
            description, 
            category, 
            start_date, 
            cover_image_url,
            project_location (
              province,
              district,
              municipality
            )
          `)
          .eq('status', 'Upcoming')
          .order('start_date', { ascending: true })
          .limit(5);

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching upcoming projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  return (
    <div className="max-w-5xl mx-auto font-sans">
      {/* Section Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between gap-2.5 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-7 bg-[#e8885a] rounded-full" />
            <h2 className="text-2xl font-bold text-gray-900">
              Upcoming <span className="text-brand font-light">Projects</span>
            </h2>
          </div>
          <Link href="/project" className="text-sm font-semibold text-brand hover:underline">
            View All
          </Link>
        </div>
      )}

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          [1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-50 animate-pulse rounded-2xl border border-slate-100" />)
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="md:col-span-2 text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No upcoming projects scheduled at the moment.
          </div>
        )}
      </div>
    </div>
  );
}

export default UpcomingProjects;