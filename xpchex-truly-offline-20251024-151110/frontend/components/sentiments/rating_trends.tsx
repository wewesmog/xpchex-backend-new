"use client"

import * as React from "react"
import { Star } from "lucide-react"
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

export const description = "A multiple line chart showing rating trends over time"

const chartConfig = {
  rating_1: {
    label: "1 Star",
    color: "#16a34a", // green-600
  },
  rating_2: {
    label: "2 Stars",
    color: "#ea580c", // yellow-600
  },
  rating_3: {
    label: "3 Stars",
    color: "#ca8a04", // amber-600
  },
  rating_4: {
    label: "4 Stars",
    color: "#059669", // emerald-600
  },
  rating_5: {
    label: "5 Stars",
    color: "#059669", // lime-600
  },
} satisfies ChartConfig

type ChartProps = React.ComponentProps<typeof LineChart>

interface RatingTrendsProps {
  data?: {
    period: { [key: string]: string }
    rating_1: { [key: string]: number }
    rating_2: { [key: string]: number }
    rating_3: { [key: string]: number }
    rating_4: { [key: string]: number }
    rating_5: { [key: string]: number }
  } | null
}

export default function RatingTrends({ data }: RatingTrendsProps) {
  if (!data || !data.period) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rating Trends</CardTitle>
          <CardDescription>
            Trends of ratings over time
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
    rating_1: data.rating_1[key] || 0,
    rating_2: data.rating_2[key] || 0,
    rating_3: data.rating_3[key] || 0,
    rating_4: data.rating_4[key] || 0,
    rating_5: data.rating_5[key] || 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-600" />
          Rating Trends
        </CardTitle>
        <CardDescription>
          Trends of ratings over time
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
              dataKey="rating_1"
              type="monotone"
              stroke={chartConfig.rating_1.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.rating_1.color,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="rating_2"
              type="monotone"
              stroke={chartConfig.rating_2.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.rating_2.color,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="rating_3"
              type="monotone"
              stroke={chartConfig.rating_3.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.rating_3.color,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="rating_4"
              type="monotone"
              stroke={chartConfig.rating_4.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.rating_4.color,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="rating_5"
              type="monotone"
              stroke={chartConfig.rating_5.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.rating_5.color,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-4">
        <div className="grid grid-cols-5 gap-2 w-full">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className="text-xs text-muted-foreground">1★</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-600"></div>
            <span className="text-xs text-muted-foreground">2★</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
            <span className="text-xs text-muted-foreground">3★</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span className="text-xs text-muted-foreground">4★</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
            <span className="text-xs text-muted-foreground">5★</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
