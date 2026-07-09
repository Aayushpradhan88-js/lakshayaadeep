import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const BRAND_LOGO_PATH = "/logo/lakshaya-deep-logo.jpg"

type BrandLogoProps = {
  className?: string
  imageClassName?: string
  href?: string | null
  priority?: boolean
}

export function BrandLogo({
  className,
  imageClassName,
  href = "/",
  priority = false,
}: BrandLogoProps) {
  const image = (
    <Image
      src={BRAND_LOGO_PATH}
      alt="Lakshyadeep"
      width={220}
      height={60}
      priority={priority}
      className={cn("h-11 w-auto max-w-[220px] object-contain", imageClassName)}
    />
  )

  if (href) {
    return (
      <Link href={href} className={cn("inline-flex shrink-0", className)}>
        {image}
      </Link>
    )
  }

  return <span className={cn("inline-flex shrink-0", className)}>{image}</span>
}
