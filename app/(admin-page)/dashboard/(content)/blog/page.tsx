"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaBlog,
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
  FaFileAlt
} from "react-icons/fa";
import { getSupabaseClient } from "@/lib/supabase/supabase";
import { Blog } from "@/lib/database/types";
import { useAdminFeedback } from "@/components/shared-component/admin-feedback";

export default function BlogsPage() {
  const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { showToast, askConfirm } = useAdminFeedback();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlogPost = (postId: string) => {
    askConfirm('Are you sure you want to delete this blog post?', async () => {
      try {
        const supabase = getSupabaseClient();
        const { error } = await supabase
          .from('blogs')
          .delete()
          .eq('id', postId);

        if (error) throw error;

        setBlogPosts(prev => prev.filter(post => post.id !== postId));
        if (selectedBlog?.id === postId) {
          setSelectedBlog(null);
          setShowDetailModal(false);
        }
        showToast('Blog post deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting blog post:', error);
        showToast('Failed to delete blog post', 'error');
      }
    });
  };

  const filteredBlogPosts = blogPosts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.content || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;

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

  const categories = [...new Set(blogPosts.map(post => post.category))];

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Blogs Management</h1>
            <p className="text-black">Manage and publish blog posts for your audience</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/dashboard/blog/create">
              <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-700 flex items-center gap-2 shadow-lg">
                <FaPlus className="h-4 w-4" />
                Write Blog
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl border border-emerald-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-100">Total Blogs</p>
              <p className="text-2xl font-bold text-white">{blogPosts.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaBlog className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl border border-green-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100">Published</p>
              <p className="text-2xl font-bold text-white">
                {blogPosts.filter(post => post.status === 'published').length}
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
                {blogPosts.filter(post => post.status === 'draft').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaClock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl border border-blue-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">Categories</p>
              <p className="text-2xl font-bold text-white">{categories.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaTag className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Blog Posts List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="flex flex-col items-center">
              <FaBlog className="h-8 w-8 text-slate-300 mb-2" />
              Loading blog posts...
            </div>
          </div>
        ) : filteredBlogPosts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="flex flex-col items-center">
              <FaBlog className="h-8 w-8 text-slate-300 mb-2" />
              No blog posts found
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Blog Post
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredBlogPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {post.blog_image_url ? (
                            <img className="h-12 w-12 rounded-lg object-cover" src={post.blog_image_url} alt={post.title} />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-slate-200 flex items-center justify-center">
                              <FaBlog className="h-6 w-6 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{post.title}</div>
                          {post.excerpt && (
                            <div className="text-sm text-slate-500 line-clamp-2">{post.excerpt}</div>
                          )}
                          {post.read_time && (
                            <div className="text-xs text-slate-400 mt-1">{post.read_time} min read</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">{post.author}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border bg-emerald-100 text-emerald-800 border-emerald-200">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedBlog(post);
                            setShowDetailModal(true);
                          }}
                          className="text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                        >
                          <FaEye className="h-3 w-3" />
                          View
                        </button>
                        <button
                          onClick={() => deleteBlogPost(post.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <FaTrash className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Blog Detail Modal */}
      {showDetailModal && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Blog Post Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <div className="bg-white/20 p-1 rounded-lg">
                    ×
                  </div>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-black uppercase tracking-wider">Title</label>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedBlog.title}</h3>
              </div>

              {selectedBlog.blog_image_url && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-black uppercase tracking-wider">Blog Image</label>
                  <div className="mt-2">
                    <img src={selectedBlog.blog_image_url} alt={selectedBlog.title} className="w-full h-48 object-cover rounded-lg" />
                  </div>
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-black uppercase tracking-wider">Excerpt</label>
                <p className="text-slate-900 font-medium mt-1">{selectedBlog.excerpt || 'No excerpt'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-black uppercase tracking-wider">Author</label>
                  <p className="text-slate-900 font-medium mt-1">{selectedBlog.author}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-black uppercase tracking-wider">Category</label>
                  <p className="text-slate-900 font-medium mt-1">{selectedBlog.category}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-black uppercase tracking-wider">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedBlog.status)}`}>
                      {selectedBlog.status}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-black uppercase tracking-wider">Read Time</label>
                  <p className="text-slate-900 font-medium mt-1">{selectedBlog.read_time || 'N/A'} minutes</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-black uppercase tracking-wider">Content</label>
                <div className="text-slate-900 mt-1 whitespace-pre-wrap max-h-64 overflow-y-auto">{selectedBlog.content}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-black uppercase tracking-wider">Tags</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(selectedBlog.tags || []).map((tag, index) => (
                    <span key={index} className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-black uppercase tracking-wider">Published Date</label>
                  <p className="text-slate-900 font-medium mt-1">
                    {selectedBlog.published_at ? new Date(selectedBlog.published_at).toLocaleString() : 'Not published'}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-black uppercase tracking-wider">Created</label>
                  <p className="text-slate-900 font-medium mt-1">{new Date(selectedBlog.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 bg-slate-200 text-slate-800 px-4 py-3 rounded-lg hover:bg-slate-300 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
