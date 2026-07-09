import Link from "next/link"
import type { ReactNode } from "react"

export const programListingSectionClass = "max-w-7xl mx-auto w-full font-sans"
export const programListingGridClass = "grid grid-cols-1 gap-6 md:gap-8 xl:grid-cols-2"
export const programListingSkeletonClass =
  "h-44 sm:h-48 bg-slate-50 animate-pulse rounded-3xl border border-slate-100"
export const programListingEmptyClass =
  "xl:col-span-2 text-center py-16 text-base text-slate-500 bg-slate-50 rounded-3xl border border-dashed border-slate-200"

type ProgramListingSectionHeaderProps = {
  title: string
  accent: string
  viewAllHref?: string
  hideHeader?: boolean
}

export function ProgramListingSectionHeader({
  title,
  accent,
  viewAllHref,
  hideHeader = false,
}: ProgramListingSectionHeaderProps) {
  if (hideHeader) return null

  return (
    <div className="mb-10 flex items-center justify-between gap-4 md:mb-12">
      <div className="flex items-center gap-3">
        <div className="h-9 w-1 rounded-full bg-[#e8885a]" />
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          {title} <span className="font-light text-brand">{accent}</span>
        </h2>
      </div>
      {viewAllHref ? (
        <Link href={viewAllHref} className="text-sm font-semibold text-brand hover:underline md:text-base">
          View All
        </Link>
      ) : null}
    </div>
  )
}

type ProgramListingSectionProps = {
  title: string
  accent: string
  viewAllHref?: string
  hideHeader?: boolean
  loading: boolean
  isEmpty: boolean
  emptyMessage: string
  children: ReactNode
}

export function ProgramListingSection({
  title,
  accent,
  viewAllHref,
  hideHeader,
  loading,
  isEmpty,
  emptyMessage,
  children,
}: ProgramListingSectionProps) {
  return (
    <div className={programListingSectionClass}>
      <ProgramListingSectionHeader
        title={title}
        accent={accent}
        viewAllHref={viewAllHref}
        hideHeader={hideHeader}
      />

      <div className={programListingGridClass}>
        {loading ? (
          [1, 2, 3, 4].map((i) => <div key={i} className={programListingSkeletonClass} />)
        ) : isEmpty ? (
          <div className={programListingEmptyClass}>{emptyMessage}</div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
