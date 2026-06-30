"use client";

import Link from "next/link";
import {
  FaTachometerAlt,
  FaUsers,
  FaImages,
  FaBlog,
  FaCalendarAlt,
  FaQuestionCircle,
  FaUserTie,
  FaPlus,
  FaNewspaper,
  FaVideo,
  FaBullhorn
} from "react-icons/fa";
import ChartPieLabelList from "@/components/dashboard/overview-chart/chart";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/supabase";
import type { User } from "@supabase/supabase-js";

type DashboardStatus =
  | "checking"
  | "config-error"
  | "unauthenticated"
  | "unauthorized"
  | "ready";

type SidebarItem = {
  id: string;
  label: string;
  expandable?: boolean;
};

type StatCard = {
  id: string;
  label: string;
  value: string;
};

type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  ago: string;
};

const SIDEBAR_ITEMS: (SidebarItem & { icon: React.ReactNode })[] = [
  { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt size={16} /> },
  { id: "blog", label: "Blog", icon: <FaBlog size={16} /> },
  { id: "gallery", label: "Gallery", icon: <FaImages size={16} /> },
  { id: "event", label: "event", icon: <FaCalendarAlt size={16} /> },
  { id: "team", label: "Team Members", icon: <FaUsers size={16} /> },
  { id: "pages", label: "Pages", icon: <FaTachometerAlt size={16} /> },
  { id: "donations", label: "Donations", icon: <FaTachometerAlt size={16} /> },
  { id: "contact", label: "Contact", icon: <FaQuestionCircle size={16} /> },
  { id: "faqs", label: "FAQs", icon: <FaQuestionCircle size={16} /> },
];

const getDashboardStats = (isMobile: boolean) => [
  {
    id: "posts",
    label: isMobile ? "Posts" : "Total Projects",
    value: "24",
    icon: <FaBlog className="h-5 w-5" />
  },
  {
    id: "event",
    label: isMobile ? "event" : "Total events",
    value: "8",
    icon: <FaCalendarAlt className="h-5 w-5" />
  },
  {
    id: "team",
    label: isMobile ? "Team" : "Total Donation ",
    value: "12",
    icon: <FaUserTie className="h-5 w-5" />
  },
  {
    id: "blogs",
    label: isMobile ? "Blogs" : "Total Content",
    value: "156",
    icon: <FaBlog className="h-5 w-5" />
  }
];

// Helper to format "time ago"
function getTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}


function StatusScreen({ title, message }: { title: string; message: string }) {
  return (
    <main className="device-responsive-page min-h-screen bg-slate-100 px-4 py-8 sm:px-6">
      <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-3 text-sm text-black">{message}</p>
      </section>
    </main>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 3H17V17H3V3Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 8H17" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 8V17" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 5L13 10L8 15" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function DotIcon() {
  return <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />;
}

export default function DashboardPage() {
  const router = useRouter();

  const [status, setStatus] = useState<DashboardStatus>("checking");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const [counts, setCounts] = useState({
    projects: 0,
    events: 0,
    donations: 0,
    blogs: 0,
    articles: 0,
    totalContent: 0,
    notices: 0,
    videos: 0
  });

  const [recentData, setRecentData] = useState({
    donations: [] as any[],
    projects: [] as any[],
    events: [] as any[],
    blogs: [] as any[],
    articles: [] as any[],
    notices: [] as any[],
    videos: [] as any[]
  });

  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function validateSession() {
      // skipping auth validation as per environment setup
      if (isMounted) setStatus("ready");
    }

    validateSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = getSupabaseClient();

        // Fetch Counts
        const [
          { count: projectCount },
          { count: eventCount },
          { count: donationCount },
          { count: blogCount },
          { count: articleCount },
          { count: newsCount },
          { count: noticeCount },
          { count: videoCount }
        ] = await Promise.all([
          supabase.from('project').select('*', { count: 'exact', head: true }),
          supabase.from('event').select('*', { count: 'exact', head: true }),
          supabase.from('donations').select('*', { count: 'exact', head: true }),
          supabase.from('blogs').select('*', { count: 'exact', head: true }),
          supabase.from('articles').select('*', { count: 'exact', head: true }),
          supabase.from('news').select('*', { count: 'exact', head: true }),
          supabase.from('notices').select('*', { count: 'exact', head: true }),
          supabase.from('hero_settings').select('*', { count: 'exact', head: true }),
        ]);

        setCounts({
          projects: projectCount || 0,
          events: eventCount || 0,
          donations: donationCount || 0,
          blogs: blogCount || 0,
          articles: articleCount || 0,
          totalContent: (blogCount || 0) + (articleCount || 0) + (newsCount || 0),
          notices: noticeCount || 0,
          videos: videoCount || 0
        });

        // Fetch Recent Items
        const [
          { data: recentDonations },
          { data: recentProjects },
          { data: recentEvents },
          { data: recentBlogs },
          { data: recentArticles },
          { data: recentNotices },
          { data: recentVideos }
        ] = await Promise.all([
          supabase.from('donations').select('id, name, amount, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('project').select('id, project_title, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('event').select('id, event_title, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('blogs').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('articles').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('notices').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('hero_settings').select('id, title, is_active, updated_at').order('updated_at', { ascending: false }).limit(5),
        ]);

        setRecentData({
          donations: recentDonations || [],
          projects: recentProjects || [],
          events: recentEvents || [],
          blogs: recentBlogs || [],
          articles: recentArticles || [],
          notices: recentNotices || [],
          videos: recentVideos || []
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchData();
  }, []);

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
    }
    router.replace("/dashboard");
  };

  const dashboardStats = useMemo(() => [
    {
      id: "projects",
      label: isMobile ? "Projects" : "Total Projects",
      value: counts.projects.toString(),
      icon: <FaBlog className="h-5 w-5 text-blue-500" />,
      href: "/dashboard/project"
    },
    {
      id: "events",
      label: isMobile ? "Events" : "Total Events",
      value: counts.events.toString(),
      icon: <FaCalendarAlt className="h-5 w-5 text-emerald-500" />,
      href: "/dashboard/event"
    },
    {
      id: "donations",
      label: isMobile ? "Donations" : "Total Donations",
      value: counts.donations.toString(),
      icon: <FaUserTie className="h-5 w-5 text-sky-500" />,
      href: "/dashboard/donation"
    },
    {
      id: "content",
      label: isMobile ? "Content" : "Total Content",
      value: counts.totalContent.toString(),
      icon: <FaNewspaper className="h-5 w-5 text-purple-500" />,
      href: "/dashboard/blog"
    }
  ], [isMobile, counts]);

  if (status === "checking") {
    return <StatusScreen title="Dashboard" message="Loading your workspace..." />;
  }

  if (status === "config-error") {
    return (
      <StatusScreen
        title="Configuration Required"
        message="Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local."
      />
    );
  }

  if (status === "unauthenticated") {
    return (
      <StatusScreen
        title="Session Expired"
        message="No active session found. Redirecting to login..."
      />
    );
  }

  if (status === "unauthorized") {
    return (
      <main className="device-responsive-page min-h-screen bg-slate-100 px-4 py-8 sm:px-6">
        <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Access Denied
          </h1>
          <p className="mt-3 text-sm text-black">
            This dashboard is restricted to the configured super admin account only.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Signed in as: {currentUser?.email ?? "Unknown user"}
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Sign out
          </button>
        </section>
      </main>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
          {isMobile ? "Dashboard" : "Welcome to Lakshyadeep Dashboard"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isMobile
            ? "Manage your operations"
            : "Monitor and manage your operations from one central hub"
          }
        </p>
      </header>

      {/* Responsive Stats Grid */}
      <section className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
        {dashboardStats.map((card) => (
          <Link href={card.href} key={card.id}>
            <article
              className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_1px_2px_rgba(2,6,23,0.06)] hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-slate-500 group-hover:text-sky-600 transition-colors">{card.label}</p>
                {card.icon}
              </div>
              <p className={`mt-2 font-semibold ${isMobile ? 'text-xl' : 'text-2xl sm:text-3xl'} text-slate-900`}>
                {card.value}
              </p>
            </article>
          </Link>
        ))}
      </section>

      <ChartPieLabelList counts={counts} />

      <section className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_1.2fr_1fr]">
        <article className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(2,6,23,0.06)]">
          <header className="border-b border-slate-200 px-4 py-3 flex items-center gap-2">
            <FaUserTie className="text-sky-500" />
            <h2 className="text-lg font-semibold text-slate-900">Recent Donations</h2>
          </header>
          <ul className="space-y-4 px-4 py-4 min-h-[200px]">
            {recentData.donations.length > 0 ? recentData.donations.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <div className="mt-1">
                  <DotIcon />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.name} donated रू {item.amount}</p>
                  <p className="text-xs text-slate-500">
                    {getTimeAgo(item.created_at)}
                  </p>
                </div>
              </li>
            )) : (
              <p className="text-sm text-slate-400 text-center py-10">No recent donations</p>
            )}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(2,6,23,0.06)]">
          <header className="border-b border-slate-200 px-4 py-3 flex items-center gap-2">
            <FaBlog className="text-blue-500" />
            <h2 className="text-lg font-semibold text-slate-900">Recent Projects</h2>
          </header>
          <ul className="space-y-4 px-4 py-4 min-h-[200px]">
            {recentData.projects.length > 0 ? recentData.projects.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <div className="mt-1">
                  <DotIcon />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.project_title}</p>
                  <p className="text-xs text-slate-500">
                    {getTimeAgo(item.created_at)}
                  </p>
                </div>
              </li>
            )) : (
              <p className="text-sm text-slate-400 text-center py-10">No recent projects</p>
            )}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(2,6,23,0.06)]">
          <header className="border-b border-slate-200 px-4 py-3 flex items-center gap-2">
            <FaCalendarAlt className="text-emerald-500" />
            <h2 className="text-lg font-semibold text-slate-900">Recent Events</h2>
          </header>
          <ul className="space-y-4 px-4 py-4 min-h-[200px]">
            {recentData.events.length > 0 ? recentData.events.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <div className="mt-1">
                  <DotIcon />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.event_title}</p>
                  <p className="text-xs text-slate-500">
                    {getTimeAgo(item.created_at)}
                  </p>
                </div>
              </li>
            )) : (
              <p className="text-sm text-slate-400 text-center py-10">No recent events</p>
            )}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(2,6,23,0.06)]">
          <header className="border-b border-slate-200 px-4 py-3 flex items-center gap-2">
            <FaBlog className="text-purple-500" />
            <h2 className="text-lg font-semibold text-slate-900">Recent Blogs</h2>
          </header>
          <ul className="space-y-4 px-4 py-4 min-h-[200px]">
            {recentData.blogs.length > 0 ? recentData.blogs.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <div className="mt-1">
                  <DotIcon />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">
                    {getTimeAgo(item.created_at)}
                  </p>
                </div>
              </li>
            )) : (
              <p className="text-sm text-slate-400 text-center py-10">No recent blogs</p>
            )}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(2,6,23,0.06)]">
          <header className="border-b border-slate-200 px-4 py-3 flex items-center gap-2">
            <FaNewspaper className="text-pink-500" />
            <h2 className="text-lg font-semibold text-slate-900">Recent Articles</h2>
          </header>
          <ul className="space-y-4 px-4 py-4 min-h-[200px]">
            {recentData.articles.length > 0 ? recentData.articles.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <div className="mt-1">
                  <DotIcon />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">
                    {getTimeAgo(item.created_at)}
                  </p>
                </div>
              </li>
            )) : (
              <p className="text-sm text-slate-400 text-center py-10">No recent articles</p>
            )}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(2,6,23,0.06)]">
          <header className="border-b border-slate-200 px-4 py-3 flex items-center gap-2">
            <FaBullhorn className="text-brand" />
            <h2 className="text-lg font-semibold text-slate-900">Recent Notices</h2>
          </header>
          <ul className="space-y-4 px-4 py-4 min-h-[200px]">
            {recentData.notices.length > 0 ? recentData.notices.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <div className="mt-1">
                  <DotIcon />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">
                    {getTimeAgo(item.created_at)}
                  </p>
                </div>
              </li>
            )) : (
              <p className="text-sm text-slate-400 text-center py-10">No recent notices</p>
            )}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(2,6,23,0.06)]">
          <header className="border-b border-slate-200 px-4 py-3 flex items-center gap-2">
            <FaVideo className="text-red-500" />
            <h2 className="text-lg font-semibold text-slate-900">Recent Videos</h2>
          </header>
          <ul className="space-y-4 px-4 py-4 min-h-[200px]">
            {recentData.videos.length > 0 ? recentData.videos.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <div className="mt-1">
                  <DotIcon />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    {item.is_active && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Active</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {getTimeAgo(item.updated_at || item.created_at)}
                  </p>
                </div>
              </li>
            )) : (
              <p className="text-sm text-slate-400 text-center py-10">No recent videos</p>
            )}
          </ul>
        </article>
      </section>
    </div>
  );
}
