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
import { FaChartLine } from "react-icons/fa6";
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

const STORAGE_BUCKET = "media";
const STORAGE_PREFIX = "impact-cards";

interface ImpactCardRow {
  id: string;
  stat_value: string;
  label: string;
  tag?: string | null;
  image_url?: string | null;
  storage_path?: string | null;
  is_featured: boolean;
  display_order: number;
  is_active: boolean;
}

const DEFAULT_FORM = {
  stat_value: "",
  label: "",
  tag: "",
  image_url: "",
  storage_path: "",
  is_featured: false,
  display_order: 0,
  is_active: true,
};

export default function ImpactCardsAdminPage() {
  const { showToast, askConfirm } = useAdminFeedback();
  const [rows, setRows] = useState<ImpactCardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<ImpactCardRow | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("impact_cards")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      setRows(data ?? []);
    } catch (err) {
      console.error("Failed to fetch impact cards:", err);
      showToast("Could not load impact cards", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleOpenModal = (row: ImpactCardRow | null = null) => {
    if (row) {
      setEditing(row);
      setFormData({
        stat_value: row.stat_value,
        label: row.label,
        tag: row.tag ?? "",
        image_url: row.image_url ?? "",
        storage_path: row.storage_path ?? "",
        is_featured: row.is_featured,
        display_order: row.display_order,
        is_active: row.is_active,
      });
    } else {
      setEditing(null);
      const nextOrder = rows.length > 0 ? Math.max(...rows.map((r) => r.display_order)) + 1 : 0;
      setFormData({ ...DEFAULT_FORM, display_order: nextOrder });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const supabase = getSupabaseClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${STORAGE_PREFIX}/${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: true });
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
      showToast("Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.stat_value.trim() || !formData.label.trim()) {
      showToast("Stat and label are required", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const supabase = getSupabaseClient();

      if (formData.is_featured) {
        await supabase.from("impact_cards").update({ is_featured: false }).eq("is_featured", true);
      }

      const payload = {
        stat_value: formData.stat_value.trim(),
        label: formData.label.trim(),
        tag: formData.tag.trim() || null,
        image_url: formData.image_url.trim() || null,
        storage_path: formData.storage_path.trim() || null,
        is_featured: formData.is_featured,
        display_order: formData.display_order,
        is_active: formData.is_active,
        updated_at: new Date().toISOString(),
      };

      if (editing) {
        const { error } = await supabase.from("impact_cards").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("impact_cards").insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchRows();
      showToast(editing ? "Impact card updated" : "Impact card added", "success");
    } catch (err) {
      console.error("Save failed:", err);
      showToast("Could not save impact card", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("impact_cards")
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      setRows((prev) => prev.map((row) => (row.id === id ? { ...row, is_active: !currentStatus } : row)));
    } catch (err) {
      showToast("Could not update status", "error");
    }
  };

  const handleDelete = (row: ImpactCardRow) => {
    askConfirm("Delete this impact card?", async () => {
      try {
        const supabase = getSupabaseClient();
        if (row.storage_path) {
          await supabase.storage.from(STORAGE_BUCKET).remove([row.storage_path]);
        }
        const { error } = await supabase.from("impact_cards").delete().eq("id", row.id);
        if (error) throw error;
        setRows((prev) => prev.filter((r) => r.id !== row.id));
        showToast("Impact card deleted", "success");
      } catch (err) {
        showToast("Error deleting card", "error");
      }
    });
  };

  return (
    <DashboardPage>
      <DashboardHeader
        title="Our Impact"
        description="Manage overlay cards on the About page. Leave image empty to use a random gallery photo."
        action={
          <DashboardPrimaryButton onClick={() => handleOpenModal()}>
            <FaPlus className="h-4 w-4" />
            Add card
          </DashboardPrimaryButton>
        }
      />

      <DashboardTableCard>
        {loading ? (
          <DashboardLoadingState
            icon={<FaChartLine className="mx-auto mb-2 h-8 w-8 animate-pulse text-slate-300" />}
            message="Loading impact cards..."
          />
        ) : rows.length === 0 ? (
          <DashboardEmptyState
            icon={<FaChartLine className="mx-auto mb-2 h-8 w-8 text-slate-300" />}
            message="No impact cards yet."
          />
        ) : (
          <DashboardTable>
            <DashboardTableHead>
              <tr>
                <DashboardTh>Order</DashboardTh>
                <DashboardTh>Preview</DashboardTh>
                <DashboardTh>Stat & label</DashboardTh>
                <DashboardTh>Featured</DashboardTh>
                <DashboardTh>Status</DashboardTh>
                <DashboardTh className="text-right">Actions</DashboardTh>
              </tr>
            </DashboardTableHead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-semibold">{row.display_order}</td>
                  <td className="px-6 py-4">
                    {row.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={row.image_url} alt="" className="h-12 w-20 rounded object-cover" />
                    ) : (
                      <span className="text-xs text-slate-400">Gallery (auto)</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{row.stat_value}</p>
                    <p className="text-xs text-slate-600">{row.label}</p>
                    {row.tag ? <p className="text-[10px] uppercase text-brand">{row.tag}</p> : null}
                  </td>
                  <td className="px-6 py-4 text-sm">{row.is_featured ? "Large card" : "—"}</td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(row.id, row.is_active)}
                      className="flex items-center gap-1 text-xs font-semibold"
                    >
                      {row.is_active ? <FaToggleOn className="text-green-600" /> : <FaToggleOff />}
                      {row.is_active ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="space-x-2 px-6 py-4 text-right">
                    <button type="button" onClick={() => handleOpenModal(row)} className="p-2 text-emerald-600">
                      <FaEdit />
                    </button>
                    <button type="button" onClick={() => handleDelete(row)} className="p-2 text-red-600">
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
            <h2 className="mb-4 text-xl font-bold">{editing ? "Edit card" : "Add card"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Stat value *</label>
                <input
                  value={formData.stat_value}
                  onChange={(e) => setFormData((p) => ({ ...p, stat_value: e.target.value }))}
                  placeholder="1200+"
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Label *</label>
                <input
                  value={formData.label}
                  onChange={(e) => setFormData((p) => ({ ...p, label: e.target.value }))}
                  placeholder="Lives Impacted"
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Tag (optional pill)</label>
                <input
                  value={formData.tag}
                  onChange={(e) => setFormData((p) => ({ ...p, tag: e.target.value }))}
                  placeholder="Education"
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Image (optional)</label>
                {formData.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={formData.image_url} alt="" className="mb-2 h-24 w-full rounded-lg object-cover" />
                ) : (
                  <p className="mb-2 text-xs text-slate-500">Uses random gallery image when empty.</p>
                )}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                  <FaUpload />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleImageUpload(file);
                    }}
                  />
                </label>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Display order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData((p) => ({ ...p, display_order: Number(e.target.value) }))}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData((p) => ({ ...p, is_featured: e.target.checked }))}
                />
                Large featured card (left column)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData((p) => ({ ...p, is_active: e.target.checked }))}
                />
                Show on site
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardPage>
  );
}
