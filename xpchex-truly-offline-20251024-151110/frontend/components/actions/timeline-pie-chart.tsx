"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface TimelineData {
  timeline: string
  count: number
}

interface TimelinePieChartProps {
  data: TimelineData[]
}

const chartConfig = {
  count: {
    label: "Actions",
  },
}

// Color scheme for timeline
const COLORS = {
  'short-term': "#16a34a", // green-600
  'medium-term': "#ca8a04", // yellow-600  
  'long-term': "#dc2626", // red-600
}

const getColorForTimeline = (timeline: string) => {
  switch (timeline.toLowerCase()) {
    case 'short-term':
      return COLORS['short-term']
    case 'medium-term':
      return COLORS['medium-term']
    case 'long-term':
      return COLORS['long-term']
    default:
      return "#6b7280" // gray-500
  }
}

export function TimelinePieChart({ data }: TimelinePieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No timeline data available
      </div>
    )
  }

  const chartData = data.map(item => ({
    ...item,
    fill: getColorForTimeline(item.timeline)
  }))

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Timeline Distribution</h3>
        <p className="text-sm text-muted-foreground">
          Distribution of actions by suggested timeline
        </p>
      </div>
      
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ timeline, percent }) => `${timeline} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ChartContainer>
    </div>
  )
}
