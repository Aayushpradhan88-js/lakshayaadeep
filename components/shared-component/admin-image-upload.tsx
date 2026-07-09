"use client"

import Image from "next/image"

type AdminImageUploadProps = {
  label: string
  previews: string[]
  maxImages?: number
  onAdd: (files: FileList | null) => void
  onRemove: (index: number) => void
  coverLabel?: string
}

export function AdminImageUpload({
  label,
  previews,
  maxImages = 8,
  onAdd,
  onRemove,
  coverLabel = "Cover",
}: AdminImageUploadProps) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-black">
        {label}
        <span className="ml-1 font-normal normal-case text-slate-500">({previews.length}/{maxImages})</span>
      </label>

      <label
        htmlFor={`img-upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
        className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-2 text-xs transition-colors ${
          previews.length >= maxImages
            ? "cursor-not-allowed border-slate-200 text-slate-400 opacity-50"
            : "border-slate-300 text-slate-500 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800"
        }`}
      >
        {previews.length === 0 ? "Click to upload images" : "Add more images"}
      </label>
      <input
        id={`img-upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        disabled={previews.length >= maxImages}
        onChange={(e) => onAdd(e.target.files)}
      />

      {previews.length > 0 && (
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {previews.map((src, i) => (
            <div key={`${src}-${i}`} className="group relative aspect-square overflow-hidden rounded-md border border-slate-200 bg-white">
              <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" unoptimized />
              {i === 0 && (
                <span className="absolute bottom-0.5 left-0.5 rounded bg-emerald-700 px-1 py-0.5 text-[8px] font-medium text-white">
                  {coverLabel}
                </span>
              )}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
