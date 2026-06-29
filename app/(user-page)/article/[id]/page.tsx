import Image from "next/image";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Header from "@/components/homepage/Header/header";
import Footer from "@/components/shared-component/footer/page";
import BackButton from "@/components/shared-component/back-button/page";
import Breadcrumbs from "@/components/shared-component/breadcrumbs";
import { getReadingTimeMinutes } from "@/lib/reading-time";

interface ArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { id } = await params;
  const supabase = getSupabaseServerClient();

  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (error || !article) {
    notFound();
  }

  const readingTime = getReadingTimeMinutes(article.content);
  const displayDate = article.published_at ?? article.created_at;

  return (
    <>
      <Header />
      <main className="min-h-screen animate-reveal-up bg-white pb-20">
        <div className="mx-auto max-w-4xl px-6 pt-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Articles", href: "/article" },
              { label: article.title },
            ]}
          />
        </div>

        <div className="relative mt-4 h-[40vh] w-full overflow-hidden md:h-[60vh]">
          {article.article_image_url ? (
            <Image
              src={article.article_image_url}
              alt={article.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
              No cover image available
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-6 text-white md:p-12">
            <div className="mx-auto max-w-4xl">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {article.category && (
                  <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    {article.category}
                  </span>
                )}
                {displayDate && (
                  <span className="text-sm text-slate-200">
                    {new Date(displayDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
                <span className="text-sm text-slate-200">{readingTime} min read</span>
              </div>
              <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                {article.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-8">
            <BackButton href="/article" label="Back to articles" />
          </div>

          <div className="mb-10 flex items-center gap-4 border-b border-slate-100 pb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-[#ed7423]">
              {article.author?.[0] || "A"}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{article.author || "Anonymous"}</p>
              <p className="text-sm text-slate-500">Author</p>
            </div>
          </div>

          <div className="prose prose-emerald max-w-none text-slate-700">
            {article.content ? (
              article.content.split("\n").map((paragraph: string, index: number) =>
                paragraph.trim() ? (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ) : null
              )
            ) : (
              <p className="italic text-slate-400">No content available for this article.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
