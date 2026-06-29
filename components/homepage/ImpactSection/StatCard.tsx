import { Users, Globe, Heart, TrendingUp } from 'lucide-react'

const iconMap = {
  users: Users,
  globe: Globe,
  heart: Heart,
  chart: TrendingUp,
}

type StatCardProps = {
  number: string
  label: string
  icon: keyof typeof iconMap
}

const StatCard = ({ number, label, icon }: StatCardProps) => {
  const Icon = iconMap[icon]

  return (
    <div className="flex flex-col items-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-6 py-8 text-white hover:bg-white/20 transition-all duration-300">
      {/* Icon box */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
        <Icon className="h-6 w-6 text-white" strokeWidth={1.5} />
      </div>

      <p className="text-4xl font-bold tracking-tight">{number}</p>
      <p className="mt-2 text-sm text-slate-200">{label}</p>
    </div>
  )
}

export default StatCard