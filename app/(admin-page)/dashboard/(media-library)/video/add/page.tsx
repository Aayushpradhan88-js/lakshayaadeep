"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  FaVideo,
  FaUpload,
  FaSave,
  FaLink,
  FaArrowLeft,
  FaImage,
} from "react-icons/fa";
import { getSupabaseClient } from "@/lib/supabase/supabase";
import Link from "next/link";

export default function AddHeroVideoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  
  const [form, setForm] = useState({
    video_url: "",
    screenshot_url: "",
    is_embed: false,
    title: "",
    subtitle: "",
    is_active: false
  });

  const handleFileUpload = async (file: File, type: 'video' | 'screenshot') => {
    const isVideo = type === 'video';
    if (isVideo) setUploadingVideo(true);
    else setUploadingScreenshot(true);

    try {
      const supabase = getSupabaseClient();
      const ext = file.name.split(".").pop();
      const folder = isVideo ? 'hero-video' : 'hero-screenshots';
      const path = `${folder}/${Date.now()}.${ext}`;
      
      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(path, file, { upsert: true });

      if (upErr) throw upErr;

      const { data } = supabase.storage.from("media").getPublicUrl(path);
      
      if (isVideo) {
        setForm(p => ({ ...p, video_url: data.publicUrl, is_embed: false }));
      } else {
        setForm(p => ({ ...p, screenshot_url: data.publicUrl }));
      }
      
      alert(`${isVideo ? 'Video' : 'Screenshot'} uploaded successfully!`);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Make sure the 'media' bucket exists.");
    } finally {
      if (isVideo) setUploadingVideo(false);
      else setUploadingScreenshot(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.video_url || !form.title) {
      alert("Title and Video URL are required.");
      return;
    }

    setSaving(true);
    try {
      const supabase = getSupabaseClient();
      
      // If setting as active, deactivate others first
      if (form.is_active) {
        await supabase.from("hero_settings").update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000'); // hacky way to target all
      }

      const { error } = await supabase.from("hero_settings").insert({
        video_url: form.video_url.trim(),
        screenshot_url: form.screenshot_url.trim(),
        is_embed: form.is_embed,
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        is_active: form.is_active,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      alert("Hero video added successfully!");
      router.push("/dashboard/video");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to add hero video.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link 
        href="/dashboard/video" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-medium mb-2"
      >
        <FaArrowLeft size={14} /> Back to Management
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
            <FaVideo size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Add New Hero Video</h1>
            <p className="text-slate-500">Create a new hero section configuration with video and screenshot.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Video Source</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, is_embed: false }))}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-semibold ${
                    !form.is_embed 
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700" 
                    : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <FaUpload /> Upload
                </button>
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, is_embed: true }))}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-semibold ${
                    form.is_embed 
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700" 
                    : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <FaLink /> URL
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {form.is_embed ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">External URL</label>
                  <input
                    type="text"
                    value={form.video_url}
                    onChange={(e) => setForm(p => ({ ...p, video_url: e.target.value }))}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Video File (MP4)</label>
                  <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl py-6 hover:border-emerald-400 hover:bg-emerald-50 transition-all">
                    <FaUpload className={`text-xl mb-2 ${uploadingVideo ? 'animate-bounce' : 'text-slate-400'}`} />
                    <span className="text-xs font-medium text-slate-600">
                      {uploadingVideo ? "Uploading..." : "Click to upload video"}
                    </span>
                    <input
                      type="file"
                      accept="video/mp4"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload(f, 'video');
                      }}
                    />
                  </label>
                  {form.video_url && !form.is_embed && (
                    <p className="text-[10px] text-slate-400 truncate">{form.video_url}</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Screenshot / Thumbnail</label>
              <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl py-6 hover:border-emerald-400 hover:bg-emerald-50 transition-all">
                <FaImage className={`text-xl mb-2 ${uploadingScreenshot ? 'animate-pulse' : 'text-slate-400'}`} />
                <span className="text-xs font-medium text-slate-600">
                  {uploadingScreenshot ? "Uploading..." : "Click to upload screenshot"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f, 'screenshot');
                  }}
                />
              </label>
              {form.screenshot_url && (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
                  <img src={form.screenshot_url} alt="Screenshot" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Hero Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Enter main title"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Hero Subtitle</label>
                <textarea
                  rows={4}
                  value={form.subtitle}
                  onChange={(e) => setForm(p => ({ ...p, subtitle: e.target.value }))}
                  placeholder="Enter subtitle content"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm(p => ({ ...p, is_active: e.target.checked }))}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Set as active hero video
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || uploadingVideo || uploadingScreenshot}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaSave />
              {saving ? "Creating..." : "Add Hero Video"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
