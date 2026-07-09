export type DetailFact = {
  label: string
  value: string
}

type DetailFactsSidebarProps = {
  title?: string
  facts: DetailFact[]
  className?: string
}

export default function DetailFactsSidebar({
  title = "At a glance",
  facts,
  className = "",
}: DetailFactsSidebarProps) {
  const visible = facts.filter((fact) => fact.value.trim())
  if (visible.length === 0) return null

  return (
    <aside className={`rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm ${className}`}>
      <h2 className="mb-3 text-base font-semibold text-slate-900">{title}</h2>
      <dl className="space-y-4 text-sm text-black">
        {visible.map((fact) => (
          <div key={fact.label}>
            <dt className="font-semibold text-slate-900">{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}
