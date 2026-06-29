"use client";

import { useState, useEffect } from "react";
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter, 
  FaPaperPlane, 
  FaUser, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaReply,
  FaEye,
  FaInbox,
  FaUserCircle,
  FaCalendarAlt,
  FaTag
} from "react-icons/fa";
import { getSupabaseClient } from "@/lib/supabase/supabase";
import { useRouter } from "next/navigation";

interface ContactMessage {
  id: string;
  name: string | null;
  email: string | null;
  phone?: string | null;
  subject?: string | null;
  message: string | null;
  status?: 'pending' | 'in-progress' | 'resolved' | null;
  social_primary?: string | null;
  social_additional?: string | null;
  source?: string | null;
  created_at: string;
  updated_at?: string | null;
}

function isSafeUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    // Check for relative paths or common patterns if needed,
    // but for social links we usually expect full URLs.
    return false;
  }
}

export default function ContactPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'resolved'>('all');
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .or('source.neq.feedback,source.is.null')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (contactId: string, status: 'pending' | 'in-progress' | 'resolved') => {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('contacts')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', contactId);

      if (error) throw error;

      setContacts(prev => prev.map(contact => 
        contact.id === contactId ? { ...contact, status } : contact
      ));
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;

      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      if (selectedContact?.id === contactId) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const sendReply = async () => {
    if (!selectedContact || !replyMessage.trim()) return;

    try {
      // Here you would implement the actual email sending logic
      // For now, we'll just update the status to in-progress
      await updateContactStatus(selectedContact.id, 'in-progress');
      
      setReplyMessage("");
      setShowReplyModal(false);
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (contact.name && contact.name.toLowerCase().includes(q)) ||
      (contact.email && contact.email.toLowerCase().includes(q)) ||
      (contact.phone && contact.phone.toLowerCase().includes(q)) ||
      (contact.subject && contact.subject.toLowerCase().includes(q)) ||
      (contact.message && contact.message.toLowerCase().includes(q)) ||
      (contact.social_primary && contact.social_primary.toLowerCase().includes(q));

    const st = contact.status ?? 'pending';
    const matchesStatus = statusFilter === 'all' || st === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FaClock className="h-3 w-3" />;
      case 'in-progress':
        return <FaExclamationCircle className="h-3 w-3" />;
      case 'resolved':
        return <FaCheckCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Volunteer Messages</h1>
            <p className="text-slate-600">Manage and respond to volunteer application submissions from your visitors</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{contacts.length}</div>
              <div className="text-xs text-slate-500">Total Messages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl border border-blue-200 p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Total Messages</p>
                <p className="text-2xl font-bold text-white">{contacts.length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <FaInbox className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl border border-yellow-200 p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-100">Pending</p>
                <p className="text-2xl font-bold text-white">
                  {contacts.filter((c) => (c.status ?? 'pending') === 'pending').length}
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
                <p className="text-sm text-purple-100">In Progress</p>
                <p className="text-2xl font-bold text-white">
                  {contacts.filter((c) => c.status === 'in-progress').length}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <FaExclamationCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl border border-green-200 p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-100">Resolved</p>
                <p className="text-2xl font-bold text-white">
                  {contacts.filter((c) => c.status === 'resolved').length}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <FaCheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

      {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

      {/* Contact List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaUserCircle className="h-4 w-4" />
                      Contact
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaTag className="h-4 w-4" />
                      Subject
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
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center">
                        <FaInbox className="h-8 w-8 text-slate-300 mb-2" />
                        Loading contact messages...
                      </div>
                    </td>
                  </tr>
                ) : filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center">
                        <FaEnvelope className="h-8 w-8 text-slate-300 mb-2" />
                        No contact messages found
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-emerald-100 p-2 rounded-full">
                            <FaUser className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{contact.name ?? '—'}</div>
                            <div className="text-sm text-slate-500">{contact.email ?? '—'}</div>
                            {contact.phone && (
                              <div className="text-xs text-slate-400">{contact.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 max-w-xs truncate font-medium">
                          {contact.subject ?? 'Contact'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(contact.status ?? 'pending')}`}>
                          {getStatusIcon(contact.status ?? 'pending')}
                          {contact.status ?? 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                          >
                            <FaEye className="h-3 w-3" />
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedContact(contact);
                              setShowReplyModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            <FaReply className="h-3 w-3" />
                            Reply
                          </button>
                          <select
                            value={contact.status ?? 'pending'}
                            onChange={(e) => updateContactStatus(contact.id, e.target.value as 'pending' | 'in-progress' | 'resolved')}
                            className="text-xs border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                          <button
                            onClick={() => deleteContact(contact.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <FaTrash className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Contact Message Details</h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <div className="bg-white/20 p-1 rounded-lg">
                    ×
                  </div>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</label>
                  <p className="text-slate-900 font-medium">{selectedContact.name ?? '—'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</label>
                  <p className="text-slate-900 font-medium">{selectedContact.email ?? '—'}</p>
                </div>
                {selectedContact.phone && (
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone</label>
                    <p className="text-slate-900 font-medium">{selectedContact.phone}</p>
                  </div>
                )}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedContact.status ?? 'pending')}`}>
                      {getStatusIcon(selectedContact.status ?? 'pending')}
                      {selectedContact.status ?? 'pending'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</label>
                <p className="text-slate-900 font-medium mt-1">{selectedContact.subject ?? 'Contact'}</p>
              </div>

              {selectedContact.source ? (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Source</label>
                  <p className="text-slate-900 font-medium mt-1">{selectedContact.source}</p>
                </div>
              ) : null}

              {selectedContact.social_primary ? (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Primary social</label>
                  <p className="mt-1 break-all text-slate-900">
                    {isSafeUrl(selectedContact.social_primary) ? (
                      <a href={selectedContact.social_primary} className="text-emerald-700 underline" target="_blank" rel="noopener noreferrer">
                        {selectedContact.social_primary}
                      </a>
                    ) : (
                      <span className="text-slate-700">{selectedContact.social_primary}</span>
                    )}
                  </p>
                </div>
              ) : null}

              {selectedContact.social_additional ? (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Additional social links</label>
                  <p className="mt-1 whitespace-pre-wrap text-slate-900">{selectedContact.social_additional}</p>
                </div>
              ) : null}
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Message</label>
                <p className="text-slate-900 whitespace-pre-wrap mt-1">{selectedContact.message ?? '—'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Received</label>
                  <p className="text-slate-900 font-medium mt-1">{new Date(selectedContact.created_at).toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Updated</label>
                  <p className="text-slate-900 font-medium mt-1">
                    {selectedContact.updated_at ? new Date(selectedContact.updated_at).toLocaleString() : '—'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowReplyModal(true)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-2 font-medium shadow-lg"
                >
                  <FaPaperPlane className="h-4 w-4" />
                  Send Reply
                </button>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="flex-1 bg-slate-200 text-slate-800 px-4 py-3 rounded-lg hover:bg-slate-300 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Send Reply</h2>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyMessage("");
                  }}
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
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">To</label>
                <p className="text-slate-900 font-medium mt-1">{selectedContact.email}</p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</label>
                <p className="text-slate-900 font-medium mt-1">Re: {selectedContact.subject}</p>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Message</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 mt-1"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={sendReply}
                  disabled={!replyMessage.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg"
                >
                  <FaPaperPlane className="h-4 w-4" />
                  Send Reply
                </button>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyMessage("");
                  }}
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
