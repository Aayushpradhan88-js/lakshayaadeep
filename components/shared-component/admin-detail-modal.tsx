"use client"

import type { ReactNode } from "react"
import { FaTimes } from "react-icons/fa"

type AdminDetailModalProps = {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?: "md" | "lg" | "xl"
}

const MODAL_WIDTH = {
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
} as const

export function AdminDetailModal({
  title,
  onClose,
  children,
  footer,
  size = "md",
}: AdminDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`thin-scrollbar max-h-[90vh] w-full overflow-y-auto rounded-xl bg-white shadow-2xl ${MODAL_WIDTH[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 rounded-t-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 transition-colors hover:text-white"
              aria-label="Close"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3 p-4">{children}</div>
        {footer ? <div className="border-t border-slate-100 px-4 pb-4">{footer}</div> : null}
      </div>
    </div>
  )
}
