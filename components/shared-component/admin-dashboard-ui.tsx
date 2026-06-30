import type { ReactNode } from "react";
import { FaSearch } from "react-icons/fa";
import { cn } from "@/lib/utils";

export function DashboardPage({ children }: { children: ReactNode }) {
  return <div className="space-y-6 p-6">{children}</div>;
}

export function DashboardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">{title}</h1>
          <p className="text-black">{description}</p>
        </div>
        {action ? <div className="flex items-center space-x-3">{action}</div> : null}
      </div>
    </div>
  );
}

const STAT_VARIANTS = {
  blue: {
    card: "from-blue-500 to-blue-600 border-blue-200",
    label: "text-blue-100",
  },
  green: {
    card: "from-green-500 to-emerald-600 border-green-200",
    label: "text-green-100",
  },
  orange: {
    card: "from-yellow-500 to-orange-600 border-yellow-200",
    label: "text-yellow-100",
  },
  purple: {
    card: "from-purple-500 to-indigo-600 border-purple-200",
    label: "text-purple-100",
  },
} as const;

export type DashboardStatVariant = keyof typeof STAT_VARIANTS;

export function DashboardStatsGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-4">{children}</div>;
}

export function DashboardStatCard({
  label,
  value,
  icon,
  variant,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  variant: DashboardStatVariant;
}) {
  const styles = STAT_VARIANTS[variant];

  return (
    <div
      className={cn(
        "rounded-xl border bg-gradient-to-r p-4 text-white shadow-lg",
        styles.card
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={cn("text-sm", styles.label)}>{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className="rounded-lg bg-white/20 p-3">{icon}</div>
      </div>
    </div>
  );
}

export function DashboardPrimaryButton({
  children,
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-white shadow-lg hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function DashboardFilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row">{children}</div>
    </div>
  );
}

export function DashboardSearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex-1">
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 pl-12 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
    </div>
  );
}

export const dashboardSelectClassName =
  "rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500";

export function DashboardTableCard({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {children}
    </div>
  );
}

export function DashboardTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">{children}</table>
    </div>
  );
}

export function DashboardTableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
      {children}
    </thead>
  );
}

export function DashboardTh({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700",
        className
      )}
    >
      {children}
    </th>
  );
}

export function DashboardEmptyState({
  icon,
  message,
}: {
  icon: ReactNode;
  message: string;
}) {
  return (
    <div className="p-12 text-center text-slate-500">
      <div className="flex flex-col items-center gap-2">
        {icon}
        <span>{message}</span>
      </div>
    </div>
  );
}

export function DashboardLoadingState({
  icon,
  message,
}: {
  icon: ReactNode;
  message: string;
}) {
  return (
    <div className="p-12 text-center text-slate-500">
      <div className="flex flex-col items-center gap-2">
        {icon}
        <span>{message}</span>
      </div>
    </div>
  );
}
