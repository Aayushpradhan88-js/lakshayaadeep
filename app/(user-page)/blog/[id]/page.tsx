import Image from "next/image";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Header from "@/components/homepage/Header/header";
import Footer from "@/components/shared-component/footer/page";
import BackButton from "@/components/shared-component/back-button/page";
import Breadcrumbs from "@/components/shared-component/breadcrumbs";
import { getReadingTimeMinutes } from "@/lib/reading-time";

interface BlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { id } = await params;
  const supabase = getSupabaseServerClient();

  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (error || !blog) {
    notFound();
  }

  const readingTime = getReadingTimeMinutes(blog.content);

  return (
    <>
      <Header />
      <main className="min-h-screen animate-reveal-up bg-white pb-20">
        <div className="mx-auto max-w-4xl px-6 pt-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: blog.title },
            ]}
          />
        </div>

        <div className="bg-slate-50 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            {blog.category && (
              <span className="mb-6 inline-block rounded-full bg-teal-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-700">
                {blog.category}
              </span>
            )}
            <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-500">
              <span className="font-medium text-slate-900">{blog.author || "NGO Team"}</span>
              <span>•</span>
              <span>
                {new Date(blog.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>

        <div className="mx-auto -mt-10 mb-16 max-w-5xl px-6">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-slate-200 shadow-2xl shadow-teal-900/10">
            {blog.blog_image_url ? (
              <Image
                src={blog.blog_image_url}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                No featured image available
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-10">
            <BackButton href="/blog" label="Back to blog" />
          </div>

          <div className="prose prose-lg prose-teal max-w-none space-y-6 leading-relaxed text-slate-700">
            {blog.content ? (
              blog.content.split("\n").map((paragraph: string, index: number) =>
                paragraph.trim() ? <p key={index}>{paragraph}</p> : null
              )
            ) : (
              <p className="italic text-slate-400">No content available for this blog post.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
