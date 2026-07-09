"use client";

import { useState, useEffect } from "react";
import {
  FaFileAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCalendarAlt,
  FaEye,
  FaTag,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaHashtag,
  FaTimes
} from "react-icons/fa";
import { getSupabaseClient } from "@/lib/supabase/supabase";
import { Article } from "@/lib/database/types";
import { useAdminFeedback } from "@/components/shared-component/admin-feedback";
import { FastLoading } from "@/components/shared-component/fast-loading";
import { AdminDetailModal } from "@/components/shared-component/admin-detail-modal";
import { ArticleCreateForm } from "@/components/shared-component/article-create-form";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { showToast, askConfirm } = useAdminFeedback();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = (articleId: string) => {
    askConfirm('Are you sure you want to delete this article?', async () => {
      try {
        const supabase = getSupabaseClient();
        const { error } = await supabase
          .from('articles')
          .delete()
          .eq('id', articleId);

        if (error) throw error;

        setArticles(prev => prev.filter(article => article.id !== articleId));
        if (selectedArticle?.id === articleId) {
          setSelectedArticle(null);
          setShowDetailModal(false);
        }
        showToast('Article deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting article:', error);
        showToast('Failed to delete article', 'error');
      }
    });
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || article.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const categories = [...new Set(articles.map(article => article.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FastLoading size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Articles Management</h1>
            <p className="text-black">Manage and publish articles for your audience</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Previous: <Link href="/dashboard/article/create"> redirected to a new page */}
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center gap-2 shadow-lg"
            >
              <FaPlus className="h-4 w-4" />
              Write Article
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl border border-blue-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">Total Articles</p>
              <p className="text-2xl font-bold text-white">{articles.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaFileAlt className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl border border-green-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100">Published</p>
              <p className="text-2xl font-bold text-white">
                {articles.filter(article => article.status === 'published').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaCheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl border border-yellow-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-100">Drafts</p>
              <p className="text-2xl font-bold text-white">
                {articles.filter(article => article.status === 'draft').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaClock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl border border-slate-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-100">Categories</p>
              <p className="text-2xl font-bold text-white">{categories.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaTag className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Article</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Published</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {article.article_image_url ? (
                          <img className="h-10 w-10 rounded-lg object-cover" src={article.article_image_url} alt={article.title} />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-slate-200 flex items-center justify-center">
                            <FaFileAlt className="h-5 w-5 text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{article.title}</div>
                        <div className="text-sm text-slate-500">#{article.article_no}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUser className="h-4 w-4 text-slate-400 mr-2" />
                      <div className="text-sm text-slate-900">{article.author}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaTag className="h-4 w-4 text-slate-400 mr-2" />
                      <div className="text-sm text-slate-900">{article.category || 'Uncategorized'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(article.status)}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Not published'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedArticle(article);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <FaEye className="h-4 w-4" />
                      </button>
                      <button className="text-black hover:text-slate-900 p-1" title="Edit">
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <FaFileAlt className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">No articles found</h3>
            <p className="mt-1 text-sm text-slate-500">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your search or filters."
                : "Get started by creating your first article."}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Article Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-slate-400 hover:text-black"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{selectedArticle.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-500 mb-4">
                    <span>Article #{selectedArticle.article_no}</span>
                    <span>By {selectedArticle.author}</span>
                    <span>Status: <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedArticle.status)}`}>{selectedArticle.status}</span></span>
                  </div>
                </div>

                {selectedArticle.article_image_url && (
                  <div>
                    <img src={selectedArticle.article_image_url} alt={selectedArticle.title} className="w-full h-64 object-cover rounded-lg" />
                  </div>
                )}

                {selectedArticle.excerpt && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Excerpt</h4>
                    <p className="text-black">{selectedArticle.excerpt}</p>
                  </div>
                )}

                {selectedArticle.content && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Content</h4>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <div className="text-sm text-slate-500">
                    Created: {new Date(selectedArticle.created_at).toLocaleString()}
                    {selectedArticle.updated_at && selectedArticle.updated_at !== selectedArticle.created_at && (
                      <span className="ml-4">Updated: {new Date(selectedArticle.updated_at).toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                      Edit Article
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <AdminDetailModal title="Create Article" onClose={() => setShowCreateModal(false)} size="lg">
          <ArticleCreateForm
            onCancel={() => setShowCreateModal(false)}
            showToast={showToast}
            onSuccess={(article) => {
              setArticles((prev) => [article, ...prev])
              setShowCreateModal(false)
            }}
          />
        </AdminDetailModal>
      )}
    </div>
  );
}