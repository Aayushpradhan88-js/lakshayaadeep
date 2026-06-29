"use client"

import { LabelList, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A pie chart showing distribution of dashboard data"

const chartConfig = {
  projects: {
    label: "Projects",
    color: "#0ea5e9", // skyblue
  },
  events: {
    label: "Events",
    color: "#22c55e", // green
  },
  donations: {
    label: "Donations",
    color: "#3b82f6", // blue
  },
  blogs: {
    label: "Blogs",
    color: "#94a3b8", // gray
  },
  articles: {
    label: "Articles",
    color: "#f97316", // orange
  },
  notices: {
    label: "Notices",
    color: "#ef4444", // red
  },
  videos: {
    label: "Videos",
    color: "#f87171", // light red
  },
} satisfies ChartConfig

interface ChartProps {
  counts: {
    projects: number;
    events: number;
    donations: number;
    blogs: number;
    articles: number;
    notices?: number;
    videos?: number;
  }
}

function ChartPieLabelList({ counts }: ChartProps) {
  const chartData = [
    { category: "projects", value: counts.projects, fill: chartConfig.projects.color },
    { category: "events", value: counts.events, fill: chartConfig.events.color },
    { category: "donations", value: counts.donations, fill: chartConfig.donations.color },
    { category: "blogs", value: counts.blogs, fill: chartConfig.blogs.color },
    { category: "articles", value: counts.articles, fill: chartConfig.articles.color },
    { category: "notices", value: counts.notices || 0, fill: chartConfig.notices.color },
    { category: "videos", value: counts.videos || 0, fill: chartConfig.videos.color },
  ].filter(item => item.value > 0);

  return (
    <Card className="flex flex-col border-slate-200 shadow-[0_1px_2px_rgba(2,6,23,0.06)]">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-bold text-slate-900">Data Visulaization</CardTitle>
        <CardDescription>Visual overview of all workspace content</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-white"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="value" hideLabel />}
            />
            <Pie 
              data={chartData} 
              dataKey="value" 
              nameKey="category"
              stroke="#fff"
              strokeWidth={2}
            >
              <LabelList
                dataKey="category"
                className="fill-white font-bold"
                stroke="none"
                fontSize={10}
                formatter={(value: any) =>
                  chartConfig[value as keyof typeof chartConfig]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ChartPieLabelList
