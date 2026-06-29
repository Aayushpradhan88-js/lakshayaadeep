"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/homepage/Header/header";
import Footer from "@/components/shared-component/footer/page";

// ─── Supabase client ──────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Type — adjust field names if your columns differ ────────────────────────
type Article = {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  article_image_url?: string;
  author?: string;
  category?: string;
  status?: string;
  published_at?: string;
  created_at: string;
  slug?: string;
};

// ─── Filter categories ────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Health", "Education", "Nutrition", "Community", "News"];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const ArticleSkeleton = () => (
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

// ─── Article card ─────────────────────────────────────────────────────────────
const ArticleCard = ({ article }: { article: Article }) => {
  const displayDate = article.published_at ?? article.created_at;
  const date = new Date(displayDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const href = `/article/${article.id}`;

  const excerpt =
    article.excerpt ??
    (article.content?.length > 100
      ? article.content.slice(0, 100) + "…"
      : article.content);

  const initials = article.author
    ? article.author
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "NG";

  return (
    <Link
      href={href}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group"
    >
      {/* Cover image */}
      <div className="relative h-44 overflow-hidden bg-amber-50 shrink-0">
        {article.article_image_url ? (
          <img
            src={article.article_image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-teal-50">
            <svg
              className="w-10 h-10 text-amber-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
        )}

        {/* Category badge */}
        {article.category && (
          <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider bg-white/90 text-amber-700 px-2.5 py-0.5 rounded-full">
            {article.category}
          </span>
        )}

        {/* Published status badge */}
        {article.status && (
          <span
            className={`absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${article.status === "published"
                ? "bg-teal-500 text-white"
                : "bg-gray-200 text-gray-600"
              }`}
          >
            {article.status}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] text-gray-400 mb-1.5">{date}</p>
        <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2 group-hover:text-amber-600 transition-colors duration-200">
          {article.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed flex-1 line-clamp-2">{excerpt}</p>

        {/* Author row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-700 shrink-0">
              {initials}
            </div>
            <span className="text-xs text-gray-500">
              {article.author ?? "NGO Team"}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-amber-500 group-hover:underline">
            Read more →
          </span>
        </div>
      </div>
    </Link>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ArticlePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filtered, setFiltered] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch from Supabase
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) {
        setError("Failed to load articles.");
        console.error(error);
      } else {
        setArticles(data ?? []);
        setFiltered(data ?? []);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  // Filter by category + search
  useEffect(() => {
    let result = articles;

    if (activeCategory !== "All") {
      result = result.filter(
        (a) => a.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.content?.toLowerCase().includes(q) ||
          a.author?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [activeCategory, search, articles]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-stone-50 animate-reveal-up">

        {/* ── Hero ── */}
        <section className="relative h-48 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80"
            alt="Articles hero"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
          <div className="absolute bottom-6 left-6">
            <p className="text-xs font-semibold text-amber-300 uppercase tracking-widest mb-1">
              Knowledge Hub
            </p>
            <h1 className="text-3xl font-bold text-white">
              Articles &amp;{" "}
              <span className="text-teal-300 italic font-serif">Stories</span>
            </h1>
          </div>
        </section>

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
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-600"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-56">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border border-gray-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition"
              />
            </div>
          </div>

          {/* ── Results count ── */}
          {!loading && (
            <p className="text-xs text-gray-400 mb-5">
              {filtered.length}{" "}
              {filtered.length === 1 ? "article" : "articles"} found
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
              {[...Array(6)].map((_, i) => (
                <ArticleSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500">No articles found</p>
              <p className="text-xs text-gray-400 mt-1">
                Try a different category or search term
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}