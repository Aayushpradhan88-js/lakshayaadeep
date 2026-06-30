"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import {
  FaBlog,
  FaPlus,
  FaTrash,
  FaSearch,
  FaEye,
  FaTag,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa"
import { getSupabaseClient } from "@/lib/supabase/supabase"
import Link from "next/link"
import { useAdminFeedback } from "@/components/shared-component/admin-feedback"

interface Event {
  id: string
  event_title: string
  description: string
  category: string
  location: string
  event_location?: {
    province: string
    district: string
    municipality: string
  }
  start_date: string
  end_date: string
  organizer: string
  cover_event_image_url: string
  status: string
  created_at: string
}

export default function EventPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const { showToast, askConfirm } = useAdminFeedback()

  useEffect(() => {
    fetchevent()
  }, [])

  //Supabase Call
  const fetchevent = async () => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('event')
        .select(`
          *,
          event_location (
            province,
            district,
            municipality
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteEvent = (eventId: string) => {
    askConfirm('Are you sure you want to delete this event?', async () => {
      try {
        const supabase = getSupabaseClient()
        const { error } = await supabase
          .from('event')
          .delete()
          .eq('id', eventId)

        if (error) throw error

        setEvents(prev => prev.filter(event => event.id !== eventId))
        if (selectedEvent?.id === eventId) {
          setSelectedEvent(null)
          setShowDetailModal(false)
        }
        showToast('Event deleted successfully', 'success')
      } catch (error) {
        console.error('Error deleting event:', error)
        showToast('Failed to delete event', 'error')
      }
    })
  }

  const updateEventStatus = async (eventId: string, newStatus: string) => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from('event')
        .update({ status: newStatus })
        .eq('id', eventId)

      if (error) throw error
      showToast('Status updated successfully', 'success')

      setEvents(prev => prev.map(event => event.id === eventId ? { ...event, status: newStatus } : event))
    } catch (error) {
      console.error('Error updating event status:', error)
      showToast('Failed to update event status', 'error')
    }
  }

  const filteredEvents = events.filter(event => {
    const titleMatch = event.event_title ? event.event_title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const descMatch = event.description ? event.description.toLowerCase().includes(searchTerm.toLowerCase()) : false;

    const matchesSearch = titleMatch || descMatch;

    const eventStatus = (event.status || "published").toLowerCase();
    const matchesStatus = statusFilter === "all" || eventStatus === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  })

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      // case 'published':
      //   return 'bg-green-100 text-green-800 border-green-200'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Ongoing':
        return 'bg-slate-100 text-slate-800 border-slate-200'
      case 'Upcoming':
        return 'bg-slate-100 text-slate-800 border-slate-200'
      case 'Completed':
        return 'bg-slate-100 text-slate-800 border-slate-200'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const categories = [...new Set(events.map(event => event.category).filter(Boolean))]

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Events Management</h1>
            <p className="text-black">Manage and publish events for your audience</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard/event/create"
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:from-emerald-600 hover:to-emerald-700"
            >
              <FaPlus className="h-4 w-4" />
              Create Event
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-linear-to-r from-emerald-500 to-emerald-600 rounded-xl border border-emerald-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-100">Total Events</p>
              <p className="text-2xl font-bold text-white">{events.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaBlog className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-green-500 to-emerald-600 rounded-xl border border-green-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            {/* <div>
              <p className="text-sm text-green-100">Published</p>
              <p className="text-2xl font-bold text-white">
                {events.filter(event => (event.status || 'published') === 'published').length}
              </p>
            </div> */}
            <div className="bg-white/20 p-3 rounded-lg">
              <FaCheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-yellow-500 to-orange-600 rounded-xl border border-yellow-200 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-100">Drafts</p>
              <p className="text-2xl font-bold text-white">
                {events.filter(event => (event.status || 'published') === 'draft').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaClock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-blue-500 to-indigo-600 rounded-xl border border-blue-200 p-4 text-white shadow-lg">
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
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50"
              />
            </div>
          </div>

          <div className="flex gap-3 flex-col sm:flex-row">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border cursor-pointer border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>

            {/* <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-slate-300 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select> */}
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="flex flex-col items-center">
              <FaBlog className="h-8 w-8 text-slate-300 mb-2" />
              Loading events...
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="flex flex-col items-center">
              {/* <FaBlog className="h-8 w-8 text-slate-300 mb-2" /> */}
              No events found
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linear-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Event Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Organizer
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
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{event.event_title}</div>
                        {event.description && (
                          <div className="text-sm text-slate-500 line-clamp-2">{event.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">{event.organizer || 'N/A'}</td>
                    {/* <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border bg-emerald-100 text-emerald-800 border-emerald-200">
                        {event.category}
                      </span>
                    </td> */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {event.created_at ? new Date(event.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
                        <select
                          value={event.status || 'Draft'}
                          onChange={(e) => updateEventStatus(event.id, e.target.value)}
                          className="rounded-full border cursor-pointer border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          title="Change status"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Ongoing">Ongoing</option>
                          <option value="Upcoming">Upcoming</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedEvent(event)
                              setShowDetailModal(true)
                            }}
                            className="text-emerald-600 cursor-pointer  hover:text-emerald-800 text-sm font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                          >
                            <FaEye className="h-3 w-3" />
                            View
                          </button>
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="text-red-600 cursor-pointer  hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <FaTrash className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="bg-linear-to-r from-emerald-500 to-emerald-600 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Event Details</h2>
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
              {selectedEvent.cover_event_image_url && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-black uppercase tracking-wider">Cover Image</label>
                  <div className="mt-2 w-full h-48 overflow-hidden rounded-lg">
                    <Image
                      src={selectedEvent.cover_event_image_url}
                      alt="Cover"
                      width={1200}
                      height={600}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-black uppercase tracking-wider">Title</label>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedEvent.event_title}</h3>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-black uppercase tracking-wider">Description</label>
                <p className="text-slate-900 font-medium mt-1">{selectedEvent.description || 'No description'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-black uppercase tracking-wider">Organizer</label>
                  <p className="text-slate-900 font-medium mt-1">{selectedEvent.organizer || 'N/A'}</p>
                </div>
                {/* <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-black uppercase tracking-wider">Category</label>
                  <p className="text-slate-900 font-medium mt-1">{selectedEvent.category || 'N/A'}</p>
                </div> */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-black uppercase tracking-wider">Status</label>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border mt-1 ${getStatusColor(selectedEvent.status)}`}>
                    {selectedEvent.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-black uppercase tracking-wider">Start Date</label>
                  <p className="text-slate-900 font-medium mt-1">
                    {selectedEvent.start_date ? new Date(selectedEvent.start_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-black uppercase tracking-wider">End Date</label>
                  <p className="text-slate-900 font-medium mt-1">
                    {selectedEvent.end_date ? new Date(selectedEvent.end_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-black uppercase tracking-wider">Location</label>
                <p className="text-slate-900 font-medium mt-1">
                  {selectedEvent.event_location ? (
                    `${selectedEvent.event_location.municipality}, ${selectedEvent.event_location.district}, ${selectedEvent.event_location.province}`
                  ) : selectedEvent.location || 'N/A'}
                </p>
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
