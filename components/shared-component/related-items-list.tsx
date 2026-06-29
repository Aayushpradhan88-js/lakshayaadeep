import Link from "next/link"

export type RelatedItem = {
  id: string
  title: string
  subtitle?: string
  href: string
}

type RelatedItemsListProps = {
  title: string
  items: RelatedItem[]
  emptyMessage?: string
}

export default function RelatedItemsList({
  title,
  items,
  emptyMessage = "No related items available right now.",
}: RelatedItemsListProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <h2 className="mb-3 text-base font-semibold text-slate-900">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyMessage}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 transition hover:border-slate-300"
            >
              <p className="font-semibold text-slate-900">{item.title}</p>
              {item.subtitle ? <p className="text-xs text-slate-500">{item.subtitle}</p> : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
