import Link from "next/link"
import { ChevronLeft } from "lucide-react"

type BackButtonProps = {
  href?: string
  label?: string
}

const BackButton = ({ href = "/", label = "Back" }: BackButtonProps) => {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-accent transition hover:text-brand-accent-hover"
    >
      <ChevronLeft className="h-4 w-4" aria-hidden />
      {label}
    </Link>
  )
}

export default BackButton
