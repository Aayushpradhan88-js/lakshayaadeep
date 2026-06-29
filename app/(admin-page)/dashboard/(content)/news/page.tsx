"use client";

import { useState, useEffect } from "react";
import { 
  FaNewspaper, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaCalendarAlt,
  FaEye,
  FaTag,
  FaUser,
  FaClock
} from "react-icons/fa";
import { getSupabaseClient } from "@/lib/supabase/supabase";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchNewsItems();
  }, []);

  const fetchNewsItems = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNewsItems(data || []);
    } catch (error) {
      console.error('Error fetching news items:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNewsItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setNewsItems(prev => prev.filter(item => item.id !== itemId));
      if (selectedNews?.id === itemId) {
        setSelectedNews(null);
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error('Error deleting news item:', error);
    }
  };

  const filteredNewsItems = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
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

  const categories = [...new Set(newsItems.map(item => item.category))];

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">News Management</h1>
            <p className="text-slate-600">Manage and publish news articles for your website visitors</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-700 flex items-center gap-2 shadow-lg">
              <FaPlus className="h-4 w-4" />
              Add News
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl border border-blue-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">Total News</p>
              <p className="text-2xl font-bold text-white">{newsItems.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaNewspaper className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl border border-green-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100">Published</p>
              <p className="text-2xl font-bold text-white">
                {newsItems.filter(item => item.status === 'published').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaEye className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl border border-yellow-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-100">Drafts</p>
              <p className="text-2xl font-bold text-white">
                {newsItems.filter(item => item.status === 'draft').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaClock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl border border-purple-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100">Archived</p>
              <p className="text-2xl font-bold text-white">
                {newsItems.filter(item => item.status === 'archived').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaTrash className="h-6 w-6 text-white" />
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
                placeholder="Search news articles..."
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

      {/* News List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="flex flex-col items-center">
              <FaNewspaper className="h-8 w-8 text-slate-300 mb-2" />
              Loading news articles...
            </div>
          </div>
        ) : filteredNewsItems.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="flex flex-col items-center">
              <FaNewspaper className="h-8 w-8 text-slate-300 mb-2" />
              No news articles found
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaNewspaper className="h-4 w-4" />
                      Article
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaUser className="h-4 w-4" />
                      Author
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaTag className="h-4 w-4" />
                      Category
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaClock className="h-4 w-4" />
                      Status
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="h-4 w-4" />
                      Date
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredNewsItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                        {item.excerpt && (
                          <div className="text-sm text-slate-500 line-clamp-2">{item.excerpt}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">{item.author}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border bg-blue-100 text-blue-800 border-blue-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedNews(item);
                            setShowDetailModal(true);
                          }}
                          className="text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                        >
                          <FaEye className="h-3 w-3" />
                          View
                        </button>
                        <button
                          onClick={() => deleteNewsItem(item.id)}
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

      {/* News Detail Modal */}
      {showDetailModal && selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">News Article Details</h2>
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
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Title</label>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedNews.title}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Author</label>
                  <p className="text-slate-900 font-medium mt-1">{selectedNews.author}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</label>
                  <p className="text-slate-900 font-medium mt-1">{selectedNews.category}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedNews.status)}`}>
                      {selectedNews.status}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Published Date</label>
                  <p className="text-slate-900 font-medium mt-1">
                    {selectedNews.published_at ? new Date(selectedNews.published_at).toLocaleString() : 'Not published'}
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Content</label>
                <div className="text-slate-900 mt-1 whitespace-pre-wrap">{selectedNews.content}</div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Tags</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedNews.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Created</label>
                  <p className="text-slate-900 font-medium mt-1">{new Date(selectedNews.created_at).toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Updated</label>
                  <p className="text-slate-900 font-medium mt-1">{new Date(selectedNews.updated_at).toLocaleString()}</p>
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
