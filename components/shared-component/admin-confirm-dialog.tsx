"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface ConfirmState {
  message: string;
  onConfirm: () => void | Promise<void>;
}

export function useAdminConfirm() {
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const askConfirm = useCallback(
    (message: string, onConfirm: () => void | Promise<void>) => {
      setConfirm({ message, onConfirm });
    },
    []
  );

  const closeConfirm = useCallback(() => setConfirm(null), []);

  const handleConfirm = useCallback(async () => {
    if (!confirm) return;
    const action = confirm.onConfirm;
    closeConfirm();
    await action();
  }, [confirm, closeConfirm]);

  return { confirm, askConfirm, closeConfirm, handleConfirm };
}

export function AdminConfirmDialog({
  confirm,
  onCancel,
  onConfirm,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
}: {
  confirm: ConfirmState | null;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!confirm) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [confirm]);

  if (!confirm || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex h-dvh w-full items-center justify-center overflow-hidden bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-900">Confirm Action</h3>
        </div>
        <p className="px-5 py-4 text-sm text-black">{confirm.message}</p>
        <div className="flex gap-3 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-300"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
