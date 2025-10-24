"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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

export const description = "A multiple line chart showing positive feedback trends over time"

const chartConfig = {
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

type ChartProps = React.ComponentProps<typeof LineChart>

interface PositiveTrendProps {
  data?: {
    period: { [key: string]: string }
    high_impact_count: { [key: string]: number }
    mid_impact_count: { [key: string]: number }
    low_impact_count: { [key: string]: number }
  }
}

export default function PositiveTrend({ data }: PositiveTrendProps) {
  if (!data || !data.period) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Positive Feedback Trends</CardTitle>
          <CardDescription>
            Trends of positive feedback over time
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

  // Transform data for the chart
  const chartData = Object.keys(data.period).map((key, index) => ({
    period: data.period[key],
    high_impact_count: data.high_impact_count[key] || 0,
    mid_impact_count: data.mid_impact_count[key] || 0,
    low_impact_count: data.low_impact_count[key] || 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Positive Feedback Trends
        </CardTitle>
        <CardDescription>
          Trends of positive feedback over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                // Format the period for display
                if (typeof value === 'string') {
                  const date = new Date(value)
                  return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })
                }
                return value
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="high_impact_count"
              type="monotone"
              stroke={chartConfig.high_impact_count.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.high_impact_count.color,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="mid_impact_count"
              type="monotone"
              stroke={chartConfig.mid_impact_count.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.mid_impact_count.color,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="low_impact_count"
              type="monotone"
              stroke={chartConfig.low_impact_count.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.low_impact_count.color,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
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