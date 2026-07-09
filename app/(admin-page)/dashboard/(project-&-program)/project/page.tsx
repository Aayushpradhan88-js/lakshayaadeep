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
  FaCheckCircle,
} from "react-icons/fa"
import { getSupabaseClient } from "@/lib/supabase/supabase"
import { useAdminFeedback } from "@/components/shared-component/admin-feedback"
import { AdminDetailModal } from "@/components/shared-component/admin-detail-modal"
import { ProjectCreateForm } from "@/components/shared-component/project-create-form"
import { ProjectDetailEditModal, type ProjectRecord } from "@/components/shared-component/project-detail-edit-modal"

export default function ProjectPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { showToast, askConfirm } = useAdminFeedback()

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
      showToast('Status updated successfully', 'success')

      setProjects(prev => prev.map(project =>
        project.id === projectId ? { ...project, status: newStatus } : project
      ))
    } catch (error) {
      console.error('Error updating project status:', error)
      showToast('Failed to update project status', 'error')
    }
  }

  const deleteProject = (projectId: string) => {
    askConfirm('Are you sure you want to delete this project?', async () => {
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
        showToast('Project deleted successfully', 'success')
      } catch (error) {
        console.error('Error deleting project:', error)
        showToast('Failed to delete project', 'error')
      }
    })
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

  const categories = [...new Set(projects.map(project => project.category).filter(Boolean))]

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Projects Management</h1>
            <p className="text-black">Manage and publish projects for your audience</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Previous: <Link href="/dashboard/project/post"> redirected to a new page */}
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-white shadow-lg hover:from-emerald-600 hover:to-emerald-700"
            >
              <FaPlus className="h-4 w-4" />
              Create
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
                    Project Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Organizer
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

      {showDetailModal && selectedProject && (
        <ProjectDetailEditModal
          project={selectedProject}
          onClose={() => setShowDetailModal(false)}
          onSaved={(updated) => {
            setProjects((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
            setSelectedProject(updated)
          }}
          showToast={showToast}
        />
      )}
      {showCreateModal && (
        <AdminDetailModal title="Create Project" onClose={() => setShowCreateModal(false)} size="xl">
          <ProjectCreateForm
            onCancel={() => setShowCreateModal(false)}
            showToast={showToast}
            onSuccess={(project) => {
              setProjects((prev) => [project, ...prev])
              setShowCreateModal(false)
            }}
          />
        </AdminDetailModal>
      )}
    </div>
  )
}
