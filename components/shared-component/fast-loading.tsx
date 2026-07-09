import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
} as const;

const variantClasses = {
  brand: "border-brand border-t-transparent",
  light: "border-white/90 border-t-transparent",
  muted: "border-slate-400 border-t-transparent",
} as const;

type FastLoadingProps = {
  size?: keyof typeof sizeClasses;
  variant?: keyof typeof variantClasses;
  className?: string;
  label?: string;
};

/** Lightweight spinner for buttons, forms, and page loading states. */
export function FastLoading({
  size = "md",
  variant = "brand",
  className,
  label = "Loading",
}: FastLoadingProps) {
  return (
    <span role="status" aria-label={label} className={cn("inline-flex items-center justify-center", className)}>
      <span
        className={cn("animate-spin rounded-full", sizeClasses[size], variantClasses[variant])}
        aria-hidden
      />
    </span>
  );
}

type FastLoadingBlockProps = FastLoadingProps & {
  wrapperClassName?: string;
};

/** Centered spinner for cards, tables, and full sections. */
export function FastLoadingBlock({ size = "md", className, wrapperClassName, label }: FastLoadingBlockProps) {
  return (
    <div className={cn("flex items-center justify-center py-12", wrapperClassName)}>
      <FastLoading size={size} className={className} label={label} />
    </div>
  );
}
