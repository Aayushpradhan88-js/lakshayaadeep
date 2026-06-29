"use client";

import { useState, useEffect } from "react";
import { 
  FaBell, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaCalendarAlt,
  FaEye,
  FaToggleOn,
  FaToggleOff,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaImage,
  FaUpload,
  FaTimes
} from "react-icons/fa";
import { getSupabaseClient } from "@/lib/supabase/supabase";

interface Notice {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  is_active: boolean;
  display_duration: number; // in seconds
  created_at: string;
  updated_at: string;
}

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    display_duration: 10,
    is_active: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNoticeStatus = async (noticeId: string, currentStatus: boolean) => {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('notices')
        .update({ is_active: !currentStatus })
        .eq('id', noticeId);

      if (error) throw error;

      setNotices(prev => prev.map(notice => 
        notice.id === noticeId 
          ? { ...notice, is_active: !currentStatus }
          : notice
      ));
    } catch (error) {
      console.error('Error toggling notice status:', error);
    }
  };

  const deleteNotice = async (noticeId: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', noticeId);

      if (error) throw error;

      setNotices(prev => prev.filter(notice => notice.id !== noticeId));
      if (selectedNotice?.id === noticeId) {
        setSelectedNotice(null);
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "active" && notice.is_active) ||
                          (statusFilter === "inactive" && !notice.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const supabase = getSupabaseClient();
      let image_url = "";

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('gallery') // Using existing gallery bucket
          .upload(`notices/${fileName}`, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(`notices/${fileName}`);
        
        image_url = publicUrl;
      }

      const { data, error } = await supabase
        .from('notices')
        .insert([{
          title: formData.title,
          description: formData.description,
          image_url: image_url || null,
          display_duration: formData.display_duration,
          is_active: formData.is_active
        }])
        .select()
        .single();

      if (error) throw error;

      setNotices([data, ...notices]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating notice:', error);
      alert('Failed to create notice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      display_duration: 10,
      is_active: true
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const getTypeColor = () => 'bg-blue-100 text-blue-800 border-blue-200';
  const getTypeIcon = () => <FaBell className="h-3 w-3" />;

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Notice Pop-up Messages</h1>
            <p className="text-slate-600">Manage pop-up notices and announcements for website visitors</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-700 flex items-center gap-2 shadow-lg"
            >
              <FaPlus className="h-4 w-4" />
              Create Notice
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl border border-blue-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">Total Notices</p>
              <p className="text-2xl font-bold text-white">{notices.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaBell className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl border border-green-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100">Active</p>
              <p className="text-2xl font-bold text-white">
                {notices.filter(notice => notice.is_active).length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaToggleOn className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl border border-yellow-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-100">Inactive</p>
              <p className="text-2xl font-bold text-white">
                {notices.filter(notice => !notice.is_active).length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaToggleOff className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl border border-purple-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100">With Image</p>
              <p className="text-2xl font-bold text-white">
                {notices.filter(notice => notice.image_url).length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaImage className="h-6 w-6 text-white" />
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
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            {/* Type filter removed as we simplified notice types */}
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notice List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="flex flex-col items-center">
              <FaBell className="h-8 w-8 text-slate-300 mb-2" />
              Loading notices...
            </div>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="flex flex-col items-center">
              <FaBell className="h-8 w-8 text-slate-300 mb-2" />
              No notices found
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaBell className="h-4 w-4" />
                      Notice
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaClock className="h-4 w-4" />
                      Duration
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaImage className="h-4 w-4" />
                      Media
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaToggleOn className="h-4 w-4" />
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
                {filteredNotices.map((notice) => (
                  <tr key={notice.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{notice.title || "Untitled"}</div>
                        <div className="text-sm text-slate-500 line-clamp-2">{notice.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {notice.display_duration}s
                    </td>
                    <td className="px-6 py-4">
                      {notice.image_url ? (
                        <div className="h-10 w-10 rounded overflow-hidden border border-slate-200">
                          <img src={notice.image_url} alt="" className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                          <FaImage />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleNoticeStatus(notice.id, notice.is_active)}
                        className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                          notice.is_active 
                            ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
                            : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {notice.is_active ? <FaToggleOn className="h-3 w-3" /> : <FaToggleOff className="h-3 w-3" />}
                        {notice.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(notice.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedNotice(notice);
                            setShowDetailModal(true);
                          }}
                          className="text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                        >
                          <FaEye className="h-3 w-3" />
                          View
                        </button>
                        <button
                          onClick={() => deleteNotice(notice.id)}
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

      {/* Notice Detail Modal */}
      {showDetailModal && selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Notice Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {selectedNotice.image_url && (
                <div className="w-full h-48 rounded-xl overflow-hidden border border-slate-200">
                  <img src={selectedNotice.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Title</label>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedNotice.title || "Untitled"}</h3>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</label>
                <div className="text-slate-900 mt-1 whitespace-pre-wrap">{selectedNotice.description}</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${
                      selectedNotice.is_active 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-slate-100 text-slate-800 border-slate-200'
                    }`}>
                      {selectedNotice.is_active ? <FaToggleOn className="h-3 w-3" /> : <FaToggleOff className="h-3 w-3" />}
                      {selectedNotice.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Display Duration</label>
                  <p className="text-slate-900 font-medium mt-1">{selectedNotice.display_duration} seconds</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Created</label>
                  <p className="text-slate-900 font-medium mt-1">{new Date(selectedNotice.created_at).toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Updated</label>
                  <p className="text-slate-900 font-medium mt-1">{new Date(selectedNotice.updated_at).toLocaleString()}</p>
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

      {/* Create Notice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Create New Notice</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateNotice} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Title (Optional)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter notice title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[100px]"
                  placeholder="Enter notice details"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Notice Image (Optional)</label>
                <div 
                  className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors relative"
                  onClick={() => document.getElementById('notice-image')?.click()}
                >
                  <input
                    type="file"
                    id="notice-image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    <div className="relative aspect-video w-full max-h-40 mx-auto">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="py-4">
                      <FaUpload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Display Duration (sec)</label>
                  <input
                    type="number"
                    value={formData.display_duration}
                    onChange={(e) => setFormData({ ...formData, display_duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    min="1"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                  />
                  <label htmlFor="is_active" className="text-sm font-semibold text-slate-700">Active</label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-slate-200 text-slate-800 px-4 py-3 rounded-lg hover:bg-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-emerald-500 text-white px-4 py-3 rounded-lg hover:bg-emerald-600 font-medium shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
