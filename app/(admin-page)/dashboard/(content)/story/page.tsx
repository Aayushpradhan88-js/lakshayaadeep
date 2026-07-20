"use client";

import { useEffect, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaUpload,
  FaImage,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa6";
import { getSupabaseClient } from "@/lib/supabase/supabase";
import { useAdminFeedback } from "@/components/shared-component/admin-feedback";
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
} from "@/components/shared-component/admin-dashboard-ui";

const STORAGE_BUCKET = "story_images";

interface StoryImageRow {
  id: string;
  image_url: string;
  storage_path?: string | null;
  alt_text?: string | null;
  display_order: number;
  is_active: boolean;
  updated_at?: string;
}

const DEFAULT_FORM = {
  alt_text: "",
  image_url: "",
  storage_path: "",
  display_order: 1,
  is_active: true,
};

export default function StoryImagesPage() {
  const { showToast, askConfirm } = useAdminFeedback();
  const [rows, setRows] = useState<StoryImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<StoryImageRow | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("story_images")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      setRows(data ?? []);
    } catch (err) {
      console.error("Failed to fetch story images:", err);
      showToast("Could not load story images", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleOpenModal = (row: StoryImageRow | null = null) => {
    if (row) {
      setEditing(row);
      setFormData({
        alt_text: row.alt_text ?? "",
        image_url: row.image_url,
        storage_path: row.storage_path ?? "",
        display_order: row.display_order,
        is_active: row.is_active,
      });
    } else {
      setEditing(null);
      const nextOrder = rows.length > 0 ? Math.max(...rows.map((r) => r.display_order)) + 1 : 1;
      setFormData({ ...DEFAULT_FORM, display_order: nextOrder });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const supabase = getSupabaseClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, { upsert: false, cacheControl: "3600" });
      if (upErr) throw upErr;

      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      setFormData((p) => ({
        ...p,
        image_url: data.publicUrl,
        storage_path: path,
      }));
      showToast("Image uploaded", "success");
    } catch (err) {
      console.error("Upload failed:", err);
      showToast("Image upload failed. Check the story_images bucket policies.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      showToast("Upload an image first", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const supabase = getSupabaseClient();
      const payload = {
        image_url: formData.image_url,
        storage_path: formData.storage_path || null,
        alt_text: formData.alt_text.trim() || null,
        display_order: formData.display_order,
        is_active: formData.is_active,
        updated_at: new Date().toISOString(),
      };

      if (editing) {
        const { error } = await supabase.from("story_images").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("story_images").insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchRows();
      showToast(editing ? "Story image updated" : "Story image added", "success");
    } catch (err) {
      console.error("Save failed:", err);
      showToast("Could not save story image", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("story_images")
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      setRows((prev) =>
        prev.map((row) => (row.id === id ? { ...row, is_active: !currentStatus } : row)),
      );
      showToast(!currentStatus ? "Image activated" : "Image hidden from site", "success");
    } catch (err) {
      console.error("Toggle failed:", err);
      showToast("Could not update status", "error");
    }
  };

  const handleDelete = (row: StoryImageRow) => {
    askConfirm("Delete this story image from the site?", async () => {
      try {
        const supabase = getSupabaseClient();
        if (row.storage_path) {
          await supabase.storage.from(STORAGE_BUCKET).remove([row.storage_path]);
        }
        const { error } = await supabase.from("story_images").delete().eq("id", row.id);
        if (error) throw error;
        setRows((prev) => prev.filter((r) => r.id !== row.id));
        showToast("Story image deleted", "success");
      } catch (err) {
        console.error("Delete failed:", err);
        showToast("Error deleting image", "error");
      }
    });
  };

  const activeCount = rows.filter((r) => r.is_active).length;

  return (
    <DashboardPage>
      <DashboardHeader
        title="Story"
        description={`About page “Our Story” carousel. ${activeCount} of ${rows.length} image${rows.length !== 1 ? "s" : ""} active.`}
        action={
          <DashboardPrimaryButton onClick={() => handleOpenModal()}>
            <FaPlus className="h-4 w-4" />
            Add image
          </DashboardPrimaryButton>
        }
      />

      <DashboardTableCard>
        {loading ? (
          <DashboardLoadingState
            icon={<FaBookOpen className="mx-auto mb-2 h-8 w-8 animate-pulse text-slate-300" />}
            message="Loading story images..."
          />
        ) : rows.length === 0 ? (
          <DashboardEmptyState
            icon={<FaBookOpen className="mx-auto mb-2 h-8 w-8 text-slate-300" />}
            message="No story images yet. Upload images for the About page carousel."
          />
        ) : (
          <DashboardTable>
            <DashboardTableHead>
              <tr>
                <DashboardTh>Order</DashboardTh>
                <DashboardTh>Preview</DashboardTh>
                <DashboardTh>Alt text</DashboardTh>
                <DashboardTh>Status</DashboardTh>
                <DashboardTh className="text-right">Actions</DashboardTh>
              </tr>
            </DashboardTableHead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={`transition hover:bg-slate-50 ${row.is_active ? "bg-emerald-50/20" : ""}`}
                >
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{row.display_order}</td>
                  <td className="px-6 py-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={row.image_url}
                      alt=""
                      className="h-14 w-24 rounded border border-slate-200 object-cover shadow-sm"
                    />
                  </td>
                  <td className="max-w-xs px-6 py-4 text-sm text-slate-600">
                    {row.alt_text || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(row.id, row.is_active)}
                      className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                        row.is_active
                          ? "border-green-200 bg-green-100 text-green-800 hover:bg-green-200"
                          : "border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200"
                      }`}
                    >
                      {row.is_active ? <FaToggleOn className="h-3 w-3" /> : <FaToggleOff className="h-3 w-3" />}
                      {row.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="space-x-2 px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(row)}
                      className="rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-50"
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(row)}
                      className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              {editing ? "Edit story image" : "Add story image"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Image</label>
                {formData.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={formData.image_url}
                    alt=""
                    className="mb-2 h-32 w-full rounded-lg border object-cover"
                  />
                ) : (
                  <div className="mb-2 flex h-32 items-center justify-center rounded-lg border border-dashed bg-slate-50 text-slate-400">
                    <FaImage />
                  </div>
                )}
                <label
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ${uploading ? "pointer-events-none opacity-60" : ""}`}
                >
                  <FaUpload />
                  {uploading ? "Uploading…" : "Upload image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleImageUpload(file);
                    }}
                  />
                </label>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Alt text (optional)</label>
                <input
                  type="text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData((p) => ({ ...p, alt_text: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Describe the photo for accessibility"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Display order</label>
                <input
                  type="number"
                  min={0}
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, display_order: Number(e.target.value) || 0 }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData((p) => ({ ...p, is_active: e.target.checked }))}
                />
                Show on About page
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {isSubmitting ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardPage>
  );
}
