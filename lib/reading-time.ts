export function getReadingTimeMinutes(content: string | null | undefined): number {
  if (!content?.trim()) return 1
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}
