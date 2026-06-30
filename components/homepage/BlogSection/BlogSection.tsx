import Link from 'next/link'
import { Blog } from '@/lib/database/types'
import { getSupabaseServerClient } from '@/lib/supabase/server'

const fetchPublishedBlogs = async (): Promise<Blog[]> => {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(4)

    if (error) {
        console.error('Error fetching published blogs:', error.message)
        return []
    }

    return data || []
}

const BlogSection = async () => {
    const blogs = await fetchPublishedBlogs()

    return (
        <section className="py-16 bg-slate-50">
            <div className="container mx-auto max-w-6xl px-4 md:px-8">
                <div className="text-center mb-12">
                    <p className="text-cyan-500 font-semibold uppercase tracking-wide mb-3">Latest Updates</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900">From Our Blog</h2>
                    <p className="text-black max-w-2xl mx-auto mt-4">
                        Read the newest stories, news, and impact updates from our team.
                    </p>
                </div>

                {blogs.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-black">
                        No published blog posts are available yet.
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {blogs.map((blog) => (
                            <Link
                                href={`/blog/${blog.id}`}
                                key={blog.id}
                                className="group block rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <article>
                                    <div className="relative h-56 overflow-hidden bg-slate-100">
                                        {blog.blog_image_url ? (
                                            <img
                                                src={blog.blog_image_url}
                                                alt={blog.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-slate-400">
                                                <svg className="w-12 h-12 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-xs font-medium uppercase tracking-wider">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-500 font-semibold mb-3">Blog</p>
                                        <h3 className="text-xl font-semibold text-slate-900 mb-3">{blog.title}</h3>
                                        <p className="text-sm text-black leading-relaxed mb-4 line-clamp-3">
                                            {blog.excerpt || (blog.content && blog.content.slice(0, 100)) || 'A new update from our team.'}
                                        </p>
                                        <div className="text-xs text-slate-500 flex flex-wrap gap-2 items-center">
                                            <span>{blog.author}</span>
                                            {blog.category && <span>• {blog.category}</span>}
                                            {blog.published_at && <span>• {new Date(blog.published_at).toLocaleDateString()}</span>}
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default BlogSection
