"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A donut chart showing positive feedback impact levels"

const chartConfig = {
  count: {
    label: "Positive Feedback",
  },
  high_impact_count: {
    label: "High Impact",
    color: "#16a34a", // green-600
  },
  mid_impact_count: {
    label: "Medium Impact",
    color: "#eab308", // yellow-600
  },
  low_impact_count: {
    label: "Low Impact",
    color: "#2563eb", // blue-600
  },
} satisfies ChartConfig

type ChartProps = React.ComponentProps<typeof PieChart>

interface PositiveSeverityProps {
  data?: {
    high_impact_count: number
    mid_impact_count: number
    low_impact_count: number
  }
}

export default function PositiveSeverity({ data }: PositiveSeverityProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Positive Feedback Impact</CardTitle>
          <CardDescription>
            Distribution of positive feedback by impact level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = [
    {
      impact: "High Impact",
      count: data.high_impact_count,
      fill: chartConfig.high_impact_count.color,
    },
    {
      impact: "Medium Impact", 
      count: data.mid_impact_count,
      fill: chartConfig.mid_impact_count.color,
    },
    {
      impact: "Low Impact",
      count: data.low_impact_count,
      fill: chartConfig.low_impact_count.color,
    },
  ]

  const total = data.high_impact_count + data.mid_impact_count + data.low_impact_count

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Positive Feedback Impact
        </CardTitle>
        <CardDescription>
          Distribution of positive feedback by impact level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="impact"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Label
                  key={`cell-${index}`}
                  content={entry.count}
                  className="text-sm font-medium"
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-4">
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span className="text-sm text-muted-foreground">High Impact</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
            <span className="text-sm text-muted-foreground">Medium Impact</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span className="text-sm text-muted-foreground">Low Impact</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}