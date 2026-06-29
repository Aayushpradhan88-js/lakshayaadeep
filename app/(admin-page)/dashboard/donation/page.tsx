'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/supabase'

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
  pending:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  rejected:  'bg-red-100 text-red-600 border-red-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
  failed:    'bg-red-100 text-red-600 border-red-200',
}

const STATUS_OPTIONS = ['pending', 'completed', 'failed', 'cancelled']

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

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
      const supabase = getSupabaseClient()
      
      // Ensure user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Authentication required to update status. Please log in again.')
      }

      console.log(`Updating donation ${id} status to ${status}...`)
      
      const { data, error } = await supabase
        .from('donations')
        .update({ status })
        .eq('id', id)
        .select()

      if (error) throw error
      
      if (!data || data.length === 0) {
        console.error('Update failed: No rows matched the query.', { id, status })
        throw new Error('No rows updated. You might not have permission to modify this record.')
      }

      console.log('Update successful:', data[0])

      // Update local state
      setDonations(prev => prev.map(d => d.id === id ? { ...d, status: status as Donation['status'] } : d))
      
      // Also update selected donation if it's the one being modified
      if (selectedDonation?.id === id) {
        setSelectedDonation(prev => prev ? { ...prev, status: status as Donation['status'] } : null)
      }
      
    } catch (err: any) {
      console.error('Failed to update status:', err)
      alert(`Could not update status: ${err.message || 'Please try again.'}`)
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
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Donation Requests</h1>
          <p className="text-sm text-slate-500 mt-0.5">Review and confirm incoming donation submissions.</p>
        </div>
        <button
          onClick={fetchDonations}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={counts.all} color="slate" />
        <StatCard label="Pending" value={counts.pending} color="yellow" />
        <StatCard label="Confirmed" value={counts.completed} color="emerald" />
        <StatCard label="Total Confirmed (रू)" value={`रू ${totalConfirmed.toLocaleString()}`} color="sky" />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'completed', 'failed', 'cancelled'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition capitalize ${
              filter === f
                ? 'bg-sky-500 border-sky-500 text-white'
                : 'bg-white border-slate-300 text-slate-600 hover:border-sky-400'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-500 text-sm">Loading donations...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">No donation requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <th className="px-4 py-3">Donor</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Screenshot</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{d.name}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <p>{d.email}</p>
                      <p className="text-slate-400">{d.phone}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                      रू {Number(d.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{d.payment_method}</td>
                    <td className="px-4 py-3">
                      {d.screenshot_url ? (
                        <a href={d.screenshot_url} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-700 underline text-xs font-medium">
                          View
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs italic">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-[150px]">
                      <p className="truncate" title={d.message ?? ''}>{d.message || <span className="italic text-slate-300">—</span>}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(d.created_at).toLocaleDateString('en-NP', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${STATUS_COLORS[d.status] || STATUS_COLORS.pending}`}>
                          {d.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
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
                          className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-700 bg-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:opacity-50 cursor-pointer"
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
            </table>
          </div>
        )}
      </div>

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
                  <p className="text-sm text-slate-600 truncate" title={selectedDonation.email}>{selectedDonation.email}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-sm text-slate-600">{selectedDonation.phone}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Method</p>
                  <p className="text-sm text-slate-600">{selectedDonation.payment_method}</p>
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
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{selectedDonation.message || 'No message provided.'}</p>
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
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
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

    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  const bg: Record<string, string> = {
    slate:   'bg-slate-50 border-slate-200 text-slate-800',
    yellow:  'bg-yellow-50 border-yellow-200 text-yellow-800',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    sky:     'bg-sky-50 border-sky-200 text-sky-800',
  }
  return (
    <div className={`rounded-xl border p-4 ${bg[color] || bg.slate}`}>
      <p className="text-xs font-medium opacity-70 mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}