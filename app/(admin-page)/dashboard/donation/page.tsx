'use client'

import { useEffect, useState } from 'react'
import { FaHandHoldingUsd, FaClock, FaCheckCircle } from 'react-icons/fa'
import { getSupabaseClient } from '@/lib/supabase/supabase'
import {
  DashboardFilterBar,
  DashboardHeader,
  DashboardPage,
  DashboardPrimaryButton,
  DashboardStatCard,
  DashboardStatsGrid,
  DashboardTable,
  DashboardTableCard,
  DashboardTableHead,
  DashboardTh,
  dashboardSelectClassName,
} from '@/components/shared-component/admin-dashboard-ui'
import { useAdminFeedback } from '@/components/shared-component/admin-feedback'
import { getAdminAuthHeaders } from '@/lib/client/admin-fetch'

type Donation = {
  id: string
  name: string
  email: string
  phone: string
  amount: number
  payment_method: string
  message: string | null
  status: 'pending' | 'completed' | 'cancelled' | 'failed' | 'confirmed' | 'rejected'
  screenshot_url?: string | null
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-100 text-red-600 border-red-200',
  cancelled: 'bg-gray-100 text-black border-gray-200',
  failed: 'bg-red-100 text-red-600 border-red-200',
}

const STATUS_OPTIONS = ['pending', 'completed', 'failed', 'cancelled']

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const { showToast } = useAdminFeedback()

  const fetchDonations = async () => {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      const query = supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false })

      const { data, error } = await query
      if (error) throw error
      setDonations(data ?? [])
    } catch (err) {
      console.error('Failed to fetch donations:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDonations() }, [])

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      const headers = await getAdminAuthHeaders()

      const response = await fetch(`/api/admin/donations/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || 'Failed to update donation status.')
      }

      setDonations(prev => prev.map(d => d.id === id ? { ...d, status: status as Donation['status'] } : d))

      if (selectedDonation?.id === id) {
        setSelectedDonation(prev => prev ? { ...prev, status: status as Donation['status'] } : null)
      }

      showToast(`Donation status updated to ${status}`, 'success')

    } catch (err: any) {
      console.error('Failed to update status:', err)
      showToast(`Could not update status: ${err.message || 'Please try again.'}`, 'error')
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter === 'all' ? donations : donations.filter(d => d.status === filter)

  const totalConfirmed = donations
    .filter(d => d.status === 'confirmed' || d.status === 'completed')
    .reduce((sum, d) => sum + Number(d.amount), 0)

  const counts = {
    all: donations.length,
    pending: donations.filter(d => d.status === 'pending').length,
    completed: donations.filter(d => d.status === 'completed' || d.status === 'confirmed').length,
    rejected: donations.filter(d => d.status === 'rejected' || d.status === 'failed' || d.status === 'cancelled').length,
  }

  return (
    <DashboardPage>
      <DashboardHeader
        title="Donation Requests"
        description="Review and confirm incoming donation submissions."
        action={
          <DashboardPrimaryButton onClick={fetchDonations}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </DashboardPrimaryButton>
        }
      />

      <DashboardStatsGrid>
        <DashboardStatCard
          label="Total Requests"
          value={counts.all}
          icon={<FaHandHoldingUsd className="h-6 w-6 text-white" />}
          variant="blue"
        />
        <DashboardStatCard
          label="Pending"
          value={counts.pending}
          icon={<FaClock className="h-6 w-6 text-white" />}
          variant="orange"
        />
        <DashboardStatCard
          label="Confirmed"
          value={counts.completed}
          icon={<FaCheckCircle className="h-6 w-6 text-white" />}
          variant="green"
        />
        <DashboardStatCard
          label="Total Confirmed (रू)"
          value={`रू ${totalConfirmed.toLocaleString()}`}
          icon={<FaHandHoldingUsd className="h-6 w-6 text-white" />}
          variant="purple"
        />
      </DashboardStatsGrid>

      <DashboardFilterBar>
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'completed', 'failed', 'cancelled'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition ${filter === f
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : 'border-slate-300 bg-white text-black hover:border-emerald-400'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </DashboardFilterBar>

      <DashboardTableCard>
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-500">Loading donations...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">No donation requests found.</div>
        ) : (
          <DashboardTable>
            <DashboardTableHead>
              <tr>
                <DashboardTh>Donor</DashboardTh>
                <DashboardTh>Contact</DashboardTh>
                <DashboardTh>Amount</DashboardTh>
                <DashboardTh>Payment</DashboardTh>
                <DashboardTh>Screenshot</DashboardTh>
                <DashboardTh>Message</DashboardTh>
                <DashboardTh>Date</DashboardTh>
                <DashboardTh>Status</DashboardTh>
                <DashboardTh>Action</DashboardTh>
              </tr>
            </DashboardTableHead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium whitespace-nowrap text-slate-900">{d.name}</td>
                  <td className="px-6 py-4 text-black">
                    <p>{d.email}</p>
                    <p className="text-slate-400">{d.phone}</p>
                  </td>
                  <td className="px-6 py-4 font-semibold whitespace-nowrap text-slate-800">
                    रू {Number(d.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{d.payment_method}</td>
                  <td className="px-6 py-4">
                    {d.screenshot_url ? (
                      <a href={d.screenshot_url} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-700 underline text-xs font-medium">
                        View
                      </a>
                    ) : (
                      <span className="text-slate-400 text-xs italic">N/A</span>
                    )}
                  </td>
                  <td className="max-w-[150px] px-6 py-4 text-slate-500">
                    <p className="truncate" title={d.message ?? ''}>{d.message || <span className="italic text-slate-300">—</span>}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                    {new Date(d.created_at).toLocaleDateString('en-NP', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${STATUS_COLORS[d.status] || STATUS_COLORS.pending}`}>
                        {d.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedDonation(d)
                          setShowDetailModal(true)
                        }}
                        className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700 hover:bg-sky-100 transition"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                      <select
                        value={d.status}
                        disabled={updating === d.id}
                        onChange={e => updateStatus(d.id, e.target.value)}
                        className={dashboardSelectClassName + " cursor-pointer disabled:opacity-50"}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s} className="capitalize">{s}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DashboardTable>
        )}
      </DashboardTableCard>

      {/* Detail Modal */}
      {showDetailModal && selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="bg-sky-500 px-6 py-4 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Donation Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-white/80 hover:text-white text-xl"
              >✕</button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Donor Name</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedDonation.name}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Amount</p>
                  <p className="text-sm font-bold text-sky-600">रू {Number(selectedDonation.amount).toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm text-black truncate" title={selectedDonation.email}>{selectedDonation.email}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-sm text-black">{selectedDonation.phone}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Method</p>
                  <p className="text-sm text-black">{selectedDonation.payment_method}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${STATUS_COLORS[selectedDonation.status] || STATUS_COLORS.pending}`}>
                    {selectedDonation.status}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Message / Additional Info</p>
                <p className="text-sm text-black whitespace-pre-wrap">{selectedDonation.message || 'No message provided.'}</p>
              </div>

              {/* Payment Screenshot */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Screenshot</p>
                {selectedDonation.screenshot_url ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img
                      src={selectedDonation.screenshot_url}
                      alt="Payment Screenshot"
                      className="h-full w-full object-contain"
                    />
                    <a
                      href={selectedDonation.screenshot_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded hover:bg-black/80 transition"
                    >
                      Open Full Size
                    </a>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No screenshot uploaded.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-black hover:bg-slate-50 transition"
                >
                  Close
                </button>
                {selectedDonation.status === 'pending' && (
                  <button
                    onClick={() => {
                      updateStatus(selectedDonation.id, 'completed')
                      setShowDetailModal(false)
                    }}
                    className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white hover:bg-emerald-600 transition shadow-lg shadow-emerald-100"
                  >
                    Confirm Payment
                  </button>
                )}

              </div>


            </div>
          </div>
        </div>
      )}

    </DashboardPage>
  )
}