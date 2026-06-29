"use client"

import { useState, useEffect } from "react"
import {
  FaBlog,
  FaPlus,
  FaTrash,
  FaSearch,
  FaCalendarAlt,
  FaEye,
  FaTag,
  FaUser,
  FaClock,
  FaCheckCircle,} from "react-icons/fa"
import { getSupabaseClient } from "@/lib/supabase/supabase"
import Link from "next/link"

interface Project {
  id: string
  project_title: string
  title?: string
  description: string
  category: string
  location: string
  project_location?: {
    province: string
    district: string
    municipality: string
  }
  start_date: string
  end_date: string
  target_budget: number
  actual_budget: number
  target_beneficiaries: number
  project_organizer: string
  cover_image_url: string
  created_at: string
  updated_at: string
  status?: string
}

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [projectImages, setProjectImages] = useState<string[]>([])
  const [fetchingImages, setFetchingImages] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  //Supabase Call
  const fetchProjects = async () => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('project')
        .select(`
          *,
          project_location (
            province,
            district,
            municipality
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProjectStatus = async (projectId: string, newStatus: string) => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from('project')
        .update({ status: newStatus })
        .eq('id', projectId)

      if (error) throw error
      alert('Status updated successfully')

      setProjects(prev => prev.map(project => 
        project.id === projectId ? { ...project, status: newStatus } : project
      ))
    } catch (error) {
      console.error('Error updating project status:', error)
      alert('Failed to update project status')
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from('project')
        .delete()
        .eq('id', projectId)

      if (error) throw error

      setProjects(prev => prev.filter(project => project.id !== projectId))
      if (selectedProject?.id === projectId) {
        setSelectedProject(null)
        setShowDetailModal(false)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const filteredProjects = projects.filter(project => {
    const titleMatch = (project.title || project.project_title) ? (project.title || project.project_title).toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const descMatch = project.description ? project.description.toLowerCase().includes(searchTerm.toLowerCase()) : false;

    const matchesSearch = titleMatch || descMatch;

    const projStatus = project.status || "Draft";
    const matchesStatus = statusFilter === "all" || projStatus === statusFilter;
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Upcoming':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Postponed':
        return 'bg-orange-100 text-brand border-orange-200'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const fetchProjectImages = async (projectId: string) => {
    setFetchingImages(true)
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('project_gallery')
        .select('image_url')
        .eq('project_id', projectId)

      if (error) throw error
      setProjectImages(data?.map(img => img.image_url) || [])
    } catch (error) {
      console.error('Error fetching project images:', error)
      setProjectImages([])
    } finally {
      setFetchingImages(false)
    }
  }

  const categories = [...new Set(projects.map(project => project.category).filter(Boolean))]

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Projects Management</h1>
            <p className="text-slate-600">Manage and publish projects for your audience</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="cursor-pointer bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-700 flex items-center gap-2 shadow-lg">
              <FaPlus className="h-4 w-4" />
              <Link href="/dashboard/project/post">Create</Link>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl border border-emerald-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-100">Total Projects</p>
              <p className="text-2xl font-bold text-white">{projects.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaBlog className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl border border-green-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100">Ongoing</p>
              <p className="text-2xl font-bold text-white">
                {projects.filter(project => project.status === 'Ongoing').length}
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
                {projects.filter(project => project.status === 'Draft').length}
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
                placeholder="Search projects..."
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
              <option value="Ongoing">Ongoing</option>
              <option value="Draft">Draft</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select> */}
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="flex flex-col items-center">
              <FaBlog className="h-8 w-8 text-slate-300 mb-2" />
              Loading projects...
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="flex flex-col items-center">
              {/* <FaBlog className="h-8 w-8 text-slate-300 mb-2" /> */}
              No projects found
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaBlog className="h-4 w-4" />
                      Project Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaUser className="h-4 w-4" />
                      Organizer
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
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{project.title || project.project_title}</div>
                        {project.description && (
                          <div className="text-sm text-slate-500 line-clamp-2">{project.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">{project.project_organizer}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border bg-emerald-100 text-emerald-800 border-emerald-200">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(project.status || 'Draft')}`}>
                        {project.status || 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProject(project)
                            setShowDetailModal(true)
                            fetchProjectImages(project.id)
                          }}
                          className="text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                        >
                          <FaEye className="h-3 w-3" />
                          View
                        </button>
                        <select
                          value={project.status || 'Draft'}
                          onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                          className="text-xs border cursor-pointer border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700"
                        >
                          <option value="Ongoing">Ongoing</option>
                          <option value="Draft">Draft</option>
                          <option value="Upcoming">Upcoming</option>
                          <option value="Completed">Completed</option>
                          {/* <option value="Postponed">Postponed</option> */}
                        </select>
                        <button
                          onClick={() => deleteProject(project.id)}
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

      {/* Project Detail Modal */}
      {showDetailModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Project Details</h2>
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
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedProject.title || selectedProject.project_title}</h3>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</label>
                <p className="text-slate-900 font-medium mt-1">{selectedProject.description || 'No description'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Organizer</label>
                  <p className="text-slate-900 font-medium mt-1">{selectedProject.project_organizer || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</label>
                  <p className="text-slate-900 font-medium mt-1">{selectedProject.category || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Location</label>
                  <p className="text-slate-900 font-medium mt-1">
                    {selectedProject.project_location ? (
                      `${selectedProject.project_location.municipality}, ${selectedProject.project_location.district}, ${selectedProject.project_location.province}`
                    ) : selectedProject.location || 'N/A'}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Target Beneficiaries</label>
                  <p className="text-slate-900 font-medium mt-1">{selectedProject.target_beneficiaries || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Start Date</label>
                  <p className="text-slate-900 font-medium mt-1">
                    {selectedProject.start_date ? new Date(selectedProject.start_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">End Date</label>
                  <p className="text-slate-900 font-medium mt-1">
                    {selectedProject.end_date ? new Date(selectedProject.end_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Target Budget</label>
                  <p className="text-slate-900 font-medium mt-1">रू {selectedProject.target_budget || '0'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Actual Budget</label>
                  <p className="text-slate-900 font-medium mt-1">रू {selectedProject.actual_budget || '0'}</p>
                </div>
              </div>

              {/* Project Images Section */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-3">Project Images</label>
                {fetchingImages ? (
                  <div className="py-4 text-center text-slate-500 text-sm">Loading images...</div>
                ) : projectImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {projectImages.map((url, i) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden border border-slate-200">
                        <img src={url} alt={`Project image ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-slate-500 text-sm bg-white/50 rounded-lg">No images found for this project</div>
                )}
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
  )
}
