"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  FaArrowDown,
  FaArrowUp,
  FaEdit,
  FaGripVertical,
  FaPlus,
  FaTrash,
  FaUpload,
  FaUsers,
  FaTimes,
} from "react-icons/fa";
import { getSupabaseClient } from "@/lib/supabase/supabase";
import { FastLoading } from "@/components/shared-component/fast-loading";

type TeamMember = {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
};

type TeamForm = {
  name: string;
  role: string;
  bio: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
};

const EMPTY_FORM: TeamForm = {
  name: "",
  role: "",
  bio: "",
  image_url: "",
  display_order: 0,
  is_active: true,
};

// ── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/80 rounded-full p-2"
      >
        <FaTimes className="h-5 w-5" />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

// ── Image Preview with lightbox trigger ─────────────────────────────────────
function PhotoPreview({ url, name }: { url: string; name: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 cursor-pointer ring-2 ring-transparent hover:ring-emerald-400 transition"
        title="Click to enlarge"
        onClick={() => setOpen(true)}
      >
        <img src={url} alt={name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/0 hover:bg-black/15 transition flex items-center justify-center">
          <span className="text-white text-[10px] font-medium opacity-0 hover:opacity-100">View</span>
        </div>
      </div>
      {open && <Lightbox src={url} alt={name} onClose={() => setOpen(false)} />}
    </>
  );
}

// ── Upload preview inside form ───────────────────────────────────────────────
function FormPhotoPreview({ url }: { url: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 cursor-pointer hover:ring-2 hover:ring-emerald-400 transition"
        onClick={() => setOpen(true)}
        title="Click to enlarge"
      >
        <img src={url} alt="Preview" className="h-full w-full object-cover" />
      </div>
      {open && <Lightbox src={url} alt="Preview" onClose={() => setOpen(false)} />}
    </>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardTeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TeamForm>(EMPTY_FORM);
  const [dragId, setDragId] = useState<string | null>(null);
  const [schemaWarning, setSchemaWarning] = useState<string | null>(null);

  const fetchTeamMembers = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("team_members")
        .select("id, name, role, bio, image_url, is_active, display_order")
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });

      if (error) {
        if (error.code === "42703") {
          setSchemaWarning(
            `Schema mismatch: ${error.message}. Run database/migrations/20260401_team_members_publish_and_order.sql in Supabase.`
          );
          const legacy = await supabase
            .from("team_members")
            .select("id, name, role, bio, image_url")
            .order("name", { ascending: true });
          if (legacy.error) throw legacy.error;
          setTeamMembers(
            (legacy.data ?? []).map((m: any) => ({ ...m, is_active: true, display_order: 0 }))
          );
          return;
        }
        throw error;
      }

      setSchemaWarning(null);
      setTeamMembers(data ?? []);
    } catch (error) {
      console.error("Error loading team members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeamMembers(); }, []);

  const sortedMembers = useMemo(() => {
    return [...teamMembers].sort((a, b) => {
      if (a.display_order !== b.display_order) return a.display_order - b.display_order;
      return a.name.localeCompare(b.name);
    });
  }, [teamMembers]);

  const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    setSubmitting(true);
    try {
      const supabase = getSupabaseClient();
      const payload: any = {
        name: form.name.trim(),
        role: form.role.trim() || null,
        bio: form.bio.trim() || null,
        image_url: form.image_url.trim() || null,
      };
      if (!schemaWarning) {
        payload.display_order = Number.isFinite(form.display_order) ? form.display_order : 0;
        payload.is_active = form.is_active;
      }

      if (editingId) {
        const { error } = await supabase.from("team_members").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("team_members").insert(payload);
        if (error) throw error;
      }

      await fetchTeamMembers();
      resetForm();
    } catch (error: any) {
      console.error("Error saving team member:", error);
      const message = typeof error?.message === "string" ? error.message : "Unknown error";
      const details = typeof error?.details === "string" ? `\nDetails: ${error.details}` : "";
      const hint = schemaWarning
        ? `\n\n${schemaWarning}`
        : "\n\nMost common causes: missing DB columns or Row Level Security policy blocking inserts.";
      alert(`Could not save this team member.\n\nError: ${message}${details}${hint}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setForm({
      name: member.name,
      role: member.role ?? "",
      bio: member.bio ?? "",
      image_url: member.image_url ?? "",
      display_order: member.display_order ?? 0,
      is_active: member.is_active ?? true,
    });
    // scroll form into view
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Fixed: bucket changed from "media" → "team_member_image_url"
  const handleUploadPhoto = async (file: File) => {
    setUploading(true);
    try {
      const supabase = getSupabaseClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `team/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("team_member_image_url")   // ← correct bucket
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("team_member_image_url").getPublicUrl(path);
      setForm((prev) => ({ ...prev, image_url: data.publicUrl }));
    } catch (error) {
      console.error("Photo upload failed:", error);
      alert("Upload failed. Check that 'team_member_image_url' bucket allows authenticated uploads.");
    } finally {
      setUploading(false);
    }
  };

  const updateMember = async (id: string, payload: Partial<TeamMember>) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("team_members").update(payload).eq("id", id);
    if (error) throw error;
  };

  const toggleActive = async (member: TeamMember) => {
    try {
      await updateMember(member.id, { is_active: !member.is_active });
      setTeamMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, is_active: !m.is_active } : m))
      );
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
      alert("Could not update publish status.");
    }
  };

  const moveMember = async (member: TeamMember, direction: "up" | "down") => {
    const currentIndex = sortedMembers.findIndex((m) => m.id === member.id);
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (currentIndex < 0 || swapIndex < 0 || swapIndex >= sortedMembers.length) return;

    const other = sortedMembers[swapIndex];
    try {
      const updatedMembers = teamMembers.map(m => {
        if (m.id === member.id) return { ...m, display_order: other.display_order };
        if (m.id === other.id) return { ...m, display_order: member.display_order };
        return m;
      });
      setTeamMembers(updatedMembers);
      await persistDisplayOrders(updatedMembers.filter(m => m.id === member.id || m.id === other.id));
      await fetchTeamMembers();
    } catch (error) {
      console.error("Failed to reorder:", error);
      alert("Could not change display order.");
    }
  };

  const persistDisplayOrders = async (members: TeamMember[]) => {
    setReordering(true);
    try {
      const supabase = getSupabaseClient();
      const updates = members.map((m) => ({ id: m.id, display_order: m.display_order }));
      const { error } = await supabase.from("team_members").upsert(updates, { onConflict: "id" });
      if (error) throw error;
    } catch (error) {
      console.error("Failed to persist display order:", error);
      alert("Could not save the new order. Reverting.");
      await fetchTeamMembers();
    } finally {
      setReordering(false);
    }
  };

  const moveByDrag = async (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const list = [...sortedMembers];
    const fromIndex = list.findIndex((m) => m.id === fromId);
    const toIndex = list.findIndex((m) => m.id === toId);
    if (fromIndex < 0 || toIndex < 0) return;

    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);
    const renumbered = list.map((m, idx) => ({ ...m, display_order: (idx + 1) * 10 }));
    setTeamMembers(renumbered);
    await persistDisplayOrders(renumbered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
      setTeamMembers((prev) => prev.filter((m) => m.id !== id));
      if (editingId === id) resetForm();
    } catch (error) {
      console.error("Error deleting team member:", error);
      alert("Could not delete this team member.");
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Team Members Management</h1>
            <p className="mt-1 text-sm text-black">
              This controls the public <strong>Our Team</strong> page. Only super admin dashboard users can update it.
            </p>
            {schemaWarning && (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {schemaWarning}
              </p>
            )}
          </div>
          <div className="rounded-lg bg-emerald-100 p-3 text-emerald-800">
            <FaUsers className="h-5 w-5" />
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          {editingId ? "Edit Team Member" : "Add Team Member"}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
            <input
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Photo Upload + Preview */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Photo</label>
            <div className="flex items-center gap-4">
              <label
                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <FaUpload className="h-3.5 w-3.5" />
                {uploading ? "Uploading..." : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleUploadPhoto(file);
                  }}
                />
              </label>

              {/* Preview — only shows after upload */}
              {form.image_url ? (
                <div className="flex items-center gap-3">
                  <FormPhotoPreview url={form.image_url} />
                  <div className="text-xs text-slate-500">
                    <p className="text-emerald-600 font-medium">✓ Image uploaded</p>
                    <p>Click image to preview</p>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, image_url: "" }))}
                      className="text-red-500 hover:text-red-700 mt-0.5"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-slate-400">No image uploaded yet</span>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Display Order</label>
            <input
              type="number"
              value={form.display_order}
              onChange={(e) => setForm((prev) => ({ ...prev, display_order: Number(e.target.value) }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                className="h-4 w-4 accent-emerald-600"
              />
              Active (published)
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <FastLoading size="sm" variant="light" />
              ) : (
                <>
                  <FaPlus className="h-3.5 w-3.5" />
                  {editingId ? "Update Member" : "Add Member"}
                </>
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* List */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Current Team Members</h2>
          <p className="text-sm text-slate-500">
            Drag the handle to reorder.
            {reordering ? <FastLoading size="sm" className="ml-2 inline-flex align-middle" /> : null}
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <FastLoading size="md" />
          </div>
        ) : sortedMembers.length === 0 ? (
          <p className="text-sm text-black">No members yet. Add the first one above.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {sortedMembers.map((member) => (
              <li
                key={member.id}
                className={`rounded-xl border border-slate-200 p-4 transition ${dragId === member.id ? "opacity-60" : "opacity-100"}`}
                onDragOver={(e) => { if (!dragId || dragId === member.id) return; e.preventDefault(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  const from = e.dataTransfer.getData("text/plain");
                  if (from) void moveByDrag(from, member.id);
                  setDragId(null);
                }}
              >
                <div className="flex gap-3">
                  <button
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      setDragId(member.id);
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", member.id);
                    }}
                    onDragEnd={() => setDragId(null)}
                    className="mt-1 inline-flex h-10 w-10 shrink-0 cursor-grab items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-black hover:bg-slate-100 active:cursor-grabbing"
                    title="Drag to reorder"
                  >
                    <FaGripVertical className="h-4 w-4" />
                  </button>

                  {/* Photo with lightbox */}
                  {member.image_url ? (
                    <PhotoPreview url={member.image_url} name={member.name} />
                  ) : (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <Image src="/logo.png" alt={member.name} fill className="object-cover" sizes="64px" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-slate-900">{member.name}</h3>
                    <p className="text-sm text-brand">{member.role || "Team Member"}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Order: {member.display_order} · {member.is_active ? "Active" : "Inactive"}
                    </p>
                    {member.bio ? (
                      <p className="mt-1 line-clamp-2 text-sm text-black">{member.bio}</p>
                    ) : (
                      <p className="mt-1 text-sm text-slate-400 italic">No bio added.</p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => moveMember(member, "up")}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
                    <FaArrowUp className="h-3 w-3" />
                  </button>
                  <button type="button" onClick={() => moveMember(member, "down")}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
                    <FaArrowDown className="h-3 w-3" />
                  </button>
                  <button type="button" onClick={() => toggleActive(member)}
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium ${member.is_active
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}>
                    {member.is_active ? "Published" : "Unpublished"}
                  </button>
                  <button type="button" onClick={() => handleEdit(member)}
                    className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100">
                    <FaEdit className="h-3 w-3" /> Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(member.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100">
                    <FaTrash className="h-3 w-3" /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}