'use client'

import { useEffect, useState } from 'react'
import { FaPlus, FaQuestionCircle } from 'react-icons/fa'
import { getSupabaseClient } from '@/lib/supabase/supabase'
import {
  DashboardEmptyState,
  DashboardHeader,
  DashboardLoadingState,
  DashboardPage,
  DashboardPrimaryButton,
  DashboardTable,
  DashboardTableCard,
  DashboardTableHead,
  DashboardTh,
} from '@/components/shared-component/admin-dashboard-ui'
import { useAdminFeedback } from '@/components/shared-component/admin-feedback'

interface FAQ {
  id: string
  question: string
  answer: string
  display_order: number
  is_active: boolean
  created_at: string
}

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast, askConfirm } = useAdminFeedback()

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    display_order: 0,
    is_active: true
  })

  const fetchFaqs = async () => {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setFaqs(data || [])
    } catch (err) {
      console.error('Failed to fetch FAQs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchFaqs() }, [])

  const handleOpenModal = (faq: FAQ | null = null) => {
    if (faq) {
      setEditingFaq(faq)
      setFormData({
        question: faq.question,
        answer: faq.answer,
        display_order: faq.display_order,
        is_active: faq.is_active
      })
    } else {
      setEditingFaq(null)
      setFormData({
        question: '',
        answer: '',
        display_order: faqs.length > 0 ? Math.max(...faqs.map(f => f.display_order)) + 1 : 1,
        is_active: true
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const supabase = getSupabaseClient()
      if (editingFaq) {
        const { error } = await supabase
          .from('faq')
          .update(formData)
          .eq('id', editingFaq.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('faq')
          .insert([formData])
        if (error) throw error
      }
      setIsModalOpen(false)
      fetchFaqs()
      showToast(editingFaq ? 'FAQ updated successfully' : 'FAQ created successfully', 'success')
    } catch (err) {
      console.error('Failed to save FAQ:', err)
      showToast('Error saving FAQ', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (id: string) => {
    askConfirm('Are you sure you want to delete this FAQ?', async () => {
      try {
        const supabase = getSupabaseClient()
        const { error } = await supabase
          .from('faq')
          .delete()
          .eq('id', id)
        if (error) throw error
        fetchFaqs()
        showToast('FAQ deleted successfully', 'success')
      } catch (err) {
        console.error('Failed to delete FAQ:', err)
        showToast('Error deleting FAQ', 'error')
      }
    })
  }

  return (
    <DashboardPage>
      <DashboardHeader
        title="Manage FAQs"
        description="Add or edit frequently asked questions shown on the About page."
        action={
          <DashboardPrimaryButton onClick={() => handleOpenModal()}>
            <FaPlus className="h-4 w-4" />
            Add New FAQ
          </DashboardPrimaryButton>
        }
      />

      <DashboardTableCard>
        {loading ? (
          <DashboardLoadingState
            icon={<FaQuestionCircle className="mx-auto mb-2 h-8 w-8 text-slate-300" />}
            message="Loading FAQs..."
          />
        ) : faqs.length === 0 ? (
          <DashboardEmptyState
            icon={<FaQuestionCircle className="mx-auto mb-2 h-8 w-8 text-slate-300" />}
            message="No FAQs found. Add your first one!"
          />
        ) : (
          <DashboardTable>
            <DashboardTableHead>
              <tr>
                <DashboardTh>Order</DashboardTh>
                <DashboardTh>Question</DashboardTh>
                <DashboardTh>Answer</DashboardTh>
                <DashboardTh>Status</DashboardTh>
                <DashboardTh className="text-right">Actions</DashboardTh>
              </tr>
            </DashboardTableHead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {faqs.map(faq => (
                <tr key={faq.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium text-slate-500">{faq.display_order}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{faq.question}</td>
                  <td className="px-6 py-4 text-black max-w-xs truncate">{faq.answer}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${faq.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {faq.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(faq)}
                      className="text-sky-600 hover:text-sky-800 font-medium"
                    >Edit</button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </DashboardTable>
        )}
      </DashboardTableCard>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-emerald-600 p-4 flex justify-between items-center">
              <h2 className="text-white font-bold">{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-white/80">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Question</label>
                <input
                  required
                  value={formData.question}
                  onChange={e => setFormData({ ...formData, question: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-emerald-500"
                  placeholder="e.g. How can I donate?"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Answer</label>
                <textarea
                  required
                  rows={4}
                  value={formData.answer}
                  onChange={e => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-emerald-500"
                  placeholder="Provide a clear and helpful answer..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-slate-700">Is Active?</span>
                  </label>
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-bold text-black hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardPage>
  )
}