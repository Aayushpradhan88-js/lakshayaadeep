'use client'

import { useEffect, useState, useMemo } from 'react'
import { getSupabaseClient } from '@/lib/supabase/supabase'
import {
  FaVideo,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaUpload,
  FaBlog,
  FaCalendarAlt,
  FaUserTie,
  FaNewspaper,
  FaImage
} from 'react-icons/fa'
import {
  DashboardEmptyState,
  DashboardHeader,
  DashboardLoadingState,
  DashboardPage,
  DashboardPrimaryButton,
  DashboardStatCard,
  DashboardStatsGrid,
  DashboardTable,
  DashboardTableCard,
  DashboardTableHead,
  DashboardTh,
} from '@/components/shared-component/admin-dashboard-ui'
import { useAdminFeedback } from '@/components/shared-component/admin-feedback'

interface HeroSettings {
  id: string
  title: string
  subtitle: string
  video_url: string
  screenshot_url?: string
  is_embed: boolean
  is_active: boolean
  updated_at: string
}

interface OverviewCounts {
  projects: number
  events: number
  donations: number
  content: number
}

export default function HeroVideoManagementPage() {
  const [videos, setVideos] = useState<HeroSettings[]>([])
  const [counts, setCounts] = useState<OverviewCounts>({ projects: 0, events: 0, donations: 0, content: 0 })
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<HeroSettings | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploading, setUploading] = useState<'video' | 'screenshot' | null>(null)
  const { showToast, askConfirm } = useAdminFeedback()

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    video_url: '',
    screenshot_url: '',
    is_embed: false,
    is_active: false
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()

      // Fetch hero settings
      const { data: heroData, error: heroErr } = await supabase
        .from('hero_settings')
        .select('*')
        .order('updated_at', { ascending: false })

      if (heroErr) throw heroErr
      setVideos(heroData || [])

      // Fetch Overview Counts
      const [
        { count: pCount },
        { count: eCount },
        { count: dCount },
        { count: bCount },
        { count: aCount }
      ] = await Promise.all([
        supabase.from('project').select('*', { count: 'exact', head: true }),
        supabase.from('event').select('*', { count: 'exact', head: true }),
        supabase.from('donations').select('*', { count: 'exact', head: true }),
        supabase.from('blogs').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }),
      ])

      setCounts({
        projects: pCount || 0,
        events: eCount || 0,
        donations: dCount || 0,
        content: (bCount || 0) + (aCount || 0)
      })
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleOpenModal = (video: HeroSettings | null = null) => {
    if (video) {
      setEditingVideo(video)
      setFormData({
        title: video.title,
        subtitle: video.subtitle,
        video_url: video.video_url,
        screenshot_url: video.screenshot_url || '',
        is_embed: video.is_embed,
        is_active: video.is_active
      })
    } else {
      setEditingVideo(null)
      setFormData({
        title: '',
        subtitle: '',
        video_url: '',
        screenshot_url: '',
        is_embed: false,
        is_active: false
      })
    }
    setIsModalOpen(true)
  }

  const handleFileUpload = async (file: File, type: 'video' | 'screenshot') => {
    setUploading(type)
    try {
      const supabase = getSupabaseClient()
      const ext = file.name.split('.').pop()
      const folder = type === 'video' ? 'hero-video' : 'hero-screenshots'
      const path = `${folder}/${Date.now()}.${ext}`

      const { error: upErr } = await supabase.storage
        .from('media')
        .upload(path, file, { upsert: true })

      if (upErr) throw upErr

      const { data } = supabase.storage.from('media').getPublicUrl(path)

      if (type === 'video') {
        setFormData(p => ({ ...p, video_url: data.publicUrl, is_embed: false }))
      } else {
        setFormData(p => ({ ...p, screenshot_url: data.publicUrl }))
      }
    } catch (err) {
      console.error('Upload failed:', err)
      showToast('Upload failed', 'error')
    } finally {
      setUploading(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const supabase = getSupabaseClient()

      const payload = {
        ...formData,
        updated_at: new Date().toISOString()
      }

      // If this one is active, we need to deactivate others
      if (formData.is_active) {
        await supabase.from('hero_settings').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000')
      }

      if (editingVideo) {
        const { error } = await supabase
          .from('hero_settings')
          .update(payload)
          .eq('id', editingVideo.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('hero_settings')
          .insert([payload])
        if (error) throw error
      }
      setIsModalOpen(false)
      fetchData()
      showToast(editingVideo ? 'Hero video updated successfully' : 'Hero video created successfully', 'success')
    } catch (err) {
      console.error('Failed to save hero video:', err)
      showToast('Error saving hero video', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    // We only want ONE video active at a time
    // If it's already active, we don't allow deactivating it unless there's another active one?
    // Actually, user said "only one video will be shown at one time"
    try {
      const supabase = getSupabaseClient()

      if (!currentStatus) {
        // Deactivate all first
        await supabase.from('hero_settings').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000')
        // Activate this one
        const { error } = await supabase
          .from('hero_settings')
          .update({ is_active: true })
          .eq('id', id)
        if (error) throw error
      } else {
        // If deactivating the only active one, just set it to false
        const { error } = await supabase
          .from('hero_settings')
          .update({ is_active: false })
          .eq('id', id)
        if (error) throw error
      }

      fetchData()
      showToast(currentStatus ? 'Hero video deactivated' : 'Hero video activated', 'success')
    } catch (err) {
      console.error('Toggle active failed:', err)
      showToast('Failed to update hero video status', 'error')
    }
  }

  const handleDelete = (id: string) => {
    askConfirm('Are you sure you want to delete this Hero configuration?', async () => {
      try {
        const supabase = getSupabaseClient()
        const { error } = await supabase
          .from('hero_settings')
          .delete()
          .eq('id', id)
        if (error) throw error
        fetchData()
        showToast('Hero video deleted successfully', 'success')
      } catch (err) {
        console.error('Failed to delete hero video:', err)
        showToast('Error deleting hero video', 'error')
      }
    })
  }

  const stats = useMemo(() => [
    { label: "Projects", value: counts.projects, icon: <FaBlog className="h-6 w-6 text-white" />, variant: "blue" as const },
    { label: "Events", value: counts.events, icon: <FaCalendarAlt className="h-6 w-6 text-white" />, variant: "green" as const },
    { label: "Donations", value: counts.donations, icon: <FaUserTie className="h-6 w-6 text-white" />, variant: "orange" as const },
    { label: "Content", value: counts.content, icon: <FaNewspaper className="h-6 w-6 text-white" />, variant: "purple" as const },
  ], [counts])

  return (
    <DashboardPage>
      <DashboardHeader
        title="Hero Video Management"
        description="Manage the videos and content shown in the main hero section."
        action={
          <DashboardPrimaryButton onClick={() => handleOpenModal()}>
            <FaPlus className="h-4 w-4" />
            Add New Hero
          </DashboardPrimaryButton>
        }
      />

      <DashboardStatsGrid>
        {stats.map((stat) => (
          <DashboardStatCard key={stat.label} {...stat} />
        ))}
      </DashboardStatsGrid>

      <DashboardTableCard>
        {loading ? (
          <DashboardLoadingState
            icon={<FaVideo className="mx-auto mb-2 h-8 w-8 animate-pulse text-slate-300" />}
            message="Loading Hero Videos..."
          />
        ) : videos.length === 0 ? (
          <DashboardEmptyState
            icon={<FaVideo className="mx-auto mb-2 h-8 w-8 text-slate-300" />}
            message="No Hero configurations found. Create your first one!"
          />
        ) : (
          <DashboardTable>
            <DashboardTableHead>
              <tr>
                <DashboardTh>Status</DashboardTh>
                <DashboardTh>Screenshot</DashboardTh>
                <DashboardTh>Content</DashboardTh>
                <DashboardTh>Type</DashboardTh>
                <DashboardTh className="text-right">Actions</DashboardTh>
              </tr>
            </DashboardTableHead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {videos.map(video => (
                <tr key={video.id} className={`hover:bg-slate-50 transition ${video.is_active ? 'bg-emerald-50/20' : ''}`}>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(video.id, video.is_active)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold transition ${video.is_active
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                        }`}
                    >
                      {video.is_active ? <FaCheckCircle /> : <FaTimesCircle />}
                      {video.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {video.screenshot_url ? (
                      <img src={video.screenshot_url} className="h-10 w-16 object-cover rounded shadow-sm border border-slate-200" alt="" />
                    ) : (
                      <div className="h-10 w-16 bg-slate-100 rounded flex items-center justify-center text-slate-300">
                        <FaVideo size={12} />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 line-clamp-1">{video.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{video.subtitle}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${video.is_embed ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                      {video.is_embed ? 'Embed' : 'Upload'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(video)}
                      className="text-emerald-600 hover:text-emerald-800 p-2 rounded-lg hover:bg-emerald-50 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </DashboardTable>
        )}
      </DashboardTableCard>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-emerald-600 p-6 flex justify-between items-center">
              <h2 className="text-white text-xl font-bold flex items-center gap-2">
                {editingVideo ? <FaEdit /> : <FaPlus />}
                {editingVideo ? 'Edit Hero Video' : 'Add New Hero Video'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white text-2xl font-light transition">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hero Title</label>
                    <input
                      required
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50/50 transition-all"
                      placeholder="Main headline"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subtitle</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.subtitle}
                      onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50/50 transition-all"
                      placeholder="Supporting text"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <input
                      type="checkbox"
                      id="is_active_check"
                      checked={formData.is_active}
                      onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="is_active_check" className="text-sm font-bold text-slate-700 cursor-pointer">Set as Active</label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Video Source</label>
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, is_embed: false })}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${!formData.is_embed ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}
                      >Upload</button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, is_embed: true })}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${formData.is_embed ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}
                      >Embed</button>
                    </div>

                    {formData.is_embed ? (
                      <input
                        required
                        value={formData.video_url}
                        onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500"
                        placeholder="YouTube embed URL"
                      />
                    ) : (
                      <div className="space-y-3">
                        <label className="cursor-pointer group flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl py-6 hover:border-emerald-400 hover:bg-emerald-50 transition-all">
                          <FaUpload className={`text-xl mb-2 ${uploading === 'video' ? 'animate-bounce' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                          <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-600">
                            {uploading === 'video' ? 'UPLOADING...' : 'CLICK TO UPLOAD MP4'}
                          </span>
                          <input type="file" className="hidden" accept="video/mp4" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'video')} />
                        </label>
                        {formData.video_url && !formData.is_embed && <p className="text-[10px] text-slate-400 truncate text-center">{formData.video_url}</p>}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Screenshot</label>
                    <label className="cursor-pointer group flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl py-6 hover:border-emerald-400 hover:bg-emerald-50 transition-all">
                      <FaImage className={`text-xl mb-2 ${uploading === 'screenshot' ? 'animate-pulse' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                      <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-600">
                        {uploading === 'screenshot' ? 'UPLOADING...' : 'ADD SCREENSHOT'}
                      </span>
                      <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'screenshot')} />
                    </label>
                    {formData.screenshot_url && (
                      <div className="mt-2 aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group">
                        <img src={formData.screenshot_url} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <p className="text-white text-[10px] font-bold">CHANGE IMAGE</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-2xl border border-slate-200 py-4 text-sm font-bold text-black hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploading !== null}
                  className="flex-1 rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white hover:bg-emerald-700 shadow-lg hover:shadow-emerald-200 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving Changes...' : 'Save Hero Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardPage>
  )
}