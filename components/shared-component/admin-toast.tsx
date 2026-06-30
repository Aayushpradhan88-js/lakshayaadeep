"use client";

import { useCallback, useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";

export type ToastType = "success" | "error" | "info";

export interface ToastState {
  message: string;
  type: ToastType;
}

const TOAST_STYLES: Record<ToastType, string> = {
  success: "bg-emerald-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-slate-800 text-white",
};

export function useAdminToast(duration = 5000) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), duration);
    return () => clearTimeout(timer);
  }, [toast, duration]);

  return { toast, showToast, hideToast };
}

export function AdminToast({
  toast,
  onClose,
}: {
  toast: ToastState | null;
  onClose: () => void;
}) {
  if (!toast) return null;

  const Icon = toast.type === "error" ? FaExclamationTriangle : FaCheckCircle;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center lg:pl-64">
      <div
        role="alert"
        className={`pointer-events-auto flex max-w-md items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${TOAST_STYLES[toast.type]}`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1">{toast.message}</span>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 opacity-80 transition-opacity hover:opacity-100"
          aria-label="Dismiss"
        >
          <FaTimes className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
