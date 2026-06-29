"use client";

import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { getSupabaseClient } from "@/lib/supabase/supabase";

interface Notice {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  display_duration: number;
}

export default function NoticePopup() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchLatestNotice = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('notices')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const currentNotice = data[0];
          // Check if this notice was already dismissed in this session
          const dismissedNotices = JSON.parse(sessionStorage.getItem('dismissed_notices') || '[]');
          if (!dismissedNotices.includes(currentNotice.id)) {
            setNotice(currentNotice);
            // Small delay to show the animation
            setTimeout(() => setIsVisible(true), 1000);
          }
        }
      } catch (error) {
        console.error('Error fetching notice:', error);
      }
    };

    fetchLatestNotice();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (notice) {
      const dismissedNotices = JSON.parse(sessionStorage.getItem('dismissed_notices') || '[]');
      dismissedNotices.push(notice.id);
      sessionStorage.setItem('dismissed_notices', JSON.stringify(dismissedNotices));
    }
  };

  if (!notice) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
    >
      {/* Blurred Background Overlay */}
      <div
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        onClick={handleClose}
      />

      {/* Notice Card */}
      <div
        className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full transform transition-all duration-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
          }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full shadow-lg text-slate-600 hover:text-red-500 transition-all"
        >
          <FaTimes size={18} />
        </button>

        {/* Content */}
        <div className="flex flex-col">
          {notice.image_url && (
            <div className="w-full aspect-video overflow-hidden">
              <img
                src={notice.image_url}
                alt={notice.title || "Notice"}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 text-center">
            {notice.title && (
              <h2 className="text-2xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {notice.title}
              </h2>
            )}
            {notice.description && (
              <p className="text-slate-600 leading-relaxed text-lg">
                {notice.description}
              </p>
            )}

            <button
              onClick={handleClose}
              className="mt-8 w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
