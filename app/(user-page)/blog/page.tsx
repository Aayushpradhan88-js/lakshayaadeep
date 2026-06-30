"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/homepage/Header/header";
import Footer from "@/components/shared-component/footer/page";
import PageImageHeroSection from "@/components/shared-component/page-image-hero-section";
import { PAGE_HERO_CONTENT } from "@/components/shared-component/page-hero-content";

// ─── Supabase client ──────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Type ─────────────────────────────────────────────────────────────────────
type Blog = {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  blog_image_url?: string;
  author?: string;
  category?: string;
  created_at: string;
  slug?: string;
};

// ─── Categories for filter tabs ───────────────────────────────────────────────
const CATEGORIES = ["All", "Health", "Education", "Nutrition", "Community"];

// ─── Skeleton card ────────────────────────────────────────────────────────────
const BlogSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
    <div className="h-44 bg-gray-200 w-full" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-gray-200 rounded w-1/4" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="flex items-center gap-2 pt-1">
        <div className="w-6 h-6 rounded-full bg-gray-200" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  </div>
);

// ─── Blog card ────────────────────────────────────────────────────────────────
const BlogCard = ({ blog }: { blog: Blog }) => {
  const date = new Date(blog.created_at).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const href = `/blog/${blog.id}`;

  const excerpt =
    blog.excerpt ??
    (blog.content?.length > 100
      ? blog.content.slice(0, 100) + "…"
      : blog.content);

  const initials = blog.author
    ? blog.author.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "NG";

  return (
    <Link
      href={href}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group"
    >
      {/* Cover image */}
      <div className="relative h-44 overflow-hidden bg-teal-50 shrink-0">
        {blog.blog_image_url ? (
          <img
            src={blog.blog_image_url}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-amber-50">
            <svg className="w-10 h-10 text-teal-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        )}
        {/* Category badge */}
        {blog.category && (
          <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider bg-white/90 text-teal-700 px-2.5 py-0.5 rounded-full">
            {blog.category}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] text-black mb-1.5">{date}</p>
        <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2 group-hover:text-teal-600 transition-colors duration-200">
          {blog.title}
        </h3>
        <p className="text-xs text-black leading-relaxed flex-1 line-clamp-2">
          {excerpt}
        </p>

        {/* Author row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-[10px] font-bold text-teal-700 shrink-0">
              {initials}
            </div>
            <span className="text-xs text-black">{blog.author ?? "NGO Team"}</span>
          </div>
          <span className="text-[10px] font-semibold text-teal-500 group-hover:underline">
            Read more →
          </span>
        </div>
      </div>
    </Link>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filtered, setFiltered] = useState<Blog[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch from Supabase
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) {
        setError("Failed to load blogs.");
        console.error(error);
      } else {
        setBlogs(data ?? []);
        setFiltered(data ?? []);
      }
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  // Filter by category + search
  useEffect(() => {
    let result = blogs;

    if (activeCategory !== "All") {
      result = result.filter(
        (b) => b.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.content?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [activeCategory, search, blogs]);

  return (

    <>
      <Header />
      <main className="min-h-screen bg-stone-50 animate-reveal-up">
        <PageImageHeroSection {...PAGE_HERO_CONTENT.blog} />

        <div className="max-w-5xl mx-auto px-4 py-8">

          {/* ── Search + filter row ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs font-medium px-4 py-1.5 rounded-full border transition-all duration-200 ${activeCategory === cat
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-white text-black border-gray-200 hover:border-teal-300 hover:text-teal-600"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-56">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search blogs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border border-gray-200 bg-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 transition"
              />
            </div>
          </div>

          {/* ── Results count ── */}
          {!loading && (
            <p className="text-xs text-black mb-5">
              {filtered.length} {filtered.length === 1 ? "post" : "posts"} found
            </p>
          )}

          {/* ── Error ── */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl mb-6">
              {error}
            </p>
          )}

          {/* ── Grid ── */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <BlogSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-black">No posts found</p>
              <p className="text-xs text-black mt-1">Try a different category or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}