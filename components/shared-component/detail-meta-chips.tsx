type DetailMetaChip = {
  label: string
  variant?: "default" | "status"
}

type DetailMetaChipsProps = {
  chips: DetailMetaChip[]
  className?: string
}

export default function DetailMetaChips({ chips, className = "" }: DetailMetaChipsProps) {
  const visible = chips.filter((chip) => chip.label.trim())
  if (visible.length === 0) return null

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {visible.map((chip, index) => (
        <span
          key={`${chip.label}-${index}`}
          className={
            chip.variant === "status"
              ? "rounded-full bg-brand-accent/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
              : "rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
          }
        >
          {chip.label}
        </span>
      ))}
    </div>
  )
}
