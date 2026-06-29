import Footer from '@/components/shared-component/footer/page'
import Link from 'next/link'
import { Article } from '@/lib/database/types'
import { getSupabaseServerClient } from '@/lib/supabase/server'

const fetchPublishedArticles = async (): Promise<Article[]> => {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(4)

    if (error) {
        console.error('Error fetching published articles:', error.message)
        return []
    }

    return data || []
}

const ArticleSection = async () => {
    const articles = await fetchPublishedArticles()

    return (
        <>
            <section className="py-16 bg-white">
                <div className="mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <p className="text-brand font-semibold uppercase tracking-wide mb-3">Featured Insights</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Latest Articles</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto mt-4">
                            Explore our newest articles to stay informed about our programs and impact.
                        </p>
                    </div>

                    {articles.length === 0 ? (
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
                            No published articles are available yet.
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                            {articles.map((article) => (
                                <Link
                                    href={`/article/${article.id}`}
                                    key={article.id}
                                    className="group block rounded-3xl border border-slate-200 bg-slate-50 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <article>
                                        <div className="relative h-56 overflow-hidden bg-slate-200">
                                            {article.article_image_url ? (
                                                <img
                                                    src={article.article_image_url}
                                                    alt={article.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                                                    <svg className="w-12 h-12 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-xs font-medium uppercase tracking-wider">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <p className="text-xs uppercase tracking-[0.24em] text-brand font-semibold mb-3">Article #{article.article_no}</p>
                                            <h3 className="text-xl font-semibold text-slate-900 mb-3">{article.title}</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                                                {article.excerpt || (article.content && article.content.slice(0, 100)) || 'Discover our latest insights and updates.'}
                                            </p>
                                            <div className="text-xs text-slate-500 flex flex-wrap gap-2 items-center">
                                                <span>{article.author}</span>
                                                {article.category && <span>• {article.category}</span>}
                                                {article.published_at && <span>• {new Date(article.published_at).toLocaleDateString()}</span>}
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default ArticleSection
