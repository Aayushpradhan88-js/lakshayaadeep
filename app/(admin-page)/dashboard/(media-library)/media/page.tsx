"use client";

import { useState, useEffect } from "react";
import { 
  FaImages, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaDownload,
  FaUpload,
  FaFileImage,
  FaFileVideo,
  FaFileAlt,
  FaCalendarAlt,
  FaTag,
  FaFolder,
  FaTh,
  FaList
} from "react-icons/fa";
import { getSupabaseClient } from "@/lib/supabase/supabase";
import { useRouter } from "next/navigation";

interface MediaItem {
  id: string;
  title: string;
  description?: string;
  file_path: string;
  file_type: 'image' | 'video' | 'document';
  file_size: number;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {

      //supabase call
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMediaItems(data || []);
    } catch (error) {
      console.error('Error fetching media items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert("Please select valid image files. Videos or documents are not allowed.");
      event.target.value = '';
      return;
    }

    if (imageFiles.length !== files.length) {
      alert("Some files were skipped because only images are allowed.");
    }

    setUploading(true);
    try {

      //supabase call
      const supabase = getSupabaseClient();
      const newItems: MediaItem[] = [];

      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to bucket
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Error uploading file:', file.name, uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(fileName);

        // Insert into gallery table
        const { data: insertData, error: insertError } = await supabase
          .from('gallery')
          .insert([
            {
              title: file.name,
              file_path: publicUrl,
              file_type: 'image',
              file_size: file.size,
              category: 'Gallery',
              tags: [],
            }
          ])
          .select()
          .single();

        if (insertError) {
          console.error('Error inserting into gallery table:', insertError);
        } else if (insertData) {
          newItems.push(insertData);
        }
      }

      if (newItems.length > 0) {
        setMediaItems(prev => [...newItems, ...prev]);
      }
      
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const deleteMediaItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setMediaItems(prev => prev.filter(item => item.id !== itemId));
      if (selectedItem?.id === itemId) {
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Error deleting media item:', error);
    }
  };

  const filteredMediaItems = mediaItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesType = typeFilter === "all" || item.file_type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <FaFileImage className="h-5 w-5 text-green-500" />;
      case 'video':
        return <FaFileVideo className="h-5 w-5 text-purple-500" />;
      case 'document':
        return <FaFileAlt className="h-5 w-5 text-blue-500" />;
      default:
        return <FaFileAlt className="h-5 w-5 text-slate-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'video':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'document':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const categories = [...new Set(mediaItems.map(item => item.category))];

  return (
    <div className="p-6 space-y-6">

      {/* Header Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Media Library</h1>
            <p className="text-slate-600">Manage and organize your media files including images, videos, and documents</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-700 flex items-center gap-2 shadow-lg"
            >
              <FaUpload className="h-4 w-4" />
              Upload Media
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl border border-blue-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">Total Media</p>
              <p className="text-2xl font-bold text-white">{mediaItems.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaImages className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl border border-green-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100">Images</p>
              <p className="text-2xl font-bold text-white">
                {mediaItems.filter(item => item.file_type === 'image').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaFileImage className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl border border-purple-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100">Videos</p>
              <p className="text-2xl font-bold text-white">
                {mediaItems.filter(item => item.file_type === 'video').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaFileVideo className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl border border-blue-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">Documents</p>
              <p className="text-2xl font-bold text-white">
                {mediaItems.filter(item => item.file_type === 'document').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaFileAlt className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search media files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
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

            <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                <FaTh className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-r-lg ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                <FaList className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="flex flex-col items-center">
              <FaImages className="h-8 w-8 text-slate-300 mb-2" />
              Loading media files...
            </div>
          </div>
        ) : filteredMediaItems.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="flex flex-col items-center">
              <FaImages className="h-8 w-8 text-slate-300 mb-2" />
              No media files found
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
            {filteredMediaItems.map((item) => (
              <div key={item.id} className="group relative bg-slate-50 rounded-lg overflow-hidden border border-slate-200 hover:border-emerald-300 transition-all duration-200">
                <div className="aspect-square bg-slate-100 flex items-center justify-center relative">
                  {item.file_type === 'image' ? (
                    <img 
                      src={item.file_path} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      {getFileIcon(item.file_type)}
                      <span className="text-xs mt-2">{item.file_type}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 truncate mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 truncate mb-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(item.file_type)}`}>
                      {item.file_type}
                    </span>
                    <span className="text-xs text-slate-500">{formatFileSize(item.file_size)}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="text-xs text-slate-500">+{item.tags.length - 2}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setShowDetailModal(true);
                      }}
                      className="flex-1 bg-emerald-500 text-white px-2 py-1 rounded text-xs hover:bg-emerald-600 flex items-center justify-center gap-1"
                    >
                      <FaEye className="h-3 w-3" />
                      View
                    </button>
                    <button
                      onClick={() => deleteMediaItem(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      <FaTrash className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaFileImage className="h-4 w-4" />
                      File
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
                {filteredMediaItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-slate-100 p-2 rounded">
                          {getFileIcon(item.file_type)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                          <div className="text-sm text-slate-500">{formatFileSize(item.file_size)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getTypeColor(item.file_type)}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowDetailModal(true);
                          }}
                          className="text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                        >
                          <FaEye className="h-3 w-3" />
                          View
                        </button>
                        <button
                          onClick={() => deleteMediaItem(item.id)}
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

      {/* Media Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Media Details</h2>
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
              <div className="bg-slate-50 rounded-lg p-4">
                {selectedItem.file_type === 'image' ? (
                  <img 
                    src={selectedItem.file_path} 
                    alt={selectedItem.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-64 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      {getFileIcon(selectedItem.file_type)}
                      <p className="text-slate-500 mt-2">{selectedItem.file_type}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Title</label>
                  <p className="text-slate-900 font-medium mt-1">{selectedItem.title}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</label>
                  <p className="text-slate-900 font-medium mt-1">{selectedItem.category}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">File Type</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getTypeColor(selectedItem.file_type)}`}>
                      {selectedItem.file_type}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">File Size</label>
                  <p className="text-slate-900 font-medium mt-1">{formatFileSize(selectedItem.file_size)}</p>
                </div>
              </div>
              
              {selectedItem.description && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</label>
                  <p className="text-slate-900 font-medium mt-1">{selectedItem.description}</p>
                </div>
              )}
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Tags</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedItem.tags.map((tag, index) => (
                    <span key={index} className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Created</label>
                  <p className="text-slate-900 font-medium mt-1">{new Date(selectedItem.created_at).toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Updated</label>
                  <p className="text-slate-900 font-medium mt-1">{new Date(selectedItem.updated_at).toLocaleString()}</p>
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Upload Media</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <div className="bg-white/20 p-1 rounded-lg">
                    ×
                  </div>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center relative hover:bg-slate-50 transition-colors">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  multiple
                  accept="image/*"
                />
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
                    <p className="text-slate-600">Uploading photos...</p>
                  </div>
                ) : (
                  <>
                    <FaUpload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-2">Drag and drop your photos here</p>
                    <p className="text-sm text-slate-500 mb-4">or</p>
                    <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600">
                      Browse Files
                    </button>
                  </>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 bg-slate-200 text-slate-800 px-4 py-3 rounded-lg hover:bg-slate-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
