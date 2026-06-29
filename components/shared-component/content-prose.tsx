type ContentProseProps = {
  content?: string | null
  emptyMessage?: string
  className?: string
}

export default function ContentProse({
  content,
  emptyMessage = "No content available.",
  className = "",
}: ContentProseProps) {
  if (!content?.trim()) {
    return <p className="text-sm italic text-slate-400">{emptyMessage}</p>
  }

  return (
    <article className={`prose prose-sm max-w-none prose-slate ${className}`}>
      <p className="text-base leading-relaxed whitespace-pre-line">{content}</p>
    </article>
  )
}
