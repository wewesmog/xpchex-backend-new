"use client"

import * as React from "react"
import { Heart } from "lucide-react"
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

export const description = "A multiple line chart showing sentiment trends over time"

const chartConfig = {
  positive: {
    label: "Positive",
    color: "#16a34a", // green-600
  },
  negative: {
    label: "Negative",
    color: "#dc2626", // red-600
  },
  neutral: {
    label: "Neutral",
    color: "#6b7280", // gray-500
  },
} satisfies ChartConfig

type ChartProps = React.ComponentProps<typeof LineChart>

interface SentimentTrendsProps {
  data?: {
    period: { [key: string]: string }
    positive: { [key: string]: number }
    negative: { [key: string]: number }
    neutral: { [key: string]: number }
  } | null
}

export default function SentimentTrends({ data }: SentimentTrendsProps) {
  if (!data || !data.period) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Trends</CardTitle>
          <CardDescription>
            Trends of sentiment over time
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
    positive: data.positive[key] || 0,
    negative: data.negative[key] || 0,
    neutral: data.neutral[key] || 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-600" />
          Sentiment Trends
        </CardTitle>
        <CardDescription>
          Trends of sentiment over time
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
              dataKey="positive"
              type="monotone"
              stroke={chartConfig.positive.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.positive.color,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="negative"
              type="monotone"
              stroke={chartConfig.negative.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.negative.color,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="neutral"
              type="monotone"
              stroke={chartConfig.neutral.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.neutral.color,
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
            <span className="text-sm text-muted-foreground">Positive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className="text-sm text-muted-foreground">Negative</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span className="text-sm text-muted-foreground">Neutral</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
