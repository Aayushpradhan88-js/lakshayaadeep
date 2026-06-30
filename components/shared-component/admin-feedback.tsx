"use client";

import { createContext, useContext, type ReactNode } from "react";
import { AdminConfirmDialog, useAdminConfirm } from "@/components/shared-component/admin-confirm-dialog";
import { AdminToast, useAdminToast, type ToastType } from "@/components/shared-component/admin-toast";

type AdminFeedbackContextValue = {
  showToast: (message: string, type?: ToastType) => void;
  askConfirm: (message: string, onConfirm: () => void | Promise<void>) => void;
};

const AdminFeedbackContext = createContext<AdminFeedbackContextValue | null>(null);

export function AdminFeedbackProvider({ children }: { children: ReactNode }) {
  const { toast, showToast, hideToast } = useAdminToast();
  const { confirm, askConfirm, closeConfirm, handleConfirm } = useAdminConfirm();

  return (
    <AdminFeedbackContext.Provider value={{ showToast, askConfirm }}>
      <AdminToast toast={toast} onClose={hideToast} />
      <AdminConfirmDialog
        confirm={confirm}
        onCancel={closeConfirm}
        onConfirm={handleConfirm}
      />
      {children}
    </AdminFeedbackContext.Provider>
  );
}

export function useAdminFeedback() {
  const context = useContext(AdminFeedbackContext);
  if (!context) {
    throw new Error("useAdminFeedback must be used within AdminFeedbackProvider");
  }
  return context;
}
