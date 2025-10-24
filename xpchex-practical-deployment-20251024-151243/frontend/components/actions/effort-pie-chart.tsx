"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface EffortData {
  effort: string
  count: number
}

interface EffortPieChartProps {
  data: EffortData[]
}

const chartConfig = {
  count: {
    label: "Actions",
  },
}

// Color scheme matching issues page
const COLORS = {
  low: "#16a34a", // green-600
  medium: "#ca8a04", // yellow-600  
  high: "#dc2626", // red-600
}

const getColorForEffort = (effort: string) => {
  switch (effort.toLowerCase()) {
    case 'low':
      return COLORS.low
    case 'medium':
      return COLORS.medium
    case 'high':
      return COLORS.high
    default:
      return "#6b7280" // gray-500
  }
}

export function EffortPieChart({ data }: EffortPieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No effort data available
      </div>
    )
  }

  const chartData = data.map(item => ({
    ...item,
    fill: getColorForEffort(item.effort)
  }))

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Effort Distribution</h3>
        <p className="text-sm text-muted-foreground">
          Distribution of actions by estimated effort level
        </p>
      </div>
      
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ effort, percent }) => `${effort} ${(percent * 100).toFixed(0)}%`}
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
